import { defineStore } from "pinia"
import { useLocalStorage } from "@vueuse/core"
import { useUserApi } from '../api/user'
import router from '../router'

export const useUserStore = defineStore('use', () => {
   const defaultUser = { token: '', name: '', username: '', permissions: [] }
   const user = useLocalStorage('user', defaultUser)
   
   const logout = () => {
      user.value = null
      router.push('/login')
   }

   const login = async() => { 
      const userApi = useUserApi()
      const data = await userApi.get()
      user.value = data
    }

   return { user, login, logout }
})
