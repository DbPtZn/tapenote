import { LibraryEnum } from '@/enums'
import { AxiosInstance } from 'axios'

interface CreateProjectDto {
  lib: LibraryEnum
  folderId: string
  noteId?: string
  procedureId?: string
  penname?: string
  email?: string
  homepage?: string
}

interface UpdateContentDto {
  id: string
  firstPicture?: string
  content: string
}

interface UpdateTitleDto {
  id: string
  title: string
}

interface UpdateSidenoteContentDto {
  id: string,
  content: string
}

interface UpdateSpeakerHistoryDto {
  id: string
  type: 'human' | 'machine'
  speakerId: string
}

interface GetRecentlyDto {
  skip: number
  take: number
  lib: LibraryEnum
}

interface AddSubmissionHistoryDto {
  id: string
  receiver: string
  editionId: string
  address: string
  code: string
  title: string
  content?: string
  penname: string
  email: string
  blog: string
  msg: string
  date: string
}

interface InputDto {
  lib: LibraryEnum
  title: string
  content: string
  firstPicture: string
  cover: string
}

interface AddMemoDto {
  projectId: string
  x: number
  y: number
}

interface DeleteMemoDto {
  projectId: string
  memoId: string
}

interface UpdateMemoContentDto {
  projectId: string
  memoId: string
  content: string
}

interface UpdateMemoStateDto {
  projectId: string
  memoId: string
  isExpanded?: boolean
  bgColor?: 'yellow' | 'green' | 'pink' | 'purple' | 'blue' | 'white' | 'gray'
  height?: number
  width?: number
  x?: number
  y?: number
}


export const project = (axios: AxiosInstance) => {
  return {
    create<T>(dto: CreateProjectDto) {
      return axios.post<T>('/project/write/create', dto)
    },
    get<T>(id: string) {
      return axios.get<T>('/project/read/' + id)
    },
    getRecent<T>(dto: GetRecentlyDto) {
      console.log(dto)
      return axios.get<T>(`/project/recent?skip=${dto.skip}&take=${dto.take}&lib=${dto.lib}`)
    },
    remove<T>(id: string) {
      return axios.patch<T>('/project/update/remove/' + id)
    },
    restore<T>(id: string, folderId: string) {
      return axios.patch<T>('/project/update/restore/'  + id + '&' + folderId)
    },
    delete<T>(id: string) {
      return axios.delete<T>('/project/delete/' + id)
    },
    move<T>(id: string, folderId: string) {
      return axios.patch<T>('/project/update/move', { sourceId: id, folderId })
    },
    copy<T>(id: string, folderId: string) {
      return axios.post<T>('/project/write/copy', { sourceId: id, folderId })
    },
    updateCover<T>(id: string, url: string) {
      return axios.patch<T>('/project/update/cover', { id, url })
    },
    updateCoverPosition<T>(id: string, position: number) {
      return axios.patch<T>('/project/update/cover/position', { id, position })
    },
    updateTitle<T>(dto: UpdateTitleDto) {
      return axios.patch<T>('/project/update/title', dto)
    },
    updateContent<T>(dto: UpdateContentDto) {
      return axios.patch<T>('/project/update/content', dto)
    },
    /** memo */
    addMemo<T>(dto: AddMemoDto) {
      return axios.patch<T>('/project/update/memo/add', dto)
    },
    deleteMemo<T>(dto: DeleteMemoDto) {
      return axios.patch<T>('/project/update/memo/delete', dto)
    },
    updateMemoContent<T>(dto: UpdateMemoContentDto) {
      // console.log('更新')
      return axios.patch<T>('/project/update/memo/content', dto)
    },
    updateMemoState<T>(dto: UpdateMemoStateDto) {
      return axios.patch<T>('/project/update/memo/state', dto)
    },
    /** sidenote update */
    // updateSidenoteContent<T>(dto: UpdateSidenoteContentDto) {
    //   return axios.patch<T>('/project/update/sidenote/content', dto)
    // },
    updateSpeakerHistory<T>(dto: UpdateSpeakerHistoryDto) {
      return axios.patch<T>('/project/update/speaker/history', dto)
    },
    addSubmissionHistory<T>(dto: AddSubmissionHistoryDto) {
      return axios.patch<T>('/project/update/submission/add', dto)
    },
    removeSubmissionHistory<T>(id: string, key: string) {
      return axios.delete<T>('/project/update/submission/remove' + id + '&' + key)
    },

    getRelevantProjects<T>(id: string) {
      return axios.get<T>('/project/read/relevant/' + id)
    },
    getParentProjects<T>(id: string) {
      return axios.get<T>('/project/read/parent/' + id)
    },
    coverCourse<T>(courseId: string, procedureId: string) {
      return axios.post<T>(`/project/write/coverCourse?courseId=${courseId}&procedureId=${procedureId}`)
    },
    input<T>(dto: InputDto) {
      return axios.post<T>('/project/write/input', dto)
    }

    /** 批量投稿（待开发） */
    // submit<T>(dto: SubmitProjectDto) {
    //   return axios.post<T>('/project/submission', dto)
    // },
    /** 批量导出（待开发） */
  }
}
