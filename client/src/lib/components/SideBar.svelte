<script>

    import HomePageItem from "../pages/home-page/components/HomePageItem.svelte";
    import NavButton from "./NavButton.svelte";
    import RecipeLogo from "../../assets/home-1-svgrepo-com.svg";
    import PantryLogo from "../../assets/cupboard-svgrepo-com.svg";
    import ShoppingListLogo from "../../assets/shopping-basket-svgrepo-com.svg";
    import LogoutLogo from "../../assets/logout-svgrepo-com.svg";
    import Logo from "../../assets/logo.svg";
    import Pantry from "../pages/pantry/Pantry.svelte";
    $: activepage = location;

    function isActivePage(page) {
        return activepage.pathname === page;
    }
</script> 

<nav class="sticky bg-secondary-green top-0 left-0 h-screen w-24 overflow-x-hidden text-white p-0 flex flex-col justify-between">
        <div class="flex-col">
            <img src={Logo} alt="Logo" class="w-8 h-8 mx-4" />
            <div class="home-page-item p-2.5">
                <NavButton linkPath="/recipes"
                text="Home"
                logoUrl={RecipeLogo}
                classBackgroundColor={isActivePage("/recipes") ? "bg-primary-green" : ""}
                />
            </div>
            <div class="pantry-page-item p-2.5">
                <NavButton linkPath="/pantry"
                text="Pantry"
                logoUrl={PantryLogo}
                classBackgroundColor={isActivePage("/pantry") ? "bg-primary-green" : ""}
                />
            </div>
        </div>
        <div>
            <div class="shopping-list-page-item p-2.5 text-l">
                <NavButton linkPath="/home"
                text="Shopping List"
                logoUrl={ShoppingListLogo}
                classBackgroundColor={isActivePage("/shopping-list") ? "bg-primary-green" : ""}
                />
                </div>
            <div class="logout-page-item p-2.5">
                <NavButton linkPath="/"
                text="Logout"
                logoUrl={LogoutLogo}
                classBackgroundColor={isActivePage("/") ? "bg-primary-green" : ""}
                />
                </div>
        </div>
  </nav>
