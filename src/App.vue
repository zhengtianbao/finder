<script setup>
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
<div id="home">
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
  <HelloWorld msg="Vite + Vue" />
</div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
#home {
  background: radial-gradient(circle at 100% 150%, #e9f1f6 24%, white 24%, white 28%, #e9f1f6 28%, #e9f1f6 36%, white 36%, white 40%, transparent 40%, transparent),
radial-gradient(circle at 0    150%, #e9f1f6 24%, white 24%, white 28%, #e9f1f6 28%, #e9f1f6 36%, white 36%, white 40%, transparent 40%, transparent),
radial-gradient(circle at 50%  100%, white 10%, #e9f1f6 10%, #e9f1f6 23%, white 23%, white 30%, #e9f1f6 30%, #e9f1f6 43%, white 43%, white 50%, #e9f1f6 50%, #e9f1f6 63%, white 63%, white 71%, transparent 71%, transparent),
radial-gradient(circle at 100% 50%, white 5%, #e9f1f6 5%, #e9f1f6 15%, white 15%, white 20%, #e9f1f6 20%, #e9f1f6 29%, white 29%, white 34%, #e9f1f6 34%, #e9f1f6 44%, white 44%, white 49%, transparent 49%, transparent),
radial-gradient(circle at 0    50%, white 5%, #e9f1f6 5%, #e9f1f6 15%, white 15%, white 20%, #e9f1f6 20%, #e9f1f6 29%, white 29%, white 34%, #e9f1f6 34%, #e9f1f6 44%, white 44%, white 49%, transparent 49%, transparent);
  background-size: 80px 40px;
}
</style>
