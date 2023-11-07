<script>
    export let ingredient = {};
</script>

<div class="w-[150px] h-[150px] bg-cover flex rounded-3xl items-end overflow-hidden" style="background-image: url({ingredient.expand.ingredient.imageUrl})">
    <div class=" w-full h-[35%] bg-black flex text-white items-center justify-center bg-opacity-70">
        <div class="flex-col text-center">
            <p>{ingredient.expand.ingredient.name}</p>
            <p class="text-sm">{ingredient.amount} {ingredient.expand.ingredient.expand.unit.name}</p>
        </div>
    </div>
</div>
  <style>
  </style>