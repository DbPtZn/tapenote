// import { TrashNameEnum } from '@/enums'
import { AxiosInstance } from 'axios'
type TrashName = 'folder' | 'note' | 'course' | 'procedure'
export const trash = (axios: AxiosInstance) => {
  return {
    get<T>(trashName: TrashName) {
      return axios.get<T>(`/trash/read/${trashName}`)
    },
    // restore<T>(id: string, trashName: TrashNameEnum) {
    //   return axios.patch<T>(`/trash/update/restore`, { id, type: trashName })
    // },
    // delete(id: string, trashName: TrashNameEnum) {
    //   return axios.delete(`/trash/delete/${trashName}/` + id)
    // }
  }
}
