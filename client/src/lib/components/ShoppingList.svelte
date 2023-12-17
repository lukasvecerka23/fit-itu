<script>
    import { onMount } from 'svelte';
    import { showShoppingList } from '../../store.js';
    import { fly, fade, scale } from 'svelte/transition';
    import circle from '../../assets/circle.svg';
    import circle_ticked from '../../assets/circle_checked.svg';
    import edit_icon from '../../assets/edit_icon.svg';
    import remove from '../../assets/remove.svg';

    let ingredients = [];
    let ingredientTypes = [];
    let filteredIngredients = [];
    let allTicked = false;
    let searchQuery = '';
    let selectedIngredient = null;
    let newIngredient = {
      ingredient: null,
      amount: 0,
    };

    function getIngredients(){
        fetch('https://fit-itu.hop.sh/api/collections/ingredientInShoppingList/records?expand=ingredient,ingredient.unit')
        .then(res => res.json())
        .then(data => {
            ingredients = data.items;
            console.log(ingredients)
        })
        .catch(err => {
            console.error(err);
        });
    }

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

    function tickIngredient(ingredient)
    {
      fetch(`https://fit-itu.hop.sh/api/collections/ingredientInShoppingList/records/${ingredient.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "ticked": !ingredient.ticked
        })
      })   
      .then((res) => {
        getIngredients();
      })
    }

    function deleteIngredient(ingredient)
    {
      fetch(`https://fit-itu.hop.sh/api/collections/ingredientInShoppingList/records/${ingredient.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      })   
      .then(() => {
          getIngredients();
      })
    }

    function deleteAllIngredients()
    {
      const fetches = [];
      for (let i = 0; i < ingredients.length; i++) {
        const res = fetch(`https://fit-itu.hop.sh/api/collections/ingredientInShoppingList/records/${ingredients[i].id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then((res) => {
          console.log(res);
        })
        fetches.push(res);
      }
      Promise.all(fetches).then(() => {
        getIngredients();
      })
    }

    function removeAllTicked()
    {
      const fetches = [];
      for (let i = 0; i < ingredients.length; i++) {
        if (ingredients[i].ticked) {
          const res = fetch(`https://fit-itu.hop.sh/api/collections/ingredientInShoppingList/records/${ingredients[i].id}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json'
            }
          })   
          .then((res) => {
            console.log(res);
          })
          fetches.push(res);
        }
      }
      Promise.all(fetches).then(() => {
        getIngredients();
      })
    }

    function tickAll()
    {
      const fetches = [];
      for (let i = 0; i < ingredients.length; i++) {
        if (!ingredients[i].ticked) {
          const res = fetch(`https://fit-itu.hop.sh/api/collections/ingredientInShoppingList/records/${ingredients[i].id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              "ticked": true
            })
          })   
          .then((res) => {
            console.log(res);  
          })
          fetches.push(res);
        }
      }
      Promise.all(fetches).then(() => {
        getIngredients();
      })
    }

    function untickAll()
    {
      const fetches = [];

      for (let i = 0; i < ingredients.length; i++) {
        if (ingredients[i].ticked) {
          const res = fetch(`https://fit-itu.hop.sh/api/collections/ingredientInShoppingList/records/${ingredients[i].id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              "ticked": false
            })
          })   
          .then((res) => {
            console.log(res);  
          })
          fetches.push(res);
        }
      }
      Promise.all(fetches).then(() => {
        getIngredients();
      })
    }

    function handleClickOutside(event) {
        if (event.target === event.currentTarget) {
            closeList();
        }
    }

      // Function to filter ingredients based on the search query
    function filterIngredients(query) {
      filteredIngredients = ingredientTypes.filter(ingredient =>
        ingredient.name.toLowerCase().includes(query.toLowerCase())
      );
    }

    function selectIngredient(ingredient) {
      selectedIngredient = ingredient;
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

    function closeList() {
      clearThings();
      showShoppingList.set(false);
    }

    onMount(() => {
        getIngredients();
        getIngredientTypes();
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape'){
              closeList();
            }
        });
    });

    function saveAmount(ingredient) {
      fetch(`https://fit-itu.hop.sh/api/collections/ingredientInShoppingList/records/${ingredient.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "amount": ingredient.amount
        })
      })   
      .then((res) => {
        getIngredients();
      })
    }

    function saveIngredient(){
      console.log(newIngredient);
      const exists = ingredients.find(item => item.ingredient === newIngredient.ingredient);
      console.log(exists);
      if (exists) {
        fetch(`https://fit-itu.hop.sh/api/collections/ingredientInShoppingList/records/${exists.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            "amount": exists.amount + newIngredient.amount
          })
        })   
        .then((res) => {
          getIngredients();
        })
      } else {
        fetch('https://fit-itu.hop.sh/api/collections/ingredientInShoppingList/records', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            "userId": "uvh48ynbmnnmydx",
            "ingredient": newIngredient.ingredient,
            "amount": newIngredient.amount,
            "ticked": false
          })
        })   
        .then((res) => {
          getIngredients();
        })
      }
      clearThings();
    }

    $: allTicked = ingredients.every(item => item.ticked);

    $: selectedIngredient = searchQuery ? selectedIngredient : null;
