<script setup lang="ts">
import AlphaButton from '@/components/alpha-button.vue';
import { useMapSets } from '@/stores/game-mode';
import { effect } from 'vue';
import { RouterLink, useRouter } from 'vue-router';

const router = useRouter();
const state = useMapSets();
effect(() => {
  state.loadMapSets();
})
</script>
<template>
  <div class="container flex">
    <div class="col col-1 flex flex-col">
      <button class="campaign">
        <router-link to="/campaign" >
          <div class="zh">战役</div>
          <div class="en">CAMPAIGN</div>
        </router-link>
      </button>
    </div>
    <div class="col col-2 flex flex-col">
      <alpha-button background="home/buttons/conquer.png" class="conquer" disabled>
        <div class="zh">征服之旅</div>
        <div class="en">CONQUER</div>
      </alpha-button>

      <button class="skirmish" :disabled="!state.state.ready">
        <router-link to="/skirmish">
          <div class="zh">自定义游戏</div>
          <div class="en">SKIRMISH</div>
        </router-link>
      </button>
    </div>
    <div class="col col-3 flex flex-col">
      <div class="col-3-fake"></div>
      <alpha-button background="home/buttons/load_mission.png" class="load-mission" disabled>
        <div class="zh">载入存档</div>
        <div class="en">LOADMISSION</div>
      </alpha-button>
      <alpha-button background="home/buttons/difficult_activity.png" class="activity" disabled
        @click="() => router.push({ path: '/difficult-activity' })">
        <div class="zh">巅峰活动</div>
        <div class="en">DIFFICULT ACTIVITY</div>
      </alpha-button>
    </div>
  </div>
</template>

<style scoped>
.container {
  width: 100%;
  height: 100%;
}

.col {
  height: 100%;
}

.col-1 {
  width: 36.5%;
}

.col-2 {
  width: 30.4%;
}

.col-3 {
  width: 33.3%;
}

.container .zh {
  font-family: '汉仪综艺体';
  line-height: 1;
}

.container .en {
  font-family: 'Marske';
  line-height: 1;
}

.container div,
.container button {
  font-size: 40px;
  color: white;
  background-color: transparent;
}

.campaign {
  height: 56.8%;
  top: 11.37%;
  background-color: transparent;
  border-width: 0;
  background-size: 100% 100%;
  background-image: url("/home/buttons/campaign.png");
  background-position: center;
  clip-path: polygon(25% 2.8%, 73% 3%, 96% 26%, 96% 72%, 72% 98%, 51.4% 98%, 5% 52%, 5% 18%);
}

/* Style for vue-router link element */
.col>button>a {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.campaign .zh {
  font-size: 150%;
  position: absolute;
  right: 8%;
  top: 25%;
}

.campaign .en {
  position: absolute;
  right: 8%;
  top: 48%;
}

.conquer {
  height: 49.68%;
  background-size: 100% 100%;
}

.conquer .zh {
  width: 50%;
  position: absolute;
  left: 8%;
  bottom: 20%;
}

.conquer .en {
  font-size: 65%;
  position: absolute;
  left: 9%;
  bottom: 8%;
}

.skirmish {
  height: 50.49%;
  background-size: 100% 100%;
  background-image: url("/home/buttons/skirmish.png");
  clip-path: polygon(22% 2%, 73% 2%, 96% 24%, 97% 70%, 72% 95%, 51% 95%, 3% 52%, 3% 20%);
}

.skirmish .zh {
  width: 65%;
  text-align: right;
  position: absolute;
  right: 8%;
  top: 25%;
}

.skirmish .en {
  font-size: 70%;
  position: absolute;
  right: 9%;
  top: 60%;
}

.col-3-fake {
  height: 21.1%;
  cursor: initial !important;
}

.load-mission {
  height: 20.1%;
  background-size: 100% 100%;
}

.load-mission .zh {
  font-size: 60%;
  position: absolute;
  left: 8%;
  top: 25%;
}

.load-mission .en {
  font-size: 69%;
  position: absolute;
  left: 8%;
  top: 56%;
}

.activity {
  height: 52.9%;
  background-size: 100% 100%;
}

.activity .zh {
  font-size: 73%;
  position: absolute;
  left: 9%;
  top: 27%;
}

.activity .en {
  font-size: 69%;
  position: absolute;
  left: 10%;
  top: 41%;
  text-align: left;
}

.container>.col>div {
  /* cursor: pointer; */
}
</style>
