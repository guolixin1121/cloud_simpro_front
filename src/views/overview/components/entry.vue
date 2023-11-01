<template>
  <div class="white-block entry">
    <div class="title--noborder">快捷入口</div>
    <div class="item-list">
      <template v-for="item in entries" :key="item.label">
        <div v-if="hasPermission(item)" class="item" @click="gotoPage(item.router)">
          <img :src="item.icon" width="24" style="margin-bottom: 12px;" />
          <span class="mt-1">{{ item.label }}</span>
        </div>
      </template>
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
  { icon: icon_newtask, label: '新增任务', router: '/simpro-task/edit/0' },
  { icon: icon_scenelist, label: '场景列表', router: '/scene/' },
  { icon: icon_resource, label: '传感器模型', router: '/sensor' },
  { icon: icon_algorithm, label: '算法管理', router: '/algorithm' },
  { icon: icon_SOTIF, label: 'SOTIF分析', router: '/sotif' },
  { icon: icon_car, label: '动力学模型', router: '/veticle-model' }
]

const router = useRouter()
const gotoPage = (url: string) => router.push(url)

const hasPermission = ({ router, label }: any) => {
  return store.user.hasPermission(label == '新增任务' ? 'add' : 'view', router)
}
</script>
<style lang="less" scoped>
.entry {
  .item-list {
    display: flex;
    // justify-content: space-between;
    flex-wrap: wrap;
    cursor: pointer;
    padding-top: 4px;
  }
  .item {
    // width: 96px;
    width: 33%;
    height: 86px;
    // margin-right: 5px;
    margin-top: 12px;
    display: inline-block;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    p {
      color: #60656e;
    }

    &:hover {
      background: var(--gray-globel-bg-color);
      border-radius: 2px;
    }
  }
}
</style>
