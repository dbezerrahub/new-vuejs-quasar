<script setup>
import { ref, onMounted } from 'vue'
import { Toast } from '@capacitor/toast'
import { App } from '@capacitor/app'

const tab = ref('tab1') // Tab inicial selecionada
const tabsRef = ref(null) // Ref para o componente de tabs

onMounted(async () => {
  let lastBackPress = 0
  App.addListener('backButton', async () => {
    const now = Date.now()
    if (now - lastBackPress < 2000) {
      App.exitApp()
    } else {
      lastBackPress = now
      await Toast.show({
        text: 'Pressione novamente para sair',
        duration: 'short',
      })
      return false
    }
  })
})
</script>

<template>
  <q-page class="page-wrapper">
    <div class="sticky-tabs">
      <q-tabs v-model="tab" class="q-tabs" ref="tabsRef" dense>
        <q-tab name="tab1" class="tab-item" ripple>
          <q-icon class="tab_icon" name="mdi-account-circle" />
        </q-tab>
        <q-tab name="tab2" class="tab-item">
          <q-icon class="tab_icon" name="mdi-school" />
        </q-tab>
        <q-tab name="tab3" class="tab-item">
          <q-icon class="tab_icon" name="mdi-account-tie" />
        </q-tab>
        <q-tab name="tab4" class="tab-item">
          <q-icon class="tab_icon" name="mdi-dev-to" />
        </q-tab>
        <q-tab name="tab5" class="tab-item">
          <q-icon class="tab_icon" name="mdi-phone" />
        </q-tab>
      </q-tabs>
    </div>
    <div class="tab-panels">
      <br />
      <q-tab-panels v-model="tab" animated swipeable>
        <q-tab-panel name="tab1">
          <div class="content">
            <q-icon class="tab_icon" name="mdi-account-circle-outline" />
            PESSOAL
            <br />
            Diogo de Oliveira Bezerra, 47 anos <br />
            Recife-PE Brasil <br />
            <br />
            <q-icon class="tab_icon" name="mdi-trophy-variant-outline" />
            VALORES
            <br />
            A resiliência é fator crucial diante das imperfeições. Há duas escolhas quando se
            compreende que saber de tudo é impossível: o vaidoso insiste que sabe enquanto o sábio
            segue adiante em busca das soluções e do auto-aprimoramento.
            <br /><br />
            <q-icon class="tab_icon" name="mdi-shield-sword-outline" />
            MISSÃO
            <br />
            Aprimorar-se e agregar valores reais com honestidade e firmeza, pois não há nada mais
            valioso que a consiência tranquila do dever cumprido.
          </div>
        </q-tab-panel>
        <q-tab-panel name="tab2">
          <div class="content">
            <q-icon class="tab_icon" name="mdi-school-outline" />
            FORMAÇÃO
            <br />
            Bacharel em Ciências Biológicas pela Universidade Federal de Pernambuco (2004)
            <br /><br />
            Curso Superior de Tecnologia em Análise e Desenvolvimento de Sistemas Unibratec (2008)
            <br /><br />
            Pós-Graduação Banco de Dados Oracle pela FBV/Apply Solutions
            <br />
          </div>
        </q-tab-panel>
        <q-tab-panel name="tab3">
          <div class="content">
            <q-icon class="tab_icon" name="mdi-school-outline" />
            EXPERIÊNCIA PROFISSIONAL <br />
            Desenvolvedor de software profissional há quase 20 anos
            <q-timeline color="primary">
              <q-timeline-entry
                title="Analista de Sistemas, Soluções e Desenvolvimento"
                subtitle="2008-2013"
                icon="mdi-clock-start"
              >
                <u>Rede Trabalho</u> <br />
                Projeto achequemfaz em parceria com grupo JCPM <br />
                Fullstack, APIs, Banco de Dados
              </q-timeline-entry>

              <q-timeline-entry
                title="Analista de Sistemas, Soluções e Desenvolvimento"
                subtitle="2014-2017"
                icon="mdi-update"
                color="orange"
              >
                <u>Associação dos Magistrados de Pernambuco</u> <br />
                Fullstack, APIs, Banco de Dados, Website, Aplicativos (Android|IOS) Redes e
                Infraestrutura
              </q-timeline-entry>

              <q-timeline-entry
                title="Analista de Sistemas, Soluções e Desenvolvimento"
                subtitle="2018"
                icon="mdi-check-circle"
                color="green"
              >
                <u>Produção autônoma</u> <br />
                Aplicações WEB e MOBILE, Fullstack e Banco de dados
              </q-timeline-entry>
              <q-timeline-entry
                title="Tech Lead, Analista de Sistemas, Soluções e Desenvolvimento"
                subtitle="2019-2024"
                icon="mdi-check-circle"
                color="green"
              >
                <u>Workfacilit/BRQ</u> <br />
                Aplicações WEB, Fullstack e Banco de dados <br />
                Infraestrutura e Hospedagem <br />
                Gerenciamento de Equipe <br />
                Estratégia Operacional e Tática <br />
                Segurança <br />
                Nível Executivo em soluções de TI
              </q-timeline-entry>
            </q-timeline>
            <br /><br />
          </div>
        </q-tab-panel>
        <q-tab-panel name="tab4">
          <div class="content">
            <q-icon class="tab_icon" name="mdi-dev-to" />
            VIVÊNCIA TÉCNICA <br />
            <q-icon class="tab_icon" name="mdi-laptop" />
            Backend
            <div class="row items-center q-gutter-sm q-mb-sm">
              <img src="/images/js.png" />
              <q-linear-progress :value="0.5" color="green" size="10px" rounded class="col" />
            </div>
          </div>
        </q-tab-panel>
        <q-tab-panel name="tab5">
          <div class="content">tab5</div>
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </q-page>
</template>

<style scoped>
.sticky-tabs {
  /* border: 1px solid aqua; */

  background: #333333;
  border-bottom: 1px solid #ccc;
  position: fixed;
  top: 150px;
  width: 100%;
  z-index: 1;
}

.page-wrapper {
  background-color: black;
  /* background-image: url('/images/bg2.jpg'); */
  background-size: cover;
  color: white;
  display: flex;
  flex-direction: column;
  font-family: 'aqum';
  height: 100%;
}

.tab_icon {
  font-size: 30px;
}

.tab-panels {
  /* border: 1px solid aqua; */
  background-color: #333333;
  margin-top: 40px;
  overflow-y: auto;
}

::v-deep(.q-tab-panels__container) {
  overflow-y: hidden !important;
}

::v-deep(.q-tab-panel) {
  overflow-y: hidden !important;
}

.content {
  background-color: #333333;
  margin: 10px;
  min-height: 70vh;
}

::v-deep(.q-tab-panels),
::v-deep(.q-tab-panels__container),
::v-deep(.q-tab-panel) {
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  padding: 0 !important;
  margin: 0 !important;
}

::v-deep(.q-timeline__title) {
  font-family: 'aqum';
  font-size: 16px;
  font-weight: bold;
  color: #fff;
}
</style>
