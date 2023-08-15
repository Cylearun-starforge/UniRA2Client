<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';

const images = [
  '/home/info/A1.png',
  '/home/info/A2.png',
  '/home/info/A1.png',
  '/home/info/A2.png',
];

const imageNodes = images.map(image => {
  return {
    src: image,
    ref: ref<HTMLImageElement>(),
    width: 0,
  };
});

const slideData = ref(0);

const offset = computed(() => {
  let offset = 0;
  for (let i = 0; i < slideData.value; i++) {
    if (i === imageNodes.length - 1) {
      break;
    }
    const imageNode = imageNodes[i];
    offset += imageNode.ref.value!.clientWidth;
  }
  return offset;
});

let timer: number
onMounted(() => {
  timer = setInterval(() => {
    slideData.value = Math.floor((slideData.value + 1) / images.length)
  }, 2000) as unknown as number
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer);
  }
})
</script>

<template>
  <div class="container">
    <div class="title flex">
      <div class="zh">资讯</div>
      <div class="en">NEW INFORMATION</div>
    </div>
    <div class="mask">
      <div class="info-list" :style="{ transform: `translateX(-${offset}px)` }">
        <img v-for="(img, i) in imageNodes" :key="i" class="info-img" :src="img.src" :ref="img.ref" />
      </div>
      <img class="info-border" src="/home/info/border.png" draggable="false" />
      <div class="dots-box flex">
        <div v-for="(_, i) in imageNodes" :key="i" class="dot" @click="slideData = i"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.title {
  --bg-url: url('/basic/message_box.png');
  background-image: var(--bg-url);
  background-repeat: no-repeat;
  background-position: left center;
  background-size: 100% 100%;
  padding: 0 24px;
  width: fit-content;
  z-index: 10;
  height: 50px;
  font-size: 33px;
  align-items: center;
}

.title .zh {
  font-family: '汉仪综艺体';
  width: fit-content;
}

.title .en {
  font-family: Marske;
  margin-left: 4px;
}

.mask {
  --bg-url: url('/home/info/alpha.png');
  -webkit-mask-image: var(--bg-url);
  -webkit-mask-position: center;
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-size: contain;
  width: 100%;
  position: absolute;
  top: 25px;
}

.info-list {
  display: flex;
  width: 100%;
  transition: linear 1s;
}

.info-img {
  width: 100%;
  object-fit: contain;
}

.dots-box {
  position: absolute;
  bottom: 48px;
  width: 30%;
  left: 50%;
  transform: translateX(-50%);
  justify-content: space-evenly;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.6);
  transition: linear 0.5s;
  cursor: pointer;
}

.dot:hover {
  background-color: rgba(255, 255, 255, 0.8);
}

.info-border {
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  transform: translateY(-50%);
  object-fit: contain;
}
</style>
