<script>
    import { Link } from 'svelte-routing';
    import edit_icon from '../../../assets/edit_icon.svg';
</script>

<div class="h-screen w-full bg-center bg-no-repeat bg-cover background flex-row items-absolute justify-center">
    <div style="display: flex;">
        <div style="flex: 20%;"> <!-- První sloupec, 15 % šířky -->
            <!-- Obsah prvního sloupce -->
        </div>
        <div style="flex: 60%;"> <!-- Druhý sloupec, 70 % šířky -->
            <div class="pt-10 flex-row justify-center">
                <h1 class="text-black text-center text-4xl font-poppins font-semibold mb-0 mx-auto">Pantry</h1>
            </div>
            <div class="pt-2 flex-row justify-end items-center">
                <button class="bg-primary-green hover:bg-secondary-green text-white text-xs font-semibold rounded-2xl text-center w-20 h-5">
                    <Link to="/home">Fridge</Link>
                </button>
                <button class="bg-primary-white hover:bg-white text-black text-xs font-semibold rounded-2xl text-center w-20 h-5" style="border: 2px solid #000;">
                    <Link to="/home">Freezer</Link>
                </button>
                <button class="bg-transparent h-5 w-5">
                    <img src={edit_icon} alt="Popis obrázku">
                </button>
            </div>
            <div class="pt-10 flex-row justify-left">
                <p class="text-black mx-auto text-xl font-poppins mb-2">Vegetables</p>
                <hr style="width: 100%; border: 1px solid #000;">
            </div>
            <div class="pt-10 flex-row justify-left">
                <p class="text-black mx-auto text-xl font-poppins mb-2">Dairy</p>
                <hr style="width: 100%; border: 1px solid #000;">
            </div>
            <div class="pt-10 flex-row justify-left">
                <p class="text-black mx-auto text-xl font-poppins mb-2">Meats</p>
                <hr style="width: 100%; border: 1px solid #000;">
            </div>
            <div class="pt-10 flex-row justify-left">
                <p class="text-black mx-auto text-xl font-poppins mb-2">Drinks</p>
                <hr style="width: 100%; border: 1px solid #000;">
            </div>
            <div class="pt-10 flex-row justify-left">
                <p class="text-black mx-auto text-xl font-poppins mb-2">Sauces</p>
                <hr style="width: 100%; border: 1px solid #000;">
            </div>
            <div class="pt-10 flex-row justify-left">
                <p class="text-black mx-auto text-xl font-poppins mb-2">Others</p>
                <hr style="width: 100%; border: 1px solid #000;">
            </div>
        </div>
        <div style="flex: 20%;"> <!-- Třetí sloupec, 15 % šířky -->
            <!-- Obsah třetího sloupce -->
        </div>
    </div>
</div>

<style>
    .background {
        background-color: #FAF8ED;
    }

</style>