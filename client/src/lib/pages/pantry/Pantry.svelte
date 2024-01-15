<!-- 
                Pantry.svelte
             Veronika Nevarilova
                FIT ITU 2023
-->

<script>
    import Ingredient from './components/Ingredient.svelte';
    import Sidebar from '../../components/SideBar.svelte';
    import {onDestroy, onMount} from 'svelte';
    import {showShoppingList, reloadPantry} from '../../../store.js';
    import {fade} from 'svelte/transition';

    // icons
    import lightbulb from '../../../assets/lightbulb.svg';
    import camera from '../../../assets/camera_gray.svg';
    import edit_white from '../../../assets/edit_white.svg';
    import close_icon from '../../../assets/close_black.svg';
    import up_arrow from '../../../assets/uparrow.svg';
    import trash_bin_icon from '../../../assets/trashbin_white.svg';
    import new_icon from '../../../assets/new_white.svg';
    import save_icon from '../../../assets/save.svg';
    import minus_icon from '../../../assets/minus.svg';
    import trashbin_red from '../../../assets/trashbin_light_red.svg';
    import save_white from '../../../assets/save_white.svg';

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
    let tiphidden = true;

    // Function that gets all the pantry sections (fridge, freezer etc.)
    // if selectedId is not null, it will select a section with the id
    // else it selects the Unassigned section
    function getSections(selectedId){
        // Fetch pantry sections and set the first one as selected
        fetch('https://fit-itu.hop.sh/api/collections/pantrySections/records')
            .then(res => res.json())
            .then(async (data) => {
                pantrySections = data.items;
                // Set the first section as selected, if there are any sections
                if (pantrySections.length > 0) {
                    if (selectedId != null)
                    {
                        selectedSectionId = selectedId;
                    } else 
                    {
                        selectedSectionId = pantrySections[0].id;
                        red_trashbin = false;
                    }
                    const specificId = "htbj55au87v9quv";  // id of section 'Unassigned'

                    // find index of section 'Unassigned'
                    const index = pantrySections.findIndex(section => section.id === specificId);

                    if (index > -1) {
                        // fake section unassigned the first
                        const [sectionToMove] = pantrySections.splice(index, 1);
                        pantrySections = [sectionToMove, ...pantrySections];
                    }

                    // select section 'Unassigned'
                    if (selectedId == null)
                    {
                        selectSection(pantrySections[0].id);
                    }
                    ingredients = await getIngredient(selectedSectionId);                    
                }
            })
            .catch(err => {
                console.error(err);
            });
    }


    // gets all the ingredients of one section
    async function getIngredient(sectionId){
        const resp = await fetch(`https://fit-itu.hop.sh/api/collections/ingredientInPantry/records?filter=(pantrySection='${sectionId}')&expand=ingredient,ingredient.unit,ingredient.category`)
        const data = await resp.json();
        return data.items;
    }

    // Function to select a section with sectionId
    async function selectSection(sectionId) {
        selectedSectionId = sectionId;
        ingredients = await getIngredient(sectionId);

        // set to default state
        red_trashbin = false;
        searchQuery = null;
    }

    // delete currently selected section
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
            // after delete, update sections and select the 'Unassigned' section
            getSections(null);
        }
    }

    async function createPantrySection()
    {   
        // invalid data
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

            // set to default state
            pantry_name_null = false;
            new_pantry_name = null;
            add_pantry = false;
        }
    }

    // cancel all changes when user click on the 'X' button
    function cancelUpdatePantrySection()
    {
        new_name = null;
        edit_pantry_id = null;
    }

    // save old name in case user will want to cancel changes
    function editPantry()
    {
        edit_pantry_id = selectedSectionId;
        let matchingSection = pantrySections.find(section => section.id === selectedSectionId)
        old_pantry_name = matchingSection.name;
        add_pantry = false;
    }

    // filter ingredients - used in searchbar in making new ingredient
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

    // save updated name of pantry section
    async function updatePantrySection(new_pantry_name)
    {
        // invalid data
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

            // set to default
            pantry_name_null = false;
            new_name = null;
            add_pantry = false;
            edit_pantry_id = null;
        }
    }

    // select ingredient to searchbar when creating a new ingredient
    function selectIngredient(ingredient) {
      selectedIngredient = ingredient;
      searchQuery = ingredient.name;   // set the name of the ingredient into the searchbar
      filteredIngredients = []; 
      newIngredient.id = ingredient.id;
      newIngredient.unit = ingredient.expand.unit.name;
    }

    // based on the operation, this function changes the amount of an ingredient
    function changeIngredientAmount(operation)
    {
        if(operation == "+")
        {
            //grams and mililitres change +10
            if(newIngredient.unit == "g" || newIngredient.unit == "ml")
            {
                newIngredient.amount += 10;
            } else if (newIngredient.unit == "pcs") // pcs change +1 only
            {
                newIngredient.amount += 1;
            }
        } else if(operation == "-")
        {
            // grams and mililitres change -10
            if(newIngredient.unit == "g" || newIngredient.unit == "ml")
            {
                newIngredient.amount -= 10;
            } else if (newIngredient.unit == "pcs") // pcs change -1 only
            {
                newIngredient.amount -= 1;
            }
        }
        if (newIngredient.amount < 0)   //cannot be negative amount
        {
            newIngredient.amount = 0;
        }
    }

    // saves a new ingredient
    async function addIngredient()
    {
        // invalid data
        if(searchQuery == null || searchQuery == "")
        { 
            newIngredientNameNull = true;
            return;
        }

        let data = {};
        let resp = null;

        // check if the ingredient already exist in the pantry
        let matchingIngredient = ingredients.find(ingredient => ingredient.ingredient === newIngredient.id);
        console.log(ingredients);
        console.log(matchingIngredient);
        console.log(newIngredient.id);
        // if exists, change only amount of the ingredient
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
        } // if not, create a new one
        else {
            
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
            // set values to default
            searchQuery = null;
            newIngredientNameNull = false;
            newIngredient.amount = 0;
            newIngredient.id = null;
            newIngredient.unit = null;
            newIngredient.url = null;
        }
    }

    // component from Ingredient.svelte after deleting an ingredient sets this variable
    // for dynamic changes
    $: if($reloadPantry)
    {
        // reload and keep selected the current selected section
        getSections(selectedSectionId);
        reloadPantry.set(false);
    }    
    
    // drag and drop changing sections of ingredients handlers
    function handleDragOver(event) {
        event.preventDefault();
    }
  
    async function handleDrop(event) {
        event.preventDefault();
        const sectionId = event.currentTarget.dataset.sectionId;
        const ingredientId = event.dataTransfer.getData('text/plain');
        await assignIngredientToSection(ingredientId, sectionId);
    }

    // when clicked, sets the focus to the searchbar of new ingredient
    function handleNewIngredientClick() {
        // get the input and button elements
        const inputElement = document.getElementById('newIngredient');
        const buttonElement = document.getElementById('newPantryButton');

        // check if elements exist
        if (inputElement && buttonElement) {
        // add a click event listener to the button
        buttonElement.addEventListener('click', function() {
            // set focus to the input element
            inputElement.focus();
        });
        }
    }

    // changes section of an ingredient
    async function assignIngredientToSection(ingredientId, sectionId) 
    {
        let ingredientsInNewSection = await getIngredient(sectionId);
        let ingredientToFind = ingredients.find(ing => ing.id === ingredientId);
        // check if already exists in the section
        let matchingIngredient = ingredientsInNewSection.find(newSectionIng => newSectionIng.ingredient === ingredientToFind.expand.ingredient.id);

        //if exists, deletes the current ingredient and add amount to the existing one
        if (matchingIngredient != null)
        {
            fetch(`https://fit-itu.hop.sh/api/collections/ingredientInPantry/records/${matchingIngredient.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                pantrySection: sectionId,
                ingredient: matchingIngredient.ingredient,
                amount: matchingIngredient.amount + ingredientToFind.amount
            })
            })

            fetch(`https://fit-itu.hop.sh/api/collections/ingredientInPantry/records/${ingredientId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            })
            .then(() => {
                getSections(selectedSectionId);
            })
            return;
        } // if not, changes the pantrySection of the ingredient
        else
        {
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
                getSections(selectedSectionId);
            })
        }
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
        <div class="flex-col w-3/5 mx-auto items-center mb-20">
            <h1 class="text-black text-center text-4xl font-poppins py-4 font-semibold mb-0 mx-auto">Pantry</h1>
            <div class="flex gap-2 justify-between">
                <!-- Pantry sections -->
                <div class="justify-start flex gap-2 w-auto">
                    {#each pantrySections as section}
                        {#if edit_pantry_id != section.id}

                            <!-- svelte-ignore a11y-no-static-element-interactions -->
                            <div
                                on:dragover={handleDragOver}
                                on:drop={async (e) => await handleDrop(e)}
                                data-section-id={section.id}
                                >
                                <button
                                    on:click={async () => await selectSection(section.id)}
                                    class={`${selectedSectionId === section.id ? 'bg-primary-green flex text-white border-2 hover:cursor-default hover:bg-primary-green border-primary-green' : 'bg-primary-white text-black'} border-black items-center hover:bg-secondary-green hover:text-white hover:border-primary-green text-xs font-semibold rounded-2xl text-center w-auto h-7 border-2`}>
                                    <div class="ml-5 mr-5 text-sm">
                                        {section.name}
                                    </div>
                                    <!-- add edit and delete button to the selected section, but only if it is not the 'Unassigned' section -->
                                    {#if selectedSectionId == section.id && selectedSectionId != "htbj55au87v9quv"}
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
                        {:else} <!-- when editing the pantry section name -->
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
                    <!-- can be saved only when name is not null-->
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
                        <button id="newPantryButton" class="p-0 h-7 w-auto min-w-[110px] items-center bg-primary-green flex justify-end hover:bg-secondary-green rounded-3xl">
                            <img src={new_icon} class="h-7 w-7" alt="Delete">
                            <p class="text-center text-white text-sm pr-3">Ingredient</p>
                        </button>
                    </div>
                </div>
                <div class="italic mt-2 flex items-center">
                    <!-- tip for drag and drop changing the sections -->
                    <button
                        on:mouseover={() => tiphidden = false}
                        on:focus={() => tiphidden = false}
                        on:mouseleave={() => tiphidden = true}
                        class="p-1 bg-transparent flex justify-end h-7 w-7 hover:cursor-default hover:bg-primary-brown rounded-3xl">
                        <img src={lightbulb} alt="tip">
                    </button>
                    {#if !tiphidden}
                        <p in:fade={{ duration: 300 }}>
                        Drag ingredient by its image onto a section to move the ingredient to it.
                        </p>
                    {/if}
                </div>
                <div class="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 pt-5 gap-x-20">
                    <!-- all the ingredients in selected section -->
                    {#each ingredients as ingredient, index}
                        <Ingredient ingredient={ingredient} />
                    {/each}
                    <!-- new ingredient input component -->
                    <div class={`w-full h-[100px] flex rounded-2xl `}>
                        <div class="flex flex-col justify-center w-[150px] bg-cover bg-white rounded-l-2xl">
                            <img src={camera} alt="Save"/>
                        </div>
                            <div class="border-2 rounded-r-2xl border-primary-green bg-primary-green text-white text-center w-full">
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
                                                <!-- filtered ingredients based on the input -->
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
                                    <!-- amount setting -->
                                    <div class="pt-2 flex h-2/3 w-auto justify-center items-center">
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
    
    <!-- shopping list -->
    <div class="fixed inset-x-0 bottom-0 flex justify-center items-end">
        <button class="w-1/2 bg-primary-brown text-black rounded-t-xl flex justify-center" on:click={() => showShoppingList.set(true)}>
            <img src={up_arrow} alt="Popis obrázku" class="w-[30px]">
        </button>
    </div>
</div>