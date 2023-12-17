<!-- 
                Recipes.svelte
                Jachym Dolezal
                FIT ITU 2023
-->

<script>
    import { Link } from 'svelte-routing';
    export let logoUrl = '/';
    export let linkPath = '/';
    export let text = '';
    export let classBackgroundColor = '';
  </script>

<Link to={linkPath}>
    <div class="flex-col items-center rounded-full m-2 py-4 {classBackgroundColor}">
        <img src={logoUrl} alt="Logo" class="w-3/4 max-w-[40px] h-auto mx-auto"/>
        <h1 class="text-white text-center font-poppins text-sm">{text}</h1>
    </div>
</Link>

<style>

</style>