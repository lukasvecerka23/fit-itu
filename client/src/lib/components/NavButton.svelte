<!-- HomePageItem.svelte -->
<script>
    import { Link } from 'svelte-routing';
    export let logoUrl = '/'; // Default logo path
    export let linkPath = '/'; // Default background color class
    export let text = '';
    export let classBackgroundColor = '';
  </script>

<Link to={linkPath}>
    <div class="button grid justify-items-center rounded-xl {classBackgroundColor}">
        <img src={logoUrl} alt="Logo" class="w-10 h-10 mx-auto"/>
        <h1 class="text-white text-center font-poppins text-sm">{text}</h1>
    </div>
</Link>

<style>

</style>