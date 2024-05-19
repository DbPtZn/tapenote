import { AxiosInstance } from "axios"
interface CreateSpeakerDto {
  role: number
  name: string
  avatar: string
  changer?: number
}

export const speaker = (axios: AxiosInstance) => {
  return {
    create<T>(dto: CreateSpeakerDto) {
      return axios.post<T>('/speaker/write/create', dto)
    },
    getAll<T>() {
      return axios.get<T>('/speaker/read')
    },
    delete<T>(id: string) {
      return axios.delete<T>(`/speaker/delete/` + id)
    },
    testTts(role: number) {
      return axios.get('/speaker/read/test/' + role)
    },
    clearTemp(url: string) {
      return axios.post('/speaker/delete/temp',{ url })
    }
  }
}