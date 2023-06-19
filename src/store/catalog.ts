import { useSessionStorage } from "@vueuse/core"
export const useCatalogStore = defineStore('map', () => {
  const mapCatalog = useSessionStorage('map-catalog', { id: '', name: '' })
  const sceneCatalog = useSessionStorage('scene-catalog', { id: '', name: '', path: '',  labels_detail: [{name: '', display_name: ''}]})
  
  return { mapCatalog, sceneCatalog }
})
