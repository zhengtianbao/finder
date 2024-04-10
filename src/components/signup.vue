<template>
  <el-row>
    <!-- 左侧空白 -->
    <el-col :span="3"></el-col>
    <!-- 中间主体 -->
    <el-col :span="18">
      <el-card class="box-card">
        <template #header>
          <div>
            <div class="header-info">欢迎来到 zlxzs.xyz，你可以通过以下方式注册成为新用户。</div>
            <div class="header-info">如果你之前已经注册过帐号，那么请从 <router-link :to="{name: 'Signin', replace: true}">这里</router-link> 登入。</div>
            <div class="header-info">问：为什么还要注册帐号，不能使用微信帐号扫码登录么？</div>
            <div class="header-info">答：网站开放微信登录需要企业主体资质认证，站长作为一名个人开发者并没有资格。</div>
          </div>
        </template>
        <div class="box-content">
          <div class="box-content-form">
            <el-form ref="form" :model="form" :rules="rules" label-width="120px">
              <el-form-item label="用户名" prop="username">
                <el-col :span="6">
                  <el-input maxlength="6" show-word-limit v-model="form.username" />
                </el-col>
                <span class="username-check">
                  <el-tooltip
                    effect="dark"
                    content="用户名未被注册"
                    placement="top-start"
                    v-if="nameUsed === false"
                  >
                    <span @click="checkNameUsed"><IconCheckOne theme="outline" size="14" fill="#7ed321"/></span>
                  </el-tooltip>
                  <el-tooltip
                    effect="dark"
                    content="用户名已被注册"
                    placement="top-start"
                    v-else-if="nameUsed === true" 
                  >
                    <span @click="checkNameUsed"><IconAttention theme="outline" size="14" fill="#d0021b"/></span>
                  </el-tooltip>
                  <el-tooltip
                    effect="dark"
                    content="点我检查是否已被占用"
                    placement="top-start"
                    v-else
                  >
                    <span @click="checkNameUsed"><IconHelp theme="outline" size="14" fill="#000"/></span>
                  </el-tooltip>
                </span>
              </el-form-item>
              <el-form-item label="密码" prop="password">
                <el-col :span="6">
                  <el-input type="password" maxlength="20" show-password v-model="form.password" />
                </el-col>
              </el-form-item>
              <el-form-item label="邮箱" prop="email">
                <el-col :span="6">
                  <el-input v-model="form.email" />
                </el-col>
              </el-form-item>
              <el-form-item label="验证码" prop="code" style="width: auto;">
                <el-col style="display: flex" :span="6">
                  <el-input v-model="form.code" @keyup.enter="registry('form')"/>
                  <div style="width: 10px"></div>
                  <el-button :disabled="isCounting" :loading="loading" @click="handleSms">
                    {{ label }}
                  </el-button>
                </el-col>
              </el-form-item>
              <div class="form-footer">
                <el-button @click="reset('form')">重置</el-button>
                <el-button type="primary" @click="registry('form')">注册</el-button>
              </div>
            </el-form>
          </div>
        </div>
      </el-card>
    </el-col>
    <!-- 右侧空白 -->
    <el-col :span="3"></el-col>
  </el-row>
</template>

<script>
import { 
  CheckOne as IconCheckOne,
  Attention as IconAttention,
  Help as IconHelp,
  RoadSign as IconRoadSign,
} from '@icon-park/vue-next'
import { markRaw } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import throttle from 'lodash.throttle'
import { register, userExist, sendEmail } from '@/api/user'
import { useRouter } from 'vue-router'
import { useEmailStore } from '@/pinia/modules/email'

const emailStore = useEmailStore()

