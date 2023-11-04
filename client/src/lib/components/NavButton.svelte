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
        <!-- css style to make the button image bigger -->
        <img src={logoUrl} alt="Logo" class="w-10 h-10 mx-4"/>
            <!-- css style to make the button background color change -->
        <!-- make the text appear under the image  -->
        <h1 class="text-white font-poppins text-l">{text}</h1>
    </div>
</Link>

<style>

</style>