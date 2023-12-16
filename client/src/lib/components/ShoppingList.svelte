<script>
    import { onMount } from 'svelte';
    import { showShoppingList } from '../../store.js';
    import { slide, fly } from 'svelte/transition';
    import circle from '../../assets/circle.svg';
    import circle_ticked from '../../assets/circle_checked.svg';
    import edit_icon from '../../assets/edit_icon.svg';
    import remove from '../../assets/remove.svg';

    let ingredients = [];
    let allTicked = false;

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
      .then(res => res.json())
      .then(data => {
        console.log(data);
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
            showShoppingList.set(false);
        }
    }

    onMount(() => {
        getIngredients();
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape'){
              showShoppingList.set(false);
            }
        });
    });

    $: allTicked = ingredients.every(item => item.ticked);
</script>

{#if $showShoppingList}
  <div class="background flex items-end fixed inset-0 z-full bg-black  bg-opacity-75 transition-opacity" tabindex="0" role="button" on:click={handleClickOutside} on:keydown={handleClickOutside}>
    <div class={`flex h-2/3 justify-center w-full p-0 transition-transform transform origin-bottom` }
    transition:fly={{ y: 200, duration: 300 }} tabindex="0" role="button" on:click={handleClickOutside} on:keydown={handleClickOutside}>
      <div class={`rounded-t-3xl w-1/2 shadow-lg bg-primary-white  p-6`}>
        <h1 class="text-black text-center text-4xl font-poppins py-4 font-semibold mb-0 mx-auto">Shopping list</h1>
        <div class="flex flex-col gap-2 items-center">
          {#each ingredients as ingredient}
            <div class="flex justify-between border-b-2 border-black w-2/3">
              <div class="flex gap-2">
                <button on:click={() => tickIngredient(ingredient)}>
                  <img src={ingredient.ticked ? circle_ticked : circle} alt="Ingredient circle" class="w-[30px]"/>
                </button>
                <h1 class={`text-2xl font-poppins py-4 mb-0 mx-auto ${ingredient.ticked ? 'text-gray-500 line-through' : 'text-black'}`}>{ingredient.expand.ingredient.name}</h1>
              </div>
              <div class="flex gap-2">
                <h1 class={`text-left text-2xl font-poppins py-4 mb-0 mx-auto ${ingredient.ticked ? 'text-gray-500 line-through' : 'text-black'}`}>{ingredient.amount}{ingredient.expand.ingredient.expand.unit.name}</h1>
                {#if !ingredient.ticked}
                  <button on:click={() => tickIngredient(ingredient)}>
                    <img src={edit_icon} alt="Ingredient circle" class="w-[30px]"/>
                  </button>
                  <button on:click={() => deleteIngredient(ingredient)}>
                    <img src={remove} alt="Ingredient circle" class="w-[30px]"/>
                  </button>
                {/if}
              </div>
            </div>
          {/each}
        </div>
      </div>
      <div class="fixed bottom-0 p-4 flex justify-center gap-4">
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
{/if}