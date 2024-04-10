import { AxiosInstance } from 'axios'
interface CreateASRFragmentDto {
  procedureId?: string
  audio: Blob
  duration: number
  role: number
}
interface CreateTTSFragmentDto {
  procedureId?: string
  key?: string
  txt: string
  role: number
  speed: number
}
interface CreateBlankFragmentDto {
  procedureId?: string
  txtLength: number
  duration: number
}
interface UpdateTranscriptDto {
  procedureId?: string
  fragmentId: string
  newTranscript: string[]
}
interface RemoveFragmentDto {
  procedureId?: string
  fragmentId: string
}
interface RestoreFragmentDto {
  procedureId?: string
  fragmentId: string
}
interface DeleteFragmentDto {
  procedureId?: string
  fragmentId: string
}
interface UpdateFragmentsTagsDto {
  fragmentId: string
  tags: (string | null)[]
}
interface AddPromoterDto {
  procedureId?: string
  fragmentId: string
  promoterIndex: number
  promoterSerial: string
  promoterId: string
}
interface RemovePromoterDto {
  procedureId?: string
  fragmentId: string,
  promoterIndex: number
}
interface UpdateSequenceDto {
  procedureId?: string
  fragmentId: string,
  oldIndex: number,
  newIndex: number
}
interface CopyFragmentDto {
  sourceProejctId: string
  targetProejctId: string
  sourceFragmentId: string
  targetFragmentId: string
  position: 'before' | 'after'
  type: 'copy' | 'cut'
}


export const fragment = (axios: AxiosInstance) => {
  return {
    createByAudio<T>(dto: CreateASRFragmentDto) {
      const formdata = new FormData()
      formdata.append('procedureId', dto.procedureId!)
      formdata.append('audio', dto.audio, 'audio.wav') // 必须添加文件名和后缀
      formdata.append('duration', dto.duration.toString())
      formdata.append('role', dto.role.toString())
      return axios.post<T>('/fragment/write/create/asr', formdata, {
        headers: {
          'Content-Type':'multipart/form-data'
        }
      })
    },
    createByText<T>(dto: CreateTTSFragmentDto) {
      return axios.post<T>('/fragment/write/create/tts', dto)
    },
    createBlank<T>(dto: CreateBlankFragmentDto) {
      return axios.post<T>('/fragment/write/create/blank', dto)
    },
    get<T>(procudureId: string) {
      return axios.get<T>('/fragment/read/' + procudureId)
    },
    updateTranscript<T>(dto: UpdateTranscriptDto) {
      return axios.patch<T>('/fragment/update/transcript', dto)
    },
    remove<T>(dto: RemoveFragmentDto) {
      return axios.patch<T>('/fragment/update/remove', dto)
    },
    restore<T>(dto: RestoreFragmentDto) {
      return axios.patch<T>('/fragment/update/restore', dto)
    },
    delete<T>(dto: DeleteFragmentDto) {
      return axios.patch<T>('/fragment/update/delete', dto)
    },
    addPromoter<T>(dto: AddPromoterDto) {
      return axios.patch<T>('fragment/update/promoter/add', dto)
    },
    removePromoter<T>(dto: RemovePromoterDto) {
      return axios.patch<T>('fragment/update/promoter/remove', dto)
    },
    updateFragmentsTags<T>(dto: UpdateFragmentsTagsDto[], procedureId: string) {
      return axios.patch<T>('/fragment/update/tags', { newData: dto, procedureId })
    },
    updateSequence<T>(dto: UpdateSequenceDto) {
      return axios.patch<T>('/fragment/update/sequence', dto)
    },
    copyFragment<T>(dto: CopyFragmentDto) {
      return axios.patch<T>('/fragment/update/copy', dto)
    }
    // getBinData<T>(procudureId: string) {
    //   return axios.get<T>('/fragment/read/bin/' + procudureId)
    // }
  }
}
