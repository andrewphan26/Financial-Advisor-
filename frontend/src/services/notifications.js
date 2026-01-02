import requestSrv from './index'

function getNotifications() {
  return new Promise((resolve, reject) => {
    requestSrv({
      path: `/notifications/`,
    })
      .then((res) => resolve(res.data))
      .catch((error) => reject(error.response.data))
  })
}

export default {
  getNotifications,
}
