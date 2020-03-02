<template>
  <white-board>
    <el-table
      v-if="accountList"
      class="tableBox"
      :data="accountList"
      style="width: 100%"
      :height="screenHeight * 0.75">
      <el-table-column
        prop="id"
        label="用户id"
        width="350">
      </el-table-column>
      <el-table-column
        prop="name"
        label="用户名称"
        width="250">
      </el-table-column>
      <el-table-column
        prop="times"
        label="违规次数"
        width="250">
      </el-table-column>
      <el-table-column
        prop="isDel"
        label="状态"
        width="250"
        :formatter="formatStatus">
      </el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button v-if="scope.row.isDel" size="medium"  type="success" @click="unban(scope.row.id)">解封</el-button>
          <el-button v-else size="medium" type="danger"  @click="ban(scope.row.id)">封号</el-button>
        </template>
      </el-table-column>
    </el-table>
  </white-board>
</template>

<script>
import WhiteBoard from '@/components/layout/white-board'
import AccountApi from '@/api/AccountApi'
export default {
  name: 'accountUpdate',
  components: {
    'white-board': WhiteBoard
  },
  data () {
    return {
      accountList: [],
      screenHeight: document.documentElement.clientHeight
    }
  },
  methods: {
    ban (accountId) {
      AccountApi.accountBan(accountId).then(data => {
        if (data === 'success') {
          this.findAll()
        }
      })
    },
    unban (accountId) {
      AccountApi.accountUnban(accountId).then(data => {
        if (data === 'success') {
          this.findAll()
        }
      })
    },
    findAll () {
      AccountApi.accountFindAllPassed().then(data => {
        this.accountList = data
      })
    },
    formatStatus (row, column, cellValue) {
      if (row.isDel === true) {
        return '禁用'
      } else {
        return '正常'
      }
    }
  },
  mounted () {
    this.findAll()
  }

}
</script>

<style scoped>

</style>
