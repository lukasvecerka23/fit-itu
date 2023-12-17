<!-- HomePage.svelte -->
<!-- Autor: Lukas Vecerka (xvecer30) -->
<script>
    import HomePageItem from "./components/HomePageItem.svelte";
    import recipeLogo from "../../../assets/recipe-book.svg";
    import pantryLogo from "../../../assets/pantry-logo-white.svg";
    import ShoppingListLogo from "../../../assets/shopping-list-white.svg";
    import {showShoppingList} from '../../../store.js';
</script>

<div class="h-screen w-full bg-center bg-no-repeat bg-cover background-image flex items-center justify-center">
    <div class="flex gap-20">
        <HomePageItem logoUrl={recipeLogo} linkPath="/recipes" text="Recipes"/>
        <HomePageItem logoUrl={pantryLogo} linkPath="/pantry" text="Pantry"/>
        <button class="flex-col bg-black bg-opacity-75 rounded-3xl p-5 h-[250px] w-[250px] items-center" on:click={() => showShoppingList.set(true)}>
            <img src={ShoppingListLogo} alt="Logo" class="w-32 h-32 mx-auto" />
            <h1 class="text-white text-4xl font-poppins mx-auto text-center py-4">Shopping list</h1>
        </button>
    </div>
</div>

<style>
    .background-image {
        background-image: url("../../../assets/landing-page-bg.jpg");
    }
</style>