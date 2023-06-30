<script lang="ts" setup>
import { GameMap } from '@/game/map';
import { PropType, reactive, onMounted } from 'vue';

const props = defineProps({
  map: {
    type: Object as PropType<GameMap>,
    required: true,
  },
});

defineEmits({
  select: null,
});


const cover = reactive({
  ready: false,
  value: '',
})

const loadMap = async () => {
  const map = props.map
  if (!map) {
    return;
  }
  cover.value = await map.cover;
  console.log('map', cover.value)
  cover.ready = true;
}

onMounted(loadMap)

</script>

<template>
  <div class="map-preview-item-root" @click="$emit('select')">
    <img :src="cover.value" />
    <!-- <div class="desc">
      <div class="en">{{ map.name.en }}</div>
      <div class="zh">{{ map.name.zh }}</div>
    </div> -->
    <!-- <div class="player-count-box">
      <div class="extra-gradient flex">
        <div class="count">{{ map.playerLimit[0] }} - {{ map.playerLimit[1] }}</div>
        <div>Players</div>
      </div>
    </div> -->
  </div>
</template>

<style scoped>
.map-preview-item-root {
  width: 320px;
  height: 104px;
  background-image: url('/game/map/map_border.png');
  background-size: 100% 100%;
  cursor: pointer;
}

.map-preview-item-root>img {
  width: 100%;
  height: 100%;
  padding: 13px;
}

.desc {
  position: absolute;
  right: 30px;
  top: 50%;
  transform: translateY(-50%);

  text-align: right;
  --shadow-blur-color: 2px rgba(0, 0, 0, 0.8);
  text-shadow: 2px 0 var(--shadow-blur-color), -2px 0 var(--shadow-blur-color), 0 var(--shadow-blur-color),
    0 -2px var(--shadow-blur-color);
  color: rgb(153, 188, 235);
}

.desc>.en {
  font-size: 46px;
}

.desc>.zh {
  font-size: 24px;
  font-family: '汉仪细等线';
  font-weight: bolder;
}

.player-count-box {
  position: absolute;
  width: 40%;
  left: 11px;
  top: 16px;
  background-image: linear-gradient(to right, rgba(3, 98, 161, 0.48) 0 35%, transparent);
  padding: 2px 0;
}

.player-count-box>.extra-gradient {
  width: 100%;
  padding: 4px;
  background-image: linear-gradient(to right, rgba(3, 98, 161, 0.68) 0 35%, transparent);
  align-items: flex-end;
  color: white;
}

.player-count-box div {
  font-family: BureauAgency;
  font-size: 16px;
  letter-spacing: 2px;
}

.player-count-box .count {
  font-size: 26px;
  margin-right: 4px;
  letter-spacing: normal;
}
</style>
