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
            <span>
              本工具用于将输入文本按权利要求书或者说明书的规则进行格式检查。
            </span>
          </div>
        </template>
        <div class="card-header">
          <span>步骤一：选择检查类型</span>
          <el-radio-group v-model="filetype" @change="radioChange">
            <el-radio label="1">权利要求书</el-radio>
            <el-radio label="2">说明书</el-radio>
          </el-radio-group>
        </div>
      </el-card>

      <div class="split" />

      <!-- 选择检查项 -->
      <el-card>
        <div v-if="filetype == '1'">
          <div class="checkbox-header">
            步骤二：选择
            <mark>权利要求书</mark>
            的格式检查项
          </div>
          <div class="checkbox-content">
            <el-checkbox
              v-model="checkAll"
              :indeterminate="isIndeterminate"
              @change="handleCheckAllChange"
            >
              <div v-if="checkAll">
                <b class="helpinfo">全部启用</b>
                <IconCheckOne theme="outline" size="14" fill="#7ed321" />
              </div>
              <div v-else-if="checkedRules.length == 0">
                <b class="helpinfo">啥都不用</b>
                <IconAttention theme="outline" size="14" fill="#d0021b" />
              </div>
              <div v-else>
                <b class="helpinfo">部分启用</b>
                <IconInfo theme="outline" size="14" fill="#f5a623" />
              </div>
            </el-checkbox>
            <el-checkbox-group
              v-model="checkedRules"
              @change="handleCheckedRulesChange"
            >
              <el-checkbox
                style="display: block"
                v-for="rule in rules"
                :key="rule"
                :label="rule"
              >
                <el-tooltip
                  class="box-item"
                  effect="dark"
                  :content="rule.help"
                  placement="top-start"
                >
                  <div v-if="rule.name == 'refHasBase'">
                    <span>{{ rule.info }} 设置字长为：</span>
                    <span>
                      <el-input-number
                        v-model="refWidth"
                        size="small"
                        :min="2"
                        :max="8"
                        step-strictly
                        @click.stop.prevent
                        @change="handleRefWidthChange"
                      />
                    </span>
                  </div>
                  <div v-else>
                    <span>{{ rule.info }}</span>
                  </div>
                </el-tooltip>
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
        <div v-else>
          <div class="checkbox-header">
            步骤二：选择
            <mark>说明书</mark>
            的格式检查项
          </div>
          <div class="checkbox-content">
            <el-checkbox
              v-model="checkAll2"
              :indeterminate="isIndeterminate2"
              @change="handleCheckAllChange2"
            >
              <div v-if="checkAll2">
                <b class="helpinfo">全部启用</b>
                <IconCheckOne theme="outline" size="14" fill="#7ed321" />
              </div>
              <div v-else-if="checkedRules2.length == 0">
                <b class="helpinfo">啥都不用</b>
                <IconAttention theme="outline" size="14" fill="#d0021b" />
              </div>
              <div v-else>
                <b class="helpinfo">部分启用</b>
                <IconInfo theme="outline" size="14" fill="#f5a623" />
              </div>
            </el-checkbox>
            <el-checkbox-group
              v-model="checkedRules2"
              @change="handleCheckedRulesChange2"
            >
              <el-checkbox
                style="display: block"
                v-for="rule in rules2"
                :key="rule"
                :label="rule"
              >
                <el-tooltip
                  class="box-item"
                  effect="dark"
                  :content="rule.help"
                  placement="top-start"
                >
                  <div v-if="rule.name == 'refHasBase'">
                    <span>{{ rule.info }} 设置字长为：</span>
                    <span>
                      <el-input-number
                        v-model="refWidth"
                        size="small"
                        :min="2"
                        :max="8"
                        step-strictly
                        @click.stop.prevent
                        @change="handleRefWidthChange"
                      />
                    </span>
                  </div>
                  <div v-else>
                    <span>{{ rule.info }}</span>
                  </div>
                </el-tooltip>
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </el-card>

      <div class="split" />

      <!-- 检查文本框 -->
      <el-card class="box-card">
        <div class="textlint">
          <div class="textlint-editor">
            <div class="textlint-header">步骤三：复制文本内容到下面</div>
            <div id="codeMirrorDiv">
              <textarea id="codeMirrorEditor" />
            </div>
          </div>
        </div>
      </el-card>
    </el-col>
    <!-- 右侧空白 -->
    <el-col :span="3"></el-col>
  </el-row>
</template>

<script>
import debounce from 'lodash.debounce';
import CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/addon/lint/lint.js';
import 'codemirror/addon/lint/lint.css';
import { Processor } from 'textlint-plugin-text';
import { TextlintKernel } from '@textlint/kernel';

