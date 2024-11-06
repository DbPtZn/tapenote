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
  rootRef: Readonly<ShallowRef<HTMLElement | null>>
  editorRef: Readonly<ShallowRef<HTMLElement | null>>
  scrollerRef: ShallowRef<HTMLElement | null>
  controllerRef: Readonly<ShallowRef<HTMLElement | null>>
  toolbarRef: Readonly<ShallowRef<HTMLElement | null>>
  bridge: Bridge
}) {
  const { id, lib, account, hostname, editorRef, scrollerRef, controllerRef, toolbarRef, rootRef, bridge } = args
  return new Promise<{ editor: Editor, content: string }>((resolve, reject) => {
    switch (lib) {
      case LibraryEnum.NOTE:
        createTextEditor({
          id, 
          account, 
          hostname, 
          rootRef, 
          editorRef, 
          scrollerRef, 
          toolbarRef
        }).then(res => {
          resolve(res)
        }).catch(err => {
          console.log(err)
          reject(err)
        })
        break
      case LibraryEnum.PROCEDURE:
        createAnimeEditor({
          id, 
          account, 
          hostname, 
          rootRef, 
          editorRef, 
          scrollerRef, 
          toolbarRef,
          controllerRef
        }).then(res => {
          resolve(res)
        }).catch(err => {
          console.log(err)
          reject(err)
        })
        break
      case LibraryEnum.COURSE:
        createPlayer({
          id,
          account,
          hostname,
          rootRef,
          editorRef,
          scrollerRef,
          controllerRef
        }).then(res => {
          resolve(res)
        }).catch(err => {
          console.log(err)
          reject(err)
        })
        break
    }
  })
}
