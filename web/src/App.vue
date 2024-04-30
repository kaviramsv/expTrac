<script setup>
import Sidebar from "./components/Sidebar.vue";
</script>

<template>
  <div class="app1">
    <!-- <Sidebar /> -->
    <router-view></router-view>
  </div>
</template>

<style lang="scss">
:root {
  --primary: white;
  --grey: #41587adc; //#6a8ab6;
  --dark: #545965;
  --dark-alt: #436ca7;
  --light: rgb(52, 69, 110);
  --white: #fff;
  --sidebar-width: 225px;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;

}

[data-bs-theme="light"] {
  .btn-primary {
    --bs-btn-color: #fff;
    --bs-btn-bg: var(--grey);
    --bs-btn-border-color: #fff;
    --bs-btn-hover-color: #fff;
    --bs-btn-hover-border-color: #fff;
    --bs-btn-focus-shadow-rgb: 59, 112, 193;
    --bs-btn-active-color: var(--grey);
    --bs-btn-active-bg: #fff;
    --bs-btn-active-border-color: #fff;
    --bs-btn-active-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);
    --bs-btn-disabled-color: var(--grey);
    --bs-btn-disabled-bg: #fff;
    --bs-btn-disabled-border-color: var(--grey);
  }
  .btn-primary:hover,
  .btn-primary:focus,
  .btn-primary:active,
  .btn-primary.active,
  .open > .dropdown-toggle.btn-primary {
    color: #fff;
    background-color: #2a5b94;
    border-color: #285e8e; /*set the color you want here*/
  }
  .btn-outline-primary {
    --bs-btn-color: var(--grey);
    --bs-btn-border-color: var(--grey);
    --bs-btn-hover-color: #fff;
    --bs-btn-hover-bg: var(--grey);
    --bs-btn-hover-border-color: var(--grey);
    --bs-btn-focus-shadow-rgb: 24, 87, 182;
    --bs-btn-active-color: #fff;
    --bs-btn-active-bg: var(--grey);
    --bs-btn-active-border-color: var(--grey);
    --bs-btn-active-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);
    --bs-btn-disabled-color: var(--grey);
    --bs-btn-disabled-bg: transparent;
    --bs-btn-disabled-border-color: var(--grey);
    --bs-gradient: none;
  }
  .page-link.active,
  .active > .page-link {
    z-index: 3;
    color: var(--bs-pagination-active-color);
    background-color: #285e8e;
    border-color: #285e8e;
  }
}
[data-bs-theme="dark"] {
  --primary: #aaaab0;
  --light: #282c35;
  --dark: rgb(50, 54, 63);
  --white: rgb(50, 54, 63);

  --bs-primary: #aaaab0;
  --bs-light: rgb(50, 54, 63);
  --bs-dark: rgb(245, 246, 248);
  --bs-white: rgb(50, 54, 63);

  --bs-text-primary: rgb(50, 54, 63);
  .page-link.active,
  .active > .page-link {
    color: #41587adc;
    background-color: white;
    border-color: white;
  }
  .page-link {
    color: white;
    background-color: #41587adc;
    border: white;
  }
  .btn-primary {
    --bs-btn-bg: var(--grey);
    --bs-btn-border-color: var(--grey);
    --bs-btn-colour: var(--grey);
    --bs-btn-hover-color: rgb(50, 54, 63);
    --bs-btn-hover-bg: rgb(243, 244, 247);
  }
  .btn-outline-primary {
    --bs-btn-color: rgb(243, 244, 247);
    --bs-btn-bg: var(--grey);
    --bs-btn-border-color: var(--grey);
    --bs-btn-colour: var(--grey);
    --bs-btn-hover-color: rgb(50, 54, 63);
    --bs-btn-hover-bg: rgb(243, 244, 247);
  }
  .card-title {
    --bs-card-title-color: rgb(6, 6, 7);
    margin-bottom: rgb(50, 54, 63);
  }
  .card-header {
  }
  .card-body {
    .events {
      color: rgb(6, 6, 7);
    }
  }

  .form-check-input:checked {
    background-color: var(--grey);
    border-color: var(--grey);
  }
}
button {
  appearance: none;
  border: none;
  outline: none;
  background: none;
}
</style>
<!-- cursor: pointer; 
 #0d6efd -bs blue-->
