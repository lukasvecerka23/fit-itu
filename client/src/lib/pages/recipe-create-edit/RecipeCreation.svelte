

<script>
    import { onMount } from 'svelte';
    import { showShoppingList } from '../../../store.js';
    import { fly, fade, scale } from 'svelte/transition';
    import remove from '../../../assets/remove.svg';
    import Recipe from '../../components/Recipe.svelte';
    import Ingredient from '../pantry/components/Ingredient.svelte';
    import Sidebar from '../../components/SideBar.svelte';
    import sample_image from '../../../assets/recipe_placeholder.jpg';
    import { navigate } from 'svelte-routing';
    import recipe_placeholder from '../../../assets/recipe_placeholder.jpg';

    export let id;
    let RecipeData = null ;
    let newStep = '';
    let newImageUrl = '';
    let searchQuery = '';
    let filteredIngredients = [];
    let selectedIngredient = null;
    let ingredientTypes = [];
    let newIngredient = {
      ingredient: null,
      amount: 0,
    };

    function getIngredientTypes(){
        fetch('https://fit-itu.hop.sh/api/collections/ingredients/records?expand=unit')
        .then(res => res.json())
        .then(data => {
            ingredientTypes = data.items;
            filteredIngredients = ingredientTypes;
            console.log(ingredientTypes);
        })
        .catch(err => {
            console.error(err);
        });
    }


    // params.id will contain the ID from the URL
    let currentStep = 1;
  
    function goToNextStep() {
      if (currentStep < 4) {
        currentStep += 1;
        if (currentStep == 2){
          getIngredientTypes();
        }
      }
    }
  
    function goToPreviousStep() {
      if (currentStep > 1) {
        currentStep -= 1;
      }
    }
  
    function handleFinish() {
      navigate('/recipes');
    }

    function handleImageSelect(event) {
      fetch(`https://fit-itu.hop.sh/api/collections/recipes/records/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "image": RecipeData.image
        })
      })
      .then(async () => {
        await fetchRecipe();
      })
    }

    async function fetchRecipe() {
      const response = await fetch(`https://fit-itu.hop.sh/api/collections/recipes/records/${id}?expand=steps,diet,ingredients,ingredients.ingredientId,ingredients.ingredientId.unit`);
      if (!response.ok) {
        // If the response is not okay, throw an error
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      RecipeData = await response.json();
    }

    $:fetchRecipe();

    function saveIngredient(){
      const exists = RecipeData.expand.ingredients.find(item => item.ingredientId === newIngredient.ingredient);
      if (exists) {
        fetch(`https://fit-itu.hop.sh/api/collections/ingredientInRecipe/records/${exists.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            "ingredientId": newIngredient.ingredient,
            "recipeId": id,
            "amount": exists.amount + newIngredient.amount
          })
        }).then(async () => {
          await fetchRecipe();
        })
      } else {
        fetch('https://fit-itu.hop.sh/api/collections/ingredientInRecipe/records', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            "ingredientId": newIngredient.ingredient,
            "recipeId": id,
            "amount": newIngredient.amount,
          })
        })   
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          const new_id = data.id;
          fetch(`https://fit-itu.hop.sh/api/collections/recipes/records/${id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json'
            },

            body: JSON.stringify({
              "ingredients+": new_id
            })
          })
          .then(async () => {
            await fetchRecipe();
          })
        });
      }
      clearThings();
    }

    function saveAmount(ingredient) {
      fetch(`https://fit-itu.hop.sh/api/collections/ingredientInRecipe/records/${ingredient.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "ingredientId": ingredient.ingredient,
          "recipeId": id,
          "amount": ingredient.amount
        })
      })   
      .then(async () => {
        await fetchRecipe();
      })
    }

    function deleteIngredient(ingredient){
      console.log("deleteIngredient");
      fetch(`https://fit-itu.hop.sh/api/collections/ingredientInRecipe/records/${ingredient.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
      })
      .then(async () => {
        await fetchRecipe();
      })
    }

    function saveStep(step){
      fetch(`https://fit-itu.hop.sh/api/collections/recipeSteps/records/${step.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "stepNumber": step.stepNumber,
          "text": step.text,
          "media": step.media,
        })
      })   
      .then(async () => {
        await fetchRecipe();
      })
    }

    function createStep(){
      fetch('https://fit-itu.hop.sh/api/collections/recipeSteps/records', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "stepNumber": RecipeData.steps.length + 1,
          "text": newStep,
          "recipeId": id,
          "media": newImageUrl
        })
      }) 
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        const new_id = data.id;
        fetch(`https://fit-itu.hop.sh/api/collections/recipes/records/${id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },

          body: JSON.stringify({
            "steps+": new_id
          })
        })
        .then(async () => {
          await fetchRecipe();
          newStep = '';
        })
      });
    }

    function handleCancel(){
      navigate('/recipes');
    }

    function filterIngredients(query) {
      filteredIngredients = ingredientTypes.filter(ingredient =>
        ingredient.name.toLowerCase().includes(query.toLowerCase())
      );
    }

    function selectIngredient(ingredient) {
      selectedIngredient = ingredient;
      console.log(selectedIngredient);
      searchQuery = ingredient.name; // Set the search query to the selected name
      filteredIngredients = []; // Clear filtered results after selection
      newIngredient.ingredient = ingredient.id;
    }

    function clearThings()
    {
      searchQuery = '';
      filteredIngredients = [];
      selectedIngredient = null;
      newIngredient = {
        ingredient: null,
        amount: 0,
      };
    }

    async function saveName(){
      console.log("saveName");
      console.log(RecipeData.name);
      fetch(`https://fit-itu.hop.sh/api/collections/recipes/records/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "name": RecipeData.name
        })
      })
      .then(async () => {
        await fetchRecipe();
      })
    }

    async function deleteStep(step){
      console.log("deleteStep");
      console.log(step);
      fetch(`https://fit-itu.hop.sh/api/collections/recipeSteps/records/${step.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
      })
      .then(async () => {
        await fetchRecipe();
      })
    }

    onMount(async () => {
      await fetchRecipe();
    });

  </script>


  <div class="flex w-full">
  <Sidebar />
  <div class="h-screen w-full bg-primary-white overflow-auto">

    {#if currentStep === 1}
      {#if RecipeData}
      <div class="text-center py-4 bg-secondary-green w-full font-poppins">
        <h2 class="text-xl font-bold text-white">What's this recipe called?</h2>
      </div>
      <div class="flex flex-col items-center">

        <div class="w-1/2 px-4 my-4">
          <input
            class="w-full p-2 border border-gray-300 rounded-full"
            type="text"
            placeholder="Name of your recipe..."
            bind:value={RecipeData.name}
            on:blur={() => saveName()}
          />
        </div>

        <div class="w-1/2 px-4 my-4">
          {#if RecipeData.image}
            <!-- svelte-ignore a11y-img-redundant-alt -->
            <img src={RecipeData.image} alt="Recipe image" class="w-full h-64 object-cover rounded-t-xl" />
          {:else}
            <!-- svelte-ignore a11y-img-redundant-alt -->
            <img src={sample_image} alt="Sample Recipe image" class="w-full h-64 object-cover rounded-t-xl"/>
          {/if}
          <input
            class="w-full bg-black bg-opacity-50 text-white py-2 text-center cursor-pointer rounded-b-xl"
            type="text"
            placeholder="Image URL..."
            bind:value={RecipeData.image}
            on:blur={() => handleImageSelect()}
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
    <div class="text-center py-4 bg-secondary-green">
      <h2 class="text-xl font-bold text-white">Which ingredients will you need?</h2>
    </div>
    <div class="w-2/3 flex flex-col gap-2 items-center mx-auto mt-10">
      {#if RecipeData.ingredients.length === 0}
        <div class="flex justify-center">
          <h1 class="text-2xl font-poppins py-4 mb-0 mx-auto text-black">No ingredients added yet</h1>
        </div>
      {:else}
        {#each RecipeData.expand.ingredients as ingredient}
          <div class="flex justify-between items-center border-b-2 border-black w-2/3">
          <div class="flex gap-2">
              <h1 class={`text-2xl font-poppins py-4 mb-0 mx-auto text-black`}>{ingredient.expand.ingredientId.name}</h1>
          </div>
          <div class="flex gap-2 items-center">
            <input
              type="number"
              min=0
              max={1000}
              bind:value={ingredient.amount}
              on:blur={() => saveAmount(ingredient)}
              class="border-gray-600 font-poppins  focus:ring-opacity-50 border-2 m-4 text-xl p-4 rounded-full text-center focus:outline-none"
            />
            <h1 class="text-2xl font-poppins py-4 mx-auto text-black"> {ingredient.expand.ingredientId.expand.unit.name}</h1>
            <button on:click={() => deleteIngredient(ingredient)}>
              <img src={remove} alt="remove" class="w-[30px]"/>
            </button>
          </div>
          </div>
        {/each}
        
      {/if}

      <!-- Search for new ingredients -->
      <div class="relative flex gap-2 w-1/2">
        <input
          type="text"
          placeholder="Search for ingredients..."
          bind:value={searchQuery}
          on:input={() => filterIngredients(searchQuery)}
          class="border-2 border-gray-700 p-2 rounded-full w-full focus:border-primary-green focus:outline-none font-poppins bg-primary-brown text-xl placeholder-gray-700"
        />
        {#if searchQuery && filteredIngredients.length}
          <div class="absolute border-black bg-opacity-50 flex flex-col mt-14 bg-primary-white z-10 w-full rounded-2xl border font-poppins">
            {#each filteredIngredients as ingredient}
              <button
                on:click={() => selectIngredient(ingredient)}
                class="p-2 hover:bg-primary-white cursor-pointer rounded-full text-left"
                in:fade={{ delay: 100 * (filteredIngredients.indexOf(ingredient)), duration: 300 }}
                >
                {ingredient.name}
              </button>
            {/each}
          </div>
        {/if}
        {#if selectedIngredient}
          <input
            type="number"
            min=0
            bind:value={newIngredient.amount}
            max={1000}
            class="border-gray-600 w-1/3 bg-primary-brown font-poppins focus:border-primary-green focus:ring-opacity-50 border-2 px-2 text-xl rounded-full text-center focus:outline-none"/>
          <h1 class="text-2xl font-poppins py-2">{selectedIngredient.expand.unit.name}</h1>
          <button class="bg-primary-green text-white rounded-3xl text-center px-4 hover:bg-secondary-green" on:click={() => saveIngredient()}>Add</button>
        {/if}
      </div>
    </div>
    {:else if currentStep === 3}
      <!-- Content for Step 3 -->
      <div class="text-center py-4 bg-secondary-green">
        <h2 class="text-xl font-bold text-white">How is this dish prepared?</h2>
      </div>
      <div class="flex flex-col gap-2 items-center mt-10">
      {#if RecipeData.steps.length === 0}
        <div class="flex justify-center">
          <h1 class="text-2xl font-poppins py-4 mb-0 mx-auto text-black">No steps added yet</h1>
        </div>
      {:else}
        {#each RecipeData.expand.steps as step, index}
          <div class="flex justify-between border-b-2 border-black w-2/3">
            <div class="flex gap-2 items-center w-2/3">
              <span class="font-poppins text-xl p-4">{index + 1}.</span>
              <textarea
                bind:value={step.text}
                class="border-gray-600 bg-primary-white font-poppins w-1/2 focus:ring-opacity-50 border-2 m-4 text-sm p-4 rounded-md focus:outline-none"
                on:blur={() => saveStep(step)}
              />
              <input
              type="text"
              placeholder="Image URL ..."
              bind:value={step.media}
              class="border-2 border-gray-700 p-2 rounded-full w-full focus:border-primary-green focus:outline-none font-poppins bg-primary-brown text-xl placeholder-gray-700"
              on:blur={() => saveStep(step)}
              />
              <div>
                <img src={step.media ? step.media : recipe_placeholder} alt={step.text} class="w-[200px] h-[100px] object-cover rounded-3xl" />
              </div>
            </div>
            <div class="flex gap-2 justify-end">
              <button on:click={() => deleteStep(step)}>
                <img src={remove} alt="remove" class="w-[30px]"/>
              </button>
            </div>
          </div>
        {/each}
      {/if}
      <div class="relative flex gap-2 w-2/3">
        <input
          type="text"
          placeholder="New step ..."
          bind:value={newStep}
          class="border-2 border-gray-700 p-2 rounded-full w-full focus:border-primary-green focus:outline-none font-poppins bg-primary-brown text-xl placeholder-gray-700"
        />
        <input
          type="text"
          placeholder="Image URL ..."
          bind:value={newImageUrl}
          class="border-2 border-gray-700 p-2 rounded-full w-full focus:border-primary-green focus:outline-none font-poppins bg-primary-brown text-xl placeholder-gray-700"
        />
        {#if newStep}
          <button class="bg-primary-green text-white rounded-3xl text-center px-4 hover:bg-secondary-green" on:click={() => createStep()}>Add</button>
        {/if}
      </div>
    <!-- add ingredient button -->
      </div>
      <!-- Input fields for step 3 -->
      <!-- ... -->
    {:else if currentStep === 4}
      <!-- Content for Step 4 (Review) -->
      <div class="text-center py-4 bg-secondary-green">
        <h2 class="text-xl font-bold text-white">Ready to publish? Check details.</h2>
      </div>
      <div class="flex flex-col w-2/3 mx-auto items-center">
        <div class="px-4 pt-4 text-center">
          <h2 class="text-2xl font-bold">{RecipeData.name}</h2>
        </div>
        <!-- Recipe Image -->
        <img src={RecipeData.image ? RecipeData.image : recipe_placeholder} alt={RecipeData.name} class="w-full h-64 object-cover rounded-3xl" />

        <!-- Display entered recipe information for review -->
        <div class="flex w-full mt-10">
          <div class="w-1/2">
            <div class="grid grid-cols-2 gap-4">
              <div class="font-bold">Ingredients</div>
              <div class="font-bold text-center">Amount</div>
              {#if RecipeData.ingredients.length == 0}
                <div class="flex justify-center col-span-2">
                  <h1 class="text-md font-poppins py-4 mb-0 mx-auto text-black">No ingredients</h1>
                </div>
              {:else}
                {#each RecipeData.expand.ingredients as ingredient, index}
                  <div class="list-disc list-inside">
                    {ingredient.expand.ingredientId.name}
                  </div>
                  <div class="text-middle text-center">
                    {ingredient.amount} {ingredient.expand.ingredientId.expand.unit.name}
                  </div>
                {/each}
              {/if}
            </div>
          </div>

          <!-- Steps -->
        <div class="px-4 w-1/2">
          <h3 class="font-semibold text-lg mb-2 text-center">Steps</h3>
          <ol class="list-decimal pl-5">
            {#if RecipeData.steps.length == 0}
              <div class="flex">
                <h1 class="text-md font-poppins py-4 mb-0 mx-auto text-black">No steps</h1>
              </div>
            {:else}
              {#each RecipeData.expand.steps as step, index}
                <li class="mb-2">
                {@html step.text}<br>
                </li>
              {/each}
            {/if}
          </ol>
        </div>
        </div>

        
        <!-- ... -->
      </div>
      

      
      



     
    {/if}
      <!-- Navigation buttons -->
    <div class="flex w-1/2 justify-center mx-auto">
      <div class="fixed bottom-0 px-10 py-4 shadow-lg flex justify-between items-center w-1/2">
        <div>
          {#if currentStep > 1}
            <button class="bg-primary-green text-white px-6 py-2 rounded-full font-bold" on:click={goToPreviousStep}>Back</button>
          {:else}
            <!-- cancel button -->
            <button class="bg-primary-red text-white px-6 py-2 rounded-full font-bold" on:click={handleCancel}>Cancel</button>
          {/if}
        </div>
        <!-- Title showing progress in the format n/m -->
        <div class="font-bold">
          Step {currentStep} / 4
        </div>
        <div>
          {#if currentStep < 4}
            <button class="bg-primary-green text-white px-6 py-2 rounded-full font-bold" on:click={goToNextStep}>Next</button>
          {:else}
            <button class="bg-primary-green text-white px-6 py-2 rounded-full font-bold" on:click={handleFinish}>Finish</button>
          {/if}
        </div>
      </div>
    </div>
    
  </div>
</div>