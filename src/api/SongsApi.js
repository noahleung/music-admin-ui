import HttpKit from '@/utils/http-kit'

export default {
  findSongsBySongsName (searchDto) {
    return HttpKit.post(`/visitor/find_songs_by_keywords`, searchDto).then(
      res => res.data
    )
  },
  findSearchAlbumDto () {
    // 查找所有的专辑标签
    return HttpKit.get(`/admin/find_search_album_dto`).then(
      res => res.data
    )
  },
  findSongsById (id) {
    return HttpKit.get(`/user/find_songs_by_id/${id}`).then(
      res => res.data
    )
  },
  findAllDeletedSongs (searchDto) {
    return HttpKit.post(`/admin/find_all_deleted_songs`, searchDto).then(
      res => res.data
    )
  },
  songsDelete (ids) {
    return HttpKit.get(`/admin/songs_delete/${ids}`).then(
      res => res.data
    )
  },
  songsAddOrUpdate (songs) {
    return HttpKit.post(`/admin/songs_add_or_update`, songs).then(
      res => res.data
    )
  },
  songsRestore (ids) {
    return HttpKit.get(`/admin/songs_restore/${ids}`).then(
      res => res.data
    )
  }
}
