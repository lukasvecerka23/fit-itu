<script>
    import HomePageItem from "./components/HomePageItem.svelte";
    import recipeLogo from "../../../assets/recipe-logo.svg";
    import pantryLogo from "../../../assets/pantry-logo.svg";
</script>

<div class="h-screen w-full bg-center bg-no-repeat bg-cover background-image flex items-center justify-center">
    <div class="flex">
        <HomePageItem logoUrl={recipeLogo} linkPath="/recipes" text="Recipes"/>
        <HomePageItem logoUrl={pantryLogo} linkPath="/pantry" text="Pantry"/>
    </div>
</div>

<style>
    .background-image {
        background-image: url("../../../assets/landing-page-bg.jpg");
    }
</style>