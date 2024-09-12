<script setup lang="ts">
import { onDevtoolsClientConnected } from "@nuxt/devtools-kit/iframe-client";
import type { AnalysisResult } from "../../rpc-types";

const result = ref<AnalysisResult>({} as AnalysisResult);

onDevtoolsClientConnected(async (client) => {
  console.log("onDevtoolsClientConnected");
  const rpc = client.devtools.rpc;
  try {
    const analysisResults = await rpc.vueMessDetector.getResults();
    result.value = analysisResults;
  } catch (error) {
    console.error("Failed to fetch analysis results:", error);
  }
});
</script>

<template>
  <div>
    <h1>Vue Mess Detector Analysis</h1>
    <pre>{{ result }}</pre>
  </div>
</template>

<style scoped></style>
