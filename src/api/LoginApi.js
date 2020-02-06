import HttpKit from '@/utils/http-kit'

export default {
  login (loginDto) {
    return HttpKit.post(`/login_and_regist/admin_login`, loginDto).then(
      res => res
    )
  },
  logout () {
    return HttpKit.get(`/user/logout`).then(
      res => res.data
    )
  },
  checkLogin () {
    return HttpKit.get(`/admin/check_login`).then(
      res => res.data
    )
  },
  updatePassword (passwordDto) {
    return HttpKit.post(`/user/update_password`, passwordDto).then(
      res => res.data
    )
  }
}
