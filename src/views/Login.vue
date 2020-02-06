<template>
  <div class="back" :style="{height: (screenHeight) + 'px'}" >
    <span style="text-align: center;font-size: 30px;color:white;font-weight: bold;opacity: 0.9;font-family: 微软雅黑;margin-top: 10px;display: inline-block">肇院听</span>
    <div style="width: 280px;background: white;margin: 7% auto 0 auto;height: 35%;padding: 20px 80px;border-radius: 10px">
      <span style="font-weight: bold;font-size: 20px">管理员登录</span>
      <el-form :model="account" style="margin-top: 15%">
        <el-form-item >
          <el-input prefix-icon="el-icon-s-custom" v-model="account.username" placeholder="账号" ></el-input>
        </el-form-item>
        <el-form-item >
          <el-input show-password prefix-icon="el-icon-lock" v-model="account.password" placeholder="密码" @keyup.enter.native="login()"></el-input>
          <span style="color: red">{{resultTips}}</span>
        </el-form-item>
        <el-form-item>
          <el-button  type="primary" @click="login()" style="width: 30%" @keyup.enter.native="login()">登录</el-button>
        </el-form-item>
      </el-form>
    </div>

  </div>
</template>

<script>
import LoginApi from '@/api/LoginApi'
export default {
  name: 'Login',
  data () {
    return {
      screenHeight: document.documentElement.clientHeight,
      account: {
        username: '',
        password: ''
      },
      resultTips: ''
    }
  },
  methods: {
    login () {
      LoginApi.login(this.account).then(data => {
        if (data.message === 'success') {
          this.$message('登陆成功')
          this.$router.push({name: 'Main'})
        } else if (data.data === 'not exist') {
          this.resultTips = '账号不存在'
        } else {
          this.resultTips = '账号或密码错误'
        }
      })
    }
  }
}
</script>

<style scoped>
  h1, h2 {
    font-weight: normal;
  }
  ul {
    list-style-type: none;
    padding: 0;
  }
  li {
    display: inline-block;
    margin: 0 10px;
  }
  a {
    color: #42b983;
  }
  .back{
    background-image: url('../assets/login.jpg');
    background-repeat: no-repeat;
    background-size:cover;
    background-attachment: fixed;
  }
</style>
