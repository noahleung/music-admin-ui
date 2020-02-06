<template>
<white-board>
  <el-dialog title="歌曲信息" :visible.sync="dialogFormVisible" style="margin-top: -5%;">
    <el-form :model="songs">
      <el-form-item label="歌曲名称" >
        <el-input v-model="songs.name"></el-input>
      </el-form-item>
      <el-form-item label="歌词" >
        <el-input type="textarea" v-model="songs.lyrics"></el-input>
      </el-form-item>

      <el-form-item label="类型" >
        <el-select v-model="songs.type"  placeholder="请选择" style="margin-left: 30px">
          <el-option
            v-for="item in type"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="所属专辑">
        <el-select v-model="songs.albumId" filterable placeholder="请选择">
          <el-option
            v-for="item in list"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="单曲图片">
        <el-upload
          class="avatar-uploader"
          :action="pictureServerUrl"
          accept="image/png,image/gif,image/jpg,image/jpeg"
          :before-upload="beforeAvatarUpload"
          :show-file-list="false"
          :on-success="answerImageSuccess"
          style="">
          <el-popover v-if="hideOrShow(songs.picture)"
                      placement="left"
                      trigger="hover">
            <img :src="songs.picture" style="width: 500px"/>
            <img slot="reference" :src="songs.picture" :alt="songs.picture" class="avatar">
          </el-popover>
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          <div slot="tip"></div>
        </el-upload>
      </el-form-item>

      <el-form-item label="单曲资源">
        <el-upload
          class="avatar-uploader"
          :before-upload="beforeMusicUpload"
          :action="musicServerUrl"
          accept="mp3"
          :show-file-list="false"
          :on-success="answerMusicSuccess"
          style="">
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
        <audio v-if="this.songs.url" :src="this.songs.url" controls="controls" controlsList="nodownload"></audio>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="closeDialog()">取 消</el-button>
      <el-button type="primary" @click="addOrUpdate()">确 定</el-button>
    </div>
  </el-dialog>
  <!--分界线---------------------- -->
  <div>
    <el-input v-model="keywords" placeholder="请输入搜索的单曲名称" style="width: 30%" size="medium" @keyup.enter.native="search"></el-input>
    <el-button @click="search" size="medium">搜索</el-button><el-button @click="addOne" size="medium">添加单曲</el-button>
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
        <el-button  size="mini" type="primary" @click="edit(scope.row.id)">编辑单曲</el-button>
        <el-button  size="mini" type="danger" @click="del(scope.row.id)">删除单曲</el-button>
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
import SongsApi from '@/api/SongsApi'
import AlbumApi from '@/api/AlbumApi'
export default {
  name: 'songs',
  components: {
    'white-board': WhiteBoard
  },
  data () {
    return {
      musicServerUrl: 'http://116.62.37.59:9090/music/upload',
      pictureServerUrl: 'http://116.62.37.59:9090/picture/upload',
      screenHeight: document.documentElement.clientHeight,
      dialogFormVisible: false,
      keywords: '',
      songs: {
        id: '',
        name: '',
        picture: '',
        url: '',
        lyrics: '',
        albumName: '',
        albumId: '',
        type: ''
      },
      searchDto: {
        keywords: '',
        page: 1,
        size: 7,
        total: 0
      },
      type: [{
        value: 'pop',
        label: '流行'
      }, {
        value: 'rock',
        label: '摇滚'
      }, {
        value: 'jazz',
        label: '爵士'
      }, {
        value: 'original',
        label: '原创'
      }, {
        value: 'cover',
        label: '翻唱'
      }, {
        value: 'light',
        label: '轻音乐'
      }],
      tableData: [],
      multipleSelection: [], // 多选后把选中的对象往里面放
      deleteSelection: [], // 把多选后把选中的对象的id往里面放
      options: [],
      value: '',
      list: []
    }
  },
  methods: {
    addOrUpdate () {
      SongsApi.songsAddOrUpdate(this.songs).then(data => {
        this.$message({
          message: '添加/修改 成功',
          type: 'success'
        })
        this.closeDialog()
        this.search()
      })
    },
    edit (id) {
      this.closeDialog()
      AlbumApi.findSearchAlbumDto().then(data => {
        // select的远程搜索专用接口
        this.list = data
        SongsApi.findSongsById(id).then(data => {
          console.log(data)
          this.songs.id = data.id
          this.songs.name = data.name
          this.songs.picture = data.picture
          this.songs.url = data.url
          this.songs.lyrics = data.lyrics
          this.songs.albumId = data.albumId
          this.songs.type = data.type
          this.dialogFormVisible = true
        })
      })
    },
    beforeMusicUpload (file) {
      const isMp3 = file.type === 'audio/mp3'
      const isLt10M = file.size / 1024 / 1024 < 10
      if (!isMp3 || !isLt10M) {
        this.$message.error('只能上传小于10MB的mp3')
      }
      return isMp3 && isLt10M
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
      this.songs.picture = res
    },
    answerMusicSuccess (res, file) {
      this.songs.url = res
    },
    hideOrShow (flag) {
      if (flag !== '') {
        return true
      } else {
        return false
      }
    },
    closeDialog () {
      this.songs.id = ''
      this.songs.name = ''
      this.songs.picture = ''
      this.songs.url = ''
      this.songs.lyrics = ''
      this.songs.albumName = ''
      this.songs.albumId = ''
      this.songs.type = ''
      this.dialogFormVisible = false
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
      this.deleteSelection = []
      for (var i = 0; i < this.multipleSelection.length; i++) {
        this.deleteSelection.push(this.multipleSelection[i].id)
      }
    },
    batchDelete () {
      if (this.deleteSelection.length === 0) {
        this.$message.error('还没选择要删除的单曲')
      } else {
        SongsApi.songsDelete(this.deleteSelection).then(data => {
          this.$message({
            message: '批量删除成功',
            type: 'success'
          })
          this.search()
        })
      }
    },
    addOne () {
      this.closeDialog()
      this.dialogFormVisible = true
      AlbumApi.findSearchAlbumDto().then(data => {
        // select的远程搜索专用接口
        this.list = data
      })
    },
    del (id) {
      SongsApi.songsDelete(id).then(data => {
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        this.search()
      })
    },
    search () {
      this.searchDto.keywords = this.keywords
      SongsApi.findSongsBySongsName(this.searchDto).then(data => {
        console.log(data)
        this.tableData = data.data
        this.searchDto.page = data.page
        this.searchDto.size = data.size
        this.searchDto.total = data.total
      })
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
