
type Chat = { id?: string, type: number, message: string }
interface LLMData {
  answer: { id: string, xml: string } | null,
  chats: Chat[]
  [key: string]: any
}

declare class HZRecorder {
  static get: (callback: (recorder: MediaRecorder) => {}) => {}
}

interface MediaRecorder {
    getBlob: Function,
    start: Function,
    stop: Function
  }  
