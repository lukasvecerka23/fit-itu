<script>
    import { Link } from 'svelte-routing';
    import edit_icon from '../../../assets/edit_icon.svg';
</script>

<div class="h-screen w-full bg-primary-white flex justify-center">
    <div class="flex-col w-1/2 mx-auto">
            <h1 class="text-black text-center text-4xl font-poppins pt-4 font-semibold mb-0 mx-auto">Pantry</h1>
            <div class="pt-2 flex gap-2 items-center">
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
</div>