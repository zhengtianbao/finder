<template>
  <el-row>
    <!-- 左侧空白 -->
    <el-col :span="3"></el-col>
    <!-- 中间主体 -->
    <el-col :span="18">
      <el-card class="box-card">
        <template #header>
          <div>
            <div class="header-info">填写用户名以及注册的邮箱后，一个重置密码的链接将发送到你的邮箱。</div>
            <div class="header-info">注意：重置密码的链接将在2小时后失效。</div>
          </div>
        </template>
        <div class="box-content">
          <div class="box-content-form">
            <div v-if="alreadySend == false">
              <el-form ref="form" :model="form" :rules="rules" label-width="120px">
                <el-form-item label="用户名" prop="username">
                  <el-col :span="6">
                    <el-input maxlength="6" show-word-limit v-model="form.username" />
                  </el-col>
                </el-form-item>
                <el-form-item label="注册邮箱" prop="email">
                  <el-col :span="6">
                    <el-input v-model="form.email" />
                  </el-col>
                </el-form-item>
                <el-form-item v-if="form.openCaptcha" label="你是机器人么？" prop="captcha">
                  <el-col :span="6">
                    <img
                      v-if="picPath"
                      :src="picPath"
                      alt="请输入验证码"
                      @click="fetchVerifyCode()"
                    >
                    <el-input
                      v-model="form.captcha"
                      placeholder="请输入上图中的验证码"
                      @keyup.enter="submitForm('form')"
                    />
                  </el-col>
                </el-form-item>
                <div class="form-footer">
                  <el-button type="primary" @click="submitForm('form')">继续</el-button>
                </div>
              </el-form>
            </div>
            <div v-else>
              一封包含了重设密码指令的邮件已经发送到你的注册邮箱，按照邮件中的提示（2小时内有效），即可重设你的密码。
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
import { ElMessage } from 'element-plus'
import { captcha } from '@/api/user'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/pinia/modules/user'

export default {
  name: "Forgot",
  created() {
    this.fetchVerifyCode()
  },
  data() {
    return {
      router: useRouter(),
      userStore: useUserStore(),
      picPath: '',
      form: {
        username: '',
        email: '',
        captcha: '',
        captchaId: '',
        openCaptcha: false,
      },
      alreadySend: false,
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
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"],
          },
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
    fetchVerifyCode() {
      captcha({}).then(async(ele) => {
        this.picPath = ele.data.picPath
        this.form.captchaId = ele.data.captchaId
        this.form.openCaptcha = ele.data.openCaptcha
      })
    },
    async forgot() {
      return await this.userStore.Forgot(this.form)
    },
    async submitForm(formname) {
      this.$refs[formname].validate(async(v) => {
        if (v) {
          const flag = await this.forgot()
          if (!flag) {
            this.fetchVerifyCode()
            this.form.captcha = ""
          } else {
            this.alreadySend = true
          }
        } else {
          ElMessage({
            type: 'error',
            message: '请正确填写登录信息',
            showClose: true,
          })
          this.fetchVerifyCode()
          return false
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.header-info {
  height: 25px;
}

.box-content {
  background-image: url("@/assets/forgot.svg");
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
