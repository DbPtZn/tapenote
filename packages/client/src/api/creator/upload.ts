// import axios from '../index'
// import axios from "axios"

import { AxiosInstance } from "axios"

export const upload = (axios: AxiosInstance) => {
  return {
    uploadImg(formdata: FormData) {
      return axios.post('/upload/img', formdata)
    }
  }
}
