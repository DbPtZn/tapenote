import { AxiosInstance } from "axios"

export const synthesizer = (axios: AxiosInstance) => {
  return {
    download<T>(id: string) {
      return axios.get<T>('/synthesizer/read/' + id)
    }
  }
}