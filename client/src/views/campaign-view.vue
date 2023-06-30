<script setup lang="ts">
import CampaignBackground from '@/components/campaign/campaign-background.vue';
import UserInfo from '@/components/user/user-info.vue';
import AlphaButton from '@/components/alpha-button.vue';
import BackButton from '@/components/back-button.vue';
</script>
<template>
  <campaign-background />
  <div class="campaign-view-root">
    <div class="campaign-container">
      <div class="mission-button-list-left flex flex-col">
        <alpha-button background="/campaign/fake_mission1.png" class="button">
          <div class="button-content-container flex flex-col">
            <div class="zh">《虚幻》新战役</div>
            <div class="en">CAMPAIGN</div>
          </div>
        </alpha-button>
        <alpha-button background="/campaign/fake_mission2.png" class="button">
          <div class="button-content-container flex flex-col">
            <div class="zh">额外战役</div>
            <div class="en">CONTENT PACK</div>
          </div>
        </alpha-button>
      </div>
      <div class="right-list flex flex-col">
        <user-info username="用户名test" class="user-info" :hide-logout="true" />

        <alpha-button background="/campaign/load_mission.png" class="button">
          <div class="zh">载入存档</div>
          <div class="en">LOAD MISSION</div>
        </alpha-button>

        <alpha-button background="/campaign/archives.png" class="button">
          <div class="zh">档案库</div>
          <div class="en">ARCHIVES</div>
        </alpha-button>

        <alpha-button background="/campaign/fan_mission.png" class="button">
          <div class="zh">非官方战役</div>
          <div class="en">FAN MISSION</div>
        </alpha-button>
      </div>
      <back-button class="back-button" />
    </div>
  </div>
</template>

<style scoped>
.campaign-view-root {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
}

.campaign-container {
  width: 100%;
  height: 100%;
}

.mission-button-list-left {
  position: absolute;
  width: 40.52%;
  height: 100%;
  left: 152px;
  top: 146px;
}

.mission-button-list-left > .button {
  width: 100%;
  padding: 0;
  height: 19.92%;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center;
  margin-bottom: 8px;
}

.mission-button-list-left .button-content-container {
  background-image: url('/campaign/mission_box.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center;

  height: 100%;
  justify-content: center;
  align-items: center;
}

.button-content-container > .zh,
.button-content-container > .en {
  color: rgb(134, 200, 217);
  font-size: 40px;
  text-align: left;
  width: 80%;
}

.right-list {
  position: absolute;
  right: 1.67%;
  top: 4.07%;
  width: 30.48%;
  height: 100%;

  align-items: center;
}

.user-info {
  width: 100%;
  height: 27.59%;
}

.right-list > .button {
  width: 54.68%;
  padding: 0;
  height: 11.48%;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center;
}

.right-list > .button > .zh,
.right-list > .button > .en {
  color: white;
  text-align: right;
  font-size: 20px;
  width: 90%;
}

.back-button {
  position: absolute;
  right: 48px;
  bottom: 48px;
}
</style>
