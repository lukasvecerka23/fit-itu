<!-- HomePageItem.svelte -->
<script>
    import { Link } from 'svelte-routing';
    export let logoUrl = '/default-logo.png'; // Default logo path
    export let linkPath = '/'; // Default background color class
    export let text = '';
  </script>
  
<Link to={linkPath}>
    <div class="flex-col bg-black bg-opacity-75 rounded-xl mx-10">
        <img src={logoUrl} alt="Logo" class="w-32 h-32 mx-auto" />
        <h1 class="text-white text-5xl font-poppins font-bold mx-auto">{text}</h1>
    </div>
</Link>