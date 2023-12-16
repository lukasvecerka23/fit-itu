<script>
    import NavButton from "./NavButton.svelte";
    import RecipeLogo from "../../assets/recipe-book.svg";
    import PantryLogo from "../../assets/pantry-logo-white.svg";
    import ShoppingListLogo from "../../assets/shopping-list-white.svg";
    import LogoutLogo from "../../assets/logout-white.svg";
    import Logo from "../../assets/main-logo.png";
    import { Link} from "svelte-routing";
    import { showShoppingList } from "../../store";
    $: activepage = location;

    function isActivePage(page) {
        return activepage.pathname === page;
    }
</script> 

<nav class="sticky bg-secondary-green top-0 h-screen w-30 overflow-x-hidden text-white flex flex-col justify-between">
        <div class="flex-col">
            <Link to="/home">
                <img src={Logo} alt="Logo" class="w-full h-auto max-w-[120px] mx-auto" />
            </Link>
            <NavButton linkPath="/recipes"
            text="Recipes"
            logoUrl={RecipeLogo}
            classBackgroundColor={isActivePage("/recipes") ? "bg-primary-green" : ""}
            />
            <NavButton linkPath="/pantry"
            text="Pantry"
            logoUrl={PantryLogo}
            classBackgroundColor={isActivePage("/pantry") ? "bg-primary-green" : ""}
            />
        </div>
        <div class="flex-col">
            <button class="flex-col items-center rounded-full m-2 py-4" on:click={() => showShoppingList.set(true)}>
                <img src={ShoppingListLogo} alt="Logo" class="w-3/4 max-w-[40px] h-auto mx-auto"/>
                <h1 class="text-white text-center font-poppins text-sm">Shopping list</h1>
            </button>
            <NavButton linkPath="/"
            text="Logout"
            logoUrl={LogoutLogo}
            classBackgroundColor={isActivePage("/") ? "bg-primary-green" : ""}
            />
        </div>
  </nav>
