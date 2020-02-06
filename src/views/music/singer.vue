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
        <el-button @click="closeDialog()">取 消</el-button>
        <el-button type="primary" @click="addOrUpdate()">确 定</el-button>
      </div>
      <el-row>
      <el-upload
        class="avatar-uploader"
        :action="serverUrl"
        accept="image/png,image/gif,image/jpg,image/jpeg"
        :before-upload="beforeAvatarUpload"
        :show-file-list="false"
        :on-success="answerImageSuccess"
        style="" >
        <el-popover v-if="hideOrShow(singer.picture)"
                    placement="left"
                    trigger="hover">
          <img :src="singer.picture" style="width: 500px"/>
          <img slot="reference" :src="singer.picture" :alt="singer.picture" class="avatar">
        </el-popover>
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        <div slot="tip">歌手图片</div>
      </el-upload>
      </el-row>
    </el-dialog>

    <div>
      <el-input v-model="keywords" placeholder="请输入搜索的歌手名称" style="width: 30%" @keyup.enter.native="search"></el-input>
      <el-button @click="search">搜索</el-button><el-button @click="addOne">添加歌手</el-button>
      <el-button @click="batchDelete" type="danger">批量删除</el-button>
    </div>
    <div>
      <el-table
        class="tableBox"
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
            <el-button  size="mini" type="primary" @click="edit(scope.row.id)">编辑歌手</el-button>
            <el-button  size="mini" type="danger" @click="del(scope.row.id)">删除歌手</el-button>
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
      serverUrl: 'http://116.62.37.59:9090/picture/upload',
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
      deleteSelection: [] // 把多选后把选中的对象的id往里面放
    }
  },
  methods: {
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt1M = file.size / 1024 / 1024 < 1
      if (!isJPG || !isLt1M) {
        this.$message.error('只能上传小于1MB的jpg图片')
      }
      return isJPG && isLt1M
    },
    answerImageSuccess (res, file) {
      this.singer.picture = res
    },
    hideOrShow (flag) {
      if (flag !== '') {
        return true
      } else {
        return false
      }
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
      this.deleteSelection = []
      for (var i = 0; i < this.multipleSelection.length; i++) {
        this.deleteSelection.push(this.multipleSelection[i].id)
      }
    },
    search () {
      this.searchDto.keywords = this.keywords
      SingerApi.findSingerBySingerName(this.searchDto).then(data => {
        this.tableData = data.data
        this.searchDto.page = data.page
        this.searchDto.size = data.size
        this.searchDto.total = data.total
      })
    },
    submit () {
      this.closeDialog()
    },
    closeDialog () {
      this.dialogFormVisible = false
      this.singer.name = ''
      this.singer.id = ''
      this.singer.introduction = ''
      this.singer.picture = ''
    },
    addOne () {
      this.closeDialog()
      this.dialogFormVisible = true
    },
    addOrUpdate () {
      SingerApi.singerAddOrUpdate(this.singer).then(data => {
        this.$message({
          message: '添加/修改 成功',
          type: 'success'
        })
        this.closeDialog()
        this.search()
      })
    },
    edit (id) {
      SingerApi.findSingerById(id).then(data => {
        this.singer.id = data.id
        this.singer.picture = data.picture
        this.singer.name = data.name
        this.singer.introduction = data.introduction
        this.dialogFormVisible = true
      })
    },
    del (id) {
      SingerApi.singerDelete(id).then(data => {
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        this.search()
      })
    },
    batchDelete () {
      if (this.deleteSelection.length === 0) {
        this.$message.error('还没选择要删除的歌手')
      } else {
        SingerApi.singerDelete(this.deleteSelection).then(data => {
          this.$message({
            message: '批量删除成功',
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

<style scoped>
  el-input{
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
  display: block;
}
</style>