</script>

{#if $showShoppingList}
  <div class="background flex items-end fixed inset-0 z-full bg-black  bg-opacity-75 transition-opacity" tabindex="0" role="button" on:click={handleClickOutside} on:keydown={handleClickOutside}>
    <div class={`flex h-5/6 justify-center w-full p-0 transition-transform transform origin-bottom` }
    transition:fly={{ y: 200, duration: 300 }} tabindex="0" role="button" on:click={handleClickOutside} on:keydown={handleClickOutside}>
      <div class={`flex flex-col justify-between rounded-t-3xl h-full w-1/2 shadow-lg bg-primary-brown  p-6`}>
        <h1 class="text-black text-center text-4xl font-poppins py-4 font-semibold mb-0 mx-auto">Shopping list</h1>
        <div class="flex-1 overflow-y-auto">
        <div class="flex flex-col gap-2 items-center ">
          {#each ingredients as ingredient}
            <div class="flex justify-between border-b-2 border-black w-2/3">
              <div class="flex gap-2 w-1/2 text-left">
                <button on:click={() => tickIngredient(ingredient)}>
                  <img src={ingredient.ticked ? circle_ticked : circle} alt="Ingredient circle" class="w-[30px]"/>
                </button>
                <h1 class={`text-2xl font-poppins py-4 ${ingredient.ticked ? 'text-gray-500 line-through' : 'text-black'} ove`}>{ingredient.expand.ingredient.name}</h1>
              </div>
              <div class="flex gap-2 justify-end">
                {#if !ingredient.ticked}
                <input
                  type="number"
                  min=0
                  max={Number.MAX_SAFE_INTEGER}
                  bind:value={ingredient.amount}
                  class="border-gray-600 w-1/3 bg-primary-brown font-poppins focus:border-primary-green focus:ring-opacity-50 border-2 m-2 text-xl p-2 rounded-full text-center focus:outline-none"
                  on:blur={() => saveAmount(ingredient)}
                />
                {:else}
                  <h1 class={`text-2xl font-poppins py-4 mb-0 ${ingredient.ticked ? 'text-gray-500 line-through' : 'text-black'}`}>{ingredient.amount}</h1>
                {/if}
                <h1 class={`text-left text-2xl font-poppins py-4 mb-0 ${ingredient.ticked ? 'text-gray-500 line-through' : 'text-black'}`}>{ingredient.expand.ingredient.expand.unit.name}</h1>
                {#if !ingredient.ticked}
                  <button on:click={() => deleteIngredient(ingredient)}>
                    <img src={remove} alt="Ingredient circle" class="w-[30px]"/>
                  </button>
                {/if}
              </div>
            </div>
          {/each}
        </div>
        
        </div>
        <div class="flex flex-col gap-2 items-center">
          <div class="relative flex gap-2 w-2/3">
            <input
              type="text"
              placeholder="Search for ingredients..."
              bind:value={searchQuery}
              on:input={() => filterIngredients(searchQuery)}
              class="border-2 border-gray-700 p-2 rounded-full w-full focus:border-primary-green focus:outline-none font-poppins bg-primary-brown text-xl placeholder-gray-700"
            />
            {#if searchQuery && filteredIngredients.length}
              <div class="absolute border-black bg-opacity-50 flex flex-col bg-primary-white mb-2 bottom-full z-10 w-full rounded-2xl border font-poppins">
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
                max={Number.MAX_SAFE_INTEGER}
                class="border-gray-600 w-1/3 bg-primary-brown font-poppins focus:border-primary-green focus:ring-opacity-50 border-2 px-2 text-xl rounded-full text-center focus:outline-none"/>
              <h1 class="text-2xl font-poppins py-2">{selectedIngredient.expand.unit.name}</h1>
              <button class="bg-primary-green text-white rounded-3xl text-center px-4 hover:bg-secondary-green" on:click={() => saveIngredient()}>Add</button>
            {/if}
          </div>
          <div class="flex justify-center gap-4">
            <button class="bg-red-700 text-white rounded-3xl text-center px-10 py-2 hover:bg-red-800" on:click={() => deleteAllIngredients()}>Delete all</button>
            <button class="bg-primary-green text-white rounded-3xl text-center px-10 py-2 hover:bg-secondary-green" on:click={() => removeAllTicked()}>Remove ticked</button>
            {#if allTicked}
              <button class="bg-primary-green text-white rounded-3xl text-center px-10 py-2 hover:bg-secondary-green" on:click={() => untickAll()}>Untick all</button>
            {:else}
              <button class="bg-primary-green text-white rounded-3xl text-center px-10 py-2 hover:bg-secondary-green" on:click={() => tickAll()}>Tick all</button>
            {/if}
          </div>
        </div>  
      </div>
      
    </div>
  </div>
{/if}