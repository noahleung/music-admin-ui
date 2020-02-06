<template>
  <white-board>
    <el-table
      class="tableBox"
      :data="reportCommentsSearchDto"
      style="width: 100%"
      :height="screenHeight * 0.75">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        prop="accountName"
        label="发表者名称"
        width="250">
      </el-table-column>
      <el-table-column
        prop="commentsContent"
        label="内容"
        width="300">
      </el-table-column>
      <el-table-column
        prop="reason"
        label="举报理由"
        width="250">
      </el-table-column>
      <el-table-column
        prop="createAt"
        label="发表日期"
        width="200">
      </el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button  size="mini" type="success" @click="reportPass(scope.row.id)">举报成功</el-button>
          <el-button  size="mini" type="danger" @click="reportReject(scope.row.id)">举报失败</el-button>
        </template>
      </el-table-column>
    </el-table>
  </white-board>
</template>

<script>
import WhiteBoard from '@/components/layout/white-board'
import ReportApi from '@/api/ReportApi'
export default {
  name: 'ReportComments',
  components: {
    'white-board': WhiteBoard
  },
  data () {
    return {
      reportCommentsSearchDto: [],
      screenHeight: document.documentElement.clientHeight,
      searchDto: {
        page: 1,
        size: 7
      },
      multipleSelection: [],
      changeSelection: []
    }
  },
  methods: {
    reportPass (ids) {
      ReportApi.reportPass(ids).then(data => {
        this.findAll()
      })
    },
    reportReject (ids) {
      ReportApi.reportReject(ids).then(data => {
        this.findAll()
      })
    },
    findAll () {
      ReportApi.findAllNone(this.searchDto).then(data => {
        this.reportCommentsSearchDto = data.data
      })
    }
  },
  mounted () {
    this.findAll()
  }
}
</script>

<style scoped>

</style>
