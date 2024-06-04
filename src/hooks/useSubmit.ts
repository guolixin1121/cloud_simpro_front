
import { goback } from '@/utils/tools'

interface Api {
    add: Function,
    edit: Function
}
/**
 * 获取指定id的数据，并将数据更新到source对象中
 * @returns {loading: boolean, setData: (source: object, api: Function, id: string | string[]) => void}
 */
export default function useSubmit() {
    const loading = ref(false)

    const submit = async (isAdd: boolean, api: Api, params: object ) => {
        try {
            isAdd ? await api.add(params) : await api.edit(params)
    
            message.info(isAdd ? '创建成功' : '修改成功')
            goback()
        } finally {
            loading.value = false
        }
        
    }

    return {
        loading,
        submit
    }
}