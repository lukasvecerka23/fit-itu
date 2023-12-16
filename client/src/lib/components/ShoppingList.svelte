<script>
    import { onMount } from 'svelte';
    import { showShoppingList } from '../../store.js';
    import { slide, fly } from 'svelte/transition';
    import circle from '../../assets/circle.svg';
    import circle_ticked from '../../assets/circle_checked.svg';

    let ingredients = [];

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

    $: console.log($showShoppingList);
</script>

{#if $showShoppingList}
  <div class="background flex items-end fixed inset-0 z-full bg-black  bg-opacity-75 transition-opacity" tabindex="0" role="button" on:click={handleClickOutside} on:keydown={handleClickOutside}>
    <div class={`flex h-2/3 justify-center w-full p-0 transition-transform transform origin-bottom` }
    transition:fly={{ y: 200, duration: 300 }} tabindex="0" role="button" on:click={handleClickOutside} on:keydown={handleClickOutside}>
      <div class={`rounded-t-3xl w-1/2 shadow-lg bg-primary-white  p-6`}>
        <div class="flex justify-between">
          <h1 class="text-black text-4xl font-poppins py-4 font-semibold mb-0 mx-auto">Shopping list</h1>
        </div>
        <div class="flex flex-col gap-2 items-center">
          {#each ingredients as ingredient}
            <div class="flex justify-between border-b-2 border-black w-2/3">
              <div class="flex gap-2">
                <button on:click={() => tickIngredient(ingredient)}>
                  <img src={ingredient.ticked ? circle_ticked : circle} alt="Ingredient circle" class="w-[30px]"/>
                </button>
                <h1 class={`text-2xl font-poppins py-4 mb-0 mx-auto ${ingredient.ticked ? 'text-gray-500 line-through' : 'text-black'}`}>{ingredient.expand.ingredient.name}</h1>
              </div>
              <div>
                <h1 class={`text-2xl font-poppins py-4 mb-0 mx-auto ${ingredient.ticked ? 'text-gray-500 line-through' : 'text-black'}`}>{ingredient.amount}{ingredient.expand.ingredient.expand.unit.name}</h1>
              </div>
            </div>
          {/each}
        </div>
      </div>
    </div>
  </div>
{/if}