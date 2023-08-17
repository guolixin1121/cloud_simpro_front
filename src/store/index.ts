/**
 * 已通过vite的auto import自动导入，使用时通过变量‘store’就可以直接访问
 * demo：store.user
 */
import pinia from './pinia'
import { useUserStore } from './user'
import { useCatalogStore } from './catalog'

// auto import的自动注入是在主程序之前，此时还没有pinia实例，所以参数里要明确指定实例
export const user = useUserStore(pinia)
export const catalog = useCatalogStore(pinia)