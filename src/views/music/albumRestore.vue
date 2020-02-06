<template>
  <white-board>
    <el-dialog title="专辑信息" :visible.sync="dialogFormVisible" style="margin-top: -5%;">
      <el-form :model="album">
        <el-form-item label="专辑名称" >
          <el-input v-model="album.name" disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="发行歌手">
          <el-input v-model="album.singerName" disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="专辑简介" >
          <el-input type="textarea" v-model="album.introduction" disabled="true"></el-input>
        </el-form-item>
      </el-form>
      <el-row>
            <img :src="album.picture" style="width: 30%"/>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog()">取 消</el-button>
      </div>
    </el-dialog>
    <div>
      <el-input v-model="keywords" placeholder="请输入搜索的歌手名称" style="width: 30%" @keyup.enter.native="search"></el-input>
      <el-button @click="search" size="medium">搜索</el-button>
      <el-button @click="batchRestore" type="success">批量恢复</el-button>
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
          label="发行歌手"
          width="250">
        </el-table-column>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button  size="mini" type="primary" @click="check(scope.row.id)" >查看专辑</el-button>
            <el-button  size="mini" type="success" @click="restore(scope.row.id)">恢复专辑</el-button>
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
import AlbumApi from '@/api/AlbumApi'
export default {
  name: 'albumRestore',
  components: {
    'white-board': WhiteBoard
  },
  data () {
    return {
      screenHeight: document.documentElement.clientHeight,
      dialogFormVisible: false,
      keywords: '',
      searchDto: {
        keywords: '',
        page: 1,
        size: 7,
        total: 0
      },
      album: { // 编辑或者添加用
        picture: '', // 照片地址
        introduction: '', // 专辑介绍
        singerId: '', // 歌手id
        name: '', // 专辑名称
        singerName: ''
      },
      tableData: [],
      multipleSelection: [], // 多选后把选中的对象往里面放
      restoreSelection: [] // 把多选后把选中的对象的id往里面放
    }
  },
  methods: {
    check (id) {
      AlbumApi.findAlbumById(id).then(data => {
        console.log(data)
        this.album.picture = data.picture // 照片地址
        this.album.introduction = data.introduction // 专辑介绍
        this.album.singerId = data.singerId // 歌手id
        this.album.name = data.name // 专辑名称
        SingerApi.findSingerById(this.album.singerId).then(data2 => {
          this.album.singerName = data2.name
          this.dialogFormVisible = true
        })
      })
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
      this.restoreSelection = []
      for (var i = 0; i < this.multipleSelection.length; i++) {
        this.restoreSelection.push(this.multipleSelection[i].id)
      }
    },
    search () {
      this.searchDto.keywords = this.keywords
      AlbumApi.findAllDeletedAlbum(this.searchDto).then(data => {
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
      this.album.picture = '' // 照片地址
      this.album.introduction = '' // 专辑介绍
      this.album.singerId = '' // 歌手id
      this.album.name = '' // 专辑名称
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
    restore (id) {
      AlbumApi.albumRestore(id).then(data => {
        this.$message({
          message: '恢复成功',
          type: 'success'
        })
        this.search()
      })
    },
    batchRestore () {
      if (this.restoreSelection.length === 0) {
        this.$message.error('还没选择要恢复的专辑')
      } else {
        AlbumApi.albumRestore(this.restoreSelection).then(data => {
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

<style scoped>

</style>
