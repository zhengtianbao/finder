<template>
<el-row>
  <!-- 左侧空白 -->
  <el-col :span="3"></el-col>
  <!-- 中间主体 -->
  <el-col :span="18">
    <!-- 帮助信息 -->
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>本工具用于将输入文本按权利要求书或者说明书的格式对替换词进行序号标记。</span>
        </div>
      </template>
      <div class="text item">替换词支持两种输入模式：</div>
      <div class="text item"><b>1）完整输入：</b>请在输入框中按 <mark>数字或字母、替换词；</mark> 的模式按顺序依次完整输入，例如：<b>1、底板；2a、弹簧；3、螺杆；</b></div>
      <div class="text item"><b>2）自动补全：</b>适用于替换序号<mark>只包含数字</mark>的模式，只需要输入替换词后按 <mark>回车键</mark> <IconEnterKey theme="outline" size="14" fill="#333"/> 将自动添加数字序号，重复操作即可。或者也可以按 <mark>空格隔开替换词</mark>，例如：<b>底板 弹簧 螺杆</b></div>
    </el-card>

    <div class="split" />

    <!-- 选择输入模式 -->
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>输入替换词：</span>
          <el-radio-group v-model="smart">
            <el-radio label="1">自动补全</el-radio>
            <el-radio label="0">完整输入</el-radio>
          </el-radio-group>
        </div>
      </template>
      <div v-if="smart == '1'">
        <el-input
          v-model="smartinput"
          placeholder="底板 弹簧 螺杆..."
          @change="autoformat"
          clearable
          type="textarea"
          :rows="3"
        />
      </div>
      <div v-else>
        <el-input
          v-model="input"
          placeholder="1、底板；2a、弹簧；3、螺杆；..."
          clearable
          type="textarea"
          :rows="3"
        />
      </div>
    </el-card>

    <div class="split" />

    <!-- 转换 -->
    <el-card class="box-card">
      <div>
        <div id="input-left">
          <el-input
            v-model="origin"
            :autosize="{ minRows: 25, maxRows: 25 }"
            type="textarea"
            placeholder="请输入源文本"
          />
        </div>
        <div id="arrow-middle">
          <el-icon size="30" color="#2593C9"><DArrowRight /></el-icon>
        </div>
        <div id="result-right" contenteditable="true">
            <div>
              <el-scrollbar height="520px" class="result-right-scrollbar">
                <el-text class="result-right-text" v-html="result"></el-text>
              </el-scrollbar>
            </div>
        </div>
        <div id="submit-bottom">
          <el-button type="primary" @click="transform(1)">权利要求书</el-button>
          <el-button type="success" @click="transform(2)">说明书</el-button>
        </div>
      </div>
    </el-card>
  </el-col>
  <!-- 右侧空白 -->
  <el-col :span="3"></el-col>
</el-row>
</template>

<script setup>
import { 
  EnterKey as IconEnterKey
} from '@icon-park/vue-next'
import { ElMessage, ElMessageBox } from 'element-plus'
import { h, ref } from 'vue'
import { copyToClipboard } from "@/utils/copyClipboard"

const smart = ref("0")
const smartinput = ref('')
const input = ref('')
const origin = ref('')
const result = ref('')

function autoformat(value) {
  let rst = "";
  if (value.trim() == "") {
    return
  }
  // 如果已经添加过序号 在后面追加返回
  if (value.includes("1、")) {
    let new_word = value.slice(value.lastIndexOf("；")+1);
    if (new_word.trim() == "") {
      return
    }

    const regex = /(\d+)、[^；]*；/g;
    let match;
    let lastNumber = 1;
    while ((match = regex.exec(value)) !== null) {
      lastNumber = parseInt(match[1]);
    }
    smartinput.value = value.slice(0, value.lastIndexOf("；")) + "；"
    let arr = new_word.trim().split(/\s+/);
    for(var i = 0; i< arr.length; i++) {
        smartinput.value += (lastNumber+i+1).toString() + "、" + arr[i].trim() + "；";
    }
    return
  }
  // 按空格区分 自动添加序号
  let words = value.trim().split(/\s+/);
  for (let i = 0; i < words.length; i++) {
    rst += (i+1).toString() + "、" + words[i] + "；";
  }
  smartinput.value = rst;
}

