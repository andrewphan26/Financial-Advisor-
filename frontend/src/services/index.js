import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:3000'

export default function executeRequest({
  path,
  data = {},
  method = 'GET',
  responseType,
  headers,
  params,
  customRequestUrl,
}) {
  function setQueryString(queryStringObj, methodReq) {
    if (methodReq === 'GET') {
      let queryString = ''
      const firstKeyProp = Object.keys(queryStringObj)[0]

      Object.keys(queryStringObj).forEach((prop) => {
        queryString += `${prop === firstKeyProp ? '?' : '&'}${prop}=${queryStringObj[prop]}`
      })

      return queryString
    }

    return ''
  }

  const url = `${path}${setQueryString(data, method)}`

  return axios({
    method,
    url: customRequestUrl || url,
    data,
    responseType,
    headers,
    params,
  })
    .then((res) => Promise.resolve(res))
    .catch((error) => Promise.reject(error))
}
