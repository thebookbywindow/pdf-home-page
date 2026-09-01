<template>
  <div class="quota-wrap">
      <span class="quota-badge" id="quota-badge" :tabindex="official ? 0 : undefined" :aria-label="official ? 'View quota options' : undefined">
      <img v-if="official" class="quota-badge-icon" :src="vector1" alt="" width="14" height="14">
      <span v-else class="material-symbols-rounded quota-badge-icon" aria-hidden="true">bolt</span>
        <span id="quota-text" v-html="official ? 'Sign in to get more free uses' : '<strong>0</strong> of 0 free uses left today'"></span>
        <span v-if="official" class="quota-client-note" id="client-quota-text" hidden></span>
    </span>
      <button v-if="!official" class="quota-info-btn" type="button" id="quota-info" aria-label="Quota rules" title="Quota rules">
      {{ official ? "Get more uses" : "i" }}
    </button>
    <div class="quota-tooltip" id="quota-tooltip" role="tooltip"></div>
  </div>
</template>

<script setup>
import vector1 from "../../../images/tool-hero/vector-1.svg";

defineProps({ official: Boolean });
</script>
