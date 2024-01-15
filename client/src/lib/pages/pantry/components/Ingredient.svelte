<!-- 
              Ingredient.svelte
             Veronika Nevarilova
                FIT ITU 2023
-->

<script>
    import {reloadPantry} from '../../../../store.js';
    export let ingredient = {};

    // icons
    import add_icon from '../../../../assets/new_white.svg';
    import minus_icon from '../../../../assets/minus.svg';
    import delete_icon from '../../../../assets/trashbin_white.svg';

    let ingredient_amount_null = false;

    // drag and drop handler when changing section of ingredient
    function handleDragStart(event) {
        event.dataTransfer.setData('text/plain', ingredient.id);
    }

    // updating amount of an ingredient
    async function saveAmount()
    {
        // invalid data
        if (ingredient.amount == null || ingredient.amount == "")
        {
            ingredient.amount = 0;
        }
        // update amount
        const data = ingredient;
        const resp = await fetch(`https://fit-itu.hop.sh/api/collections/ingredientInPantry/records/${ingredient.id}`, {
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
            ingredient_amount_null = false;
        }
    }


    // changes the amount when clicking the + and - buttons
    function updateAmount(operation, value)
    {
        if(operation == "+")
        {
            if(ingredient.expand.ingredient.expand.unit.name == "pcs")
            {
                ingredient.amount += 1; // pcs change +1 only

            } //grams and mililitres change +10 
            else if (ingredient.expand.ingredient.expand.unit.name == "g" || ingredient.expand.ingredient.expand.unit.name == "ml")
            {
                ingredient.amount += 10;
            }
        }else if(operation == "-")
        {
            if(ingredient.expand.ingredient.expand.unit.name == "pcs")
            {
                ingredient.amount -= 1;  // pcs change -1 only

            } //grams and mililitres change -10
             else if (ingredient.expand.ingredient.expand.unit.name == "g" || ingredient.expand.ingredient.expand.unit.name == "ml")
            {
                ingredient.amount -= 10;
            }
            if(ingredient.amount < 0)
            {
                ingredient.amount = 0;
            }
        }
        ingredient_amount_null = false;
        saveAmount();
        return;
    }

    // deletes the ingredient when user click the trashbin button
    async function deleteIngredient()
    {
        const data = ingredient;
        const resp = await fetch(`https://fit-itu.hop.sh/api/collections/ingredientInPantry/records/${ingredient.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        });

        if (!resp.ok) {
            const message = `An error has occured: ${resp.status}`;
            throw new Error(message);
        }
        // tell the Pantry.svelte to reload
        reloadPantry.set(true);
    }
</script>

<div class="w-full">
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="h-[100px] mb-4 bg-cover flex rounded-2xl overflow-hidden" draggable="true" on:dragstart={handleDragStart}>
        <div class="flex w-[150px] cursor-move bg-cover h-full" style=" background-image: url({ingredient.expand.ingredient.imageUrl})">
        </div>
        <div class="border-2 rounded-r-2xl border-primary-green bg-primary-green text-white text-center w-full">
            <div class="items-center text-center">
                <div class="flex justify-between mt-1">
                    <p class="text-lg w-auto pl-2">{ingredient.expand.ingredient.name}</p>
                        <button 
                            on:click={() => deleteIngredient()}
                            class="flex p-1 h-8 mr-2 w-8 rounded-3xl ml-1 bg-primary-green justify-end hover:bg-secondary-green">
                            <img src={delete_icon} alt="Edit">
                        </button>
                </div>
                <div class="pt-4 flex h-2/3 w-auto justify-center items-center">
                    <button 
                        on:click={() => updateAmount("-", null)}
                        class="flex h-7 w-7 p-1 mr-1 rounded-3xl bg-primary-green hover:bg-secondary-green">
                        <img src={minus_icon} alt="Edit">
                    </button>
                    <input 
                        bind:value={ingredient.amount}
                        on:blur={() => updateAmount("=", null)}
                        type="number" min=0 max={Number.MAX_SAFE_INTEGER} id="ingredient_comp" class={`px-3 w-1/3 h-7 bg-transparent border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-700 ${ingredient_amount_null? 'border-red-500' : ''}`} placeholder="Amount"/>
                        <p class="text-sm flexrounded-2xl pl-2 pr-2">{ingredient.expand.ingredient.expand.unit.name}</p>
                    <button 
                        on:click={() => updateAmount("+", null)}
                        class="flex  h-7 w-7 rounded-3xl ml-1 bg-primary-green hover:bg-secondary-green">
                        <img src={add_icon} alt="Edit">
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>