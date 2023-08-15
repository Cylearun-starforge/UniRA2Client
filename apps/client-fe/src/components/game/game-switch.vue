<script lang="ts" setup>
const props = defineProps({
  text: {
    type: String,
    required: true,
  },
  checked: {
    type: Boolean,
    required: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:checked']);

const emitUpdate = () => {
  if (props.disabled) {
    return;
  }
  emit('update:checked', !props.checked);
};
</script>

<template>
  <div :class="disabled ? ['game-switch-root', 'flex', 'game-switch-disabled'] : ['game-switch-root', 'flex']">
    <div
      :class="`game-switch-button ${checked ? 'game-switch-selected' : ''} ${
        disabled ? 'game-switch-button-disabled' : ''
      }`"
      @click="emitUpdate"
    ></div>
    {{ text }}
  </div>
</template>

<style scoped>
.game-switch-root {
  height: 32px;
  align-items: center;
  color: rgb(134, 200, 217);
}

.game-switch-button {
  width: 24px;
  height: 24px;
  margin-right: 4px;
  --bg-url:url('/game/switch_box.png');
  background-image: VAR(--bg-url);
  background-size: contain;
  background-repeat: no-repeat;
}

.game-switch-button {
  cursor: pointer;
}

.game-switch-button:not(.game-switch-selected):not(.game-switch-button-disabled):hover {
  background-image: var(--bg-url), radial-gradient(circle, rgba(0, 192, 255, 0.8) 0 10%, transparent 50%);
}

.game-switch-selected {
  background-image: var(--bg-url), radial-gradient(circle, rgb(0, 192, 255) 0 10%, transparent 50%);
}

.game-switch-disabled {
  filter: grayscale(1);
}

.game-switch-button-disabled {
  cursor: not-allowed;
}
</style>
