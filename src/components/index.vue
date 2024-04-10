<template>
  <div id="home">
    <el-container>
      <el-header><Navigation /></el-header>
      <el-main><router-view /></el-main>
      <el-footer><Footer /></el-footer>
    </el-container>
  </div>
</template>

<script setup>
import Footer from './footer.vue'
import Navigation from './navigation.vue'
</script>

<style scoped>
#home {
  background: radial-gradient(circle at 100% 150%, #e9f1f6 24%, white 24%, white 28%, #e9f1f6 28%, #e9f1f6 36%, white 36%, white 40%, transparent 40%, transparent),
radial-gradient(circle at 0    150%, #e9f1f6 24%, white 24%, white 28%, #e9f1f6 28%, #e9f1f6 36%, white 36%, white 40%, transparent 40%, transparent),
radial-gradient(circle at 50%  100%, white 10%, #e9f1f6 10%, #e9f1f6 23%, white 23%, white 30%, #e9f1f6 30%, #e9f1f6 43%, white 43%, white 50%, #e9f1f6 50%, #e9f1f6 63%, white 63%, white 71%, transparent 71%, transparent),
radial-gradient(circle at 100% 50%, white 5%, #e9f1f6 5%, #e9f1f6 15%, white 15%, white 20%, #e9f1f6 20%, #e9f1f6 29%, white 29%, white 34%, #e9f1f6 34%, #e9f1f6 44%, white 44%, white 49%, transparent 49%, transparent),
radial-gradient(circle at 0    50%, white 5%, #e9f1f6 5%, #e9f1f6 15%, white 15%, white 20%, #e9f1f6 20%, #e9f1f6 29%, white 29%, white 34%, #e9f1f6 34%, #e9f1f6 44%, white 44%, white 49%, transparent 49%, transparent);
  background-size: 80px 40px;
}
</style>
