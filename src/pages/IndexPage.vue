<script setup>
import { ref } from 'vue'
const ligado = ref(false)
</script>

<template>
  <q-page class="page-wrapper">
    <q-toggle v-model="ligado" label="Ativar" color="primary" />
    <br />
    08134922924
  </q-page>
</template>

<style scoped>
.page-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  max-height: 100vh;
  overflow: hidden;
}
</style>
