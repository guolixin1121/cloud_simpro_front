<template>
  <div class="white-block entry">
     <div class="title-primary">快捷入口</div>
     <div class="item-list">
        <div v-for="item in entries" :key="item.label"
          class="item"
          @click="gotoPage(item.router)">
          <img :src="item.icon" width="24">
          <p class="mt-1">{{ item.label }}</p>
     </div>
     </div>
  </div>
</template>

<script lang="ts" setup>
import icon_newtask from '@/assets/images/icon_newtask.png'
import icon_scenelist from '@/assets/images/icon_scenelist.png'
import icon_resource from '@/assets/images/icon_resource.png'
import icon_algorithm from '@/assets/images/icon_algorithm.png'
import icon_SOTIF from '@/assets/images/icon_SOTIF.png'
import icon_car from '@/assets/images/icon_car_h.png'

const entries = [
  { icon: icon_newtask, label: '新增任务', router: '/simpro-task/edit/0'},
  { icon: icon_scenelist, label: '场景列表', router: '/scene/'},
  { icon: icon_resource, label: '理想传感器', router: '/sensor'},
  { icon: icon_algorithm, label: '算法管理', router: '/algorithm'},
  { icon: icon_SOTIF, label: 'SOTIF分析', router: '/sotif'},
  { icon: icon_car, label: '车辆动力学', router: '/veticle-model'}
]

const router = useRouter()
const gotoPage = (url: string) => router.push(url)
</script>
<style lang="less" scoped>
.entry {
  .item-list {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    cursor: pointer;
  }
  .item {
    width: 96px;
    height: 78px;
    margin-right: 5px;
    margin-top: 20px;
    display: inline-block;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    p {
      color: #60656E;
    }

    &:hover {
      background: #F2F3F5;
      border-radius: 2px;
    }
  }
}
</style>