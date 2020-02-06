<template>
  <white-board>
    <el-dialog title="歌手信息" :visible.sync="dialogFormVisible" style="margin-top: -5%;">
      <el-form :model="singer">
      <el-form-item label="歌手名称" >
        <el-input v-model="singer.name"></el-input>
      </el-form-item>
      <el-form-item label="歌手简介" >
        <el-input type="textarea" v-model="singer.introduction"></el-input>
      </el-form-item>
    </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog()">关 闭</el-button>
      </div>
      <el-row>
          <img :src="singer.picture" style="width: 30%"/>
        <div slot="tip">歌手图片</div>
      </el-row>
    </el-dialog>

    <div>
      <el-input v-model="keywords" placeholder="请输入搜索的歌手名称" style="width: 30%" @keyup.enter.native="search"></el-input>
      <el-button @click="search" size="medium">搜索</el-button>
      <el-button @click="batchRestore" type="success" size="medium">批量恢复</el-button>
    </div>
    <div>
      <el-table
        :data="tableData"
        style="width: 100%"
        :height="screenHeight * 0.75"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="name"
          label="歌手姓名"
          width="300">
        </el-table-column>
        <el-table-column
          prop="introduction"
          label="歌手简介"
          width="500">
        </el-table-column>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button  size="mini" type="primary" @click="check(scope.row.id)">查看歌手</el-button>
            <el-button  size="mini" type="success" @click="restore(scope.row.id)">恢复歌手</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[7,10]"
        :page-size="this.searchDto.size"
        layout="sizes, prev, pager, next"
        :total="this.searchDto.total">
      </el-pagination>
    </div>
  </white-board>
</template>

<script>
import WhiteBoard from '@/components/layout/white-board'
import SingerApi from '@/api/SingerApi'
export default {
  name: 'singer',
  components: {
    'white-board': WhiteBoard
  },
  data () {
    return {
      screenHeight: document.documentElement.clientHeight,
      dialogFormVisible: false,
      keywords: '',
      singer: {
        id: '',
        picture: '',
        introduction: '',
        name: ''
      },
      searchDto: {
        keywords: '',
        page: 1,
        size: 7,
        total: 0
      },
      tableData: [],
      multipleSelection: [], // 多选后把选中的对象往里面放
      restoreSelection: [] // 把多选后把选中的对象的id往里面放
    }
  },
  methods: {
    handleSelectionChange (val) {
      this.multipleSelection = val
      this.restoreSelection = []
      for (var i = 0; i < this.multipleSelection.length; i++) {
        this.restoreSelection.push(this.multipleSelection[i].id)
      }
    },
    search () {
      this.searchDto.keywords = this.keywords
      SingerApi.findAllDeletedSinger(this.searchDto).then(data => {
        this.tableData = data.data
        this.searchDto.page = data.page
        this.searchDto.size = data.size
        this.searchDto.total = data.total
      })
    },
    closeDialog () {
      this.dialogFormVisible = false
      this.singer.name = ''
      this.singer.id = ''
      this.singer.introduction = ''
      this.singer.picture = ''
    },
    check (id) {
      SingerApi.findSingerById(id).then(data => {
        this.singer.id = data.id
        this.singer.picture = data.picture
        this.singer.name = data.name
        this.singer.introduction = data.introduction
        this.dialogFormVisible = true
      })
    },
    restore (id) {
      SingerApi.singerRestore(id).then(data => {
        this.$message({
          message: '恢复成功',
          type: 'success'
        })
        this.search()
      })
    },
    batchRestore () {
      if (this.restoreSelection.length === 0) {
        this.$message.error('还没选择要恢复的歌手')
      } else {
        SingerApi.singerRestore(this.restoreSelection).then(data => {
          this.$message({
            message: '批量恢复成功',
            type: 'success'
          })
          this.search()
        })
      }
    },
    handleSizeChange (val) {
      this.searchDto.size = val
      this.search()
    },
    handleCurrentChange (val) {
      this.searchDto.page = val
      this.search()
    }
  },
  mounted () {
    this.search()
  }
}
</script>

<style scoped>  el-input{
  width: 500px;
}
.add-item{
  width: 40%;
  margin-left: 5%;
  padding-top: 0px;
  margin-top: 0px;
}

.avatar-uploader-icon {
  border: 1px solid #409EFF;
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}

</style>
