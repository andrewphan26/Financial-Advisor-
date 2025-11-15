import requestSrv from './index'

function applyLoan(data) {
  return new Promise((resolve, reject) => {
    requestSrv({
      data,
      method: 'POST',
      path: `/customer/loans/apply`,
    })
      .then((res) => resolve(res.data))
      .catch((error) => reject(error.response.data))
  })
}

export default {
  applyLoan,
}
