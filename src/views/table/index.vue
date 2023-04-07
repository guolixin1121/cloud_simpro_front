<template>
  <a-button type="primary" v-if="user.hasPermission('add')">上传</a-button>
  <Table :data-source="dataSource" :columns="columns" @on-select="onSelect">
    <template #bodyCell="{ column, text }">
      <template v-if="column.key === 'age'">
        {{ text > 18 ? "成人" : "未成年" }}
      </template>
    </template>
  </Table>
</template>

<script setup lang="ts">
import Table from '../../components/table/index.vue'
import { useUserStore } from '@/store/user';
const router = useRouter()
const user = useUserStore()

const dataSource = [
  {
    key: '1',
    name: '胡彦斌',
    age: 12,
    address: '西湖区湖底公园1号',
  },
  {
    key: '2',
    name: '胡彦祖',
    age: 42,
    address: '西湖区湖底公园1号',
  },
]

const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: '住址',
    dataIndex: 'address',
    key: 'address'
  },
  {
    title: '操作',
    key: 'actions',
    actions: {
      view: () => router.push(`/test2`) ,
      edit: ( data: any ) => console.log(data) ,
      delete: (data: any) => console.log(data)
    }
  }
]

const onSelect = (keys: any) => {
  console.log(keys)
}
</script>
