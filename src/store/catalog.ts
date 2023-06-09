import { useSessionStorage } from "@vueuse/core"
export const useCatalogStore = defineStore('map', () => {
  const mapCatalog = useSessionStorage('map-catalog', {})
  const sceneCatalog = useSessionStorage('scene-catalog', {})
  
  return { mapCatalog, sceneCatalog }
})
