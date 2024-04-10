<template>
  <el-row>
    <!-- 左侧空白 -->
    <el-col :span="3"></el-col>
    <!-- 中间主体 -->
    <el-col :span="18">
      <el-card class="box-card">
        <template #header>
          <div>
            <div class="header-info">这里是设置页面，可以对个人信息进行修改。</div>
          </div>
        </template>
        <div class="box-content" v-if="isLogin">
          <el-tabs v-model="activeTabName" class="setting-tabs" @tab-click="handleTabClick">
            <!-- 个人信息 -->
            <el-tab-pane label="个人信息" name="profile">
              <div class="box-content-form">
                <el-col :span="12">
                  <div style="display: flex;">
                    <span class="box-content-label">
                      <el-avatar :src="getUrl(userStore.userInfo.headerImg)" shape="square"></el-avatar>
                    </span>
                    <span class="box-content-value">本站第 {{ userStore.userInfo.ID }} 号会员</span>
                  </div>
                </el-col>
                <div style="height: 20px"></div>
                <el-col :span="12">
                  <div style="display: flex;">
                    <span class="box-content-label">
                      <IconTime theme="outline" size="14" fill="#333"/>注册时间
                    </span>
                    <span>{{ userCreatedAt }}</span>
                  </div>
                </el-col>
                <div style="height: 20px"></div>
                <el-col :span="12">
                  <div style="display: flex;">
                    <span class="box-content-label">
                      <IconUser theme="outline" size="14" fill="#333"/>用户名
                    </span>
                    <span>{{ userStore.userInfo.userName }}</span>
                  </div>
                </el-col>
                <div style="height: 20px"></div>
                <el-col :span="12">
                  <div style="display: flex;">
                    <span class="box-content-label">
                      <IconEmailPush theme="outline" size="14" fill="#333"/>电子邮箱
                    </span>
                    <span>{{ userStore.userInfo.email }}</span>
                  </div>
                </el-col>
                
                <div style="height: 20px"></div>
                <el-col :span="16">
                  <div style="display: flex;">
                    <span class="box-content-label">
                      <IconFinancingOne theme="outline" size="14" fill="#333"/>积分
                    </span>
                    <router-link :to="{ name:'Coin' }">
                      <span>
                        <IconFunds theme="outline" size="14" />
                        {{ userCoin.gold }}
                        <IconFinancing theme="two-tone" size="14" :fill="['#333', '#ffd700']" />
                        {{ userCoin.silver }}
                        <IconFinancing theme="two-tone" size="14" :fill="['#333', '#c0c0c0']" />
                        {{ userCoin.copper }}
                        <IconFinancing theme="two-tone" size="14" :fill="['#333', '#b87333']" />
                      </span>
                    </router-link>
                  </div>
                </el-col>
                <div style="height: 20px"></div>
                <el-col :span="16">
                  <div style="display: flex;">
                    <span class="box-content-label">
                      <IconLinkTwo theme="outline" size="14" fill="#333"/>推广链接
                    </span>
                    <span>{{ inviteLink }}</span>
                  </div>
                  <div style="display: flex;">
                    <span class="tips">如果有新用户通过你的分享注册，那么你和新用户将各自得到：10 <IconFinancing theme="two-tone" size="14" :fill="['#333' ,'#c0c0c0']" /></span>
                  </div>
                </el-col>
              </div>
            </el-tab-pane>
            <!-- 设置头像 -->
            <el-tab-pane label="头像" name="avatar">
              <div class="box-content-form">
                <el-col :span="12">
                  <div style="display: flex;">
                    <span class="box-content-label"></span>
                    <span>本站可能用到的头像样式展示</span>
                  </div>
                </el-col>
                <div style="height: 20px"></div>
                <el-col :span="12">
                  <div style="display: flex;">
                    <span class="box-content-label">当前头像</span>
                    <el-avatar class="middle" :src="getUrl(userStore.userInfo.headerImg)" shape="square" size="large"></el-avatar>
                    <div style="width: 10px"></div>
                    <el-avatar class="middle" :src="getUrl(userStore.userInfo.headerImg)" shape="square"></el-avatar>
                    <div style="width: 10px"></div>
                    <el-avatar class="middle" :src="getUrl(userStore.userInfo.headerImg)" shape="circle" size="large"></el-avatar>
                    <div style="width: 10px"></div>
                    <el-avatar class="middle" :src="getUrl(userStore.userInfo.headerImg)" shape="circle"></el-avatar>
                  </div>
                </el-col>
                <div style="height: 20px"></div>
                <el-col :span="12">
                  <div style="display: flex;">
                    <span class="box-content-label">修改头像</span>
                    <el-button plain size="small" @click="toggleShow">选择文件</el-button>
                    <myUpload 
                      field="file"
                      @crop-success="cropSuccess"
                      @crop-upload-success="cropUploadSuccess"
                      @crop-upload-fail="cropUploadFail"
                      v-model="uploadHeadImgShow"
                      :width="120"
                      :height="120"
                      :url="`${path}/fileUploadAndDownload/upload`"
                      :headers="{ 'x-token': userStore.token }"
                      imgFormat="png"
                      :maxSize="10240">
                    </myUpload>
                  </div>
                </el-col>
                <div style="height: 20px"></div>
                <el-col :span="12">
                  <div style="display: flex;">
                    <span class="box-content-label"></span>
                    <span class="headImgHelp">支持 2MB 以内的 PNG / JPEG / GIF 文件，推荐使用一张 512x512 的 PNG 文件以获得最佳展示效果</span>
                  </div>
                </el-col>
              </div>
            </el-tab-pane>
            <!-- 修改密码 -->
            <el-tab-pane label="密码" name="password">
              <div class="box-content-form">
                <el-form ref="modifyPwdForm" :model="pwdModify" :rules="rules" label-width="120px">
                  <el-form-item label="当前密码" prop="password">
                    <el-col :span="6">
                      <el-input type="password" maxlength="20" show-password v-model="pwdModify.password" />
                    </el-col>
                  </el-form-item>
                  <el-form-item label="新密码" prop="newPassword">
                    <el-col :span="6">
                      <el-input type="password" maxlength="20" show-password v-model="pwdModify.newPassword" />
                    </el-col>
                  </el-form-item>
                  <el-form-item label="再次输入新密码" prop="confirmPassword">
                    <el-col :span="6">
                      <el-input type="password" maxlength="20" show-password v-model="pwdModify.confirmPassword" @keyup.enter="savePassword('modifyPwdForm')"/>
                    </el-col>
                  </el-form-item>
                  <div class="form-footer">
                    <el-button type="primary" @click="savePassword('modifyPwdForm')">更改密码</el-button>
                  </div>
                </el-form>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
        <div class="box-content" v-else>
          对不起，该功能仅对已登录用户开放。
        </div>
      </el-card>
    </el-col>
    <!-- 右侧空白 -->
    <el-col :span="3"></el-col>
  </el-row>
