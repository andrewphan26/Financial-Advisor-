import requestSrv from './index'

function register(data) {
  return new Promise((resolve, reject) => {
    requestSrv({
      data,
      method: 'POST',
      path: `/user/register/`,
    })
      .then((res) => resolve(res.data))
      .catch((error) => reject(error.response.data))
  })
}

function login(data) {
  return new Promise((resolve, reject) => {
    requestSrv({
      data,
      method: 'POST',
      path: `/user/login/`,
    })
      .then((res) => resolve(res.data))
      .catch((error) => reject(error.response.data))
  })
}

export default {
  register,
  login,
}
