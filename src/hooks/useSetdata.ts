
/**
 * 获取指定id的数据，并将数据更新到source对象中
 * @returns {loading: boolean, setData: (source: object, api: Function, id: string | string[]) => void}
 */
export default function useSetdata() {
    const loading = ref(false)

    /**
     * 获取指定id的数据，并将数据更新到source对象中
     * @param source 目的对象
     * @param api api定义
     * @param id 指定的数据
     */
    const setData = async (source: object, api: Function, id: string | string[]) => {
        loading.value = true
        const data = await api(id)
        loading.value = false
        for(const prop in source) {
            source[prop as keyof typeof source] = data[prop] as never
        }
    }

    return {
        loading,
        setData
    }
}