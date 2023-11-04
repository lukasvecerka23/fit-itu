<script>
    import { Link } from 'svelte-routing';
</script>

<div class="h-screen w-full bg-center bg-no-repeat bg-cover background-image flex items-center justify-center">
    <div class="text-center">
        <h1 class="text-white text-5xl font-poppins font-bold mb-6 mx-auto">RECIPE HUB</h1>
        <p class="text-white mx-auto w-1/2 text-xl font-poppins mb-8">Dive into your pantry and discover deliciousness! Turn forgotten ingredients into tonight's feast. Manage, shop, and savor with ease.</p>
        <button class="bg-primary-green hover:bg-secondary-green text-white font-bold py-4 px-4 rounded-xl">
            <Link to="/home">Try for Free</Link>
        </button>
    </div>
</div>

<style>
    .background-image {
        background-image: url("../../../assets/landing-page-bg.jpg");
    }
</style>