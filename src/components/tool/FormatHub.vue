<template>
  <div class="format-hub" id="format-hub">
    <div :class="tool.type === '3d-conversion' ? 'format-hub-grid format-hub-grid--aligned' : 'format-hub-grid'">
      <div :class="tool.type === '3d-conversion' ? 'format-group format-group--from' : 'format-group'">
        <h4 :class="{ 'format-group-title': tool.type === '3d-conversion' }">Convert from</h4>
        <div class="format-chips" id="chips-from" role="listbox" aria-label="Input format"></div>
      </div>
      <div class="format-arrow" aria-hidden="true"><span class="material-symbols-rounded">arrow_forward</span></div>
      <div :class="tool.type === '3d-conversion' ? 'format-group format-group--to' : 'format-group'">
        <h4 :class="{ 'format-group-title': tool.type === '3d-conversion' }">Convert to</h4>
        <div class="format-chips" id="chips-to" role="listbox" aria-label="Output format"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({ tool: { type: Object, required: true } });
</script>
