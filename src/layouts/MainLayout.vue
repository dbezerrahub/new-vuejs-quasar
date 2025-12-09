<script setup>
import { ref } from 'vue'
import LeftMenu from 'components/LeftMenu.vue'
import { watch } from 'vue'
import { useRoute } from 'vue-router'
// import { VERSION } from 'src/composables/constants'
import linksList from '../config/LeftMenuLinks.js'

const route = useRoute()

// Force HMR workaround
if (import.meta.hot) {
  watch(
    () => route.path,
    (newPath) => {
      if (newPath.includes('/app')) {
        import.meta.hot.send('vue:reload')
      }
    },
  )
}

const leftDrawerOpen = ref(false)

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="q-header">
      <q-toolbar v-if="true" class="q-toolbar">
        <q-btn
          class="btn_menu"
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title></q-toolbar-title>
        <div class="foto-wrapper">
          <q-img src="/images/eu.jpg" class="foto-moldura" ratio="1" fit="cover" />
        </div>
        <div class="name-wrapper">DIOGO BEZERRA</div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <!-- <q-item-label header> Essential Links </q-item-label> -->

        <LeftMenu v-for="link in linksList" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<style lang="css" scoped>
.q-toolbar {
  background-color: black;
  background-image: url('/images/bg_toolbar.png');
  background-size: cover;
  height: 150px;
  vertical-align: top;
}

.btn_menu {
  align-self: flex-start;
  margin-top: 8px;
}

.foto-wrapper {
  /* border: 1px solid white; */
  left: 50%;
  position: absolute;
  top: 10px;
  transform: translateX(-50%); /* centraliza */
}
.name-wrapper {
  font-family: 'aqum';
  font-size: 16px;
  left: 50%;
  position: absolute;
  top: 100px;
  transform: translateX(-50%); /* centraliza */
}

.info-wrapper {
  /* border: 1px solid white; */
  text-align: center;
  font-family: 'aqum';
  font-size: 12px;
  left: 50%;
  position: absolute;
  top: 130px;
  transform: translateX(-50%); /* centraliza */
  width: 100%;
}

.foto-moldura {
  height: 80px;
  border-radius: 50%; /* deixa redonda */
  border: 4px double #fff; /* moldura branca */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25); /* sombra bonita */
  overflow: hidden; /* importante para o corte ficar perfeito */
  width: 80px; /* você ajusta o tamanho */
}

.icons_info {
  border: 1px solid white;
  border-radius: 50%; /* deixa redonda */
  padding: 3px;
  font-size: 14px;
}
</style>