</template>

<script>
import { 
  EmailPush as IconEmailPush,
  User as IconUser,
  Time as IconTime,
  LinkTwo as IconLinkTwo,
  FinancingOne as IconFinancingOne,
  Financing as IconFinancing,
  Funds as IconFunds
} from '@icon-park/vue-next'
import { ElMessage } from 'element-plus'
import myUpload from 'vue-image-crop-upload'
import { getUrl } from '@/utils/image'
import { useUserStore } from '@/pinia/modules/user'
import { setSelfInfo, changePassword } from '@/api/user.js'
import { useRouter } from 'vue-router'

export default {
  name: "Setting",
  components: {
    myUpload,
    IconTime,
    IconUser,
    IconEmailPush,
    IconLinkTwo,
    IconFinancingOne,
    IconFinancing,
    IconFunds
  },
  created() {
    this.updateLoginStatus()
  },
  computed: {
    userCreatedAt() {
      let date = this.userStore.userInfo.CreatedAt
      var dateString = new Date(date)
      let year = dateString.getFullYear()
      let month = dateString.getMonth() + 1 < 10 ? '0' + (dateString.getMonth() + 1) : dateString.getMonth() + 1
      let day = dateString.getDate() < 10 ? '0' + (dateString.getDate()) : dateString.getDate()
      let hour = dateString.getHours() < 10 ? '0' + dateString.getHours() : dateString.getHours()
      let minute = dateString.getMinutes() < 10 ? '0' + dateString.getMinutes() : dateString.getMinutes()
      let second = dateString.getSeconds() < 10 ? '0' + dateString.getSeconds() : dateString.getSeconds()
      let FormattedDateTime = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
      return FormattedDateTime
    },
    inviteLink() {
      let domain = import.meta.env.VITE_BASE_PATH
      let inviteCode = this.userStore.userInfo.uuid
      return domain.trimEnd('/') + '/#/patent/signup?inviteFrom=' + inviteCode
    },
    userCoin() {
      let coin = this.userStore.userInfo.coin
      let gold = Math.floor(coin / (100*100))
      let silver = Math.floor(( coin - gold * (100*100)) / 100)
      let copper = coin - (gold * 100 * 100) - (silver* 100)
      return {
        gold: gold,
        silver: silver,
        copper: copper,
      }
    }
  },
  data() {
    return {
      userStore: useUserStore(),
      router: useRouter(),
      isLogin: false,
      activeTabName: "profile",
      uploadHeadImgShow: false,
      imgDataUrl: "",
      path: import.meta.env.VITE_BASE_API,
      pwdModify: {
        password: "",
        newPassword: "",
        confirmPassword: "",
      },
      rules: {
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '最少6个字符', trigger: 'blur' },
        ],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 6, message: '最少6个字符', trigger: 'blur' },
        ],
        confirmPassword: [
          { required: true, message: '请输入确认密码', trigger: 'blur' },
          { min: 6, message: '最少6个字符', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (value !== this.pwdModify.newPassword) {
                callback(new Error('两次密码不一致'))
              } else {
                callback()
              }
            },
            trigger: 'blur',
          },
        ],
      }
    }
  },
  methods: {
    updateLoginStatus() {
      if (this.userStore.token) {
        this.isLogin = true
        this.userStore.GetUserCoinHistory()
      } else {
        this.isLogin = false
      }
    },
    handleTabClick(tab, event) {

    },
    toggleShow() {
      this.uploadHeadImgShow = !this.uploadHeadImgShow;
    },
    cropSuccess(imgDataUrl){

    },
    // TODO: 修改上传组件源码 对jsonData响应进行错误判断
    async cropUploadSuccess(jsonData, field){
      if (jsonData.data?.file?.url) {
        let val = jsonData.data.file.url
        const res = await setSelfInfo({ headerImg: val })
        if (res.code === 0) {
          this.userStore.ResetUserInfo({ headerImg: val })
          ElMessage({
            type: 'success',
            message: '设置成功',
          })
        }
      } else {
        ElMessage({
          showClose: true,
          message: jsonData.msg,
          type: 'error'
        })
        if (jsonData.data && jsonData.data.reload) {
          this.userStore.token = ''
          localStorage.clear()
          this.router.push({ name: 'Signin', replace: true})
        }
      }

    },
    cropUploadFail(status, field){
      console.log('-------- upload fail --------');
      console.log(status);
    },
    getUrl: getUrl,
    async savePassword(formname) {
      this.$refs[formname].validate(async (valid) => {
        if (valid) {
          changePassword({
            password: this.pwdModify.password,
            newPassword: this.pwdModify.newPassword,
          }).then((res) => {
            if (res.code === 0) {
              ElMessage.success('修改密码成功！')
              this.pwdModify = {
                password: "",
                newPassword: "",
                confirmPassword: "",
              }
              this.$refs[formname].clearValidate()
              this.activeTabName = "profile"
            }
          })
        } else {
          return false
        }
      })
    }
  }
}

</script>

<style lang="scss" scoped>
.header-info {
  height: 25px;
}

.box-content {
  background-image: url("@/assets/setting.svg");
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

.box-content-label {
  display: flex;
  justify-content: center;
  width: 120px;
}

.box-content-value {
  line-height: 40px;
}

.tips {
  margin-left: 120px;
  margin-top: 10px;
  color: #999;
}

.form-footer {
  margin-top: 30px;
  width: 55%;
  text-align: center;
}

.middle {
  margin-top:auto;
}

.headImgHelp {
  color: #999;
}

a:link {
  text-decoration: none;
  color: black;
}

a:visited {
  text-decoration: none;
  color: black;
}

a:hover {
  text-decoration: none;
  color: black;
  background-color: azure;
}

a:active {
  text-decoration: none;
  color: black;
}

</style>
