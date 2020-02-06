<template>
<white-board>
  <el-dialog title="专辑信息" :visible.sync="dialogFormVisible" style="margin-top: -5%;">
    <el-form :model="album">
      <el-form-item label="专辑名称" >
        <el-input v-model="album.name"></el-input>
      </el-form-item>
      <el-form-item label="专辑简介" >
        <el-input type="textarea" v-model="album.introduction"></el-input>
      </el-form-item>
      <el-form-item label="发行歌手">
        <el-select v-model="album.singerId" filterable placeholder="请选择">
          <el-option
            v-for="item in list"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>

      </el-form-item>
    </el-form>
    <el-row>
      <el-upload
        class="avatar-uploader"
        :action="serverUrl"
        accept="image/png,image/gif,image/jpg,image/jpeg"
        :before-upload="beforeAvatarUpload"
        :show-file-list="false"
        :on-success="answerImageSuccess"
        style="">
        <el-popover v-if="hideOrShow(album.picture)"
                    placement="left"
                    trigger="hover">
          <img :src="album.picture" style="width: 500px"/>
          <img slot="reference" :src="album.picture" :alt="album.picture" class="avatar">
        </el-popover>
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        <div slot="tip">专辑图片</div>
      </el-upload>
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeDialog()">取 消</el-button>
      <el-button type="primary" @click="addOrUpdate()">确 定</el-button>
    </div>
  </el-dialog>

  <div>
    <el-input v-model="keywords" placeholder="请输入搜索的专辑名称" style="width: 30%" size="medium" @keyup.enter.native="search"></el-input>
    <el-button @click="search" size="medium">搜索</el-button><el-button @click="addOne" size="medium">添加专辑</el-button>
    <el-button @click="batchDelete" type="danger" size="medium">批量删除</el-button>
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
        label="专辑名称"
        width="250">
      </el-table-column>
      <el-table-column
        prop="introduction"
        label="专辑简介"
        width="300">
      </el-table-column>
      <el-table-column
        prop="singerName"
        label="所属歌手"
        width="250">
      </el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button  size="mini" type="primary" @click="edit(scope.row.id)">编辑专辑</el-button>
          <el-button  size="mini" type="danger" @click="del(scope.row.id)">删除专辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange1"
      @current-change="handleCurrentChange1"
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
import AlbumApi from '@/api/AlbumApi'
import SingerApi from '@/api/SingerApi'
export default {
  name: 'album',
  components: {
    'white-board': WhiteBoard
  },
  data () {
    return {
      serverUrl: 'http://116.62.37.59:9090/picture/upload',
      screenHeight: document.documentElement.clientHeight,
      dialogFormVisible: false,
      keywords: '',
      album: { // 编辑或者添加用
        id: '', // id
        picture: '', // 照片地址
        introduction: '', // 专辑介绍
        singerId: '', // 歌手id
        name: '', // 专辑名称
        singerName: ''
      },
      searchDto: {
        keywords: '',
        page: 1,
        size: 7,
        total: 0
      },
      tableData: [],
      multipleSelection: [], // 多选后把选中的对象往里面放
      deleteSelection: [], // 把多选后把选中的对象的id往里面放
      options: [],
      value: '',
      list: []
    }
  },
  methods: {
    edit (id) {
      SingerApi.findSearchSingerDto().then(data => {
        // select的远程搜索专用接口
        this.list = data
        console.log(data)
        AlbumApi.findAlbumById(id).then(data => {
          console.log(data)
          this.album.id = data.id // id
          this.album.picture = data.picture // 照片地址
          this.album.introduction = data.introduction // 专辑介绍
          this.album.singerId = data.singerId // 歌手id
          this.album.name = data.name // 专辑名称
          this.dialogFormVisible = true
        })
      })
    },
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt1M = file.size / 1024 / 1024 < 1
      if (!isJPG || !isLt1M) {
        this.$message.error('只能上传小于1MB的jpg图片')
      }
      return isJPG && isLt1M
    },
    answerImageSuccess (res, file) {
      this.album.picture = res
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
    addOne () {
      this.closeDialog()
      this.dialogFormVisible = true
      SingerApi.findSearchSingerDto().then(data => {
        // select的远程搜索专用接口
        this.list = data
      })
    },
    addOrUpdate () {
      AlbumApi.albumAddOrUpdate(this.album).then(data => {
        this.$message({
          message: '添加/修改 成功',
          type: 'success'
        })
        this.closeDialog()
        this.search()
      })
    },
    closeDialog () {
      this.album.id = ''
      this.album.picture = ''
      this.album.introduction = ''
      this.album.singerId = ''
      this.album.name = ''
      this.dialogFormVisible = false
    },
    batchDelete () {
      if (this.deleteSelection.length === 0) {
        this.$message.error('还没选择要删除的专辑')
      } else {
        AlbumApi.albumDelete(this.deleteSelection).then(data => {
          this.$message({
            message: '批量删除成功',
            type: 'success'
          })
          this.search()
        })
      }
    },
    del (id) {
      AlbumApi.albumDelete(id).then(data => {
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        this.search()
      })
    },
    search () {
      this.searchDto.keywords = this.keywords
      AlbumApi.findAlbumByAlbumName(this.searchDto).then(data => {
        this.tableData = data.data
        this.searchDto.page = data.page
        this.searchDto.size = data.size
        this.searchDto.total = data.total
      })
    },
    handleSizeChange1 (val) {
      this.searchDto.size = val
      this.search()
    },
    handleCurrentChange1 (val) {
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
