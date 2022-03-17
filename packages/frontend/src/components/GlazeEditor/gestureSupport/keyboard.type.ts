export interface KeyboardCenterTargetOption {
  key: string
  altKey?: boolean
  ctrlKey?: boolean
  shiftKey?: boolean
  metaKey?: boolean
}

export interface KeyboardCenterCallback {
  (target: KeyboardCenterTarget, e: KeyboardEvent | ClipboardEvent): void
}

export interface KeyboardCenterSubscriber {
  target: KeyboardCenterTarget
  callback: KeyboardCenterCallback
}

export enum KeyboardCenterEvent {
  Copy = 'CENTER_EVENT_COPY',
  Paste = 'CENTER_EVENT_PASTE',
  Delete = 'CENTER_EVENT_DELETE'
}

export type KeyboardCenterTarget = KeyboardCenterEvent | string
