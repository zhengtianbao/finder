<template>
  <el-row>
    hello
  </el-row>
</template>

<script>
// import debounce from "lodash.debounce";
// import CodeMirror from "codemirror";
// import 'codemirror/lib/codemirror.css'
// import "codemirror/addon/lint/lint.js";
// import "codemirror/addon/lint/lint.css"
// import { Processor } from 'textlint-plugin-text'
import { TextlintKernel } from "@textlint/kernel";

// import { 
//   CheckOne as IconCheckOne,
//   Attention as IconAttention,
//   Info as IconInfo
// } from '@icon-park/vue-next'

// // rules
// import { 
//   duplicateNumber,
//   incrementalNumber,
//   extraSpace,
//   repeatPeriod,
//   repeatWords,
//   legalSerialNumber,
//   refHasBase,
//   setRefSearchWordWidth 
// } from "@/utils/checkRules"

export default {
  name: "Check",
  // components: {
  //   IconCheckOne,
  //   IconAttention,
  //   IconInfo,
  // },
  data() {
    return {
      // filetype: "1", // 1->权利要求书 2->说明书
      // refWidth: 4, // 默认引用查找最小长度
      // checkAll: false,
      // checkAll2: false,
      // isIndeterminate: false,
      // isIndeterminate2: false,
      // rules: [
      //   {
      //     id: 1,
      //     name: "duplicateNumber",
      //     info: "检查是否存在重复序号",
      //     rule: duplicateNumber,
      //     help: "按规范序号是以 数字. 或者 数字、开头的号码，例如: 1. 或者 2、且不可重复"
      //   },
      //   {
      //     id: 2,
      //     name: "incrementalNumber",
      //     info: "检查权利要求序号递增",
      //     rule: incrementalNumber,
      //     help: "序号必须从1开始连续递增"
      //   },
      //   {
      //     id: 3,
      //     name: "extraSpace",
      //     info: "检查权利要求是否有多余的空格",
      //     rule: extraSpace,
      //     help: "权利要求应不包含多余的空格"
      //   },
      //   {
      //     id: 4,
      //     name: "repeatPeriod",
      //     info: "检查权利要求是否有多个句号",
      //     rule: repeatPeriod,
      //     help: "按规范每条应以句号。结尾，且每条只能有一个"
      //   },
      //   {
      //     id: 5,
      //     name: "legalSerialNumber",
      //     info: "检查权利要求引用的序号是否合法",
      //     rule: legalSerialNumber,
      //     help: "引用序号必须按顺序合法引用"
      //   },
      //   {
      //     id: 6,
      //     name: "repeatWords",
      //     info: "检查权利要求是否包含连续重复的词或者标点符号",
      //     rule: repeatWords,
      //     help: "无法识别语义只能逻辑上检查重复的词"
      //   },
      //   {
      //     id: 7,
      //     name: "refHasBase",
      //     info: "检查权利要求引用基础",
      //     rule: refHasBase,
      //     help: "前文中是否出现"
      //   },
      // ],
      // rules2: [
      //   {
      //     id: 1,
      //     name: "repeatPeriod",
      //     info: "检查说明书每条是否有多个句号",
      //     rule: repeatPeriod,
      //     help: "按规范每条应以句号。结尾，且每条只能有一个"
      //   },
      //   {
      //     id: 2,
      //     name: "repeatWords",
      //     info: "检查说明书是否包含连续重复的词或者标点符号",
      //     rule: repeatWords,
      //     help: "无法识别语义只能逻辑上检查重复的词"
      //   },
      //   {
      //     id: 3,
      //     name: "refHasBase",
      //     info: "检查引用基础",
      //     rule: refHasBase,
      //     help: "前文中是否出现"
      //   },
      // ],
      // checkedRules: [],
      // checkedRules2: [],
      // enabledRules: [],
      // codemirrorContent: "",
      // textlintKernel: undefined,
      // textlintOption: {},
      // validator: undefined,
    }
  }

}

</script>
  
<style lang="scss" scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}

.split {
  margin-top: 10px;
}

.checkbox-header {
  margin-bottom: 10px;
}

.helpinfo {
  margin-right: 5px;
}

.checkbox-content {
  margin-left: 30px;
}

// 设置输入框的宽度和高度
:deep(.el-input-number__input) {
  width: 150px;
  height: 18px;
}

:deep(.el-checkbox) {
  height: 20px;
}

// checkbox样式
:deep(.el-checkbox__inner) {
  //大小
  border-color: #384461;
  border-radius: 4px;
}

:deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  //选中
  border-color: #384461;
  background-color: transparent;

  &::after {
    // 里面的对钩
    border-color: #384461;
  }
}

:deep(.el-checkbox__input.is-focus .el-checkbox__inner) {
  //悬浮
  border-color: none !important;
}

:deep(.el-checkbox__input.is-checked + .el-checkbox__label),
:deep(.el-checkbox__label) {
  //文字
  font-size: 14px;
  color: #384461;
}

.textlint-header {
  margin-bottom: 10px;
}

.textlint {
  height: 100%;

  :deep(.CodeMirror) {
    height: 600px;
  }

  :deep(.CodeMirror *) {
    font-size: 16px;
    line-height: 1.5em;
  }
}
</style>
