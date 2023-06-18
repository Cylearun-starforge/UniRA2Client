<script setup lang="ts">
import { reactive, ref } from 'vue';
import { invoke } from '@tauri-apps/api'

const command = ref<HTMLInputElement>()
const param = ref<HTMLInputElement>()
const dialog = reactive({
  type: 'RESPONSE',
  visible: false,
  content: ''
})
function simpleDialog(type: 'RESPONSE' | 'ERROR', msg: string) {
  dialog.visible = true;
  dialog.content = msg;
  dialog.type = type;
}

async function submit() {
  const cmd = command.value?.value;
  const params = JSON.parse(param.value?.value?.trim()?.length === 0 ? '{}' : param.value?.value ?? '{}');
  if (!cmd) {
    simpleDialog('ERROR', 'empty command!');
    return;
  }
  invoke(cmd, params).then(response => {
    console.log(response)
    simpleDialog('RESPONSE', JSON.stringify(response))
  }).catch((error: Error) => {
    simpleDialog('RESPONSE', error.message)
  });

}

</script>

<template>
  <main>
    <form @submit.prevent="submit">
      <div class="group">
        <label for="command">command</label>
        <input type="text" name="command" ref="command">
      </div>
      <div class="group">
        <label for="param">param(json)</label>
        <input type="text" name="param" ref="param">
      </div>
      <button type="submit">invoke</button>
    </form>
  </main>
  <div class="dialog" v-show="dialog.visible">
    <div>
      response: {{ dialog.content }}
    </div>
    <button @click="dialog.visible = false">close</button>
  </div>
</template>


<style scoped>
form {
  .group {
    display: flex;
  }
}

.dialog {
  position: fixed;
  padding: 12px;
  border: 1px solid white;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 800px;
  height: 600px;
  display: flex;
  flex-direction: column;
  background-color: darkolivegreen;


}

.dialog button {
  background-color: darkslategrey;
  color: white;
}
</style>