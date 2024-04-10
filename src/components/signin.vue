<template>
  <el-row>
    <!-- 左侧空白 -->
    <el-col :span="3"></el-col>
    <!-- 中间主体 -->
    <el-col :span="18">
      <el-card class="box-card">
        <template #header>
          <div>
            <div class="header-info">欢迎来到 zlxzs.xyz，登录后将开放受限功能。</div>
            <div class="header-info">如果你还没有注册过帐号，那么请从 <router-link :to="{name: 'Signup', replace: true}">这里</router-link> 注册。</div>
            <div class="header-info">问：为什么需要登录，我可以不登录吗？</div>
            <div class="header-info">答：当然可以，本站的大部分功能都可以免登录使用，但某些功能会因为以下原因需要登录后使用：1）政策相关 2）高级功能</div>
          </div>
        </template>
        <div class="box-content">
          <div class="box-content-form">
            <el-form ref="form" :model="form" :rules="rules" label-width="120px">
              <el-form-item label="用户名" prop="username">
                <el-col :span="6">
                  <el-input maxlength="6" show-word-limit v-model="form.username" />
                </el-col>
              </el-form-item>
              <el-form-item label="密码" prop="password">
                <el-col :span="6">
                  <el-input type="password" maxlength="20" show-password v-model="form.password" @keyup.enter="submitForm('form')" />
                </el-col>
              </el-form-item>
              <el-form-item v-if="form.openCaptcha" label="你是机器人么？" prop="captcha">
                <el-col :span="6">
                  <img
                    v-if="picPath"
                    :src="picPath"
                    alt="请输入验证码"
                    @click="loginVerify()"
                  >
                  <el-input
                    v-model="form.captcha"
                    placeholder="请输入上图中的验证码"
                    @keyup.enter="submitForm('form')"
                  />
                </el-col>
              </el-form-item>
              <div class="form-footer">
                <el-button @click="forgetPassword">我忘记密码了</el-button>
                <el-button type="primary" @click="submitForm('form')">登录</el-button>
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
import { ElMessage } from 'element-plus'
import { captcha } from '@/api/user'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/pinia/modules/user'

export default {
  name: "Signup",
  created() {
    this.loginVerify()
  },
  data() {
    return {
      router: useRouter(),
      userStore: useUserStore(),
      picPath: '',
      form: {
        username: '',
        password: '',
        captcha: '',
        captchaId: '',
        openCaptcha: false,
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (value.length < 2) {
                return callback(new Error('请输入正确的用户名'))
              } else {
                callback()
              }
            }, 
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { 
            validator: (rule, value, callback) => {
              if (value.length < 6) {
                return callback(new Error('请输入正确的密码'))
              } else {
                callback()
              }
            }, 
            trigger: 'blur' 
          }
        ],
        captcha: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          {
            max: 6,
            min: 6,
            message: '请输入6位验证码',
            trigger: 'blur',
          }
        ],
      }
    }
  },
  methods: {
    loginVerify() {
      captcha({}).then((ele) => {
        this.picPath = ele.data.picPath
        this.form.captchaId = ele.data.captchaId
        this.form.openCaptcha = ele.data.openCaptcha
      })
    },
    async login() {
      return await this.userStore.LoginIn(this.form)
    },
    async submitForm(formname) {
      this.$refs[formname].validate(async(v) => {
        if (v) {
          const flag = await this.login()
          if (!flag) {
            this.loginVerify()
            this.form.captcha = ""
          }
        } else {
          ElMessage({
            type: 'error',
            message: '请正确填写登录信息',
            showClose: true,
          })
          this.loginVerify()
          return false
        }
      })
    },
    forgetPassword() {
      this.router.push({ name: 'Forgot', replace: true})
    }
  },
}
</script>

<style lang="scss" scoped>
.header-info {
  height: 25px;
}

.box-content {
  background-image: url("@/assets/signin.svg");
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

.form-footer {
  margin-top: 30px;
  width: 50%;
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
