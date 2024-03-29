<!-- 
                Recipes.svelte
                Jachym Dolezal
                FIT ITU 2023
-->

<script>
    import Sidebar from '../../components/SideBar.svelte';
    import Recipe from '../../components/Recipe.svelte';
    import SlideUpOverlay from '../../components/SlideUpOverlay.svelte';
    import circle_checked from '../../../assets/circle_checked.svg';
    import close_icon_black from '../../../assets/close_icon_black.svg';
    import basket_to_buy from '../../../assets/basket_to_buy.svg';
    import basket_in_shopping_list from '../../../assets/basket_in_shopping_list.svg';
    import plus_icon from '../../../assets/plus_button.svg'
    import {navigate} from 'svelte-routing';
    import recipe_placeholder from '../../../assets/recipe_placeholder.jpg';
    import { onMount } from 'svelte';
    import {reloadShoppingList, showShoppingList} from '../../../store.js';
    import up_arrow from '../../../assets/uparrow.svg';


    let recipes = [];
    let showModal = false;
    let selectedRecipe = null;
    let missingIngredients = [];
    let missingIngredientsShoppingList = [];
    export let selectedRecipeData = null;
    let ingredients = [];
    let loading = false;
    let ingredientsInPantry = [];
    let sortedRecipes = [];

    function mergeIngredients(){
      return ingredientsInPantry.reduce((acc, item) => {
        const { ingredient, amount } = item;
        if (acc[ingredient]) {
          acc[ingredient] += amount; // Add to existing amount
        } else {
          acc[ingredient] = amount; // Initialize amount
        }
        return acc;
      }, {});
    }

    function getRecipes(){
      fetch('https://fit-itu.hop.sh/api/collections/recipes/records')
        .then(res => res.json())
        .then(data => {
            recipes = data.items;
            getAndSortRecipes();
        })
        .catch(err => {
            console.error(err);
        });
    }

    function getIngredientsInPantry(){
      fetch('https://fit-itu.hop.sh/api/collections/ingredientInPantry/records?expand=ingredient')
        .then(res => res.json())
        .then(data => {
            ingredientsInPantry = data.items;
        })
        .catch(err => {
            console.error(err);
        });
    }

    function getAndSortRecipes() {
      const ingredients = mergeIngredients();

      // Score each recipe based on the amount of ingredients the user has
      recipes.forEach(recipe => {
        let score = 0;
        recipe.ingredients.forEach(ingredient => {
          // Check if the user has the ingredient and enough of it
          if (ingredients[ingredient.name] && ingredients[ingredient.name] >= ingredient.amount) {
            score++;
          }
        });
        recipe.score = score;
      });

      // Sort recipes based on the score in descending order
      recipes.sort((a, b) => b.score - a.score);

      sortedRecipes = recipes;
    }

    async function openModal(recipe) {
      loading = true;
      const response = await fetch(`https://fit-itu.hop.sh/api/collections/recipes/records/${recipe.id}?expand=steps,diet,ingredients,ingredients.ingredientId,ingredients.ingredientId.unit`);
      if (!response.ok) {
        // If the response is not okay, throw an error
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      selectedRecipeData = await response.json();

      const mergedIngredients = mergeIngredients();

      // Determine missing ingredients
      if (selectedRecipeData && selectedRecipeData.expand && selectedRecipeData.expand.ingredients){
      missingIngredients = selectedRecipeData.expand.ingredients.filter(ingredient => {
        const pantryItem = mergedIngredients[ingredient.ingredientId];
        return !pantryItem || pantryItem < ingredient.amount;
      });
      }


      // Fetch the ingredients in the shopping list
      const shoppingListResponse = await fetch('https://fit-itu.hop.sh/api/collections/ingredientInShoppingList/records?expand=ingredient');
      if (!shoppingListResponse.ok) throw new Error(`HTTP error! Status: ${shoppingListResponse.status}`);
      const shoppingListData = await shoppingListResponse.json();

      // Create a map of shopping list ingredients for easy lookup
      const shoppingListIngredientsMap = new Map(shoppingListData.items.map(item => [item.expand.ingredient.name, item]));


      if(selectedRecipeData && selectedRecipeData.expand && selectedRecipeData.expand.ingredients){
        missingIngredientsShoppingList = selectedRecipeData.expand.ingredients.filter(ingredient => {
          const shoppingListItem = shoppingListIngredientsMap.get(ingredient.expand.ingredientId.name);
          return !shoppingListItem || shoppingListItem.amount < ingredient.amount;
        });
      }

      if (selectedRecipeData && selectedRecipeData.expand && selectedRecipeData.expand.steps) {
        selectedRecipeData.expand.steps.sort((a, b) => a.stepNumber - b.stepNumber);
      }
      loading = false;
      showModal = true;
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
            const updateUrl = `${shoppingListUrl}/${existingItem.id}`;
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
        }
    } catch (error) {
        console.error('Error adding ingredient to shopping list:', error);
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
    
      reloadShoppingList.set(true);
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

      let newRecipe = await postResponse.json();
      console.log('Created new recipe with ID:', newRecipe.id);

      let getResponse = await fetch(`https://fit-itu.hop.sh/api/collections/recipes/records/${newRecipe.id}`);

      if (!getResponse.ok) {
        throw new Error(`HTTP error! Status: ${getResponse.status}`);
      }

      let retrievedRecipe = await getResponse.json();
      console.log('Retrieved new recipe:', retrievedRecipe);

      return retrievedRecipe;

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

  async function handleCookRecipeClick(recipeid) {
    if (recipeid) {
      navigate(`/recipeinteractive/${recipeid}`);
    }
  }

  async function handleEditRecipe() {
    navigate(`/createrecipe/${selectedRecipeData.id}`);
  }

  onMount(() => {
    getRecipes();
    getIngredientsInPantry();

  });


  </script>

<div class="flex w-full">
  <Sidebar />
  <div class="h-screen w-full bg-primary-white overflow-auto">
    <h1 class="text-4xl font-bold p-4 text-center">Recipes</h1>
    <div class="columns-1 md:columns-2 lg:columns-3 xl:columns-5 gap-6 p-2">
      {#each sortedRecipes as recipe}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div class="rounded-lg cursor-pointer py-2" on:click={() => openModal(recipe)}>
          <Recipe name={recipe.name} imageurl={recipe.image ? recipe.image : recipe_placeholder}/>
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
  <div class="fixed inset-x-0 bottom-0 flex justify-center items-end">
    <button class="w-1/2 bg-primary-brown text-black rounded-t-xl flex justify-center" on:click={() => showShoppingList.set(true)}>
        <img src={up_arrow} alt="Popis obrázku" class="w-[30px]">
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
      <div class="flex flex-col items-center justify-between h-full">
          <div class="flex-1 w-full overflow-y-auto">
            <div class="p-4">
              <h2 class="text-2xl font-bold">{selectedRecipeData.name}</h2>
            </div>

            <!-- Recipe Image -->
            <img src={selectedRecipeData.image ? selectedRecipeData.image : recipe_placeholder} alt={selectedRecipeData.name} class="w-full h-64 object-cover rounded-2xl" />

            <!-- Ingredients List -->
            <div class="px-4 mt-4">
              {#if selectedRecipeData.ingredients.length != 0}
              <div class="grid grid-cols-2 gap-4 items-center">
                <div class="font-bold">Ingredient</div>
                <div class="font-bold text-middle">Amount</div>
                {#each selectedRecipeData.expand.ingredients as ingredient, index}
                  <div>
                    <li class="list-disc list-inside">{ingredient.expand.ingredientId.name}</li>
                  </div>
                  <div class="text-middle">
                    <div class="flex items-center space-x-4">
                    {ingredient.amount} {ingredient.expand.ingredientId.expand.unit.name}
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
              <div class="col-span-2 text-center">No ingredients</div>
            {/if}
            </div>

            <!-- Steps -->
            <div class="px-4 my-4">
              <h3 class="font-semibold text-lg mb-2 text-center">Steps</h3>
             
                {#if selectedRecipeData.steps.length != 0}
                <ol class="list-decimal pl-5">
                  {#each selectedRecipeData.expand.steps as step, index}
                    <li class="mb-2">
                    {@html step.text}<br>
                    </li>
                  {/each}
                </ol>
                {:else}
                  <div class="text-center">No steps</div>
                {/if}
             
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-center gap-4">
              <button on:click={()=>handleCookRecipeClick(selectedRecipeData.id)} class="bg-primary-green text-white px-6 py-2 rounded-full font-bold">Cook</button>
              <button on:click={handleEditRecipe} class="bg-yellow-500 text-white px-6 py-2 rounded-full font-bold">Edit</button>
              <button on:click={closeModal} class="bg-primary-red text-white px-6 py-2 rounded-full font-bold">Close</button>
          </div>
      </div>
    {/if}
</SlideUpOverlay>