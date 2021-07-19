import axios from "axios"
import router from "next/router"
const baseUrl = 'http://localhost:8000'

export const login = (body) =>
  axios.post(`${baseUrl}/login`, body)

export const getCourses = () =>
  axios.get(`${baseUrl}/courses`)

export const payment = (body, options) => {
  return axios.post(`${baseUrl}/buyCourse`, body, options)
}