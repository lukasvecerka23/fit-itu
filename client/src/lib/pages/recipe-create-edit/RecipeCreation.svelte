

<script>
    import { onMount } from 'svelte';
    import { showShoppingList } from '../../../store.js';
    import { fly, fade, scale } from 'svelte/transition';
    // import circle from '../../assets/circle.svg';
    // import circle_ticked from '../../assets/circle_checked.svg';
    // import edit_icon from '../../assets/edit_icon.svg';
    import remove from '../../../assets/remove.svg';
    import Recipe from '../../components/Recipe.svelte';
    import Ingredient from '../pantry/components/Ingredient.svelte';
    export let id;
    let RecipeData = null ;
    let Number = null;


    // params.id will contain the ID from the URL
    let currentStep = 1;
  
    function goToNextStep() {
      if (currentStep < 4) {
        currentStep += 1;
        fetchRecipe();
        console.log("currentStep",currentStep);
      }
    }
  
    function goToPreviousStep() {
      if (currentStep > 1) {
        currentStep -= 1;
        console.log("currentStep",currentStep);
      }
    }
  
    function handleFinish() {
      alert('Recipe submitted!');
      // Here you would handle the submission of the recipe, such as a POST request to a server
    }

    function handleImageSelect(event) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        RecipeData.image = event.target.result;
      };
      reader.readAsDataURL(file);
    }

    async function fetchRecipe() {
      const response = await fetch(`https://fit-itu.hop.sh/api/collections/recipes/records/${id}?expand=steps,diet,ingredients,ingredients.ingredientId,ingredients.ingredientId.unit`);
      if (!response.ok) {
        // If the response is not okay, throw an error
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      RecipeData = await response.json();
      // loading = true;
      console.log("data",RecipeData);
    }
    $:fetchRecipe();

    function saveAmount(){
      console.log("saveAmount");
    }

    function deleteIngredient(){
      console.log("deleteIngredient");
    }

    async function addIngredient(){
      console.log("addIngredient");
    }

    function saveStep(){
      console.log("saveStep");
    }
  </script>

  <div>
    {#if currentStep === 1}
      {#if RecipeData}
      <div class="text-center py-4 bg-green-500 w-full">
        <h2 class="text-xl font-bold text-white">What's this recipe called?</h2>
      </div>
      <div class="flex flex-col justify-center items-center min-h-screen">

        <div class="w-full px-4 my-4">
          <input
            class="w-full p-2 border border-gray-300 rounded-md"
            type="text"
            placeholder="Name of your recipe..."
            bind:value={RecipeData.name}
          />
        </div>

        <div class="w-full px-4 my-4 relative">
          {#if RecipeData.image}
            <!-- svelte-ignore a11y-img-redundant-alt -->
            <img src={RecipeData.image} alt="Recipe image" class="w-full h-64 object-cover rounded-md" />
          {/if}
          <label
            for="file-upload"
            class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white py-2 text-center cursor-pointer">
            Select Picture
          </label>
          <input
            id="file-upload"
            type="file"
            class="hidden"
            on:change={handleImageSelect}
          />
        </div>
      </div>
      {:else}
        <!-- Render some loading state here -->
        <div class="flex justify-center items-center min-h-screen">
          Loading...
        </div>
      {/if}
    {:else if currentStep === 2}
    <div class="text-center py-4 bg-green-500">
      <h2 class="text-xl font-bold text-white">Which ingredients will you need?</h2>
    </div>
    <div class="flex flex-col gap-2 items-center">
      {#if RecipeData.ingredients.length === 0}
        <div class="flex justify-center">
          <h1 class="text-2xl font-poppins py-4 mb-0 mx-auto text-black">No ingredients added yet</h1>
        </div>
      {:else}
        {#each RecipeData.expand.ingredients as ingredient}
          <div class="flex justify-between border-b-2 border-black w-2/3">
          <div class="flex gap-2">
              <h1 class={`text-2xl font-poppins py-4 mb-0 mx-auto text-black`}>{ingredient.expand.ingredientId.name}</h1>

          <div class="flex gap-2">
            <input
              type="number"
              min=0
              max={1000}
              bind:value={ingredient.amount}
              class="border-gray-600 font-poppins  focus:ring-opacity-50 border-2 m-4 text-xl p-4 rounded-full text-center focus:outline-none"
              on:blur={() => saveAmount()}
            />
          </div>
          <div class="flex gap-2"></div>
          <h1 class="text-2xl font-poppins py-4 mb-0 mx-auto text-black"> {ingredient.expand.ingredientId.expand.unit.name}</h1>
          </div>
          <div class="flex gap-2 justify-end">
          <button on:click={() => deleteIngredient()}>
            <img src={remove} alt="remove" class="w-6 h-6"/>
          </button>
          </div>
          </div>
        {/each}
      {/if}
      <!-- add ingredient button -->
      <div class="flex justify-center">
        <button class="bg-green-500 text-white px-6 py-2 rounded-full font-bold" on:click={() => addIngredient()}>Add ingredient</button>
      </div>
    </div>
    {:else if currentStep === 3}
      <!-- Content for Step 3 -->
      <div class="text-center py-4 bg-green-500">
        <h2 class="text-xl font-bold text-white">How is this dish prepared?</h2>
      </div>
      <div class="flex flex-col gap-2 items-center">
      {#if RecipeData.steps.length === 0}
        <div class="flex justify-center">
          <h1 class="text-2xl font-poppins py-4 mb-0 mx-auto text-black">No steps added yet</h1>
        </div>
      {:else}
        {#each RecipeData.expand.steps as step}
          <div class="flex justify-between border-b-2 border-black w-2/3">
          <div class="flex gap-2">
              <h1 class={`text-2xl font-poppins py-4 mb-0 mx-auto text-black`}>{step.stepNumber}</h1>

          <div class="flex gap-2">
            <input
              type="text"
              bind:value={step.text}
              class="border-gray-600 font-poppins  focus:ring-opacity-50 border-2 m-4 text-xl p-4 rounded-full text-center focus:outline-none"
              on:blur={() => saveStep()}
            />
          </div>
          <div class="flex gap-2"></div>
          </div>
          <div class="flex gap-2 justify-end">
          <button on:click={() => deleteIngredient()}>
            <img src={remove} alt="remove" class="w-6 h-6"/>
          </button>
          </div>
          </div>
        {/each}
      {/if}
      </div>
      <!-- Input fields for step 3 -->
      <!-- ... -->
    {:else if currentStep === 4}
      <!-- Content for Step 4 (Review) -->
      <div class="text-center py-4 bg-green-500">
        <h2 class="text-xl font-bold text-white">Ready to publish? Check details.</h2>
      </div>
      <div class="px-4 pt-4">
        <h2 class="text-2xl font-bold">{RecipeData.name}</h2>
      </div>

      <!-- Recipe Image -->
      <img src={RecipeData.image} alt={RecipeData.name} class="w-full h-64 object-cover" />

      <!-- Display entered recipe information for review -->
      <div class="px-4">
        <div class="grid grid-cols-3 gap-4 items-center">
          <div class="font-bold">Ingredients</div>
          <div class="col-span-2 font-bold text-middle">Amount</div>
          {#if RecipeData.ingredients.length == 0}
            <div class="flex justify-center">
              <h1 class="text-2xl font-poppins py-4 mb-0 mx-auto text-black">No ingredients</h1>
            </div>
          {:else}
            {#each RecipeData.expand.ingredients as ingredient, index}
              <div>
                <li class="list-disc list-inside">{ingredient.expand.ingredientId.name}</li>
              </div>
              <div class="col-span-2 text-middle">
                <div class="flex items-center space-x-4">
                {ingredient.amount} {ingredient.expand.ingredientId.expand.unit.name}
                <!-- Add icons here as needed -->
                  <!-- Icon SVG -->
                </div>
              </div>
            {/each}
          {/if}
        </div>
      </div>

      <!-- Steps -->
      <div class="px-4 my-4">
        <h3 class="font-semibold text-lg mb-2">Steps</h3>
        <ol class="list-decimal pl-5">
          {#if RecipeData.steps.length == 0}
            <div class="flex justify-center">
              <h1 class="text-2xl font-poppins py-4 mb-0 mx-auto text-black">No steps</h1>
            </div>
          {:else}
            {#each RecipeData.expand.steps as step, index}
              {@html step.text}<br>
            {/each}
          {/if}
        </ol>
      </div>
      <!-- ... -->
    {/if}
  </div>
  
  <!-- Navigation buttons -->
  <div class="fixed inset-x-0 bottom-0 px-6 py-4 bg-white shadow-lg flex justify-between items-center">
    <div>
      {#if currentStep > 1}
        <button class="bg-green-500 text-white px-6 py-2 rounded-full font-bold" on:click={goToPreviousStep}>Back</button>
      {/if}
    </div>
    <!-- Title showing progress in the format n/m -->
    <div class="font-bold">
      Step {currentStep} / 4
    </div>
    <div>
      {#if currentStep < 4}
        <button class="bg-green-500 text-white px-6 py-2 rounded-full font-bold" on:click={goToNextStep}>Next</button>
      {:else}
        <button class="bg-green-500 text-white px-6 py-2 rounded-full font-bold" on:click={handleFinish}>Finish</button>
      {/if}
    </div>
  </div>