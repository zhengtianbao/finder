<template>
  <el-row>
    <!-- 左侧空白 -->
    <el-col :span="3"></el-col>
    <!-- 中间主体 -->
    <el-col :span="18">
      <el-card class="box-card">
        <template #header>
          <div>
            <div class="header-info">你的积分变动记录</div>
          </div>
        </template>
        <div class="box-content" v-if="isLogin">
          <div>
            <div class="coin-label">剩余积分：</div>
            <div class="coin">
              <IconFunds theme="outline" size="14" />
              {{ userCoin.gold }}
              <IconFinancing theme="two-tone" size="14" :fill="['#333', '#ffd700']" />
              {{ userCoin.silver }}
              <IconFinancing theme="two-tone" size="14" :fill="['#333', '#c0c0c0']" />
              {{ userCoin.copper }}
              <IconFinancing theme="two-tone" size="14" :fill="['#333', '#b87333']" />
            </div>
            <div class="coin-tips">
              <a><IconTipsOne size="14" />关于积分的说明文档</a>
            </div>
          </div>
          <el-table
            ref="multipleTable"
            :data="tableData"
            style="width: 100%"
            row-key="ID"
          >
            <el-table-column align="left" label="时间" width="180" >
              <template #default="scope">
                <div style="color: #999">{{ formatDate(scope.row.CreatedAt) }}</div>
              </template>
            </el-table-column>
            <el-table-column align="left" label="类型" width="180" >
              <template #default="scope">
                <div>{{ formatType(scope.row.type) }}</div>
              </template>
            </el-table-column>
            <el-table-column align="left" label="数额" width="80" >
              <template #default="scope">
                <div v-if="scope.row.count > 0" style="color: green"><b>{{ scope.row.count }}</b></div>
                <div v-else style="color:hotpink"><b>{{ scope.row.count }}</b></div>
              </template>
            </el-table-column>
            <el-table-column align="left" label="余额" width="80" >
              <template #default="scope">
                <div>{{ scope.row.balance }}</div>
              </template>
            </el-table-column>
            <el-table-column align="left" label="描述" >
              <template #default="scope">
                <div style="color: #999">{{ scope.row.desc }}</div>
              </template>
            </el-table-column>
          </el-table>
          <div class="gva-pagination">
            <el-pagination
              :current-page="page"
              :page-size="pageSize"
              :total="total"
              layout="total, prev, pager, next, jumper"
              @current-change="handleCurrentChange"
              @size-change="handleSizeChange"
            />
          </div>
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
  Funds as IconFunds,
  Financing as IconFinancing,
  TipsOne as IconTipsOne
} from '@icon-park/vue-next'
import { getUserCoinHistoryList } from '@/api/coin'
import { useUserStore } from '@/pinia/modules/user'

export default {
  name: "Coin",
  components: {
    IconFunds,
    IconFinancing,
    IconTipsOne
  },
  created() {
    this.updateLoginStatus()
    this.getTableData()
  },
  computed: {
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
      isLogin: false,
      page: 1,
      total: 0,
      pageSize: 10,
      tableData: [],
    }
  },
  methods: {
    updateLoginStatus() {
      if (this.userStore.token) {
        this.isLogin = true
      } else {
        this.isLogin = false
      }
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getTableData()
    },
    async getTableData() {
      if (this.userStore.userInfo.ID == '') {
        await this.userStore.GetUserInfo()
      }
      if (this.userStore.userInfo.ID == "") {
        return
      }
      const table = await getUserCoinHistoryList({
        page: this.page,
        pageSize: this.pageSize,
        user_id: this.userStore.userInfo.ID
      })
      if (table.code === 0) {
        this.tableData = table.data.list
        this.total = table.data.total
        this.page = table.data.page
        this.pageSize = table.data.pageSize
      }
    },
    handleSizeChange(val){
      this.pageSize = val
      this.getTableData()
    },
    formatDate(date) {
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
    formatType(type) {
      switch(type) {
        case 1:
          return "注册获取";
        case 2:
          return "每日登录奖励";
        case 3:
          return "连续登录奖励";
        case 4:
          return "邀请注册奖励";
        case 5:
          return "友情赞助获取";
        case 6:
          return "专利助手聊天消费";
      }
    }
  },
}

</script>

<style lang="scss" scoped>
.coin-label {
  margin-left: 10px;
}
.coin {
  margin-top: 10px;
  margin-left: 10px;
}

.coin-tips {
  margin-left: 10px;
  margin-top: 10px;
  color: #999;
}

.header-info {
  height: 25px;
}

.box-content {
  width: 100%;
  height: 75vh;
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
  text-decoration: underline;
  color: black;
}

a:active {
  text-decoration: underline;
  color: black;
}

</style>
