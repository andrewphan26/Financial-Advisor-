import requestSrv from './index'

function applyLoan(data) {
  return new Promise((resolve, reject) => {
    requestSrv({
      data,
      method: 'POST',
      path: `/user/apply-loan`,
    })
      .then((res) => resolve(res.data))
      .catch((error) => reject(error.response.data))
  })
}

function getCustomerLoans() {
  return new Promise((resolve, reject) => {
    requestSrv({
      path: `/loan/customer/history`,
    })
      .then((res) => resolve(res.data))
      .catch((error) => reject(error.response.data))
  })
}

function getLoanInfo(loanId) {
  return new Promise((resolve, reject) => {
    requestSrv({
      path: `/loan/customer/${loanId}`,
    })
      .then((res) => resolve(res.data))
      .catch((error) => reject(error.response.data))
  })
}

export default {
  applyLoan,
  getCustomerLoans,
  getLoanInfo,
}
