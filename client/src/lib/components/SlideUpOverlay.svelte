<script>
    import { slide, fly } from 'svelte/transition';
    import { createEventDispatcher } from 'svelte';
  
    // This variable will control the visibility of the overlay
    export let show = false;
  
    // Dispatch an event to notify the parent component when the overlay is requested to be closed
    const dispatch = createEventDispatcher();
  
    // Function to close the overlay
    function closeOverlay() {
      dispatch('close');
    }
  </script>
  
  {#if show}
    <div class="fixed inset-0 bg-black bg-opacity-75 transition-opacity" tabindex="0" role="button" on:click={closeOverlay} on:keydown={closeOverlay}></div>
  
    <div class="fixed flex h-1/2 justify-center bottom-0 inset-x-0 p-0 transition-transform transform origin-bottom"
         transition:fly={{ y: 200, duration: 300 }}>
      <div class="rounded-t-3xl w-1/3 left-1/2 shadow-lg bg-primary-white  p-6">
        <h1 class="font-poppins font-semibold text-center mb-4 text-2xl"> Edit pantries</h1>
        <slot></slot>
      </div>
    </div>
  {/if}