<script lang="ts" setup>
defineEmits(['click']);
</script>
<template>
  <button @click="$emit('click', $event)">
    <img src="/user/box.png" draggable="false" />
    <img src="/game/plus.png" class="icon" draggable="false" />
  </button>
</template>

<style scoped>
button {
  width: 86.75px;
  height: 86.75px;
  background-color: transparent;
  border-width: 0;
  padding: 0;
}

img {
  width: 100%;
  height: 100%;
}

button:hover {
  cursor: pointer;
}

.icon {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 50%;
  height: 50%;
}
</style>
