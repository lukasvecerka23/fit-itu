<script>
    // export let imageurl = '';
    export let name = '';
    export let description = '';
    export let imageurl = '';
  </script>

  <div class="max-w-sm overflow-hidden hover:scale-105">
    <!-- svelte-ignore a11y-img-redundant-alt -->
    <img class="rounded-2xl max-w-full" src={imageurl} alt="recipe image" style="max-width: 100px height: auto; ">
    <div class="px-6 py-1">
      <div class="font-bold text-xl">
        <p> {name}</p>
      </div>
    </div>
  </div>

  <style>
    /* Optionally, you can add Svelte-specific styles here */
  </style>