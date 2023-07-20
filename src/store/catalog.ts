import { useSessionStorage } from "@vueuse/core"
export const useCatalogStore = defineStore('map', () => {
  const mapCatalog = useSessionStorage('map-catalog', {} as any)
  const sceneCatalog = useSessionStorage('scene-catalog', {} as any)
  
  return { mapCatalog, sceneCatalog }
})
