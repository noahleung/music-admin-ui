<template>
  <el-menu :default-active="menuList[0].menuName" :style="{height: (screenHeight - 60) + 'px'}" :collapse="collapse">
    <div v-for="menu in menuList" :key="menu.menuName">
      <el-menu-item :index="menu.menuName" v-if="!menu.groupList">
        <i :class="menu.icon" v-if="menu.icon"></i>
        <i v-if="menu.iconBase64" :class="menu.iconBase64"></i>

        <span slot="title" v-if="menu.routerName"><router-link :to="{name: menu.routerName}">{{menu.menuName}}</router-link></span>
        <span slot="title" v-if="menu.url"><a :href="menu.url" target="_blank">{{menu.menuName}}</a></span>
      </el-menu-item>

      <el-submenu :index="menu.menuName" v-else>
        <template slot="title">
          <i :class="menu.icon" v-if="menu.icon"></i>
          <!--<i v-if="menu.iconBase64"><img :src="menu.iconBase64"/>&nbsp;&nbsp;</i>-->
          <i v-if="menu.iconBase64" :class="menu.iconBase64"></i>
          <span slot="title">{{menu.menuName}}</span>
        </template>
        <el-menu-item-group>
          <el-menu-item :index="group.menuName" v-for="group in menu.groupList" :key="group.menuName">
            <i :class="group.icon"></i>
            <!--<i v-if="group.iconBase64"><img :src="group.iconBase64"/>&nbsp;&nbsp;</i>-->
            <i v-if="group.iconBase64" :class="group.iconBase64"></i>

            <span slot="title" v-if="group.routerName"><router-link :to="{name: group.routerName}">{{group.menuName}}</router-link></span>
            <span slot="title" v-if="group.url"><a :href="group.url" target="_blank">{{group.menuName}}</a></span>
          </el-menu-item>
        </el-menu-item-group>
      </el-submenu>
    </div>
  </el-menu>
</template>

<script>
export default {
  name: 'LayoutAsideMenu',
  components: {},
  props: {
    collapse: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  data () {
    return {
      screenHeight: document.documentElement.clientHeight, // 获取可视屏幕高度

      menuList: [{
        iconBase64: 'el-icon-headset',
        menuName: '歌手管理',
        groupList: [{
          iconBase64: 'el-icon-plus',
          menuName: '歌手编辑',
          routerName: 'Singer'
        }, {
          iconBase64: 'el-icon-plus',
          menuName: '歌手恢复',
          routerName: 'SingerRestore'
        }]
      },
      {
        iconBase64: 'el-icon-headset',
        menuName: '专辑管理',
        groupList: [{
          iconBase64: 'el-icon-plus',
          menuName: '专辑增删',
          routerName: 'Album'
        }, {
          iconBase64: 'el-icon-plus',
          menuName: '专辑恢复',
          routerName: 'AlbumRestore'
        }]
      },
      {
        iconBase64: 'el-icon-headset',
        menuName: '单曲管理',
        groupList: [{
          iconBase64: 'el-icon-plus',
          menuName: '单曲增删',
          routerName: 'Songs'
        }, {
          iconBase64: 'el-icon-plus',
          menuName: '单曲恢复',
          routerName: 'SongsRestore'
        }]
      },
      {
        iconBase64: 'el-icon-date',
        menuName: '举报处理',
        groupList: [{
          iconBase64: 'el-icon-time',
          menuName: '待处理举报',
          routerName: 'ReportComments'
        }, {
          iconBase64: 'el-icon-delete',
          menuName: '已处理举报',
          routerName: 'ReportCommentsHistory'
        }]
      },
      {
        iconBase64: 'el-icon-s-data',
        menuName: '系统报表',
        routerName: 'charts'
      }]
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
    const that = this
    window.onresize = () => {
      return (() => {
        window.screenHeight = document.documentElement.clientHeight
        that.screenHeight = window.screenHeight
      })()
    }

    // todo 在非[数据大盘]页面路由刷新后，默认选中的菜单没有调整
  },
  methods: {}
}
</script>

<style scoped>
  /* 屏蔽鼠标[悬浮]在菜单是的[手型]样式,只有[悬浮]在文字上才会触发菜单跳转 */
  .el-menu-item {
    cursor: default;
  }

  /* 左侧菜单[选中]高亮的颜色 */
  .el-menu-item.is-active {
    color: #409EFF!important;
  }

  /* 左侧菜单[选中]高亮的颜色 */
  .el-menu-item.is-active span a {
    color: #409EFF!important;
  }

  /* 左侧菜单[菜单组]背景色 */
  .el-menu-item-group {
    background-color: #F0F0F0;
  }
</style>
