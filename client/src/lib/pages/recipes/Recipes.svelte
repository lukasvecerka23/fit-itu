<script>
    import Sidebar from '../../components/SideBar.svelte';
    import Recipe from '../../components/Recipe.svelte';
    import { showShoppingList } from '../../../store';
    import up_arrow from '../../../assets/uparrow.svg';
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

<div class="fixed inset-x-0 bottom-0 flex justify-center items-end">
  <button class="w-1/2 bg-primary-brown text-black rounded-t-xl flex justify-center" on:click={() => showShoppingList.set(true)}>
      <img src={up_arrow} alt="Popis obrázku" class="w-[30px]">
  </button>
</div>