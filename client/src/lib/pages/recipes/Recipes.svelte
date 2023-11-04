<script>
    import Sidebar from '../../components/SideBar.svelte';
    // You can add more script code here if needed
  </script>
  
  <Sidebar />
  <div class="recipes-container">
    <!-- Your recipes content goes here -->
  </div>
  
  <style>
    .recipes-container {
      margin-left: 200px; /* Same as the width of the Sidebar */
      padding: 1rem;
      /* Rest of your styling for the recipes content */
    }
  </style>