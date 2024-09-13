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
    {
      showNotification: (message: string) => {
        console.log(message);
      },
    }
  );

  result.value = await rpc.getResults();
  console.log(result.value);
});
</script>

<template>
  <div>
    <h1>Vue Mess Detector Analysis</h1>
    <h2>Output</h2>
    <ul>
      <li v-for="item in result.output">
        {{ item.info }}
      </li>
    </ul>

    <h2>Report Output</h2>
    <ul>
      <li v-for="(item, key) in result.reportOutput">
        {{ key }}
        <ul>
          <li v-for="rule in item">
            {{ rule.id }}
            {{ rule.description }}
            {{ rule.message }}
          </li>
        </ul>
      </li>
    </ul>

    <h2>Code Health Output</h2>
    <ul>
      <li v-for="item in result.codeHealthOutput">
        {{ item.info }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
h1 {
  font-size: 2rem;
  margin-top: 2rem;
}
h2 {
  font-size: 1.5rem;
  margin-top: 1.5rem;
}
</style>
