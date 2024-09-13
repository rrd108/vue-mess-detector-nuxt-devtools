<script setup lang="ts">
import { onDevtoolsClientConnected } from "@nuxt/devtools-kit/iframe-client";
import type {
  AnalysisResult,
  ClientFunctions,
  ServerFunctions,
} from "../../rpc-types";

const result = ref<AnalysisResult>({} as AnalysisResult);

onDevtoolsClientConnected(async (client) => {
  console.log("onDevtoolsClientConnected");
  const rpc = client.devtools.extendClientRpc<ServerFunctions, ClientFunctions>(
    "vueMessDetector",
    { _doNothing: () => {} }
  );

  result.value = await rpc.getResults();
  console.log(result.value);
});

const beautify = (str: string) =>
  str
    .replace(/<bg_err>/g, '<span class="bg-err">')
    .replace(/<bg_warn>/g, '<span class="bg-warn">')
    .replace(/<bg_info>/g, '<span class="bg-info">')
    .replace(/<bg_ok>/g, '<span class="bg-ok">')
    .replace(/<\/bg_err>|<\/bg_warn>|<\/bg_info>|<\/bg_ok>/g, "</span>")
    .replace(/<text_warn>/g, '<span class="text-warn">')
    .replace(/<text_info>/g, '<span class="text-info">')
    .replace(/<\/text_warn>|<\/text_info>/g, "</span>");
</script>

<template>
  <div>
    <h1>Vue Mess Detector Analysis</h1>
    <h2>Output</h2>
    <ul>
      <li v-for="item in result.output">
        <p v-html="beautify(item.info)"></p>
      </li>
    </ul>

    <h2>Report Output</h2>
    <ul>
      <li v-for="(item, key) in result.reportOutput">
        <h3 v-html="beautify(key)"></h3>
        <ul>
          <li v-for="rule in item">
            <p v-html="beautify(rule.id)"></p>
            <p v-html="beautify(rule.description)"></p>
            <p v-html="beautify(rule.message)"></p>
          </li>
        </ul>
      </li>
    </ul>

    <h2>Code Health Output</h2>
    <ul>
      <li v-for="item in result.codeHealthOutput">
        <p v-html="beautify(item.info)"></p>
      </li>
    </ul>
  </div>
</template>

<style scoped>
div {
  padding: 0.5rem;
}
h1 {
  font-size: 2rem;
  margin-top: 2rem;
}
h2 {
  font-size: 1.5rem;
  margin-top: 1.5rem;
}

ul ul {
  padding-left: 1rem;
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
