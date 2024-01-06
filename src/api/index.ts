import axios from "axios"

const baseUrl = 'https://mock.mengxuegu.com/mock/644691ecdfa03133b0ca8244'

export const getData = () => {
  return axios.get(`${baseUrl}/mock`)
}