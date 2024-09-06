<script setup lang="ts">
import { Readable } from "stream";
import { onDevtoolsClientConnected } from "@nuxt/devtools-kit/iframe-client";

const result = ref("");

onDevtoolsClientConnected(async (client) => {
  const rpc = client.devtools.extendClientRpc("vue-mess-detector", {
    displayLsResults: (results: string | Readable) => {
      if (results instanceof Readable) {
        // Convert Readable stream to string
        const chunks: string[] = [];
        results.on("data", (chunk) => chunks.push(chunk.toString()));
        results.on("end", () => {
          result.value = chunks.join("");
        });
      } else {
        result.value = results;
      }
    },
  });
});
</script>

<template>
  <div>
    <h1>Vue Mess Detector Analysis</h1>
    <button>Run Analysis</button>
    {{ result ? "Loading" : result }}
  </div>
</template>

<style scoped>
div {
  padding: 1em;
}
h1 {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1em;
}
button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
}
</style>
