<!-- eslint-disable vue/no-v-html -->
<!-- eslint-disable vue/no-v-html -->
<script setup lang="ts">
import { onDevtoolsClientConnected } from '@nuxt/devtools-kit/iframe-client'
import type { BirpcReturn } from 'birpc'
import type {
  AnalysisResult,
  ClientFunctions,
  ServerFunctions,
} from '../../rpc-types'
import { ref } from '#imports'

const results = ref<AnalysisResult>({} as AnalysisResult)
const loading = ref(false)

const showButton = ref(false)
let rpc: BirpcReturn<ServerFunctions, ClientFunctions>

const getAnalysisReport = async () => {
  loading.value = true
  results.value = await rpc.getResults()
  loading.value = false
}

onDevtoolsClientConnected(async (client) => {
  rpc = client.devtools.extendClientRpc<ServerFunctions, ClientFunctions>(
    'vueMessDetector',
    { _doNothing: () => {} },
  )
  getAnalysisReport()
  showButton.value = true
})

const htmlize = (str: string) => {
  const urlPattern = /(\bhttps:\/\/[-\w+&@#/%?=~|!:,.;]*[-\w+&@#/%=~|])/gi
  str = str.replace(
    urlPattern,
    '🔗 <a href="$1" target="_blank" rel="noopener noreferrer">$1</a>',
  )

  return str
    .replace(/<bg_err>/g, '<span class="bg-err">')
    .replace(/<bg_warn>/g, '<span class="bg-warn">')
    .replace(/<bg_info>/g, '<span class="bg-info">')
    .replace(/<bg_ok>/g, '<span class="bg-ok">')
    .replace(/<\/bg_err>|<\/bg_warn>|<\/bg_info>|<\/bg_ok>/g, '</span>')
    .replace(/<text_warn>/g, '<span class="text-warn">')
    .replace(/<text_info>/g, '<span class="text-info">')
    .replace(/<\/text_warn>|<\/text_info>/g, '</span>')
    .replace(/\n/g, '<br>')
}
</script>

<template>
  <section>
    <h1>
      Vue Mess Detector Analysis

      <button
        v-show="showButton"
        @click="getAnalysisReport"
      >
        Refresh Report
      </button>
    </h1>

    <main v-show="loading">
      <h2>Loading...</h2>
    </main>

    <main v-show="!loading && results.output">
      <h2>Overview</h2>
      <ul>
        <li
          v-for="item in results.output"
          :key="item.info"
        >
          <p v-html="htmlize(item.info)" />
        </li>
      </ul>

      <h2>Analysis Report</h2>
      <ul>
        <li
          v-for="(item, key) in results.reportOutput"
          :key="key"
        >
          <h3 v-html="htmlize(key)" />
          <ul>
            <li
              v-for="message in item"
              :key="message.id"
            >
              <p v-html="htmlize(message.id)" />
              <p v-html="htmlize(message.description)" />
              <p v-html="htmlize(message.message)" />
            </li>
          </ul>
        </li>
      </ul>

      <h2>Code Health</h2>
      <ul>
        <li
          v-for="item in results.codeHealthOutput"
          :key="item.info"
        >
          <p v-html="htmlize(item.info)" />
        </li>
      </ul>
    </main>
  </section>
</template>

<style scoped>
section {
  padding: 0.5rem;
}

h1 {
  font-size: 2rem;
  margin-top: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
button {
  background-color: #2ecc71;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.25em;
  cursor: pointer;
  font-size: 1rem;
}

h2 {
  font-size: 1.5rem;
  margin-top: 1.5rem;
}

ul ul {
  padding-left: 1rem;
}

li {
  padding: 0.5em;
  border-radius: 0.25em;
}

ul ul li:nth-child(even) {
  background-color: #222;
}

:deep a {
  text-decoration: underline;
}
:deep(.bg-info) {
  background-color: #3498db;
  color: #fff;
}

:deep(.bg-warn) {
  background-color: #f39c12;
  color: #000;
}

:deep(.bg-err) {
  background-color: #e74c3c;
  color: #fff;
}

:deep(.bg-ok) {
  background-color: #2ecc71;
  color: #000;
}

:deep(.text-warn) {
  color: #f39c12;
}

:deep(.text-info) {
  color: #3498db;
}
</style>