import {
  CheckOne as IconCheckOne,
  Attention as IconAttention,
  Info as IconInfo,
} from '@icon-park/vue-next';

// rules
import {
  duplicateNumber,
  incrementalNumber,
  extraSpace,
  repeatPeriod,
  repeatWords,
  legalSerialNumber,
  refHasBase,
  setRefSearchWordWidth,
} from '@/utils/checkRules';

export default {
  name: 'Check',
  components: {
    IconCheckOne,
    IconAttention,
    IconInfo,
  },
  data() {
    return {
      filetype: '1', // 1->权利要求书 2->说明书
      refWidth: 4, // 默认引用查找最小长度
      checkAll: false,
      checkAll2: false,
      isIndeterminate: false,
      isIndeterminate2: false,
      rules: [
        {
          id: 1,
          name: 'duplicateNumber',
          info: '检查是否存在重复序号',
          rule: duplicateNumber,
          help: '按规范序号是以 数字. 或者 数字、开头的号码，例如: 1. 或者 2、且不可重复',
        },
        {
          id: 2,
          name: 'incrementalNumber',
          info: '检查权利要求序号递增',
          rule: incrementalNumber,
          help: '序号必须从1开始连续递增',
        },
        {
          id: 3,
          name: 'extraSpace',
          info: '检查权利要求是否有多余的空格',
          rule: extraSpace,
          help: '权利要求应不包含多余的空格',
        },
        {
          id: 4,
          name: 'repeatPeriod',
          info: '检查权利要求是否有多个句号',
          rule: repeatPeriod,
          help: '按规范每条应以句号。结尾，且每条只能有一个',
        },
        {
          id: 5,
          name: 'legalSerialNumber',
          info: '检查权利要求引用的序号是否合法',
          rule: legalSerialNumber,
          help: '引用序号必须按顺序合法引用',
        },
        {
          id: 6,
          name: 'repeatWords',
          info: '检查权利要求是否包含连续重复的词或者标点符号',
          rule: repeatWords,
          help: '无法识别语义只能逻辑上检查重复的词',
        },
        {
          id: 7,
          name: 'refHasBase',
          info: '检查权利要求引用基础',
          rule: refHasBase,
          help: '前文中是否出现',
        },
      ],
      rules2: [
        {
          id: 1,
          name: 'repeatPeriod',
          info: '检查说明书每条是否有多个句号',
          rule: repeatPeriod,
          help: '按规范每条应以句号。结尾，且每条只能有一个',
        },
        {
          id: 2,
          name: 'repeatWords',
          info: '检查说明书是否包含连续重复的词或者标点符号',
          rule: repeatWords,
          help: '无法识别语义只能逻辑上检查重复的词',
        },
        {
          id: 3,
          name: 'refHasBase',
          info: '检查引用基础',
          rule: refHasBase,
          help: '前文中是否出现',
        },
      ],
      checkedRules: [],
      checkedRules2: [],
      enabledRules: [],
      codemirrorContent: '',
      textlintKernel: undefined,
      textlintOption: {},
      validator: undefined,
    };
  },
  mounted() {
    this.checkAllRules();
    this.initCodeMirror();
  },
  methods: {
    remountCodeMirror() {
      // 获取codemirror中的文本内容
      let spans = document.querySelectorAll(
        '.CodeMirror-code .CodeMirror-line [role="presentation"]'
      );
      this.codemirrorContent = '';
      spans.forEach(span => {
        if (!!span.querySelector('span[cm-text=""]')) {
          this.codemirrorContent += '\n';
        } else {
          let c = span.innerText;
          this.codemirrorContent += c + '\n';
        }
      });
      this.codemirrorContent = this.codemirrorContent.trimEnd('\n');

      let dom = document.getElementById('codeMirrorDiv');
      let parent = dom.parentNode;
      parent.removeChild(dom);
      let newDom = document.createElement('div');
      newDom.setAttribute('id', 'codeMirrorDiv');
      let newTextarea = document.createElement('textarea');
      newTextarea.setAttribute('id', 'codeMirrorEditor');
      newDom.appendChild(newTextarea);
      parent.appendChild(newDom);
      this.checkAllRules();
      this.initCodeMirror();
    },
    handleRefWidthChange(newvalue, oldvalue) {
      setRefSearchWordWidth(newvalue);
      this.remountCodeMirror();
    },
    radioChange(value) {
      this.remountCodeMirror();
    },
    initCodeMirror() {
      this.textlintKernel = new TextlintKernel();
      this.updateEnabledRules();
      this.validator = this.createValidator();
      this.mountCodeMirror();
    },
    updateEnabledRules() {
      this.enabledRules = [];
      let rules = this.filetype == '1' ? this.checkedRules : this.checkedRules2;
      for (let i = 0; i < rules.length; i++) {
        let r = rules[i];
        this.enabledRules.push(Object.assign({}, r));
      }
    },
    createSetupRules(rules) {
      let rst = [];
      for (let i = 0; i < rules.length; i++) {
        rst.push({
          ruleId: rules[i].name,
          rule: rules[i].rule,
          options: {},
        });
      }
      return rst;
    },
    createValidator() {
      return (text, callback) => {
        if (!text) {
          callback([]);
          return;
        }
        let textlintOption = {
          rules: this.createSetupRules(this.enabledRules),
          plugins: [
            {
              pluginId: 'text',
              plugin: { Processor },
            },
          ],
          ext: '.txt',
        };
        this.textlintKernel
          .lintText(text, textlintOption)
          .then(result => {
            const lintMessages = result.messages;
            const lintErrors = lintMessages.map(
              this.convertTextlintMessageToCodeMirror
            );
            callback(lintErrors);
          })
          .catch(error => {
            console.error(error);
          });
      };
    },
    convertSeverity(severity) {
      switch (severity) {
        case 1:
          return 'warning';
        case 2:
          return 'error';
        default:
          return 'error';
      }
    },
    convertTextlintMessageToCodeMirror(message) {
      const posFrom = { line: message.line - 1, ch: message.column - 1 };
      const posTo = { line: message.line - 1, ch: message.column };
      let rst = {
        from: posFrom,
        to: posTo,
        message: message.message,
        severity: this.convertSeverity(message.severity),
      };
      return rst;
    },
    codemirrorOnChange() {
      return function (text) {
        let textlintOption = {
          rules: this.createSetupRules(this.enabledRules),
          plugins: [
            {
              pluginId: 'text',
              plugin: { Processor },
            },
          ],
          ext: '.txt',
        };
        this.textlintKernel
          .lintText(text, textlintOption)
          .then(result => {
            return result;
          })
          .catch(error => {
            console.error(error);
          });
      };
    },
    codemirrorOnChangeHandler(cm) {
      debounce(this.codemirrorOnChange(), 1000);
    },
    checkAllRules() {
      this.checkedRules = [];
      for (let index = 0; index < this.rules.length; index++) {
        const element = this.rules[index];
        this.checkedRules.push(element);
      }
      this.checkAll = true;
      this.isIndeterminate = false;

      this.checkedRules2 = [];
      for (let index = 0; index < this.rules2.length; index++) {
        const element = this.rules2[index];
        this.checkedRules2.push(element);
      }
      this.checkAll2 = true;
      this.isIndeterminate2 = false;
    },
    handleCheckAllChange(val) {
      this.checkedRules = val ? this.rules : [];
      this.isIndeterminate = false;
      this.updateEnabledRules();
    },
    handleCheckedRulesChange(value) {
      const checkedCount = value.length;
      this.checkAll = checkedCount === this.rules.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.rules.length;
      this.updateEnabledRules();
    },
    handleCheckAllChange2(val) {
      this.checkedRules2 = val ? this.rules2 : [];
      this.isIndeterminate2 = false;
      this.updateEnabledRules();
    },
    handleCheckedRulesChange2(value) {
      const checkedCount = value.length;
      this.checkAll2 = checkedCount === this.rules2.length;
      this.isIndeterminate2 =
        checkedCount > 0 && checkedCount < this.rules2.length;
      this.updateEnabledRules();
    },
    mountCodeMirror() {
      let textarea = document.getElementById('codeMirrorEditor');
      let cm = CodeMirror.fromTextArea(textarea);
      cm.setValue(this.codemirrorContent);
      let options = {
        lineNumbers: true,
        lineWrapping: true,
        mode: 'null', // null | gfm | htmlmixed
        gutters: ['CodeMirror-lint-markers'],
        lint: {
          getAnnotations: this.validator,
          async: true,
        },
      };
      for (const optionName in options) {
        if (Object.hasOwnProperty.call(options, optionName)) {
          cm.setOption(optionName, options[optionName]);
        }
      }
      cm.on('change', this.codemirrorOnChangeHandler());
    },
  },
};
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

  :deep(.CodeMirror-lint-mark-error) {
    background-color: yellow;
    -webkit-animation: pulse 400ms infinite alternate;
    animation: pulse 400ms infinite alternate;
  }
  @-webkit-keyframes pulse {
    0% {
      background-color: red;
    }
    100% {
      background-color: yellow;
    }
  }
  @keyframes pulse {
    0% {
      background-color: red;
    }
    100% {
      background-color: yellow;
    }
  }

  :deep(.CodeMirror *) {
    font-size: 16px;
    line-height: 1.5em;
  }
}
</style>
