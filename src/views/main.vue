<template>
  <el-container>
    <el-dialog title="修改密码" :visible.sync="updatePasswordVisible" style="width: 60%;margin-left: 20%">
      <el-form :model="passwordDto">
        <el-form-item label="原密码" >
          <el-input v-model="passwordDto.beforePassword" show-password></el-input>
        </el-form-item>
        <el-form-item label="新密码" >
          <el-input v-model="passwordDto.afterPassword" show-password></el-input>
        </el-form-item>
        <el-form>
          <el-button type="danger" @click="changeUpdatePassword">取消</el-button>
          <el-button type="success" @click="updatePassword()">确定</el-button>
        </el-form>
      </el-form>
    </el-dialog>

    <!--上面那一栏-->
    <el-header>
      <div style="width: 200px; height: 60px; float: left;margin-left: 2.5%">
        <label style="font-size: 16px; font-weight: bold;">肇院听音乐网管理后台</label>
      </div>

      <div style="width: 60px; float: right; cursor: pointer;">
        <el-dropdown>
          <el-avatar icon="el-icon-user-solid" style="box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);"></el-avatar>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>  <el-button type="text" @click="changeUpdatePassword">密码修改</el-button></el-dropdown-item>
            <el-dropdown-item>  <el-link type="primary" @click="logout()">退出登录</el-link></el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-header>

    <el-container>
      <!--左侧栏-->
      <el-aside width="200px">
        <AsideMenu :collapse="isAsideMenuCollapse"></AsideMenu>
      </el-aside>

      <!--主页面-->
      <el-main :style="{height: (screenHeight - 60) + 'px', padding: 0 + 'px ' + 10 + 'px', paddingTop: 10 + 'px'}">
        <transition name="el-fade-in-linear">
          <router-view />
        </transition>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import AsideMenu from '@/components/layout/aside-menu'
import LoginApi from '@/api/LoginApi'
export default {
  name: 'Main',
  components: {
    AsideMenu
  },
  data () {
    return {
      screenHeight: document.documentElement.clientHeight, // 获取可视屏幕高度
      isAsideMenuCollapse: false,
      passwordDto: {
        beforePassword: '',
        afterPassword: ''
      },
      updatePasswordVisible: false
    }
  },
  watch: {
    screenHeight (val) {
      // 为了避免频繁触发resize函数导致页面卡顿，使用定时器
      if (!this.timer) {
        // 一旦监听到的screenWidth值改变，就将其重新赋给data里的screenWidth
        this.screenHeight = val
        this.timer = true
        let that = this
        setTimeout(function () {
          that.timer = false
        }, 400)
      }
    }
  },
  mounted () {
    LoginApi.checkLogin().then(data => {})
  },
  methods: {
    changeUpdatePassword () {
      this.passwordDto.beforePassword = ''
      this.passwordDto.afterPassword = ''
      this.updatePasswordVisible = !this.updatePasswordVisible
    },
    updatePassword () {
      LoginApi.updatePassword(this.passwordDto).then(data => {
        if (data === 'success') {
          LoginApi.logout().then(data => {
            if (data === 'success') {
              this.changeUpdatePassword()
              LoginApi.checkLogin()
              this.$message({
                message: '修改密码成功，请重新登录',
                type: 'success'
              })
            }
          })
        } else {
          this.$message.error('原密码不正确')
        }
      })
    },
    logout () {
      LoginApi.logout().then(data => {
        if (data === 'success') {
          // this.$store.commit('changeUsername', '')
          // this.$store.commit('changeName', '')
          this.$router.push({name: 'Main'})
          this.$message('退出登录成功')
          this.$router.push({name: 'Login'})
        }
      })
    }
  }
}
</script>

<style scoped>
  .el-header, .el-footer {
    background-color: #07DBAB;
    color: #333;
    text-align: center;
    line-height: 60px;
    padding-left: 0px;
    padding-right: 0px;
  }

  .el-footer {
    height: 40px !important;
    line-height: 40px !important;
  }

  .el-aside {
    background-color: #fff;
    color: #333;
    text-align: center;
  }

  .el-main {
    background-color: #eee;
    color: #333;
    text-align: center;
    padding: 0px;
  }

  body > .el-container {
    margin-bottom: 40px;
  }

  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }

  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }
</style>
