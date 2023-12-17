<script>
    import Sidebar from '../../components/SideBar.svelte';
    import Recipe from '../../components/Recipe.svelte';
    import SlideUpOverlay from '../../components/SlideUpOverlay.svelte';
    import { showShoppingList } from '../../../store';
    import circle_checked from '../../../assets/circle_checked.svg';
    import close_icon_black from '../../../assets/close_icon_black.svg';
    import basket_to_buy from '../../../assets/basket_to_buy.svg';
    import basket_in_shopping_list from '../../../assets/basket_in_shopping_list.svg';
    import plus_icon from '../../../assets/plus_button.svg'
    import {navigate} from 'svelte-routing';
    import recipe_placeholder from '../../../assets/recipe_placeholder.jpg';
    import frying_pan from '../../../assets/frying_pan.svg';
    // You can add more script code here if needed
    // Fetch pantry sections and set the first one as selected
    let recipes = [];
    let showModal = false;
    let selectedRecipe = null;
    let missingIngredients = [];
    let missingIngredientsShoppingList = [];
    export let selectedRecipeData = null;
    let ingredients = [];
    let loading = false;
    fetch('https://fit-itu.hop.sh/api/collections/recipes/records')
        .then(res => res.json())
        .then(data => {
            recipes = data.items;
            console.log(recipes);
        })
        .catch(err => {
            console.error(err);
        });




    async function openModal(recipe) {
      loading = true;
      const response = await fetch(`https://fit-itu.hop.sh/api/collections/recipes/records/${recipe.id}?expand=steps,diet,ingredients,ingredients.ingredientId,ingredients.ingredientId.unit`);
      if (!response.ok) {
        // If the response is not okay, throw an error
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      selectedRecipeData = await response.json();
      // loading = true;
      console.log(selectedRecipeData);

      // Fetch the ingredients in the pantry
      const pantryResponse = await fetch('https://fit-itu.hop.sh/api/collections/ingredientInPantry/records?expand=ingredient');
      if (!pantryResponse.ok) throw new Error(`HTTP error! Status: ${pantryResponse.status}`);
      const pantryData = await pantryResponse.json();

      // Create a map of pantry ingredients for easy lookup
      const pantryIngredientsMap = new Map(pantryData.items.map(item => [item.expand.ingredient.name, item]));

      console.log("pantry",pantryIngredientsMap);

      // Determine missing ingredients
      if (selectedRecipeData && selectedRecipeData.expand && selectedRecipeData.expand.ingredients){
      missingIngredients = selectedRecipeData.expand.ingredients.filter(ingredient => {
        const pantryItem = pantryIngredientsMap.get(ingredient.expand.ingredientId.name);
        return !pantryItem || pantryItem.amount < ingredient.amount;
      });
      }

      console.log("missing ingredients",missingIngredients);


      // Fetch the ingredients in the shopping list
      const shoppingListResponse = await fetch('https://fit-itu.hop.sh/api/collections/ingredientInShoppingList/records?expand=ingredient');
      if (!shoppingListResponse.ok) throw new Error(`HTTP error! Status: ${shoppingListResponse.status}`);
      const shoppingListData = await shoppingListResponse.json();

      // Create a map of shopping list ingredients for easy lookup
      const shoppingListIngredientsMap = new Map(shoppingListData.items.map(item => [item.expand.ingredient.name, item]));

      console.log("shopping list",shoppingListIngredientsMap);

      // Determine missing ingredients
      if(missingIngredientsShoppingList.length != 0){
      missingIngredientsShoppingList = selectedRecipeData.expand.ingredients.filter(ingredient => {
        const shoppingListItem = shoppingListIngredientsMap.get(ingredient.expand.ingredientId.name);
        return !shoppingListItem || shoppingListItem.amount < ingredient.amount;
      });
      }

      if (selectedRecipeData && selectedRecipeData.expand && selectedRecipeData.expand.steps) {
        selectedRecipeData.expand.steps.sort((a, b) => a.stepNumber - b.stepNumber);
      }
  console.log(selectedRecipeData);
      loading = true;
      selectedRecipe = recipe;
      showModal = true;
      loading = false;
    }

    function closeModal() {
      showModal = false;
    }

    async function addIngredientToShoppingList(ingredient){
      const shoppingListUrl = 'https://fit-itu.hop.sh/api/collections/ingredientInShoppingList/records';
    const ingredientId = ingredient.expand.ingredientId.id; // The ID of the ingredient
    const amountToAdd = ingredient.amount;
    try {
        // Check if ingredient is in the shopping list
        const shoppingListResponse = await fetch(shoppingListUrl);
        if (!shoppingListResponse.ok) {
            throw new Error(`HTTP error! Status: ${shoppingListResponse.status}`);
        }
        const shoppingList = await shoppingListResponse.json();

        // Find if the ingredient already exists in the shopping list
        const existingItem = shoppingList.items.find(item => item.ingredient === ingredientId);

        if (existingItem) {
            // Ingredient exists, update the amount
            const updateUrl = `${shoppingListUrl}/${existingItem.id}`; // Assuming the item's ID is in `existingItem.id`
            const updatedAmount = (amountToAdd - existingItem.amount) + existingItem.amount; // Add only the difference to the existing amount

            const patchResponse = await fetch(updateUrl, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ amount: updatedAmount }),
            });

            if (!patchResponse.ok) {
                throw new Error(`HTTP error! Status: ${patchResponse.status}`);
            }

            console.log("Ingredient amount updated in shopping list");
        } else {
            // Ingredient does not exist, add new item
            const postResponse = await fetch(shoppingListUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: "uvh48ynbmnnmydx", // Constant user ID sine we don't have authentication
                    ingredient: ingredientId,
                    amount: amountToAdd,
                    ticked: false,
                }),
            });

            if (!postResponse.ok) {
                throw new Error(`HTTP error! Status: ${postResponse.status}`);
            }

            console.log("Ingredient added to shopping list");
        }
    } catch (error) {
        console.error("Error processing shopping list:", error);
    }

    const shoppingListResponse = await fetch('https://fit-itu.hop.sh/api/collections/ingredientInShoppingList/records?expand=ingredient');
      if (!shoppingListResponse.ok) throw new Error(`HTTP error! Status: ${shoppingListResponse.status}`);
      const shoppingListData = await shoppingListResponse.json();

      // Create a map of shopping list ingredients for easy lookup
      const shoppingListIngredientsMap = new Map(shoppingListData.items.map(item => [item.expand.ingredient.name, item]));

      console.log("shopping list",shoppingListIngredientsMap);

      // Determine missing ingredients
      missingIngredientsShoppingList = selectedRecipeData.expand.ingredients.filter(ingredient => {
        const shoppingListItem = shoppingListIngredientsMap.get(ingredient.expand.ingredientId.name);
        return !shoppingListItem || shoppingListItem.amount < ingredient.amount;
      });
}

