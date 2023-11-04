<script>
    // export let imageurl = '';
    export let name = '';
    export let description = '';
  </script>
  
  <div class="max-w-sm rounded overflow-hidden shadow-lg bg-white">
    <!-- <img class="w-full" src={imageurl} alt="Food Image"> -->
    <div class="px-6 py-4">
      <div class="font-bold text-xl mb-2">
        <h1> {name}</h1>
      </div>
      <p class="text-gray-700 text-base">
        {description}
      </p>
    </div>
  </div>
  
  <style>
    /* Optionally, you can add Svelte-specific styles here */
  </style>