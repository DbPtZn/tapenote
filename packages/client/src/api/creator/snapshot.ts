import { AxiosInstance } from "axios"

export const snapshot = (axios: AxiosInstance) => {
  return {
    create<T>(id: string) {
      return axios.post<T>('/snapshot/write/' + id)
    },
    getAll<T>(id: string) {
      return axios.get<T>('/snapshot/read/all/' + id)
    },
    get<T>(id: string) {
      return axios.get<T>('/snapshot/read/' + id)
    },
    apply<T>(projectId: string, snapshotId: string) {
      return axios.post<T>(`/snapshot/apply?projectId=${projectId}&snapshotId=${snapshotId}`)
    },
    delete<T>(id: string) {
      return axios.delete<T>(`/snapshot/delete/` + id)
    }
  }
}