async function createAndRetrieveNewRecipe() {
    try {
      // POST request to create a new recipe
      let postResponse = await fetch('https://fit-itu.hop.sh/api/collections/recipes/records', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: "uvh48ynbmnnmydx", // Constant user ID sine we don't have authentication
                    duration: 0,
                    difficulty: 0,
                    ticked: false,
                }),
            });

      if (!postResponse.ok) {
        throw new Error(`HTTP error! Status: ${postResponse.status}`);
      }

      // Assuming the POST request returns the new recipe object with an ID
      let newRecipe = await postResponse.json();
      console.log('Created new recipe with ID:', newRecipe.id);

      // GET request to retrieve the new recipe
      let getResponse = await fetch(`https://fit-itu.hop.sh/api/collections/recipes/records/${newRecipe.id}`);

      if (!getResponse.ok) {
        throw new Error(`HTTP error! Status: ${getResponse.status}`);
      }

      let retrievedRecipe = await getResponse.json();
      console.log('Retrieved new recipe:', retrievedRecipe);

      return retrievedRecipe; // Return the retrieved recipe object

    } catch (error) {
      console.error('Error creating and retrieving new recipe:', error);
    }
  }
  async function handleCreateRecipeClick() {
    const newRecipe = await createAndRetrieveNewRecipe();
    if (newRecipe && newRecipe.id) {
      navigate(`/createrecipe/${newRecipe.id}`);
    }
  }

  async function handleCookRecipeClick() {
    const newRecipe = await createAndRetrieveNewRecipe();
    if (newRecipe && newRecipe.id) {
      navigate(`/recipeinteractive/${newRecipe.id}`);
    }
  }

  async function handleEditRecipe() {
    navigate(`/createrecipe/${selectedRecipe.id}`);
  }


  </script>

