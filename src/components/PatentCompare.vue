<template>
  <el-row>
    <!-- 左侧空白 -->
    <el-col :span="3"></el-col>
    <!-- 中间主体 -->
    <el-col :span="18">
      <el-card>
        <template #header>
          <div class="card-header">
            <span>本工具用于高亮显示文档之间的差异。</span>
          </div>
        </template>

        <div id="compare-input">
          <div class="compare-input-left">
            <p>原文档：</p>
            <el-input
              v-model="prev"
              :rows="10"
              type="textarea"
              placeholder="这里输入原文档内容"
            />
          </div>
          <div class="compare-input-right">
            <p>对比文档：</p>
            <el-input
              v-model="current"
              :rows="10"
              type="textarea"
              placeholder="这里输入要对比文档内容"
            />
          </div>
        </div>
      </el-card>

      <div class="split" />

      <el-card>
        <div id="compare-switch">
          <div class="switch-block">
            <span>显示方式：</span>
            <el-select v-model="mode" style="width: 100px">
              <el-option label="左右显示" value="split" />
              <el-option label="上下显示" value="unified" />
            </el-select>
          </div>
          <div class="switch-block">
            <span>隐藏相同行：</span>
            <el-select v-model="isFolding" style="width: 100px">
              <el-option label="隐藏" value="true" />
              <el-option label="不隐藏" value="false" />
            </el-select>
          </div>
        </div>
        <div id="compare-result">
          <p>对比结果：</p>
          <VueDiff
            :mode="mode"
            :theme="theme"
            :language="language"
            :prev="prev"
            :current="current"
            :folding="folding"
            :input-delay="0"
            :virtual-scroll="{ height: 500, lineMinHeight: 24, delay: 100 }"
          />
        </div>
      </el-card>
    </el-col>
    <!-- 右侧空白 -->
    <el-col :span="3"></el-col>
  </el-row>
</template>

<script>
export default {
  name: 'PatentCompare',
  computed: {
    folding() {
      if (this.isFolding == 'true') {
        return true;
      } else {
        return false;
      }
    },
  },
  data() {
    return {
      mode: 'split', // split or unified
      theme: 'light', // dark or light
      language: 'plaintext',
      prev: '',
      current: '',
      isFolding: 'false',
    };
  },
};
</script>

<style>
#compare {
  text-align: center;
  height: 100vh;
}

.switch-block {
  display: inline-block;
  margin-right: 20px;
}

#compare-input p {
  font-size: 16px;
  margin-bottom: 10px;
}

.compare-input-left {
  display: inline-block;
  width: 50%;
}

.compare-input-right {
  display: inline-block;
  width: 50%;
}

.split {
  margin-top: 10px;
}

#compare-result {
  margin-top: 20px;
}

#compare-result p {
  font-size: 16px;
}
</style>
