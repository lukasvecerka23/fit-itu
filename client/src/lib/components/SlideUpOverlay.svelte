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
    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" tabindex="0" role="button" on:click={closeOverlay} on:keydown={closeOverlay}></div>
  
    <div class="fixed bottom-0 inset-x-0 p-4 transition-transform transform origin-bottom"
         transition:fly={{ y: 200, duration: 300 }}>
      <div class="rounded-lg shadow-lg bg-white p-6">
        <!-- Content for your overlay goes here -->
        <button class="absolute top-0 right-0 m-4" on:click={closeOverlay}>✕</button>
        <slot></slot>
      </div>
    </div>
  {/if}