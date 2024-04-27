<script setup>
import SidebarVue from "../../components/Sidebar.vue";
import Navbar from "../../components/Navbar.vue";
import Footer from "../../components/Footer.vue";
</script>

<template>
  <div class="main">
    <Navbar />
    <div class="fullContainer">
      <div class="menuContainer">
        <SidebarVue />
      </div>
      <div class="contentContainer container-fluid">
        <slot />
      </div>
    </div>
    <!-- <Footer /> -->
  </div>
</template>
<style lang="scss">
.main {
  font-family: "Roboto", sans-serif;
  background-color: var(--light);
  color: var(--primary);
  width: 100%;
  .fullContainer {
    display: flex;
    margin: 0;
    width: 9;
    padding: 0px;

    .menuContainer {
      //width: var(--sidebar-width);
      padding: 5px 0px;
    }
    .contentContainer {
      width: 100%;
      //display: flex;
      //justify-content: center;
      //align-items: center;
      background: var(--white);
      color: var(--primary);
    }
  }
}
</style>
<!-- -->
<!-- <style lang="scss">
 .container {
  display: flex;
  text-align: center;
  justify-content: space-between;
  align-items: center;
  .menuContainer {
    display: flex;
    text-align: center;
    justify-content: center;
    align-items: center;
    margin: 2rem;
  }
  .contentContainer {
    padding-left: 2rem;
    display: flex;
    text-align: center;
    justify-content: center;
    align-items: center;
  }
} 
</style> -->
