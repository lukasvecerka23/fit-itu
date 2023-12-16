<script>

    export let id;

    // params.id will contain the ID from the URL
    let currentStep = 1;
  
    function goToNextStep() {
      if (currentStep < 4) {
        currentStep += 1;
      }
    }
  
    function goToPreviousStep() {
      if (currentStep > 1) {
        currentStep -= 1;
      }
    }
  
    function handleFinish() {
      alert('Recipe submitted!');
      // Here you would handle the submission of the recipe, such as a POST request to a server
    }

    
  </script>
  <h1>Create or Edit Recipe</h1>
  <p>Recipe ID: {id}</p>
  <div>
    {#if currentStep === 1}
      <!-- Content for Step 1 -->
      <div>
        <h2>What's this recipe called?</h2>
        <!-- Input fields for step 1 -->
        <!-- ... -->
      </div>
    {:else if currentStep === 2}
      <!-- Content for Step 2 -->
      <div>
        <h2>Which ingredients will you need?</h2>
        <!-- Input fields for step 2 -->
        <!-- ... -->
      </div>
    {:else if currentStep === 3}
      <!-- Content for Step 3 -->
      <div>
        <h2>How is this dish prepared?</h2>
        <!-- Input fields for step 3 -->
        <!-- ... -->
      </div>
    {:else if currentStep === 4}
      <!-- Content for Step 4 (Review) -->
      <div>
        <h2>Ready to publish? Check details.</h2>
        <!-- Display entered recipe information for review -->
        <!-- ... -->
      </div>
    {/if}
  </div>
  
  <!-- Navigation buttons -->
  <div class="flex justify-between">
    {#if currentStep > 1}
      <button on:click={goToPreviousStep}>Back</button>
    {/if}
    {#if currentStep < 4}
      <button on:click={goToNextStep}>Next</button>
    {:else}
      <button on:click={handleFinish}>Finish</button>
    {/if}
  </div>