function transform(type) {
  let real_input = smart.value == "1" ? smartinput.value.trim() : input.value.trim();
  if (real_input == "") {
    ElMessageBox.alert('请先输入标记以便于替换', '提示', {
      confirmButtonText: '好的',
    })
    return
  }
  real_input = real_input.replace(/\r\n/g, "").replace(/\n/g, "")
  if (real_input.endsWith("。")) {
    real_input = real_input.substring(0, real_input.length-1) + "；"
  }
  if (real_input.match(/^([a-zA-Z0-9]+、[\u4e00-\u9fa5a-zA-Z0-9]+；)+$/) == null) {
    ElMessageBox.alert('输入标记格式不符合规范', '提示', {
      confirmButtonText: '好的',
    })
    return
  }

  let words = real_input.split("；");
  words = words.filter(w => w != "");
  words = words.sort( function(a, b) {
    let av = a.split("、")[1]
    let bv = b.split("、")[1]
    return bv.length - av.length
  })

  // 如果是说明书需要先做替换词检查 要求所有的替换词都必须在文本中出现
  if (type == 2) {
    let unused_words = words.filter(w => !origin.value.includes(w.split("、")[1]))
    if (unused_words.length > 0) {
      ElMessageBox.alert('说明书中未出现标记：' + unused_words.join("；") + " 请检查并修改", '提示', {
        confirmButtonText: '好的',
      })
      return
    }
  }

  let words_map = new Map();
  let words_list = [];
  for (let i = 0; i < words.length; i++) {
    let tmp = words[i].split("、");
    if (words_map.has(tmp[1])) {
      let oldv = words_map.get(tmp[1]) + "、" + tmp[1];
      let newv = tmp[0] + "、" + tmp[1];
      let msg = oldv + " 与 " + newv
      ElMessageBox.alert('不允许存在相同的标记：' + msg, '提示', {
        confirmButtonText: '好的',
      })
      return
    }
    words_map.set(tmp[1], tmp[0]);
    let word = {
      id: tmp[0],
      content: tmp[1],
      children: [],
      parents: []
    }
    insertWord(words_list, word)
  }

  // 如果words_list中有包含children的元素，给出提示信息
  let pair_list = [];
  let visited = {};
  for( let i = 0; i < words_list.length; i++) {
    let queue = [words_list[i]];
    visited[words_list[i].id] = true;
    while (queue.length > 0) {
      const word = queue.shift();
      for (const sub_word of word.children) {
        if (!visited[sub_word.id]) {
          visited[sub_word.id] = true;
          queue.push(sub_word);
          for(const p of sub_word.parents) {
            let pair = [p.id + "、" + p.content, sub_word.id + "、" + sub_word.content]
            pair_list.push(pair)
          }
        }
      }
    }
  }
  if (pair_list.length != 0) {
    let pair_info_list = []
    for(let i = 0; i < pair_list.length; i++) {
      pair_info_list.push(h('p', {style: 'color: teal'}, pair_list[i][0] + " - " + pair_list[i][1]))
    }
    let message = h('p', null, [
      h('p', null, '发现以下替换词之间存在包含关系： '),
      ...pair_info_list,
      h('p', null, '可能会影响结果的准确性，还确定要执行操作么？'),
    ])
    ElMessageBox.confirm(
      message,
      '提示',
      {
        confirmButtonText: '是的，我就要',
        cancelButtonText: '好吧，我改改先',
        type: 'warning',
        center: true,
      }
    )
    .then(() => {
      doTransfer(words_list, type)
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '转换操作已取消',
      })
    })
  } else {
    doTransfer(words_list, type)
  }
}

function doTransfer(words_list, type) {
  result.value = origin.value;
  // 替换所有的换行符和空格
  result.value = result.value.replace(/\r\n/g, "<br>")
  result.value = result.value.replace(/\n/g, "<br>")
  result.value = result.value.replace(/\s/g, "&nbsp;")
  result.value = replaceWordsList(words_list, result.value, type, true)

  // 自动复制到系统剪切板
  let data = origin.value;
  data = replaceWordsList(words_list, data, type, false)
  copyToClipboard(data);
  ElMessage({
    message: '转换结果已自动复制到系统剪贴板',
    type: 'info',
    center: true,
  })
}

// words_list: [word]
// word: {
//   id: string,
//   content: string,
//   children: [word],
//   parents: [word]
// }
function insertWord(words_list, word) {
  let need_insert = true
  for(let i = 0; i < words_list.length; i++) {
    if (words_list[i].content.includes(word.content)) { // 之前word已经按长度排序过，所以这里只需要单向判断
      need_insert = false
      word.parents.push(words_list[i])
      insertWord(words_list[i].children, word)
    }
  }
  if (need_insert) {
    words_list.push(word)
  }
}

