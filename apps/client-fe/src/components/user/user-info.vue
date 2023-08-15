<script setup lang="ts">
import AlphaButton from '@/components/alpha-button.vue';

const props = defineProps({
  username: {
    type: String,
    required: true,
  },
  team: {
    type: String,
  },
  title: {
    type: String,
  },
  hideLogout: {
    type: Boolean,
    default: false,
  },
});
</script>
<template>
  <div class="container">
    <div class="info-box flex flex-col">
      <div class="username">
        {{ props.username }}
      </div>

      <div class="team">
        {{ props.team ?? '<无战队>' }}
      </div>

      <div class="title">
        {{ props.title ?? '<称号测试>' }}
      </div>
      <div class="image-box avatar-box">
        <img src='/user/avatar.png' class="avatar" draggable="false" />
      </div>
      <div class="image-box level-box">
        <img src="/user/level.png" class="level" draggable="false" />
      </div>
    </div>
    <alpha-button background="/basic/button.png" class="logout-button" v-if="!hideLogout">
      <div class="zh">登出账号</div>
    </alpha-button>
  </div>
</template>

<style scoped>
.container {
  max-width: 471px;
  max-height: 298px;
  height: 100%;
  width: 100%;
}

.info-box {
  width: 76.43%;
  height: 80.53%;
  background-image: url('/user/info.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  justify-content: center;
}

.info-box>div:not(.image-box) {
  width: 90%;
  text-align: right;
}

.info-box>.username {
  font-size: 40px;
}

.info-box>.team {
  font-size: 22px;
}

.info-box>.title {
  font-size: 22px;
}

.image-box {
  position: absolute;
  background-image: url('/user/box.png');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.avatar-box {
  position: absolute;
  width: 36.09%;
  height: 56.67%;
  right: -22%;
  top: 8px;
}

.avatar {
  padding: 16px;
  position: absolute;
  width: 100%;
  height: 100%;
  position: absolute;
  object-fit: contain;
  object-fit: contain;
  object-position: center;
  box-sizing: border-box;
}

.level-box {
  width: 25.05%;
  height: 39.6%;
  right: -8%;
  bottom: -10%;
}

.level {
  padding: 12px;
  position: absolute;
  width: 100%;
  height: 100%;
  position: absolute;
  object-fit: contain;
  object-fit: contain;
  object-position: center;
  box-sizing: border-box;
}

.logout-button {
  width: 34.69%;
  height: 22.64%;
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100% 100%;
  position: absolute;
  left: 32%;
  bottom: 1%;
  min-height: 40px;
}

.zh {
  color: white;
  font-size: 20px;
}
</style>
