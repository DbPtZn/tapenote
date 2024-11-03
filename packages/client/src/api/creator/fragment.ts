import { AxiosInstance } from 'axios'
type Action = { animeId: string, serial: string, keyframe: number }
interface CreateASRFragmentDto {
  procedureId?: string
  key?: string
  audio: Blob
  duration: number
  speakerId: string
  actions: Action[]
}
interface CreateTTSFragmentDto {
  procedureId?: string
  key?: string
  txt: string
  speakerId: string
  speed: number
}
interface CreateBlankFragmentDto {
  procedureId?: string
  txtLength: number
  duration: number
  actions?: Action[]
}
interface CreateSegmentFragmentDto {
  key?: string
  audio: Blob
  duration: number
  speaker: any
  txt: string
  timestamps: number[]
  transcript: string[]
  tags: (string | null)[]
  promoters: (string | null)[]
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
  sourceProjectId: string
  targetProjectId: string
  sourceFragmentId: string
  targetFragmentId: string
  position: 'before' | 'after' | 'insert'
  type: 'copy' | 'cut'
}


// interface CreateASRChunkDto {
//   procedureId?: string
//   key?: string
//   speakerId: string
//   audio: Blob
//   duration: number
//   actions: Action[]
// }


export const fragment = (axios: AxiosInstance) => {
  return {
    createByAudio<T>(dto: CreateASRFragmentDto) {
      const formdata = new FormData()
      formdata.append('procedureId', dto.procedureId!)
      formdata.append('audio', dto.audio, 'audio.wav') // 必须添加文件名和后缀
      formdata.append('duration', dto.duration.toString())
      formdata.append('speakerId', dto.speakerId)
      formdata.append('key', dto.key!)
      formdata.append('actions', JSON.stringify(dto.actions))
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
    createBySegment<T>(data: CreateSegmentFragmentDto[], procedureId: string, sourceFragmentId, removeSourceFragment?: boolean) {
      const formdata = new FormData()
      formdata.append('projectId', procedureId!)
      formdata.append(`sourceFragmentId`, sourceFragmentId)
      formdata.append('removeSourceFragment', removeSourceFragment ? 'true' : 'false')
      data.forEach((dto, index) => {
        formdata.append(`audio[${index}]`, dto.audio, 'audio.wav') // 必须添加文件名和后缀
        formdata.append(`duration[${index}]`, dto.duration.toString())
        formdata.append(`speaker[${index}]`, JSON.stringify(dto.speaker))
        formdata.append(`key[${index}]`, dto.key!)
        formdata.append(`txt[${index}]`, dto.txt)
        formdata.append(`timestamps[${index}]`, JSON.stringify(dto.timestamps))
        formdata.append(`transcript[${index}]`, JSON.stringify(dto.transcript))
        formdata.append(`tags[${index}]`, JSON.stringify(dto.tags))
        formdata.append(`promoters[${index}]`, JSON.stringify(dto.promoters))
      })
     
      return axios.post<T>('/fragment/write/create/segment', formdata, {
        headers: {
          'Content-Type':'multipart/form-data'
        }
      })
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
    updateCollapsed<T>(fragmentId: string, collapsed: boolean) {
      return axios.patch<T>(`/fragment/update/collapsed/${fragmentId}&${collapsed}`)
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
