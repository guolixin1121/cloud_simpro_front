type Scene = {
  sceneset_name: string,
  sceneset_id: string,
  adsName: string,
  id: string,
}
type Chat = { type: number, message: string, scene?: Scene }
interface LLMData {
  answer: { scene: Scene, xml: string } | null,
  chats: Chat[],
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
