<script>
    import edit_icon from '../../../assets/edit_icon.svg';
    import Ingredient from './components/Ingredient.svelte';
    import Sidebar from '../../components/SideBar.svelte';
    import SlideUpOverlay from '../../components/SlideUpOverlay.svelte';
    import menu_icon from '../../../assets/menu_icon.svg';
    import close_icon from '../../../assets/close_icon.svg';
    let pantrySections = [];
    let selectedSectionId = null;
    let ingredients = [];
    let showModal = false;


    function getSections(){
        // Fetch pantry sections and set the first one as selected
        fetch('https://fit-itu.hop.sh/api/collections/pantrySections/records')
            .then(res => res.json())
            .then(data => {
                pantrySections = data.items;
                // Set the first section as selected, if there are any sections
                if (pantrySections.length > 0) {
                    selectedSectionId = pantrySections[0].id;
                    getIngredient(selectedSectionId);
                }
            })
            .catch(err => {
                console.error(err);
            });
    }

    function getIngredient(sectionId){
        fetch(`https://fit-itu.hop.sh/api/collections/ingredientInPantry/records?filter=(pantrySection='${sectionId}')&expand=ingredient,ingredient.unit,ingredient.category`)
        .then(res => res.json())
        .then(data => {
            ingredients = data.items;
            console.log(ingredients)
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
    
    onMount(() => {
        getSections();
    });
</script>
<div class="flex w-full">
    <Sidebar />
    <div class="h-full w-full min-h-screen bg-primary-white flex justify-center">
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

                    <button class="bg-transparent h-5 w-5" on:click={() => showModal = true}>
                        <img src={edit_icon} alt="Popis obrázku">
                    </button>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pt-10 justify-left">
                    {#each ingredients as ingredient}
                        <Ingredient ingredient={ingredient} />
                    {/each}
                    <!-- A další komponenty -->
                </div>
        </div>

    </div>
    <SlideUpOverlay show={showModal} on:close={() => showModal = false}>
        <!-- Your overlay content here -->
        {#each pantrySections as section}
        <div class="flex justify-center p-2">
        <div class="flex items-center justify-between gap-8 h-8 w-3/4 bg-primary-green rounded-lg">
            <div class=" flex justify-start">
              <img class="h-6 w-full ml-5" src={menu_icon} alt="Menu">
            </div>
            <div class=" flex-1 text-start text-white">
              <!-- Text sem vložte -->
              <p>{section.name}</p>
            </div>
            <div class=" text-right flex justify-end">
              <!-- Ikonu 2 sem vložte -->
              <img class="h-6 w-full mr-5 " src={close_icon} alt="Close">
            </div>
        </div>
        </div>
        {/each}
    </SlideUpOverlay>
</div>