export default {
  name: "Signup",
  components: {
    IconCheckOne,
    IconAttention,
    IconHelp,
    IconRoadSign,
  },
  created() {
    this.saveInviteFrom();
    this.checkEmailIsCounting();
  },
  computed: {
    label(){
      const initLabel = '获取验证码';
      const countingLabel = (second) => `${second}秒后重新获取`;
      let text = initLabel;
        if (emailStore.loading) {
          text = '';
        }
        if (emailStore.isCounting) {
          text = countingLabel(emailStore.counts);
        }
        return text;
    },
    loading() {
      return emailStore.loading
    },
    isCounting() {
      return emailStore.isCounting
    }
  },
  data() {
    return {
      nameUsed: undefined, // 判断用户名是否已被占用
      router: useRouter(),
      form: {
        username: "",
        password: "",
        email: "",
        code: "",
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, message: '最少2个字符', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              let reg = /^[\u4e00-\u9fa5a-zA-Z0-9]+$/;
              if (!reg.test(value)) {
                callback(new Error('只能由字母数字或汉字组成'))
              } else {
                callback()
              }
            },
            trigger: 'blur',
          },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '最少6个字符', trigger: 'blur' },
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"],
          },
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
        ]
      },
    }
  },
  watch: {
    'form.username': {
      handler(newValue, oldValue) {
        this.nameUsed = undefined
      },
      deep: true
    }
  },
  methods: {
    saveInviteFrom() {
      let inviteFrom = this.router.currentRoute.query.inviteFrom;
      if (inviteFrom) {
        window.localStorage.setItem('inviteFrom', inviteFrom)
      }
    },
    checkEmailIsCounting() {
      if (emailStore.isCounting) {
        clearInterval(emailStore.intervalId);
        emailStore.intervalId = setInterval(() => {
          emailStore.counts -= 1;
          if (emailStore.counts <= 0) {
            clearInterval(emailStore.intervalId);
            emailStore.isCounting = false;
          }
        }, 1000);
      }
    },
    checkNameUsed: throttle(async function() {
      if (this.form.username == "") {
        return
      }
      let req = {
        username: this.form.username
      }
      let res = await userExist(req)
      if (res.data.exist == true) {
        this.nameUsed = true
      } else {
        this.nameUsed = false
      }
    }, 2000),
    async registry(formname) {
      this.$refs[formname].validate(async (valid) => {
        if (valid) {
          let req = {
            inviteFrom: window.localStorage.getItem('inviteFrom') || '',
            ...this.form
          }
          let res = await register(req)
          if (res.code === 0) {
            ElMessageBox.confirm(
              "帐号已成功注册，点击确定跳转至登录页",
              '提示',
              {
                confirmButtonText: '确定',
                type: 'info',
                icon: markRaw(IconRoadSign)
              }
            )
            .then(() => {
              this.router.push({ name: 'Signin', replace: true})
            })
            .catch(() => {
            })
          } else {
            if (res.message == "验证码错误") {
              ElMessage({ type: 'error', message: '验证码错误' })
              this.form.code = ""
            } else {
              ElMessage({ type: 'error', message: '注册失败' })
            }
          }
        } else {
          return false
        }
      })
    },
    handleSms() {
      this.getSmsCode(this.form.email)
    },
    reset(formname) {
      this.nameUsed = undefined
      this.$refs[formname].resetFields()
    },
    async getSmsCode(email) {
      const valid = this.isEmailValid(email);
      if (!valid || emailStore.loading) {
        return;
      }
      emailStore.loading = true;
      //向后端发起发送邮箱验证码请求
      let req = { email: this.form.email}
      const res = await sendEmail(req)
      if (res.code === 0) {
        ElMessage.success('验证码已发送到邮箱,请注意查收')
      } else {
        ElMessage.warning('验证码发送失败,请稍后重试')
      }
      this.startCount(60);
      emailStore.loading = false;
    },
    startCount(updateSecond) {
      if (!emailStore.counts) {
        emailStore.isCounting = true;
        emailStore.counts = updateSecond;
        emailStore.intervalId = setInterval(() => {
          emailStore.counts -= 1;
          if (emailStore.counts <= 0) {
            clearInterval(emailStore.intervalId);
            emailStore.isCounting = false;
          }
        }, 1000);
      }
    },
    isEmailValid(email) {
      const REGEXP_EMAIL = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
      let valid = true;
      if (email === '') {
        ElMessage({
          message: '邮箱不能为空！',
          type:'error',
          grouping:true
        })
        valid = false;
      } else if (!REGEXP_EMAIL.test(email)) {
        ElMessage({
          message: '邮箱格式错误！',
          type:'error',
          grouping:true
        })
        valid = false;
      }
      return valid;
    }
  }
}

</script>

<style lang="scss" scoped>
.header-info {
  height: 25px;
}

.box-content {
  background-image: url("@/assets/signup.svg");
  background-repeat: no-repeat;
  background-position: top right;
  background-size: 50% 80%;
  width: 100%;
  height: 70vh;
}

.box-content-form {
  padding-top: 100px;
  padding-left: 50px;
}

.username-check {
  margin-left: 15px;
}

.form-footer {
  margin-top: 30px;
  width: 55%;
  text-align: center;
}

a:link {
  text-decoration: none;
  color: grey;
}

a:visited {
  text-decoration: none;
  color: grey;
}

a:hover {
  text-decoration: underline;
  color: black;
}

a:active {
  text-decoration: underline;
  color: black;
}
</style>
