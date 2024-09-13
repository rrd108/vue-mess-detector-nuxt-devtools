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

const htmlize = (str: string) => {
  const urlPattern =
    /(\bhttps:\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
  str = str.replace(
    urlPattern,
    '🔗 <a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
  );

  return str
    .replace(/<bg_err>/g, '<span class="bg-err">')
    .replace(/<bg_warn>/g, '<span class="bg-warn">')
    .replace(/<bg_info>/g, '<span class="bg-info">')
    .replace(/<bg_ok>/g, '<span class="bg-ok">')
    .replace(/<\/bg_err>|<\/bg_warn>|<\/bg_info>|<\/bg_ok>/g, "</span>")
    .replace(/<text_warn>/g, '<span class="text-warn">')
    .replace(/<text_info>/g, '<span class="text-info">')
    .replace(/<\/text_warn>|<\/text_info>/g, "</span>")
    .replace(/\n/g, "<br>");
};
</script>

<template>
  <div>
    <h1>Vue Mess Detector Analysis</h1>
    <h2>Overview</h2>
    <ul>
      <li v-for="item in result.output">
        <p v-html="htmlize(item.info)"></p>
      </li>
    </ul>

    <h2>Report</h2>
    <ul>
      <li v-for="(item, key) in result.reportOutput">
        <h3 v-html="htmlize(key)"></h3>
        <ul>
          <li v-for="rule in item">
            <p v-html="htmlize(rule.id)"></p>
            <p v-html="htmlize(rule.description)"></p>
            <p v-html="htmlize(rule.message)"></p>
          </li>
        </ul>
      </li>
    </ul>

    <h2>Code Health</h2>
    <ul>
      <li v-for="item in result.codeHealthOutput">
        <p v-html="htmlize(item.info)"></p>
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
