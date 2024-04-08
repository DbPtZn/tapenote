import { AxiosInstance } from "axios"
interface AddRobotDto {
  role: number
  name: string
  avatar: string
}

interface AddRoleDto {
  role: number
  name: string
  avatar: string
  changer?: number
}

export const timbre = (axios: AxiosInstance) => {
  return {
    addRole<T>(dto: AddRoleDto) {
      return axios.post<T>('/timbre/update/role', dto)
    },
    addRobot<T>(dto: AddRobotDto) {
      return axios.post<T>('/timbre/update/robot', dto)
    },
    getAll<T>() {
      return axios.get<T>('/timbre/read')
    },
    delete<T>(key: number, type: 'role' | 'robot') {
      return axios.delete<T>(`/timbre/delete/${type}&${key}`)
    },
    testRobot(role: number) {
      return axios.get('/timbre/read/robot/test/' + role)
    },
    clearTemp(url: string) {
      return axios.post('/timbre/delete/temp',{ url })
    }
  }
}