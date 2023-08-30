<script lang="ts" setup>
import { PropType } from 'vue';
import AlphaButton from './alpha-button.vue';
import { RouteLocationRaw, RouterLink } from 'vue-router';
const props = defineProps({
  class: {
    type: String,
    default: '',
  },
  to: {
    type: [String, Object] as PropType<RouteLocationRaw>,
    default: '/'
  },
  text: {
    type: String,
    default: '返回主菜单'
  }
});
</script>
<template>
  <alpha-button background="/basic/button.png" :class="['back-button', props.class]">
    <router-link :to="props.to">
      <div class="zh">{{ text }}</div>
      <div class="en">BACK</div>
    </router-link>
  </alpha-button>
</template>

<style scoped>
.back-button {
  position: absolute;
  bottom: 40px;
  right: 40px;
  width: 211px;
  height: 84px;

  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center;
}

.back-button>a {
  text-decoration: none;
}

.back-button .zh,
.back-button .en {
  color: white;
  text-align: center;
  font-size: 24px;
  padding-left: 8px;
}
</style>
