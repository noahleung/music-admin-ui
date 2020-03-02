import HttpKit from '@/utils/http-kit'

export default {
  songsCharts () {
    return HttpKit.get(`/admin/songs_charts`).then(
      res => res.data
    )
  },
  historyCharts () {
    return HttpKit.get(`/admin/history_charts`).then(
      res => res.data
    )
  }
}
