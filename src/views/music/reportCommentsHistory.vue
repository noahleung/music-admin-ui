<template>
   <white-board>
     <div>
       <el-select v-model="type" placeholder="请选择" @change="changeType()">
         <el-option
           v-for="item in options"
           :key="item.value"
           :label="item.label"
           :value="item.value">
         </el-option>
       </el-select>

       <el-table
         v-if="passList"
         class="tableBox"
         :data="passList"
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
             <el-button  size="mini" type="danger" @click="reportReject(scope.row.id)">更改为举报失败</el-button>
           </template>
         </el-table-column>
       </el-table>

       <el-table
         v-else
         class="tableBox"
         :data="rejectList"
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
             <el-button  size="mini" type="success" @click="reportPass(scope.row.id)">更改为举报成功</el-button>
           </template>
         </el-table-column>
       </el-table>
     </div>
   </white-board>
</template>

<script>
import WhiteBoard from '@/components/layout/white-board'
import ReportApi from '@/api/ReportApi'
export default {
  name: 'reportCommentsHistory',
  components: {
    'white-board': WhiteBoard
  },
  data () {
    return {
      screenHeight: document.documentElement.clientHeight,
      type: 'pass',
      options: [{
        value: 'pass',
        label: '举报通过'
      }, {
        value: 'reject',
        label: '举报失败'
      }],
      searchDto: {
        page: 1,
        size: 7
      },
      passList: [],
      rejectList: []
    }
  },
  methods: {
    changeType () {
      this.searchDto.page = 1
      this.searchDto.size = 7
      this.findAll()
    },
    findAll () {
      if (this.type === 'pass') {
        ReportApi.findAllPass(this.searchDto).then(data => {
          this.passList = data.data
          this.rejectList = ''
          this.searchDto.page = data.page
          this.searchDto.size = data.size
        })
      } else {
        ReportApi.findAllReject(this.searchDto).then(data => {
          this.rejectList = data.data
          this.passList = ''
          this.searchDto.page = data.page
          this.searchDto.size = data.size
        })
      }
    },
    reportPass (ids) {
      ReportApi.reportPass(ids).then(data => {
        this.findAll()
      })
    },
    reportReject (ids) {
      ReportApi.reportReject(ids).then(data => {
        this.findAll()
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
