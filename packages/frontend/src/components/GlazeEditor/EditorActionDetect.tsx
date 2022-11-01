import React, { FC } from 'react'
import { Log } from '../../utils/log'

import { KeyboardCenterEvent, useKeyboardCenter, useKeyboardDetect } from './gestureSupport'
import { editorSharedDocument } from './EditorSharedDocument'
import { SelectedNodeInfoSubject } from './state'

const EditorActionDetect: FC = () => {
  Log.EditorActionDetect('render EditorActionDetect')

  useKeyboardCenter()

  useKeyboardDetect(KeyboardCenterEvent.Copy, (target, e) => {
    Log.EditorActionDetect('on copy', target, e)
  })

  useKeyboardDetect(KeyboardCenterEvent.Paste, (target, e) => {
    Log.EditorActionDetect('on paste', target, e)
  })

  useKeyboardDetect(KeyboardCenterEvent.Delete, () => {
    editorSharedDocument.deleteNode(SelectedNodeInfoSubject.value)
  })

  useKeyboardDetect('c', (target, e) => {
    Log.EditorActionDetect('others: on c', target, e)
  })

  useKeyboardDetect(
    [
      {
        key: 'G',
        metaKey: true
      },
      {
        key: 'G',
        ctrlKey: true
      }
    ],
    (target, e) => {
      Log.EditorActionDetect('others: on Commend+G / Ctrl+G', target, e)
      e.preventDefault()
    }
  )

  return null
}

export default React.memo(EditorActionDetect)
