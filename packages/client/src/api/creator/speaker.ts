import { AxiosInstance } from 'axios'
interface CreateSpeakerDto {
  type: 'human' | 'machine'
  model: string
  avatar: string
  name: string
  role: number
  speed: number
  changer: number
}

export const speaker = (axios: AxiosInstance) => {
  return {
    create<T>(dto: CreateSpeakerDto) {
      return axios.post<T>('/speaker/write/create', dto)
    },
    getAll<T>() {
      return axios.get<T>('/speaker/read/all')
    },
    delete<T>(id: string) {
      return axios.delete<T>(`/speaker/delete/` + id)
    },
    testTts(role: number, model: string, speed: number) {
      // console.log(`/speaker/read/test?role=${role}&model=${model}`)
      return axios.get(`/speaker/read/test?role=${role}&model=${model}&speed=${speed}`)
    },
    clearTemp(url: string) {
      return axios.post('/speaker/delete/temp', { url })
    }
  }
}
