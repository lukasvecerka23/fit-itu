<script>
    import edit_icon from '../../../assets/edit_icon.svg';
    import Ingredient from './components/Ingredient.svelte';
    import Sidebar from '../../components/SideBar.svelte';
    import SlideUpOverlay from '../../components/SlideUpOverlay.svelte';
    import menu_icon from '../../../assets/menu_icon.svg';
    import close_icon from '../../../assets/close_black.svg';
    import { onMount } from 'svelte';
    import {showShoppingList} from '../../../store.js';
    import up_arrow from '../../../assets/uparrow.svg';
    import trash_bin_icon from '../../../assets/trashbin.svg';
    import new_icon from '../../../assets/new_white.svg';
    import new_icon_gray from '../../../assets/new_gray.svg';
    import save_icon from '../../../assets/save.svg';
    import minus_icon from '../../../assets/minus.svg';
    import delete_icon from '../../../assets/trashbin_white.svg';

    let textField = '';
    let pantrySections = [];
    let selectedSectionId = null;
    let ingredients = [];
    let add_pantry = false;
    let new_pantry_name = null;
    let pantry_name_null = false;
    let edit_pantry_id = null;
    let new_name = null;
    let old_pantry_name = null;


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

    async function handleSubmit(){
        const data = {
            "name": textField,
            "userId": "uvh48ynbmnnmydx"
        };
        const resp = await fetch('https://fit-itu.hop.sh/api/collections/pantrySections/records', {
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
            textField = '';
            getSections(null);
        }

        const json = await resp.json();
        console.log(json);
    };

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

    function cancelNewPantrySection()
    {
        pantry_name_null = false;
        new_pantry_name = null;
        add_pantry = false;
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

    function setOldName(old_name)
    {
        old_pantry_name = old_name;
    }

    document.addEventListener('DOMContentLoaded', (event) => {
    // Get the input and button elements
    const inputElement = document.getElementById('newIngredient');
    const buttonElement = document.getElementById('newPantryButton');

    // Add a click event listener to the button
    buttonElement.addEventListener('click', function() {
        // Set focus to the input element
        inputElement.focus();
        });
    });
    
    onMount(() => {
        getSections(null);
    });

</script>
<div class="flex w-full">
    <Sidebar />
    <div class="h-full w-full min-h-screen bg-primary-white flex justify-center">
        <div class="flex-col w-3/5 mx-auto">
                <h1 class="text-black text-center text-4xl font-poppins py-4 font-semibold mb-0 mx-auto">Pantry</h1>
                <div class="flex gap-2 justify-between">
                    <div class="justify-start flex gap-2 w-auto">
                        {#each pantrySections as section}
                        {#if edit_pantry_id != section.id}
                        <button
                            on:click={() => selectSection(section.id)}
                            class={`${selectedSectionId === section.id ? 'bg-primary-green text-white border-2 border-primary-green' : 'bg-primary-white text-black'} border-black hover:bg-secondary-green hover:text-white hover:border-primary-green text-xs font-semibold rounded-2xl text-center w-auto h-7 border-2`}>
                            <div class="ml-5 mr-5 text-sm">
                                {section.name}
                            </div>
                        </button>
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
                        <button class="p-1 bg-transparent flex justify-end h-9 w-9 hover:bg-primary-brown rounded-3xl" on:click={() => editPantry()}>
                            <img src={edit_icon} alt="Edit">
                        </button>
                        <button class="p-1 bg-transparent flex justify-end h-9 w-9 hover:bg-primary-brown rounded-3xl" on:click={() => deletePantrySection()}>
                            <img src={trash_bin_icon} alt="Delete">
                        </button>
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


                    <div class="w-[350px] h-[100px] bg-cover flex rounded-2xl overflow-hidden">
                        <div class="flex w-[100px] bg-cover h-full" style="">
                        </div>
                        <div class="border-2 rounded-r-2xl border-primary-green bg-primary-green text-white text-center w-[250px]">
                            <div class="items-center text-center">
                                <div class="flex justify-between mt-1">
                                    <p class="text-lg w-auto pl-2">Ahoj</p>
                                        <button 
                                        class="flex p-1 h-8 mr-2 w-8 rounded-3xl ml-1 bg-primary-green justify-end hover:bg-secondary-green">
                                        <img src={delete_icon} alt="Edit">
                                        </button>
                                </div>
                                <div class="pt-4 flex h-2/3 w-auto justify-center items-center">
                                    <button 
                                        class="flex h-7 w-7 p-1 mr-1 rounded-3xl bg-primary-green hover:bg-secondary-green">
                                        <img src={minus_icon} alt="Edit">
                                    </button>
                                    <input 
                                        type="number" min=0 max={Number.MAX_SAFE_INTEGER} id="cauky" class={`px-3 w-1/3 h-7 bg-transparent border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-700 `} placeholder="Amount"/>
                                        <p class="text-sm flexrounded-2xl pl-2 pr-2">Ahoj</p>
                                    <button 
                                        class="flex  h-7 w-7 rounded-3xl ml-1 bg-primary-green hover:bg-secondary-green">
                                        <img src={new_icon} alt="Edit">
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