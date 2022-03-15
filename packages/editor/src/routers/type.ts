export enum EditorWebSocketRequestType {
  GetComponentList = 'getComponentList',
  CreateComponent = 'createComponent',
  RemoveComponent = 'removeComponent'
}

export interface EditorWebSocketRequest {
  type: EditorWebSocketRequestType
  componentName?: string
}

export enum EditorWebSocketResponseType {
  LocalEvent = 'localEvent',
  Data = 'data',
  RequestTypeNotFound = 'requestTypeNotFound'
}

export interface EditorWebSocketResponse {
  type: EditorWebSocketResponseType
  data?: any
}
