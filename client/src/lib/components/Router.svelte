<!-- Router.svelte -->
<script>
    import { Router, Route, Link } from 'svelte-routing';
    import LandingPage from '../pages/landing-page/LandingPage.svelte';
    import HomePage from '../pages/home-page/HomePage.svelte';
    import Recipes from '../pages/recipes/Recipes.svelte';
    import Pantry from '../pages/pantry/Pantry.svelte';
</script>
  
<Router>
    <Route path="/" component={LandingPage} />
    <Route path="home" component={HomePage} />
    <Route path="recipes" component={Recipes} />
    <Route path="pantry" component={Pantry} />
</Router>