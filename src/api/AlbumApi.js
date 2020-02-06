import HttpKit from '@/utils/http-kit'

export default {
  findAlbumByAlbumName (searchDto) {
    return HttpKit.post(`/visitor/find_album_by_keywords`, searchDto).then(
      res => res.data
    )
  },
  findSearchAlbumDto () {
    return HttpKit.get(`/admin/find_search_album_dto`).then(
      res => res.data
    )
  },
  findAlbumById (id) {
    return HttpKit.get(`/visitor/find_album_by_id/${id}`).then(
      res => res.data
    )
  },
  findAllDeletedAlbum (searchDto) {
    return HttpKit.post(`/admin/find_all_deleted_album`, searchDto).then(
      res => res.data
    )
  },
  albumDelete (ids) {
    return HttpKit.get(`/admin/album_delete/${ids}`).then(
      res => res.data
    )
  },
  albumAddOrUpdate (album) {
    return HttpKit.post(`/admin/album_add_or_update`, album).then(
      res => res.data
    )
  },
  albumRestore (ids) {
    return HttpKit.get(`/admin/album_restore/${ids}`).then(
      res => res.data
    )
  }
}
