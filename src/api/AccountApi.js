import HttpKit from '@/utils/http-kit'

export default {
  accountFindAllPassed () {
    return HttpKit.get(`/admin/account_find_all_passed`).then(
      res => res.data
    )
  },
  accountBan (accountId) {
    return HttpKit.get(`/admin/account_update/${accountId}/ban`).then(
      res => res.data
    )
  },
  accountUnban (accountId) {
    return HttpKit.get(`/admin/account_update/${accountId}/unban`).then(
      res => res.data
    )
  }
}
