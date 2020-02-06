import {Message} from 'element-ui'
import axios from 'axios'
import router from '../router'
axios.defaults.baseURL = process.env.HOME_URL
axios.defaults.timeout = 30 * 1000 // 设置接口响应时间
axios.defaults.withCredentials = true

/**
 * 功能描述：Http Request 拦截器
 */
const URL_WHITE_TOKEN_LIST = [
  ''
]
axios.interceptors.request.use((request) => {
  // 每次发送都把内存中的token添加到请求头
  if (URL_WHITE_TOKEN_LIST.indexOf(request.url) === -1) {
    request.headers.common['authorization'] = window.localStorage.token
  }
  request.headers.common['Content-Type'] = 'application/json;charset=UTF-8'
  return request
  // 结束
}, (error) => { // 请求错误时做些事(接口错误、超时等)
  Message.error(`请求参数错误`, 10)
  return Promise.reject(error) // 在调用的那边可以拿到(catch)你想返回的错误信息
})

/**
 * 功能描述：Http Response 拦截器
 */
axios.interceptors.response.use((res) => {
  window.localStorage.token = res.headers['authorization']
  // 把请求头获取的token放到存储中
  let isTips = res.config.showMessage === undefined || res.config.showMessage === true
  let data = res.data

  /* 根据返回的code值来做不同的处理（和后端约定） */
  switch (data.code) {
    case 200:
      return Promise.resolve(data)
    case 401:
      return Promise.resolve(data)
    default:
      isTips && Message.error(`服务器返回异常：${data.message}`, 10)
      return Promise.reject(res)
  }
}, (error) => {
  if (error && error.response) {
    switch (error.response.status) {
      case 400:
        Message.error(`服务器返回异常：${error}`, 10)
        break
      case 401:
        Message.warning('还没登录或账号已经过期')
        window.localStorage.token = 'expired'
        router.push({ name: 'Login' })
        break
      default:
        Message.error(`服务器返回异常：${error}`, 10)
        break
    }
  }
  return Promise.reject(error)
})

export default {
  get (url, data = {}) {
    return new Promise((resolve, reject) => {
      axios.get(url, data).then(response => {
        resolve(response)
      }).catch(err => {
        reject(err)
      })
    })
  },
  delete (url, data = {}) {
    return new Promise((resolve, reject) => {
      axios.delete(url, data).then(response => {
        resolve(response)
      }).catch(err => {
        reject(err)
      })
    })
  },
  post (url, data = {}) {
    return new Promise((resolve, reject) => {
      axios.post(url, data).then(response => {
        resolve(response)
      }, err => {
        reject(err)
      })
    })
  },
  put (url, data = {}) {
    return new Promise((resolve, reject) => {
      axios.put(url, data).then(response => {
        resolve(response)
      }, err => {
        reject(err)
      })
    })
  },
  patch (url, data = {}) {
    return new Promise((resolve, reject) => {
      axios.patch(url, data).then(response => {
        resolve(response)
      }, err => {
        reject(err)
      })
    })
  }
}
