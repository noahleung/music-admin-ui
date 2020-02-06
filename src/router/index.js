import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/views/main'
import Singer from '@/views/music/singer'
import SingerRestore from '@/views/music/singerRestore'
import Album from '@/views/music/album'
import AlbumRestore from '@/views/music/albumRestore'
import Songs from '@/views/music/songs'
import SongsRestore from '@/views/music/songsRestore'
import ReportComments from '@/views/music/reportComments'
import ReportCommentsHistory from '@/views/music/reportCommentsHistory'
import Login from '@/views/Login'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/Main',
      name: 'Main',
      component: Main,
      children: [
        {
          path: '/Singer',
          name: 'Singer',
          component: Singer
        },
        {
          path: '/SingerRestore',
          name: 'SingerRestore',
          component: SingerRestore
        },
        {
          path: '/Album',
          name: 'Album',
          component: Album
        },
        {
          path: '/AlbumRestore',
          name: 'AlbumRestore',
          component: AlbumRestore
        },
        {
          path: '/Songs',
          name: 'Songs',
          component: Songs
        },
        {
          path: '/SongsRestore',
          name: 'SongsRestore',
          component: SongsRestore
        },
        {
          path: '/ReportComments',
          name: 'ReportComments',
          component: ReportComments
        },
        {
          path: '/ReportCommentsHistory',
          name: 'ReportCommentsHistory',
          component: ReportCommentsHistory
        }
      ]
    },
    {
      path: '/',
      name: 'Login',
      component: Login
    }
  ]
})
