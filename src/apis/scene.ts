import { defineApi } from '../hooks/api'

export const useSceneApi = defineApi({
  getList: '/scene/scene/',
})
