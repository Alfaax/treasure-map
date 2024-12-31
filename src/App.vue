<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <nav class="navigation">
      <RouterLink class="navigation__link" to="/">le jeu</RouterLink>
      <RouterLink class="navigation__link" to="/reglement">les règles</RouterLink>
    </nav>
  </header>

  <RouterView class="mainApp" />
</template>

<style scoped lang="scss">
.navigation {
  box-sizing: border-box;
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  background-color: $grey-2;
  border-bottom: 1px solid #e5e5e5;
  height: 60px;
  gap: 18px;

  &__link {
    text-decoration: none;
    color: $white;

    &.router-link-active {
      color: $green;
    }
  }
}
</style>
