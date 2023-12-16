<script>
    import Sidebar from '../../components/SideBar.svelte';
    import Recipe from '../../components/Recipe.svelte';
    import SlideUpOverlay from '../../components/SlideUpOverlay.svelte';
    import { showShoppingList } from '../../../store';
    import circle_checked from '../../../assets/circle_checked.svg';
    import close_icon_black from '../../../assets/close_icon_black.svg';
    import basket_to_buy from '../../../assets/basket_to_buy.svg';
    // You can add more script code here if needed
    // Fetch pantry sections and set the first one as selected
    let recipes = [];
    let showModal = false;
    let selectedRecipe = null;
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

    function testbutton(){
      console.log("test");
    }


  </script>

<div class="flex w-full">
  <Sidebar />
  <div class="h-screen w-full bg-primary-white overflow-auto">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 p-2">
      {#each recipes as recipe}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div class="rounded-lg cursor-pointer" on:click={() => openModal(recipe)}>
          <Recipe name={recipe.name} description={recipe.description} imageurl={recipe.image}/>
        </div>
      {/each}
    </div>
  </div>
</div>


<SlideUpOverlay bind:show={showModal}>

  <div class={`fixed inset-0 z-50 ${showModal ? 'flex' : 'hidden'} items-end`}>
    {#if loading}
    <div class="w-full max-w-screen-md mx-auto bg-white rounded-t-lg overflow-hidden">
    <div class="px-4 pt-4">
      <h2 class="text-2xl font-bold">Loading ingredients...</h2>
    </div>
    </div>
    {:else}
    <div class="w-full max-w-screen-md mx-auto bg-white rounded-t-lg overflow-hidden">

      <!-- Recipe Title -->
      <div class="px-4 pt-4">
        <h2 class="text-2xl font-bold">{selectedRecipe.name}</h2>
      </div>

      <!-- Recipe Image -->
      <img src={selectedRecipe.image} alt={selectedRecipe.name} class="w-full h-64 object-cover" />

      <!-- Ingredients List -->
      <div class="px-4">
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
              {#if 0}
              <img src={circle_checked} alt="arrow" class="w-6 h-6" />
              {:else}
              <img src={close_icon_black} alt="arrow" class="w-6 h-6" />
              <!-- svelte-ignore a11y-click-events-have-key-events -->
              <!-- svelte-ignore a11y-no-static-element-interactions -->
              <button class="w-6 h-6" on:click={() => testbutton()}>
              <img src={basket_to_buy} alt="arrow"/>
              </button>
              {/if}
                <!-- Icon SVG -->
              </div>
            </div>
          {/each}
        </div>
      </div>

      <!-- Steps -->
      <div class="px-4 my-4">
        <h3 class="font-semibold text-lg mb-2">Steps</h3>
        <ol class="list-decimal pl-5">
          {#each selectedRecipeData.expand.steps as step, index}
            {@html step.text}<br>
          {/each}
        </ol>
      </div>
  
      <!-- Action Buttons -->
      <div class="flex justify-between items-center px-4 py-4">
        <button class="bg-green-500 text-white px-6 py-2 rounded-full font-bold">Cook</button>
        <button on:click={closeModal} class="bg-red-500 text-white px-6 py-2 rounded-full font-bold">Close</button>
        <!-- <button class="text-red-500">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <!-- Heart icon SVG path -->
          <!-- </svg> -->
        <!-- </button> -->
      </div>
    </div>
    {/if}
  </div>
</SlideUpOverlay>