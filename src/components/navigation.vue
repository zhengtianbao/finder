<template>
  <div id="navigation">
    <el-menu
    :default-active="this.$route.path"
    mode="horizontal"
    :ellipsis="false"
    router
    >
      <el-menu-item class="meun-item" index="/patent/format">
        <div><el-badge class="mark" hidden value="new">文本格式化</el-badge></div>
      </el-menu-item>
      <el-menu-item class="meun-item" index="/patent/check">
        <div><el-badge class="mark" hidden value="new">形式检查</el-badge></div>
      </el-menu-item>
      <el-menu-item class="meun-item" index="/patent/compare">
        <div><el-badge class="mark" hidden value="new">文本对比</el-badge></div>
      </el-menu-item>
      <div class="flex-grow" />
    </el-menu>
  </div>
</template>

<script>
import { 
  SettingTwo as IconSettingTwo,
  Logout as IconLogout,
  Funds as IconFunds,
  Financing as IconFinancing
} from '@icon-park/vue-next'
import { getUrl } from '@/utils/image'
import defaultUserImg from '@/assets/user.png'


export default {
  name: "Navigation",
  components: {
    IconSettingTwo,
    IconLogout,
    IconFunds,
    IconFinancing,
  },
  data() {
    return {
      defaultUserImg: defaultUserImg,
    }
  },
  methods: {
    headImgErrorHandler() {
      return true
    },
    getUrl: getUrl,
  },
  watch: {
    "$route": {
      immediate: true,
    }
  },
}
</script>

<style lang="scss" scoped>
.flex-grow {
  flex-grow: 1;
}

.mark {
  margin-right: 10px;
  display: inline;
  font-size: 16px;
}

.coin {
  margin-right: 20px;
}

.userinfo {
  display: flex;
  align-items: center;
}

.submenu {
  padding-left: 10px;
  padding-right: 10px;
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

<style>
/* 生成的el-menu没有挂载在#app下，因此使用deep无法生效 */
.el-menu--collapse .el-menu .el-submenu,
.el-menu--popup {
  min-width: 100px !important;;
}
</style>
