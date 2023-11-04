<script>
    import edit_icon from '../../../assets/edit_icon.svg';
    import Ingredient from './components/Ingredient.svelte';
    import Sidebar from '../../components/SideBar.svelte';
    let pantrySections = [];
    let selectedSectionId = null;
    let ingredients = [];

    // Fetch pantry sections and set the first one as selected
    fetch('https://fit-itu.hop.sh/api/collections/pantrySections/records')
        .then(res => res.json())
        .then(data => {
            pantrySections = data.items;
            // Set the first section as selected, if there are any sections
            if (pantrySections.length > 0) {
                selectedSectionId = pantrySections[0].id;
            }
        })
        .catch(err => {
            console.error(err);
        });

    function getIngredient(sectionId){
        fetch(`https://fit-itu.hop.sh/api/collections/ingredientInPantry/records?filter=(pantrySection='${sectionId}')&expand=ingredient`)
        .then(res => res.json())
        .then(data => {
            ingredients = data.items;
        })
        .catch(err => {
            console.error(err);
        });
    }

    // Function to select a section
    function selectSection(sectionId) {
        selectedSectionId = sectionId;
        getIngredient(sectionId);
    }
    
</script>
<div class="flex w-full">
    <Sidebar />
    <div class="h-screen w-full bg-primary-white flex justify-center">
        <div class="flex-col w-3/5 mx-auto">
                <h1 class="text-black text-center text-4xl font-poppins py-4 font-semibold mb-0 mx-auto">Pantry</h1>
                <div class="flex gap-2 items-center">
                    {#each pantrySections as section}
                        <button
                            on:click={() => selectSection(section.id)}
                            class={`${selectedSectionId === section.id ? 'bg-primary-green text-white' : 'bg-primary-white text-black'} hover:bg-secondary-green text-xs font-semibold rounded-2xl text-center w-20 h-5 border-2 border-black`}
                        >
                            {section.name}
                        </button>
                    {/each}

                    <button class="bg-transparent h-5 w-5">
                        <img src={edit_icon} alt="Popis obrázku">
                    </button>
                </div>
                <div class="pt-10 flex-row justify-left">
                    {#each ingredients as ingredient}
                        <Ingredient ingredient={ingredient} />
                    {/each}
                </div>
                <div class="pt-10 flex-row justify-left">
                    <p class="text-black mx-auto text-xl font-poppins mb-2">Vegetables</p>
                    <hr class="w-full border border-black">
                </div>
                <div class="pt-10 flex-row justify-left">
                    <p class="text-black mx-auto text-xl font-poppins mb-2">Dairy</p>
                    <hr class="w-full border border-black">
                </div>
                <div class="pt-10 flex-row justify-left">
                    <p class="text-black mx-auto text-xl font-poppins mb-2">Meats</p>
                    <hr class="w-full border border-black">
                </div>
                <div class="pt-10 flex-row justify-left">
                    <p class="text-black mx-auto text-xl font-poppins mb-2">Drinks</p>
                    <hr class="w-full border border-black">
                </div>
                <div class="pt-10 flex-row justify-left">
                    <p class="text-black mx-auto text-xl font-poppins mb-2">Sauces</p>
                    <hr class="w-full border border-black">
                </div>
                <div class="pt-10 flex-row justify-left">
                    <p class="text-black mx-auto text-xl font-poppins mb-2">Others</p>
                    <hr class="w-full border border-black">
                </div>
        </div>
    </div>
</div>