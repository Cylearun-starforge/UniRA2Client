<script setup lang="ts">
import BackgroundView from '@/components/difficult-activity/BackgroundView.vue';
import UserInfo from '@/components/user/user-info.vue';
import BackButton from '@/components/back-button.vue';
</script>

<template>
  <background-view />
  <div class="view-container">
    <div class="content-container">
      <div class="left-side">
        <div class="item">
          <img class="raid-logo" src="/difficult-activity/raid/old_haunt_logo.png" alt="raid-logo" />
          <img class="raid-text" src="/difficult-activity/raid/old_haunt.png" alt="raid-text" />
        </div>
        <div class="item">
          <img class="raid-logo" src="/difficult-activity/raid/sum_temple_logo.png" alt="raid-logo" />
          <img class="raid-text" src="/difficult-activity/raid/sum_temple.png" alt="raid-text" />
        </div>
        <div class="item">
          <img class="raid-logo" src="/difficult-activity/raid/storm-logo.png" alt="raid-logo" />
          <img class="raid-text" src="/difficult-activity/raid/storm.png" alt="raid-text" />
        </div>
      </div>
      <div class="right-side">
        <user-info username="用户名galaxyx" class="user-info" :hide-logout="true" />
      </div>
    </div>
  </div>
  <back-button></back-button>
</template>

<style scoped>
.view-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
}

.content-container {
  width: 100%;
  height: 100%;
  padding: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.left-side {
  /* position: relative; */
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}

.item {
  /* position: relative; */
  display: flex;
  justify-content: center;
  align-items: center;
}

.item:nth-child(2n + 1) {
  left: min(253px, 13vw);
}

.raid-logo {
  max-width: 327px;
  max-height: 327px;
  width: 17vw;
  height: 17vw;
}

.raid-text {
  max-width: 366px;
  max-height: 147px;
  width: 19vw;
  height: 7.6vw;
}

.right-side {
  align-self: flex-start;
}

.user-info {
  width: min(471px, 24.5vw);
  height: min(298px, 15.5vw);
}
</style>
