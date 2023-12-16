<script>
    import { onMount } from 'svelte';
    import { showShoppingList } from '../../store.js';
    import { slide, fly } from 'svelte/transition';

    function handleClickOutside(event) {
        if (event.target === event.currentTarget) {
            showShoppingList.set(false);
        }
    }

    onMount(() => {
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
        <h1 class="font-poppins font-semibold text-center mb-4 text-2xl">Shopping list</h1>
      </div>
    </div>
  </div>
{/if}