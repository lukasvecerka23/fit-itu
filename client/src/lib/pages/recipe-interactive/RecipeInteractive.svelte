<script>
    import { Link } from 'svelte-routing';
    import Sidebar from '../../components/SideBar.svelte';
    import SideBar from '../../components/SideBar.svelte';
    import Recipes from '../recipes/Recipes.svelte';
    import Recipe from '../../components/Recipe.svelte';


    let currentStep = 1;
    let RecipeData = null;
    let recipeSteps = [];
    let currentStepData = null;
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
        console.log("currentStepData",currentStepData);
        // loading = true;
        console.log("data",RecipeData);
    }
    $:fetchRecipe();

</script>

<!-- Visual stylistics -->
{#if RecipeData}
<div class="flex w-full bg-primary-white">
    <SideBar/>
    <div class="w-2/6">
        <div class="flex justify-center items-end h-2/5 bg-cover" style=" background-image: url({RecipeData.image})">
            <div class="h-1/3 w-full flex items-center justify-center bg-opacity-80 font-poppins bg-black">
                <h2 class="text-2xl text-white">{RecipeData.name}</h2>
            </div>
        </div>
        <div class="flex-col justify-center items-center">
                <div class="grid grid-cols-2 items-center gap-x-5 h-full">
                    <h2 class="text-xl font-poppins ml-10 font-bold">Ingredients</h2>
                    <h2 class="text-xl font-poppins font-bold w-2/3 text-end">Amount</h2>
                    {#each RecipeData.expand.ingredients as ingredient}
                            <ul class="list-inside w-full text-start ml-10 font-semibold">
                                <li>• {ingredient.expand.ingredientId.name}</li>
                            </ul>
                        <div class="text-end w-2/3 font-semibold">
                            {ingredient.amount} {ingredient.expand.ingredientId.expand.unit.name}
                        </div>
                    {/each}
                </div>
        </div>
    </div>
    <div class="bg-black w-[2px]"></div>
    <div class="flex-col w-4/6 justify-center">
        <div class="flex h-4/6 items-center justify-center text-end">
            <div class="h-[400px] w-[300px] rounded-3xl overflow-hidden bg-cover" style="background-image: url(https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg?cs=srgb&dl=pexels-pixabay-533280.jpg&fm=jpg)">

            </div>
        </div>
        <p class="text-center w-full text-3xl">Ahojky</p>
        <div class="flex justify-center mt-10 items-center">
            <button class="bg-primary-green w-1/5 text-white px-6 py-2 rounded-full font-bold">Previous step</button>
            <p class=" ml-5 mr-5 text-2xl">2/3</p>
            <button class="bg-primary-green w-1/5 text-white px-6 py-2 rounded-full font-bold">Next step</button>
          
        </div>
    </div>
</div>
{/if}
