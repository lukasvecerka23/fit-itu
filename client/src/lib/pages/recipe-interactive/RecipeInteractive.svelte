<!-- 
                RecipeInteractive.svelte
                Jachym Dolezal
                FIT ITU 2023
-->
<script>
    import { Link } from 'svelte-routing';
    import { navigate } from 'svelte-routing';
    import { onMount } from 'svelte';
    import Sidebar from '../../components/SideBar.svelte';
    import SideBar from '../../components/SideBar.svelte';
    import Recipes from '../recipes/Recipes.svelte';
    import Recipe from '../../components/Recipe.svelte';
    import recipe_placeholder from '../../../assets/recipe_placeholder.jpg';


    let currentStep = 1;
    let RecipeData = null;
    let recipeSteps = [];
    let currentStepData = null;
    let totalsteps = 0;
    export let id


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
  navigate('/recipes');
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
        console.log("data",RecipeData);
    }
    onMount(() => {
        fetchRecipe();
    });
    finishRecipe();

</script>

<!-- Visual stylistics -->
{#if RecipeData}
<div class="flex w-full bg-primary-white">
    <SideBar/>
    <div class="w-2/6">
        <div class="flex justify-center items-end h-2/5 bg-cover" style=" background-image: url({RecipeData.image})">
            <div class="h-1/3 w-full flex items-center justify-center bg-opacity-80 font-poppins bg-black">
                <h2 class="text-2xl text-white">{RecipeData.name}</h2>
            </div>
        </div>
        <div class="flex-col justify-center items-center">
                <div class="grid grid-cols-2 items-center gap-x-5 h-full">
                    <h2 class="text-xl font-poppins ml-10 font-bold">Ingredients</h2>
                    <h2 class="text-xl font-poppins font-bold w-2/3 text-end">Amount</h2>
                    {#each RecipeData.expand.ingredients as ingredient}
                            <ul class="list-inside w-full text-start ml-10 font-semibold">
                                <li>• {ingredient.expand.ingredientId.name}</li>
                            </ul>
                        <div class="text-end w-2/3 font-semibold">
                            {ingredient.amount} {ingredient.expand.ingredientId.expand.unit.name}
                        </div>
                    {/each}
                </div>
        </div>
    </div>
    <div class="bg-black w-[2px]"></div>
    <div class="flex-col w-4/6 justify-center">
        <div class="flex h-4/6 items-center justify-center text-end">
            <div class="h-[400px] w-[300px] rounded-3xl overflow-hidden">
                <img src={currentStepData.media ? currentStepData.media : recipe_placeholder} alt="recipe" class="w-full h-full object-cover"/>
            </div>
        </div>
        <p class="text-center w-full text-3xl">{@html currentStepData.text}</p>
        <div class="flex justify-center mt-10 items-center">
            <button on:click={() => goToPreviousStep()} class="bg-primary-green w-1/5 text-white px-6 py-2 rounded-full font-bold">Previous step</button>
            <p class=" ml-5 mr-5 text-2xl">{currentStep}/{totalsteps}</p>
        {#if currentStep != totalsteps}
            <button on:click={() => goToNextStep()} class="bg-primary-green w-1/5 text-white px-6 py-2 rounded-full font-bold">Next step</button>
        {:else}
            <button on:click={() => finishRecipe()} class="bg-primary-green w-1/5 text-white px-6 py-2 rounded-full font-bold">Finish recipe</button>
        {/if}
        </div>
    </div>
</div>
{/if}
