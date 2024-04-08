import { AxiosInstance } from "axios"
interface AddDto {
  name: string
  audio: string
}

export const bgm = (axios: AxiosInstance) => {
  return {
    add<T>(dto: AddDto) {
      return axios.post<T>('/bgm/update/add', dto)
    },
    getAll<T>() {
      return axios.get<T>('/bgm/read')
    },
    remove<T>(id: string) {
      return axios.delete<T>(`/bgm/delete/` + id)
    }
  }
}