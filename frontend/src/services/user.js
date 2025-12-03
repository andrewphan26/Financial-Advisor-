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

function registerCustomer(data) {
  return new Promise((resolve, reject) => {
    requestSrv({
      data,
      method: 'POST',
      path: `/user/customer-register/`,
    })
      .then((res) => resolve(res.data))
      .catch((error) => reject(error.response.data))
  })
}

function registerNApplyLoan(data) {
  return new Promise((resolve, reject) => {
    requestSrv({
      data,
      method: 'POST',
      path: `/user/customer-loan-n-register/`,
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

function getUserInfo(userID) {
  return new Promise((resolve, reject) => {
    requestSrv({
      path: `/user/${userID}`,
    })
      .then((res) => resolve(res.data))
      .catch((error) => reject(error.response.data))
  })
}

function getPersonalInfo() {
  return new Promise((resolve, reject) => {
    requestSrv({
      path: `/user/personal-info/`,
    })
      .then((res) => resolve(res.data))
      .catch((error) => reject(error.response.data))
  })
}

function getEmploymentInfo() {
  return new Promise((resolve, reject) => {
    requestSrv({
      path: `/user/employment-info/`,
    })
      .then((res) => resolve(res.data))
      .catch((error) => reject(error.response.data))
  })
}

function updatePersonalInfo(data) {
  return new Promise((resolve, reject) => {
    requestSrv({
      data,
      method: 'PUT',
      path: `/user/personal-info/`,
    })
      .then((res) => resolve(res.data))
      .catch((error) => reject(error.response.data))
  })
}

function updateEmploymentInfo(data) {
  return new Promise((resolve, reject) => {
    requestSrv({
      data,
      method: 'PUT',
      path: `/user/employment-info/`,
    })
      .then((res) => resolve(res.data))
      .catch((error) => reject(error.response.data))
  })
}

export default {
  register,
  registerCustomer,
  registerNApplyLoan,

  login,

  getPersonalInfo,
  getEmploymentInfo,
  updatePersonalInfo,
  updateEmploymentInfo,
  getUserInfo,
}
