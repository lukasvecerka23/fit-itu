<script>
    import edit_icon from '../../../assets/edit_icon.svg';
    import edit_white from '../../../assets/edit_white.svg';
    import Ingredient from './components/Ingredient.svelte';
    import Sidebar from '../../components/SideBar.svelte';
    import SlideUpOverlay from '../../components/SlideUpOverlay.svelte';
    import menu_icon from '../../../assets/menu_icon.svg';
    import close_icon from '../../../assets/close_black.svg';
    import { onDestroy, onMount } from 'svelte';
    import {showShoppingList} from '../../../store.js';
    import up_arrow from '../../../assets/uparrow.svg';
    import trash_bin_icon from '../../../assets/trashbin_white.svg';
    import new_icon from '../../../assets/new_white.svg';
    import new_icon_gray from '../../../assets/new_gray.svg';
    import save_icon from '../../../assets/save.svg';
    import minus_icon from '../../../assets/minus.svg';
    import trashbin_red from '../../../assets/trashbin_light_red.svg';
    import save_white from '../../../assets/save_white.svg';
    import { fly, fade, scale } from 'svelte/transition';
    import camera from '../../../assets/camera_gray.svg';

    let textField = '';
    let pantrySections = [];
    let selectedSectionId = null;
    let ingredients = [];
    let add_pantry = false;
    let red_trashbin = false;
    let new_pantry_name = null;
    let pantry_name_null = false;
    let edit_pantry_id = null;
    let new_name = null;
    let old_pantry_name = null;
    let searchQuery = '';
    let filteredIngredients = [];
    let ingredientTypes = [];
    let selectedIngredient = null;
    let newIngredient = {
      id: null,
      amount: 0,
      unit: null,
      url: null,
    };
    let newIngredientNameNull = false;


    function getSections(selectedId){
        // Fetch pantry sections and set the first one as selected
        fetch('https://fit-itu.hop.sh/api/collections/pantrySections/records')
            .then(res => res.json())
            .then(data => {
                pantrySections = data.items;
                // Set the first section as selected, if there are any sections
                if (pantrySections.length > 0) {
                    if (selectedId != null)
                    {
                        selectedSectionId = selectedId;
                    } else 
                    {
                        selectedSectionId = pantrySections[0].id;
                    }
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

    async function deletePantrySection() 
    {
        const data = {
            "name": textField,
            "userId": "uvh48ynbmnnmydx"
        };
        const resp = await fetch(`https://fit-itu.hop.sh/api/collections/pantrySections/records/${selectedSectionId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        });

        if (!resp.ok) {
            const message = `An error has occured: ${resp.status}`;
            throw new Error(message);
        } else {
            getSections(null);
        }
    }

    async function createPantrySection()
    {
        if (new_pantry_name == null || new_pantry_name == "")
        {
            pantry_name_null = true;
            return;
        }
        const data = {
            "name": new_pantry_name,
            "userId": "uvh48ynbmnnmydx"
        };
        const resp = await fetch(`https://fit-itu.hop.sh/api/collections/pantrySections/records/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        });

        if (!resp.ok) {
            const message = `An error has occured: ${resp.status}`;
            throw new Error(message);
        } else {
            getSections(data.id);
            pantry_name_null = false;
            new_pantry_name = null;
            add_pantry = false;
        }
    }

    function cancelUpdatePantrySection()
    {
        new_name = null;
        edit_pantry_id = null;
        let matchingSection = pantrySections.find(section => section.id === selectedSectionId);
    }

    function editPantry()
    {
        edit_pantry_id = selectedSectionId;
        let matchingSection = pantrySections.find(section => section.id === selectedSectionId)
        old_pantry_name = matchingSection.name;
        add_pantry = false;
    }

    function filterIngredients(query) {
      filteredIngredients = ingredientTypes.filter(ingredient =>
        ingredient.name.toLowerCase().includes(query.toLowerCase())
      );
      console.log(filteredIngredients);
    }

    function getIngredientTypes(){
        fetch('https://fit-itu.hop.sh/api/collections/ingredients/records?expand=unit')
        .then(res => res.json())
        .then(data => {
            ingredientTypes = data.items;
            filteredIngredients = ingredientTypes;
            console.log(ingredientTypes);
        })
        .catch(err => {
            console.error(err);
        });
    }

    async function updatePantrySection(new_pantry_name)
    {
        if (new_pantry_name == null || new_pantry_name == "")
        {
            pantry_name_null = true;
            return;
        }
        const data = {
            "name": new_pantry_name,
            "userId": "uvh48ynbmnnmydx"
        };
        const resp = await fetch(`https://fit-itu.hop.sh/api/collections/pantrySections/records/${selectedSectionId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        });

        if (!resp.ok) {
            const message = `An error has occured: ${resp.status}`;
            throw new Error(message);
        } else {
            getSections(selectedSectionId);
            pantry_name_null = false;
            new_name = null;
            add_pantry = false;
            edit_pantry_id = null;
        }
    }

    function selectIngredient(ingredient) {
      selectedIngredient = ingredient;
      searchQuery = ingredient.name; // Set the search query to the selected name
      filteredIngredients = []; // Clear filtered results after selection
      newIngredient.id = ingredient.id;
      newIngredient.unit = ingredient.expand.unit.name;
    }

    function changeIngredientAmount(operation)
    {
        if(operation == "+")
        {
            if(newIngredient.unit == "g" || newIngredient.unit == "ml")
            {
                newIngredient.amount += 10;
            } else if (newIngredient.unit == "pcs")
            {
                newIngredient.amount += 1;
            }
        } else if(operation == "-")
        {
            if(newIngredient.unit == "g" || newIngredient.unit == "ml")
            {
                newIngredient.amount -= 10;
            } else if (newIngredient.unit == "pcs")
            {
                newIngredient.amount -= 1;
            }
        }
        if (newIngredient.amount < 0)
        {
            newIngredient.amount = 0;
        }
    }

    async function addIngredient()
    {
        if(searchQuery == null || searchQuery == "")
        { 
            newIngredientNameNull = true;
            return;
        }

        let data = {};
        let resp = null;

        let matchingIngredient = ingredients.find(ingredient => ingredient.ingredient === newIngredient.id);
        console.log(ingredients);
        console.log(matchingIngredient);
        console.log(newIngredient.id);
        if (matchingIngredient)
        {
            data = {
                "amount" : matchingIngredient.amount + newIngredient.amount,
                "ingredient" : newIngredient.id,
                "pantrySection" : selectedSectionId,
            }
            resp = await fetch(`https://fit-itu.hop.sh/api/collections/ingredientInPantry/records/${matchingIngredient.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        });
        } else {
            
            data = {
                "ingredient" : newIngredient.id,
                "pantrySection" : selectedSectionId,
                "amount" : newIngredient.amount
            };
            resp = await fetch(`https://fit-itu.hop.sh/api/collections/ingredientInPantry/records`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data),
            });
        }


        if (!resp.ok) {
            const message = `An error has occured: ${resp.status}`;
            throw new Error(message);
        } else {
            getSections(selectedSectionId);
            searchQuery = null;
            newIngredientNameNull = false;
            newIngredient.amount = 0;
            newIngredient.id = null;
            newIngredient.unit = null;
            newIngredient.url = null;
        }
    }

    function handleDragOver(event) {
        event.preventDefault(); // This is necessary to allow a drop
    }
  
    function handleDrop(event) {
        event.preventDefault();
        const sectionId = event.currentTarget.dataset.sectionId;
        const ingredientId = event.dataTransfer.getData('text/plain');
        // Call your method to assign the ingredient to the section
        // console.log(`Assign ingredient ${ingredientId} to section ${sectionId}`);
        assignIngredientToSection(ingredientId, sectionId);
    }

    function handleNewIngredientClick() {
    // Get the input and button elements
        const inputElement = document.getElementById('newIngredient');
        const buttonElement = document.getElementById('newPantryButton');

        // Check if elements exist
        if (inputElement && buttonElement) {
        // Add a click event listener to the button
        buttonElement.addEventListener('click', function() {
            // Set focus to the input element
            inputElement.focus();
        });
        }
    }

    function assignIngredientToSection(ingredientId, sectionId) {
        fetch(`https://fit-itu.hop.sh/api/collections/ingredientInPantry/records/${ingredientId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                pantrySection: sectionId
            })
        })
        .then(() => {
            selectedSectionId = sectionId;
            getSections(sectionId);
        })
    }

    onMount(() => {
        getIngredientTypes();
        getSections(null);
        handleNewIngredientClick();
    });

    onDestroy(() => {
        const buttonElement = document.getElementById('newPantryButton');
        if (buttonElement) {
        buttonElement.removeEventListener('click', handleNewIngredientClick);
        }
    });

</script>
<div class="flex w-full">
    <Sidebar />
    <div class="h-full w-full min-h-screen bg-primary-white flex justify-center">
        <div class="flex-col w-3/5 mx-auto mb-20">
                <h1 class="text-black text-center text-4xl font-poppins py-4 font-semibold mb-0 mx-auto">Pantry</h1>
                <div class="flex gap-2 justify-between">
                    <div class="justify-start flex gap-2 w-auto">
                        {#each pantrySections as section}
                        {#if edit_pantry_id != section.id}
                        <div
                        on:dragover={handleDragOver}
                        on:drop={handleDrop}
                        data-section-id={section.id}
                        >
                            <button
                            on:click={() => selectSection(section.id)}
                            class={`${selectedSectionId === section.id ? 'bg-primary-green flex text-white border-2 hover:cursor-default hover:bg-primary-green border-primary-green' : 'bg-primary-white text-black'} border-black items-center hover:bg-secondary-green hover:text-white hover:border-primary-green text-xs font-semibold rounded-2xl text-center w-auto h-7 border-2`}>
                            <div class="ml-5 mr-5 text-sm">
                                {section.name}
                            </div>
                            {#if selectedSectionId == section.id}
                            <button class=" mr-1 bg-transparent flex justify-end h-5 w-5 hover:bg-secondary-green rounded-3xl" on:click={() => editPantry()}>
                                <img src={edit_white} alt="Edit">
                            </button>
                            <button class={`mr-1 bg-transparent flex justify-end h-5 w-5 hover: hover:bg-secondary-green rounded-3xl`} 
                            on:mouseover={() => red_trashbin = true}
                            on:focus={() => red_trashbin = true}
                            on:mouseleave={() => red_trashbin = false}
                            on:click={() => deletePantrySection()}>
                                
                                {#if !red_trashbin}
                                    <img src={trash_bin_icon} alt="Delete">
                                {:else}
                                    <img src={trashbin_red} alt="Delete">
                                {/if}
                            </button>
                            {/if}
                            </button>
                        </div>

                        {:else}
                            <div>
                                <input 
                                bind:value={section.name}
                                type="text" id="pantry" class={`px-3 h-7 bg-transparent border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-700 ${pantry_name_null? 'border-red-500' : ''}`} placeholder="Pantry name..."/>
                            </div>
                            <div>
                                <button
                                    on:click={() => updatePantrySection(section.name)}
                                    class="p-1 bg-transparent flex justify-end h-7 w-7 hover:bg-primary-brown rounded-xl">
                                    <img src={save_icon} alt="Save">
                                </button>
                            </div>
                            <div>
                                <button
                                    on:click={() => {cancelUpdatePantrySection(); section.name = old_pantry_name; old_pantry_name = null;}}
                                    class="bg-transparent flex justify-end h-7 w-7 hover:bg-primary-brown rounded-xl">
                                    <img src={close_icon} alt="Close">
                                </button>
                            </div>
                        {/if}
                        {/each}
                        <div class="">
                            <input
                            bind:value={new_pantry_name}
                            type="text" id="newPantry" class={`px-3 w-[150px] h-7 bg-transparent border border-gray-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-700 ${pantry_name_null? 'border-red-500' : ''}`} placeholder="New pantry..."/>
                        </div>
                        {#if new_pantry_name != null && new_pantry_name != ""}
                        <div class="">
                            <button
                                on:click={() => createPantrySection()}
                                class="p-1 bg-transparent flex justify-end h-7 w-7 hover:bg-primary-brown rounded-2xl">
                                <img src={save_icon} alt="Save">
                            </button>
                        </div>
                        {/if}
                    </div>
                    <div class="flex gap-4 justify-end">
                        <button id="newPantryButton" class="p-0 h-7 items-center bg-secondary-green flex justify-end hover:bg-secondary-green rounded-3xl">
                            <img src={new_icon} class="h-7 w-7" alt="Delete">
                            <p class="text-center text-white text-sm pr-3">Ingredient</p>
                        </button>
                    </div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 gap-4 pt-10 justify-left">
                    {#each ingredients as ingredient}
                        <Ingredient ingredient={ingredient} />
                    {/each}


                    <div class="w-[350px] h-[100px] bg-cover flex rounded-2xl ">
                        <div class="w-[100px] bg-white rounded-l-2xl">
                            <img src={camera} alt="Save"/>
                        </div>
                        <div class="border-2 rounded-r-2xl border-primary-green bg-primary-green text-white text-center w-[250px]">
                            <div class="items-center text-center">
                                <div class="flex justify-between mt-1 relative">
                                    <input
                                        id="newIngredient"
                                        type="text"
                                        placeholder="Search for ingredient..."
                                        bind:value={searchQuery}
                                        on:input={() => filterIngredients(searchQuery)}
                                        class={`m-2 text-black border-2 text-s  p-2 h-7 rounded-full w-full focus:border-black focus:outline-none font-poppins placeholder-gray-700 ${newIngredientNameNull? 'border-red-500' : ''}`}
                                    />
                                    {#if searchQuery && filteredIngredients.length}
                                        <div class="absolute border-primary-white flex flex-col bg-primary-white mb-2 bottom-full z-10 w-full rounded-3xl border font-poppins">
                                        {#each filteredIngredients as ingredient}
                                            <button
                                            on:click={() => selectIngredient(ingredient)}
                                            class="p-2 hover:bg-secondary-green hover:text-white cursor-pointer rounded-3xl text-black text-left"
                                            in:fade={{ delay: 100 * (filteredIngredients.indexOf(ingredient)), duration: 300 }}
                                            >
                                            {ingredient.name}
                                            </button>
                                        {/each}
                                        </div>
                                    {/if}
                                </div>
                                <div class="pt-4 flex h-2/3 w-auto justify-center items-center">
                                    <button 
                                        on:click={() => changeIngredientAmount("-")}
                                        class="flex h-7 w-7 p-1 mr-1 rounded-3xl bg-primary-green hover:bg-secondary-green">
                                        <img src={minus_icon} alt="Edit">
                                    </button>
                                    <input 
                                        bind:value={newIngredient.amount}
                                        type="number" min=0 max={Number.MAX_SAFE_INTEGER} id="amount" class={`px-3 w-1/3 h-7 bg-transparent border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-700 `} placeholder="Amount"/>
                                        <p class="text-sm flexrounded-2xl pl-2 pr-2">
                                            {#if newIngredient.unit != null}
                                                {newIngredient.unit}
                                            {:else}
                                                unit
                                            {/if}
                                        </p>
                                    <button 
                                        on:click={() => changeIngredientAmount("+")}
                                        class="flex  h-7 w-7 rounded-3xl ml-1 bg-primary-green hover:bg-secondary-green">
                                        <img src={new_icon} alt="Edit">
                                </button>
                                <button
                                    on:click={() => addIngredient()}
                                    class="p-1 bg-transparent flex justify-end h-7 w-7 hover:bg-secondary-green rounded-2xl">
                                    <img src={save_white} alt="Save">
                                </button>
                                </div>
                            </div>
                        </div>


                </div>
                    
                    
                </div>
        </div>

    </div>
    
    <div class="fixed inset-x-0 bottom-0 flex justify-center items-end">
        <button class="w-1/2 bg-primary-brown text-black rounded-t-xl flex justify-center" on:click={() => showShoppingList.set(true)}>
            <img src={up_arrow} alt="Popis obrázku" class="w-[30px]">
        </button>
    </div>
</div>