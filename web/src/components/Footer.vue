<script setup></script>
<template>
  <div class="footer">
    <slot />
  </div>
</template>
<style lang="scss">
.footer {
  //display: flex;

  //justify-content: space-between;
  height: 7vh;
  padding-top: 20px;

  span {
    &:first-child {
      font-weight: bold;
    }
    &:last-child {
      font-size: 14px;
    }
  }
}
</style>
