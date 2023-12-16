<script>
    import { onMount } from 'svelte';
    import { slide, fly } from 'svelte/transition';
    import { createEventDispatcher } from 'svelte';
  
    // This variable will control the visibility of the overlay
    export let show = false;
    export let width = 'w-1/3';
    export let height = 'h-1/2';
    const dispatch = createEventDispatcher();

  
    function handleClickOutside(event) {
        if (event.target === event.currentTarget) {
            show = false;
        }
    }

    onMount(() => {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape'){
              show = false;
            }
        });
    });
  </script>
  
  {#if show}
    <div class="background flex items-end fixed inset-0 bg-black z-full  bg-opacity-75 transition-opacity" tabindex="0" role="button" on:click={handleClickOutside} on:keydown={handleClickOutside}>
      <div class={`flex ${height} justify-center w-full p-0 transition-transform transform origin-bottom` }
      transition:fly={{ y: 200, duration: 300 }} tabindex="0" role="button" on:click={handleClickOutside} on:keydown={handleClickOutside}>
        <div class={`rounded-t-3xl ${width} shadow-lg bg-primary-white  p-6`}>
          <slot></slot>
        </div>
      </div>
    </div>
  {/if}