<script setup lang="ts">
import FixSize from '@/components/fix-sized-view.vue';
import HomeBackground from '@/components/home/home-background.vue';
import ScrollInfo from '@/components/home/scroll-info.vue';
import ButtonGroup from '@/components/home/button-group.vue';
import LadderPanel from '@/components/home/ladder-panel.vue';
import VersionTag from '@/components/home/version-tag.vue';
import UserInfo from '@/components/user/user-info.vue';
import AlphaButton from '@/components/alpha-button.vue';
import { invoke } from '@tauri-apps/api';
import { useApiStore } from '@/stores/api-store';

const closeApp = () => {
  invoke('cmd_exit_app')
}

const apiStore = useApiStore();
apiStore.loadMap()

</script>

<template>
  <home-background />
  <fix-size class="home-view-container" :width="1380" :height="768">
    <div class="row flex">
      <div class="col flex flex-col">
        <div class="top">
          <scroll-info />
        </div>
        <div class="bottom">
          <button-group />
        </div>
      </div>
      <div class="col flex flex-col">
        <div class="flex">
          <ladder-panel />
        </div>
        <div class="fake-padding-block"></div>
        <alpha-button background="/home/buttons/options.png" class="options-button" disabled>
          <div class="zh">游戏设置</div>
          <div class="en">OPTIONS</div>
        </alpha-button>
        <user-info class="user-info" username="用户名test" />
        <alpha-button background="/home/buttons/exit.png" class="exit-button" @click="closeApp">
          <div class="zh">退出游戏</div>
          <div class="en">EXIT</div>
        </alpha-button>
      </div>
    </div>
  </fix-size>
  <alpha-button background="/home/buttons/button_logo.png" class="logo-button"></alpha-button>
  <version-tag class="version-tag" />
</template>

<style scoped>
.home-view-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
}

.row {
  gap: 72px;
  padding: 0;

  width: 100%;
  height: 100%;
}

@media screen and (max-width: 1700px) {
  .row {
    gap: 36px;
  }
}

@media screen and (max-width: 1500px) {
  .row {
    gap: 12px;
    padding: 12px;
    width: 1280px;
  }
}

.col {
  height: 100%;
  width: 100%;
}

.col>.top {
  height: 35%;
  width: 100%;
}

.col>.bottom {
  width: 100%;
  height: 64.3%;
}

.logo-button {
  position: absolute;

  right: 0;
  top: 3.8%;
  width: 190px;
  height: 215px;
}

.version-tag {
  position: absolute;
  bottom: -4px;
  left: -16px;

  transform: scale(0.85);
}

.fake-padding-block {
  height: 50px;
}

.options-button {
  width: 33.23%;
  height: 11.48%;
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100% 100%;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  font-size: 22px;
  align-self: flex-end;
  margin-right: 116px;
}

.options-button>.zh {
  color: white;
}

.options-button>.en {
  color: white;
}

.user-info {
  height: 30%;
  align-self: flex-end;
}

.exit-button {
  width: 33.23%;
  height: 11.48%;
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100% 100%;
  font-size: 22px;
  align-self: flex-end;
  display: flex;
  margin-right: 48px;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
}

.exit-button>.zh {
  color: white;
  width: 55%;
  text-align: left;
}

.exit-button>.en {
  color: white;
  width: 55%;
  text-align: left;
}
</style>
