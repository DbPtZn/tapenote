export interface CopyFragmentDto {
  sourceProjectId: string
  targetProjectId: string
  sourceFragmentId: string
  targetFragmentId: string
  position: 'before' | 'after' | 'insert'
  type: 'copy' | 'cut'
}
