<script>
import MainLayout from "../layouts/MainLayout.vue";
import Footer from "../../components/Footer.vue";
export default {
components: {
   MainLayout,
    Footer,
  },
}
</script>

<template>
  <MainLayout>
    <main  class="d-flex justify-content-start  p-5 text-muted ">
     <div class="">
     <h4  class="f mb-3">The Expense Tracker</h4>
     <p>The Expense tracker app is a MEVN - Mongo Express Vue Node App.</p>

     <h4 class="f mt-4">Features</h4>
     <p> 1. Vuex Store - Centralized state management using Vuex store.</p>
     <p> 2. Mongo Db Connectivity - data is getting pulled in from the Mongo Db cluster.</p>      
     <p> 3. Pagination - Data getting retrieved in small batch sizes from the backend.</p>
     <p> 4. JWT authentication - signed Jwt tokens sent from backend is store in Vuex store and sent via axios interceptors.</p>
     <p> 5. Toggle theme - the user has the option to choose between light mode and dark mode. </p>
     <p> 6. Data Analysis using Apex Charts</p>
     <p> 7. Advanced Filter - Search/Sort Operations getting performed from backend via REST API'S. </p>
     <p> 8. Responsive screen design</p>
     <p> 9. CRUD Operations - the user has the ability to add expenses, add the card Details, tag the specific expense, delete/edit expense && much more! </p>     
     </div>
   
    </main>
     <Footer>
      <div
        class="d-none"
        style=""
      >TEST</div>
     </Footer>
      
  </MainLayout>
</template>
<style>
.f{
  font-family: "Pacifico", cursive;
  }

</style>