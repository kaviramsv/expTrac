<!-- <h3>Menu</h3> -->
<!-- <aside :class="`${is_expanded ? 'is-expanded' : ''}`"> -->
<!-- <div class="logo">
      <img :src="vueLogo" alt="Vue" />
    </div> -->

<!-- <div class="menu-toggle-wrap">
      <button class="menu-toggle" @click="ToggleMenu">
        <span class="material-icons">keyboard_double_arrow_right</span>
      </button>
    </div> -->

<script setup>
import { ref } from "vue";
import vueLogo from "../assets/vue.svg";

const is_expanded = ref(localStorage.getItem("is_expanded") === "true");

// const ToggleMenu = () => {
//   is_expanded.value = !is_expanded.value;
//   localStorage.setItem("is_expanded", is_expanded.value);
// };
const myFunction = () => {
  var element = document.body;
  element.dataset.bsTheme =
    element.dataset.bsTheme == "light" ? "dark" : "light";
};
</script>
<template>
  <div class="menu pt-5 pb-0 pe-md-5">
    <!-- <p class="mx-auto mb-0 mt-2 d-none d-md-block">
      Menu&nbsp;&nbsp;&nbsp;&nbsp;
    </p> -->
    <div>
      <router-link to="/home" class="button mb-3">
        <span class="material-icons me-3 me-md-0">home</span>
        <span class="text d-none d-md-block me-md-2"
          >Home&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
        >
      </router-link>


      <router-link to="/expense" class="button mb-3">
        <span class="material-icons me-3 me-md-0"> monetization_on </span>
        <span class="text d-none d-md-block me-md-2">Expense</span>
      </router-link>
            <router-link to="/about" class="button mb-3">
        <span class="material-icons me-3 me-md-0">description</span>
        <span class="text d-none d-md-block me-md-2"
          >About&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
        >
      </router-link>
    </div>
    <div class="d-flex flex-column ms-3 justify-content-start">
      <p class="mx-auto d-none d-md-block">Toggle Theme</p>
      <div
        class="form-check form-switch justify-content-center align-items-center mx-auto"
      >
        <input
          class="form-check-input"
          type="checkbox"
          role="switch"
          id="flexSwitchCheckChecked"
          checked
          @click="myFunction"
        />
      </div>
    </div>
  </div>

  <!-- <div class="menu">

    <router-link to="/home" class="button mx-2 ps-2">
      <span class="material-icons me-2 me-md-0">home</span>
      <span class="text d-none d-md-block"
        >Home&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
      >
    </router-link>
    <router-link to="/about" class="button mx-2 ps-2">
      <span class="material-icons me-2 me-md-0">description</span>
      <span class="text d-none d-md-block"
        >About&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
      >
    </router-link>
   
    <router-link to="/expense" class="button mx-2 ps-2">
      <span class="material-icons me-2 me-md-0"> monetization_on </span>
      <span class="text d-none d-md-block">Expense</span>
    </router-link>
 
  </div> -->
  <!-- </aside> -->
</template>

<style lang="scss" scoped>
.menu {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: start;

  font-weight: bold;
  font-size: 18px;
  height: calc(100vh - 39.998px - 20px - 20px - 39.998px - 20px - 20px - 10px);
  // navbar =39.998-20-20;
  //footer=39.998-20-20;
  // menu container padding 5+5

  a {
    text-decoration: none;
    color: inherit;
  }
  .button {
    display: flex;
    gap: 25px;
    border-left: 5px  solid transparent;
    padding-left: 25px;
    &:hover {
      color: var(--primary);
      border-left: 5px solid var(--primary);
    }
  }
}
</style>
