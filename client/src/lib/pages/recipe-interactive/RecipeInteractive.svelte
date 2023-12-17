<script>
    import { Link } from 'svelte-routing';
    import Sidebar from '../../components/SideBar.svelte';
    import SideBar from '../../components/SideBar.svelte';


    let currentStep = 1;
    let RecipeData = null;
    let recipeSteps = [];
    let currentStepData = null;
    let totalsteps = 0;
    export let id


    // go to next step
    function goToNextStep() {
        if (currentStep < recipeSteps.length) {
        currentStep += 1;
        currentStepData = recipeSteps[currentStep-1];
        console.log("currentStep",currentStep);
        }
    }

    function goToPreviousStep() {
        if (currentStep > 1) {
        currentStep -= 1;
        currentStepData = recipeSteps[currentStep-1];
        console.log("currentStep",currentStep);
        }
    }

    async function fetchRecipe() {
        const response = await fetch(`https://fit-itu.hop.sh/api/collections/recipes/records/${id}?expand=steps,diet,ingredients,ingredients.ingredientId,ingredients.ingredientId.unit`);
        if (!response.ok) {
            // If the response is not okay, throw an error
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        RecipeData = await response.json();
        recipeSteps = RecipeData.expand.steps;
        currentStepData = recipeSteps[currentStep-1]
        totalsteps = recipeSteps.length;
        console.log("currentStepData",currentStepData);
        // loading = true;
        console.log("data",RecipeData);
    }
    $:fetchRecipe();

</script>

<!-- Visual stylistics -->
<SideBar/>
