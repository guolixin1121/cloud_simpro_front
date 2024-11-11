import { useLocalStorage } from "@vueuse/core"
export const useCatalogStore = defineStore('map', () => {
  const mapCatalog = useLocalStorage('map-catalog', {} as any)
  const sceneCatalog = useLocalStorage('scene-catalog', {} as any)
  
  return { mapCatalog, sceneCatalog }
})
