<script>
    import { Link } from 'svelte-routing';
    import { onMount } from 'svelte';
    import Sidebar from '../../components/SideBar.svelte';
    import SideBar from '../../components/SideBar.svelte';


    let currentStep = 1;
    let RecipeData = null;
    let recipeSteps = [];
    let currentStepData = null;
    let totalsteps = 0;
    export let id


    // go to next step
    function goToNextStep() {
        if (currentStep < recipeSteps.length) {
        currentStep += 1;
        currentStepData = recipeSteps[currentStep-1];
        console.log("currentStep",currentStep);
        }
    }

    function goToPreviousStep() {
        if (currentStep > 1) {
        currentStep -= 1;
        currentStepData = recipeSteps[currentStep-1];
        console.log("currentStep",currentStep);
        }
    }

    async function finishRecipe2() {
        await fetchRecipe();
        // remove used ingredients from pantry
        const response = await fetch(`https://fit-itu.hop.sh/api/collections/ingredientInPantry/records?expand=ingredient,ingredient.unit`);
        if (!response.ok) {
            // If the response is not okay, throw an error
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        const PantryData = data.items;
        console.log("PantryData",PantryData);
        for (let i = 0; i < RecipeData.expand.ingredients.length; i++) {
            const ingredient = RecipeData.expand.ingredients[i];
            const ingredientId = ingredient.ingredientId.id;
            const ingredientQuantity = ingredient.amount;
            const ingredientUnit = ingredient.expand.ingredientId.expand.unit.name;
            const ingredientName = ingredient.expand.ingredientId.name;
            
            const currentIngredientPantry = PantryData.find((ingredient) => ingredient.expand.ingredient.name === ingredientName);
            if (!currentIngredientPantry) {
                console.log("ingredient not found in pantry");
                continue;
            }
            // console.log("ingredientId",ingredient);
            // console.log("currentIngredientPantry",currentIngredientPantry);
            const ingredientPantryQuantity = currentIngredientPantry.amount;
            console.log("ingredientName",ingredientName);
            console.log("pantry quantity",ingredientPantryQuantity,"recipe quantity",ingredientQuantity);
            let newQuantity = ingredientPantryQuantity - ingredientQuantity;
            if(newQuantity < 0){
                // try to find another ingredient with the same name but different id
                const otherIngredientPantry = PantryData.find((ingredient) => ingredient.expand.ingredient.name === ingredientName && ingredient.id !== currentIngredientPantry.id);
                console.log("otherIngredientPantry",otherIngredientPantry);
                if (!otherIngredientPantry) {
                    console.log("ingredient not found in pantry");
                    newQuantity = 0;
                }
                newQuantity = otherIngredientPantry.amount - ingredientQuantity;
            }
            console.log("newQuantity",newQuantity);
            // const response2 = await fetch(`https://fit-itu.hop.sh/api/collections/pantry/records/${ingredientId}`, {
            //     method: 'PUT',
            //     headers: {
            //         'Content-Type': 'application/json'
            //     },
            //     body: JSON.stringify({
            //         quantity: newQuantity
            //     })
            // });
            // if (!response2.ok) {
            //     // If the response is not okay, throw an error
            //     throw new Error(`HTTP error! Status: ${response2.status}`);
            // }
        }
    }

async function finishRecipe() {
  // Fetch the current ingredients in the pantry
  const response = await fetch('https://fit-itu.hop.sh/api/collections/ingredientInPantry/records?expand=ingredient,ingredient.unit');
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  const pantryResponse = await response.json();
  let pantryIngredients = pantryResponse.items;

  // Iterate over each ingredient in the recipe
  console.log("RecipeData",RecipeData);
  for (let recipeIngredient of RecipeData.expand.ingredients) {
    let recipeIngredientQuantity = recipeIngredient.amount;
    const recipeIngredientName = recipeIngredient.expand.ingredientId.name;
    const recipeIngredientUnit = recipeIngredient.expand.ingredientId.expand.unit.name;

    // Filter for matching ingredients in the pantry
    let matchingPantryItems = pantryIngredients.filter(pantryItem =>
      pantryItem.expand.ingredient.name === recipeIngredientName &&
      pantryItem.expand.ingredient.expand.unit.name === recipeIngredientUnit
    );
    // Deduct the recipe ingredient amount from the pantry items
    for (let pantryItem of matchingPantryItems) {
      if (recipeIngredientQuantity <= 0) break; // Stop if the recipe amount is depleted

      let pantryItemAmount = pantryItem.amount;
      let amountToDeduct = Math.min(recipeIngredientQuantity, pantryItemAmount);
      pantryItemAmount -= amountToDeduct;
      recipeIngredientQuantity -= amountToDeduct;

    //   // Delete the pantry item if the amount is 0
      if (pantryItemAmount === 0) {
        const deleteResponse = await fetch(`https://fit-itu.hop.sh/api/collections/ingredientInPantry/records/${pantryItem.id}`, {
          method: 'DELETE',
        });

        if (!deleteResponse.ok) {
          throw new Error(`HTTP error! Status: ${deleteResponse.status}`);
        }

        console.log(`Pantry item ${pantryItem.expand.ingredient.name} deleted`);
      }
      else {
        console.log(`Pantry item ${pantryItem.expand.ingredient.name} updated with new amount: ${pantryItemAmount}`);
        // Update the pantry ingredient with the new amount
        const updateResponse = await fetch(`https://fit-itu.hop.sh/api/collections/ingredientInPantry/records/${pantryItem.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ amount: pantryItemAmount }),
        });

        if (!updateResponse.ok) {
          throw new Error(`HTTP error! Status: ${updateResponse.status}`);
        }
      }
    }

    // Check if there was enough ingredient in the pantry
    if (recipeIngredientQuantity > 0) {
      console.log(`Not enough ${recipeIngredientName} in pantry to remove the required amount.`);
      // Handle the case where there is not enough ingredient in the pantry
    }
  }
}


    async function fetchRecipe() {
        const response = await fetch(`https://fit-itu.hop.sh/api/collections/recipes/records/${id}?expand=steps,diet,ingredients,ingredients.ingredientId,ingredients.ingredientId.unit`);
        if (!response.ok) {
            // If the response is not okay, throw an error
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        RecipeData = await response.json();
        recipeSteps = RecipeData.expand.steps;
        currentStepData = recipeSteps[currentStep-1]
        totalsteps = recipeSteps.length;
        console.log("currentStepData",currentStepData);
        // loading = true;
        console.log("data",RecipeData);
    }
    onMount(() => {
        fetchRecipe();
    });
    finishRecipe();

</script>

<!-- Visual stylistics -->
<SideBar/>
