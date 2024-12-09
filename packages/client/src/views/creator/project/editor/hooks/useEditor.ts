import { Ref, ShallowRef } from 'vue'
import { Bridge } from '../../bridge'
import { LibraryEnum } from '@/enums'
import { Editor } from '@textbus/editor'
import { createAnimeEditor } from './procedure/_index'
import { createTextEditor } from './note/_index'
import { createPlayer } from './course/_index'
export function useEditor(args: {
  id: string
  lib: LibraryEnum
  account: string
  hostname: string
  editorWrapperRef: Readonly<ShallowRef<HTMLElement | null>>
  editorRef: Readonly<ShallowRef<HTMLElement | null>>
  scrollerRef: ShallowRef<HTMLElement | null>
  controllerRef: Readonly<ShallowRef<HTMLElement | null>>
  toolbarRef: Readonly<ShallowRef<HTMLElement | null>>
}) {
  const { id, lib, account, hostname, editorRef, editorWrapperRef, scrollerRef, controllerRef, toolbarRef } = args
  return new Promise<{ editor: Editor; content: string }>((resolve, reject) => {
    switch (lib) {
      case LibraryEnum.NOTE:
        createTextEditor({
          id,
          account,
          hostname,
          editorWrapperRef,
          editorRef,
          scrollerRef,
          toolbarRef
        })
          .then(res => {
            resolve(res)
          })
          .catch(err => {
            console.log(err)
            reject(err)
          })
        break
      case LibraryEnum.PROCEDURE:
        createAnimeEditor({
          id,
          account,
          hostname,
          editorWrapperRef,
          editorRef,
          scrollerRef,
          toolbarRef,
          controllerRef
        })
          .then(res => {
            resolve(res)
          })
          .catch(err => {
            console.log(err)
            reject(err)
          })
        break
      case LibraryEnum.COURSE:
        createPlayer({
          id,
          account,
          hostname,
          editorWrapperRef,
          editorRef,
          scrollerRef,
          controllerRef
        })
          .then(res => {
            resolve(res)
          })
          .catch(err => {
            console.log(err)
            reject(err)
          })
        break
    }
  })
}