<div class="flex w-full">
  <Sidebar />
  <div class="h-screen w-full bg-primary-white overflow-auto">
    <h1 class="text-4xl font-bold p-4 text-center">Recipes</h1>
    <div class="columns-1 md:columns-2 lg:columns-3 xl:columns-5 gap-6 p-2">
      {#each recipes as recipe}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div class="rounded-lg cursor-pointer py-2" on:click={() => openModal(recipe)}>
          <Recipe name={recipe.name} description={recipe.description} imageurl={recipe.image ? recipe.image : recipe_placeholder}/>
        </div>
      {/each}
    </div>
  </div>
  <!-- Create button -->
  <div class="fixed bottom-0 right-0 mb-4 mr-4">
    <button on:click={handleCreateRecipeClick} class="focus:outline-none">
      <img src={plus_icon} alt="plus icon" class="w-20 h-20" />
    </button>
  </div>
  <div class="fixed bottom-20 right-0 mb-4 mr-4">
    <button on:click={handleCookRecipeClick} class="focus:outline-none">
      <img src={frying_pan} alt="cook crecipe" class="w-20 h-20" />
    </button>
  </div>
</div>




<SlideUpOverlay bind:show={showModal} height="h-screen pt-10">
    {#if loading}
    <div class="px-4 pt-4">
      <h2 class="text-2xl font-bold">Loading ingredients...</h2>
    </div>
    {:else}
      <!-- Recipe Title -->
      <div class="flex flex-col items-center pb-100">
          <div class="px-4 pt-4">
            <h2 class="text-2xl font-bold">{selectedRecipe.name}</h2>
          </div>

          <!-- Recipe Image -->
          <img src={selectedRecipe.image} alt={selectedRecipe.name} class="w-full h-64 object-cover" />

          <!-- Ingredients List -->
          <div class="px-4">
            {#if selectedRecipeData.ingredients.length != 0}
            <div class="grid grid-cols-3 gap-4 items-center">
              <div class="font-bold">Ingredients</div>
              <div class="col-span-2 font-bold text-middle">Amount</div>
              {#each selectedRecipeData.expand.ingredients as ingredient, index}
                <div>
                  <li class="list-disc list-inside">{ingredient.expand.ingredientId.name}</li>
                </div>
                <div class="col-span-2 text-middle">
                  <div class="flex items-center space-x-4">
                  {ingredient.amount} {ingredient.expand.ingredientId.expand.unit.name}
                  <!-- Add icons here as needed -->
                  {#if missingIngredients.some(missingIngredient => missingIngredient.expand.ingredientId.name === ingredient.expand.ingredientId.name)}
                  <img src={close_icon_black} alt="arrow" class="w-6 h-6" />
                  <!-- svelte-ignore a11y-click-events-have-key-events -->
                  <!-- svelte-ignore a11y-no-static-element-interactions -->
                  {#if missingIngredientsShoppingList.some(missingIngredient => missingIngredient.expand.ingredientId.name === ingredient.expand.ingredientId.name)}
                  <button class="w-6 h-6" on:click={() => {addIngredientToShoppingList(ingredient);}}>
                  <img src={basket_to_buy} alt="ingredient not in shopping list"/>
                  </button>
                  {:else}
                  <img src={basket_in_shopping_list} alt="ingredient in shopping list"  class="w-6 h-6"/>
                  {/if}
                  {:else}
                  <img src={circle_checked} alt="arrow" class="w-6 h-6" />
                  {/if}
                    <!-- Icon SVG -->
                  </div>
                </div>
              {/each}
            </div>
            {:else}
            <div class="col-span-3 text-center">No ingredients</div>
          {/if}
          </div>

          <!-- Steps -->
          <div class="px-4 my-4 overflow-scroll">
            <h3 class="font-semibold text-lg mb-2">Steps</h3>
            <ol class="list-decimal pl-5">
              {#if selectedRecipeData == null}
                <div class="col-span-3 text-center">No steps</div>
              {:else}
              {#if selectedRecipeData.steps.length != 0}
              {#each selectedRecipeData.expand.steps as step, index}
                {@html step.text}<br>
              {/each}
              {/if}
              {/if}
            </ol>
          </div>

          <!-- Action Buttons -->
          <div class="fixed bottom-0 py-2">
              <button class="bg-green-500 text-white px-6 py-2 rounded-full font-bold">Cook</button>
              <button on:click={handleEditRecipe} class="bg-yellow-500 text-white px-6 py-2 rounded-full font-bold">Edit</button>
              <button on:click={closeModal} class="bg-red-500 text-white px-6 py-2 rounded-full font-bold">Close</button>
          </div>
      </div>

    {/if}
</SlideUpOverlay>