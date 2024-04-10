<template>
  <el-row>
    <!-- 左侧空白 -->
    <el-col :span="3"></el-col>
    <!-- 中间主体 -->
    <el-col :span="18">
      <el-card class="box-card">
        <template #header>
          <div>
            <div class="header-info">在这里可以进行密码重置操作。</div>
          </div>
        </template>
        <div class="box-content">
          <div class="box-content-form">
            <div v-if="linkExpired == false">
              <el-form ref="form" :model="form" :rules="rules" label-width="120px">
                <el-form-item label="新密码" prop="new">
                  <el-col :span="6">
                    <el-input type="password" maxlength="20" show-password v-model="form.new" />
                  </el-col>
                </el-form-item>
                <el-form-item label="确认密码" prop="again">
                  <el-col :span="6">
                    <el-input type="password" maxlength="20" show-password v-model="form.again" />
                  </el-col>
                </el-form-item>
                <div class="form-footer">
                  <el-button type="primary" @click="submitForm('form')">确定</el-button>
                </div>
              </el-form>
            </div>
            <div v-else>
              该链接已经失效。
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
import {
  Login as IconLogin
} from '@icon-park/vue-next'
import { markRaw } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { linkcode } from '@/api/user'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/pinia/modules/user'

export default {
  name: "Forgot",
  created() {
    this.verifyLinkCode()
  },
  components: {
    IconLogin
  },
  data() {
    return {
      router: useRouter(),
      userStore: useUserStore(),
      form: {
        new: '',
        again: '',
        linkcode: '',
      },
      alreadySend: false,
      linkExpired: true,
      rules: {
        new: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '最少6个字符', trigger: 'blur' },
        ],
        again: [
          { required: true, message: '请输入确认密码', trigger: 'blur' },
          { min: 6, message: '最少6个字符', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (value !== this.form.new) {
                callback(new Error('两次密码不一致'))
              } else {
                callback()
              }
            },
            trigger: 'blur',
          },
        ]
      }
    }
  },
  methods: {
    verifyLinkCode() {
      this.form.linkcode = this.router.currentRoute.query.code
      linkcode(this.form).then(async(res)=>{
        if (res.code === 0) {
          this.linkExpired = false
        } else {
          this.linkExpired = true
        }
      })
    },
    async resetPasswordByLink() {
      return await this.userStore.ResetPasswordByLink(this.form)
    },
    async submitForm(formname) {
      this.$refs[formname].validate(async(v) => {
        if (v) {
          const flag = await this.resetPasswordByLink()
          if (!flag) {
            ElMessage({
              type: 'error',
              message: '修改密码失败',
              showClose: true,
            })
          } else {
            this.linkExpired = true
            ElMessageBox.confirm(
              "修改密码成功，点击确定跳转到登录页",
              '提示',
              {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'info',
                icon: markRaw(IconLogin)
              }
            ).then(() => {
              this.router.push({ name: 'Signin', replace: true})
            })
          }
        } else {
          ElMessage({
            type: 'error',
            message: '请正确填写密码信息',
            showClose: true,
          })
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
