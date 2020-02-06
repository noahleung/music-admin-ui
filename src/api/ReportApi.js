import HttpKit from '@/utils/http-kit'

export default {
  findAllNone (searchDto) {
    return HttpKit.get(`/admin/report_find_all_none/${searchDto.page}/${searchDto.size}`).then(
      res => res.data
    )
  },
  findAllPass (searchDto) {
    return HttpKit.get(`/admin/report_find_all_pass/${searchDto.page}/${searchDto.size}`).then(
      res => res.data
    )
  },
  findAllReject (searchDto) {
    return HttpKit.get(`/admin/report_find_all_reject/${searchDto.page}/${searchDto.size}`).then(
      res => res.data
    )
  },
  reportPass (ids) {
    return HttpKit.get(`/admin/report_pass/${ids}`).then(
      res => res.data
    )
  },
  reportReject (ids) {
    return HttpKit.get(`/admin/report_reject/${ids}`).then(
      res => res.data
    )
  }
}
