<template>
  <white-board>
    <el-dialog title="歌曲信息" :visible.sync="dialogFormVisible" style="margin-top: -5%;">
      <el-form :model="songs">
        <el-form-item label="歌曲名称" >
          <el-input v-model="songs.name" disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="所属专辑">
          <el-input v-model="songs.albumName" disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="歌词" >
          <el-input type="textarea" v-model="songs.lyrics" disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="单曲图片">
              <img :src="songs.picture" style="width: 30%"/>
        </el-form-item>

        <el-form-item label="单曲资源">
          <audio v-if="this.songs.url" :src="this.songs.url" controls="controls" controlsList="nodownload"></audio>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="closeDialog()">关 闭</el-button>
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
          label="单曲名称"
          width="250">
        </el-table-column>
        <el-table-column
          prop="albumName"
          label="所属专辑"
          width="300">
        </el-table-column>
        <el-table-column
          prop="singerName"
          label="所属歌手"
          width="250">
        </el-table-column>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button  size="mini" type="primary" @click="check(scope.row.id)">查看单曲</el-button>
            <el-button  size="mini" type="danger" @click="restore(scope.row.id)">恢复单曲</el-button>
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
import AlbumApi from '@/api/AlbumApi'
import SongsApi from '@/api/SongsApi'
export default {
  name: 'songsRestore',
  components: {
    'white-board': WhiteBoard
  },
  data () {
    return {
      screenHeight: document.documentElement.clientHeight,
      dialogFormVisible: false,
      keywords: '',
      songs: {
        id: '',
        picture: '',
        url: '',
        lyrics: '',
        albumName: '',
        albumId: ''
      },
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
      restoreSelection: [], // 把多选后把选中的对象的id往里面放
      list: []
    }
  },
  methods: {
    check (id) {
      this.closeDialog()
      SongsApi.findSongsById(id).then(data => {
        console.log(data)
        this.songs.id = data.id
        this.songs.name = data.name
        this.songs.picture = data.picture
        this.songs.url = data.url
        this.songs.lyrics = data.lyrics
        this.songs.albumId = data.albumId
        AlbumApi.findAlbumById(this.songs.albumId).then(data => {
          this.songs.albumName = data.name
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
      SongsApi.findAllDeletedSongs(this.searchDto).then(data => {
        this.tableData = data.data
        this.searchDto.page = data.page
        this.searchDto.size = data.size
        this.searchDto.total = data.total
      })
    },
    closeDialog () {
      this.songs.id = ''
      this.songs.name = ''
      this.songs.picture = ''
      this.songs.url = ''
      this.songs.lyrics = ''
      this.songs.albumName = ''
      this.songs.albumId = ''
      this.dialogFormVisible = false
    },
    restore (id) {
      SongsApi.songsRestore(id).then(data => {
        this.$message({
          message: '恢复成功',
          type: 'success'
        })
        this.search()
      })
    },
    batchRestore () {
      if (this.restoreSelection.length === 0) {
        this.$message.error('还没选择要恢复的单曲')
      } else {
        SongsApi.songsRestore(this.restoreSelection).then(data => {
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
