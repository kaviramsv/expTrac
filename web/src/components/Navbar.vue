<script>
import { mapGetters, mapActions } from "vuex";
import lady from "../assets/lady.jpg";
export default {
  setup(props) {},
  data() {
    return {};
  },
  props: {},
  mounted() {},
  computed: {
    ...mapGetters([]),
  },
  methods: {
    ...mapActions(["logOut"]),
  },
  components: {},
};
</script>
<template>
  <div class="navbar navbar-expand-lg mb-1 pb-5 pb-md-0 ">
    <div class="logo">
      <span class="material-icons font-size-12 text-warning">
        currency_rupee
      </span>
      <span class="ms-2 ms-md-0 text-warning">Expense Tracker</span>
    </div>
    <div class="icons d-flex justify-content-end ">
      <button class="b btn border-0 d-none d-lg-block p-2">
        <span class="material-icons"> search </span>
      </button>
      <button class="b btn border-0 d-none d-lg-block p-2">
        <span class="material-icons"> grid_view </span>
      </button>
      <button class="b btn border-0 d-none d-lg-block p-2">
        <span class="material-icons"> fullscreen </span>
      </button>
      <div class="notification d-none d-lg-block p-2">
        <button class="b btn border-0 p-2">
          <span class="material-icons"> notifications </span></button
        ><span class="item">1</span>
      </div>
      <div class="user">
        <img src="@/assets/lady.jpg" />
        <span class="d-none d-lg-block"> Kavita </span>
      </div>
      <!-- <div class="form-check form-switch mx-4">
        <input
          class="form-check-input p-2"
          type="checkbox"
          role="switch"
          id="flexSwitchCheckChecked"
          checked
          @click="myFunction"
        />
      </div> -->
      <button
        class="btn btn-primary px-2 py-1 cm-1"
        style="width: 80px; height: 32px"
        @click="logOut"
      >
        Log Out
      </button>
    </div>
  </div>
</template>
<!-- font-family: "Bungee Spice", sans-serif;
font-weight: 200;
font-style: normal;
font-size: 20px; -->
<style lang="scss" scoped>
.navbar {
  background-color: var(--light);
  color: var(--primary);
  width: 100%;
  height: 7vh;
  padding: 20px 20px;
  display: flex;
  justify-content: space-between;
  border-bottom: var(--dark);
  .logo {
    display: flex;
    align-items: center;
    gap: 10px;

    font-family: "Pacifico", cursive;
    font-weight: 400;
    font-style: normal;
    font-size: 18px;

    .material-icons {
      color: var(--primary);
      font-weight: bold;
      font-size: 30px;
    }
  }
  .icons {
    display: flex;
    align-items: center;
    gap: 20px;
    .b {
      color: var(--primary);
      &:hover {
        background: var(--grey);
      }
    }
    .notification {
      position: relative;
      .item {
        height: 16px;
        width: 16px;
        border-radius: 50%;
        background-color: red;
        color: white;
        position: absolute;
        top: -2px;
        right: 5px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
      }
    }

    .user {
      display: flex;
      align-items: center;
      gap: 10px;
      img {
        width: 25px;
        height: 25px;
        border-radius: 50%;
        object-fit: cover;
      }
    }
    .logout {
      color: var(--white);
      background: var(--grey);
      &:hover {
        color: var(--white);
      }
    }
  }
}
</style>
