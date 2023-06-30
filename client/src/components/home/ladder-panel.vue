<template>
  <div class="flex flex-col">
    <div class="title flex">
      <div class="zh">多人游戏</div>
      <div class="en">PVP</div>
    </div>
    <div class="flex" style="gap: 12px">
      <div class="button ladders">
        <div class="zh">天梯排位赛</div>
        <div class="en">LADDERS</div>
      </div>
      <div class="button cncnet">
        <div class="zh">多人大厅</div>
        <div class="en">CNCNET</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.title {
  background-image: url("/basic/message_box.png");
  background-repeat: no-repeat;
  background-position: left center;
  background-size: 100% 100%;
  padding: 0 24px;
  width: 100%;
  z-index: 10;
  height: 50px;
  font-size: 33px;
  align-items: center;
  margin-bottom: 8px;
}

.zh {
  font-family: '汉仪综艺体';
  line-height: 1;
}

.en {
  font-family: Marske;
  line-height: 1;
}

.title .zh {
  width: fit-content;
}

.title .en {
  margin-left: 4px;
}

.button {
  width: 12.66vw;
  height: 29.91vh;
  background-position: top;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  cursor: pointer;
}

.button > div {
  position: absolute;
}

.ladders {
  background-image: url("/home/buttons/ladders.png");
}

.cncnet {
  background-image: url("/home/buttons/cncnet.png");
}

.button .zh {
  left: 4%;
  bottom: 14%;
  font-size: 200%;
}

.button .en {
  left: 4%;
  bottom: 0;
  font-size: 200%;
}
</style>
