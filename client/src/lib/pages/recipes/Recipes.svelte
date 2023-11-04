<script>
    import Sidebar from '../../components/SideBar.svelte';
    import Recipe from '../../components/Recipe.svelte';
    // You can add more script code here if needed
    // Fetch pantry sections and set the first one as selected
    let recipes = [];
    fetch('https://fit-itu.hop.sh/api/collections/recipes/records')
        .then(res => res.json())
        .then(data => {
            recipes = data.items;
            console.log(recipes);
        })
        .catch(err => {
            console.error(err);
        });
  </script>
<div class="flex w-full">
  <Sidebar />
  <div class="h-screen w-full bg-primary-white flex justify-center">
    {#each recipes as recipe}
    <h1>
    <Recipe name={recipe.name} description={recipe.description} />
    </h1> 
    {/each}
  </div>
</div>