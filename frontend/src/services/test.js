import requestSrv from './index'

function testApi() {
  return new Promise((resolve, reject) => {
    requestSrv({
      path: `/api/items/`,
    })
      .then((res) => resolve(res.data))
      .catch((error) => reject(error.response.data))
  })
}

export default {
  testApi,
}