// 使用BFS遍历
// words_list: [word]
// word: {
//   id: string,
//   content: string,
//   children: [word],
//   parents: [word]
// }
// content: string
// type: int 1|2
// colorful: bool
function replaceWordsList(words_list, content, type, colorful) {
  let result = content
  let visited = {}; // 因为节点包含了所有父节点信息，每个节点只需要遍历一次
  for( let i = 0; i < words_list.length; i++) {
    let queue = [words_list[i]];
    visited[words_list[i].id] = true;
    while (queue.length > 0) {
      const word = queue.shift();
      result = replaceWord(word, word.parents, result, type, colorful)

      for (const sub_word of word.children) {
        if (!visited[sub_word.id]) {
          visited[sub_word.id] = true;
          queue.push(sub_word);
        }
      }
    }
  }
  return result
}

// word: {
//   id: string,
//   content: string,
//   children: [word],
//   parents: [word]
// }
// parent_words_list: [word]
// content: string
// type: int 1|2
// colorful: bool
function replaceWord(word, parent_words_list, content, type, colorful) {
  var result
  if (parent_words_list.length == 0){
    result = replaceString(word.content, word.id, content, type, colorful)
  } else {
    result = replaceSubString(word.content, word.id, parent_words_list, content, type, colorful)
  }
  return result;
}

function replaceString(str, targetid, content, type, colorful) {
  let color = getRandomColor();
  let result = content.replace(new RegExp(str, 'g'), function(v){
    let r = colorful ? "<span style='color: " + color + "'>" : ""
    if (type == 1) {
      r = r + v + "（" + targetid.toString() + "）"; 
    } else {
      r = r + v + targetid.toString(); 
    }
    r = colorful ? r + "</span>" : r
    return r
  })
  return result
}

// substr: string
// targetid: string
// parent_words_list: [word]
// word: {
//   id: string,
//   content: string,
//   children: [word],
//   parents: [word]
// }
// content: string
// type: int 1|2
// colorful: bool
function replaceSubString(substr, targetid, parent_words_list, content, type, colorful) {
    function replaceWithMarker(str, parent_word, marker) {
      return str.replace(new RegExp(parent_word, 'g'), marker);
    }

    function restoreFromMarker(str, origin_word, marker) {
      return str.replace(new RegExp(escape(marker), 'g'), origin_word);
    }
    // 先对parent_words_list 按内容长度进行排序
    parent_words_list = parent_words_list.sort((a,b) => b.content.length - a.content.length)
    let result = content
    let contentWithMarker = result
    for (let i = 0; i < parent_words_list.length; i++) {
      let marker = '###START###' + btoa(unescape(encodeURIComponent(parent_words_list[i].content))) + '###END###'
      contentWithMarker = replaceWithMarker(contentWithMarker, parent_words_list[i].content, marker)
    }
    let resultWithMarker = replaceString(substr, targetid, contentWithMarker, type, colorful)
    for (let i = 0; i < parent_words_list.length; i++) {
      let marker = '###START###' + btoa(unescape(encodeURIComponent(parent_words_list[i].content))) + '###END###'
      result = restoreFromMarker(resultWithMarker, parent_words_list[i].content, marker)
      resultWithMarker = result;
    }
    return result;
}

function escape(str) {
  if (!RegExp.escape) {
    RegExp.escape = function (s) {
      return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    };
  }
  return RegExp.escape(str);
}

function getRandomColor() {
  // 生成随机的RGB值
  let red = 130;
  let green = Math.floor(Math.random() * 256);
  let blue = Math.floor(Math.random() * 256);

  // 构建CSS颜色样式
  let color = 'rgb(' + red + ', ' + green + ', ' + blue + ')';

  return color;
}
</script>

<style scoped>
#input-left {
  width: 45%;
  margin: 5px;
  display: inline-block;
}

#arrow-middle {
  width: 8%;
  display: inline-block;
  vertical-align: top;
  padding-top: 180px;
  height: 340px;
  text-align: center;
}

#result-right {
  width: 45%;
  display: inline-block;
  border: 1px solid gainsboro;
  background-color: white;
}

.result-right-scrollbar {
  padding: 5px 11px;
}

.result-right-text {
  line-height: 1.5;
}

#submit-bottom {
  text-align: center;
  margin-top: 10px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 12px;
}

.split {
  margin-top: 10px;
}

</style>
