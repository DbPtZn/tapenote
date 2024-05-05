export interface CopyFragmentDto {
  sourceProejctId: string
  targetProejctId: string
  sourceFragmentId: string
  targetFragmentId: string
  position: 'before' | 'after'
  type: 'copy' | 'cut'
}
