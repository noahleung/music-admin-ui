import HttpKit from '@/utils/http-kit'

export default {
  findSingerBySingerName (searchDto) {
    return HttpKit.post(`/visitor/find_singer_by_keywords`, searchDto).then(
      res => res.data
    )
  },
  findSearchSingerDto () {
    return HttpKit.get(`/admin/find_search_singer_dto`).then(
      res => res.data
    )
  },
  singerAddOrUpdate (singer) {
    return HttpKit.post(`/admin/singer_add_or_update`, singer).then(
      res => res.data
    )
  },
  singerDelete (ids) {
    return HttpKit.get(`/admin/singer_delete/${ids}`).then(
      res => res.data
    )
  },
  singerRestore (ids) {
    return HttpKit.get(`/admin/singer_restore/${ids}`).then(
      res => res.data
    )
  },
  findSingerById (id) {
    return HttpKit.get(`/visitor/find_singer_by_id/${id}`).then(
      res => res.data
    )
  },
  findAllDeletedSinger (searchDto) {
    return HttpKit.post(`/admin/find_all_deleted_singer`, searchDto).then(
      res => res.data
    )
  }

}
