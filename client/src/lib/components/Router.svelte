<!-- Router.svelte -->
<!-- Autors: Lukas Vecerka, Veronika Nevarilova, Jachym Dolezal -->
<script>
    import { Router, Route, Link } from 'svelte-routing';
    import LandingPage from '../pages/landing-page/LandingPage.svelte';
    import HomePage from '../pages/home-page/HomePage.svelte';
    import Recipes from '../pages/recipes/Recipes.svelte';
    import Pantry from '../pages/pantry/Pantry.svelte';
    import RecipeCreation from '../pages/recipe-create-edit/RecipeCreation.svelte';
    import RecipeInteractive from '../pages/recipe-interactive/RecipeInteractive.svelte';
</script>
  
<Router>
    <Route path="/" component={LandingPage} />
    <Route path="home" component={HomePage} />
    <Route path="recipes" component={Recipes} />
    <Route path="createrecipe/:id" component={RecipeCreation} />
    <Route path="pantry" component={Pantry} />
    <Route path="recipeinteractive/:id" component={RecipeInteractive} />
</Router>