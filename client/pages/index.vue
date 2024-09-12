<script setup lang="ts">
import { onDevtoolsClientConnected } from "@nuxt/devtools-kit/iframe-client";
import type { ServerFunctions } from "../../rpc-types";

const result = ref("");

onDevtoolsClientConnected(async (client) => {
  console.log("onDevtoolsClientConnected");

  // Use the correct RPC structure
  const rpc = client.devtools.rpc as unknown as ServerFunctions;

  // Call server RPC function
  result.value = await rpc.getResults();

  // You can also call the showNotification method if needed
  // client.devtools.rpc.broadcast.showNotification("Results fetched successfully")
});
</script>

<template>
  <div>
    <h1>Vue Mess Detector Analysis</h1>
    <pre>{{ result }}</pre>
  </div>
</template>

<style scoped></style>
