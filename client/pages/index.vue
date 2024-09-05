<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useDevtoolsClient } from "@nuxt/devtools-kit/iframe-client";

const analysisResult = ref("");
const isLoading = ref(false);

const devtoolsClient = useDevtoolsClient();

async function runAnalysis() {
  if (!devtoolsClient.value) return;

  isLoading.value = true;
  try {
    const rpc =
      devtoolsClient.value.devtools.extendClientRpc("vue-mess-detector");
    analysisResult.value = await rpc.analyze();
  } catch (error) {
    console.error("Error running analysis:", error);
    analysisResult.value = `Error running analysis: ${JSON.stringify(
      error,
      null,
      2
    )}`;
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div>
    <h1>Vue Mess Detector Analysis</h1>
    <button :disabled="isLoading" @click="runAnalysis">
      {{ isLoading ? "Running..." : "Run Analysis" }}
    </button>
    <pre v-if="analysisResult">{{ analysisResult }}</pre>
  </div>
</template>

<style scoped>
button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
}
</style>
