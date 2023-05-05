<template>
  <div>
    <!-- <embed src="https://10.31.255.202/x8v-drivingcloud-xtest/52b84beca571a5a3?Expires=1683169582&AWSAccessKeyId=CB350C40B87AA1F98EC4&Signature=BdF512kDNfuwyM%2BznnMjl0wiejQ%3D" type="application/pdf" width="100%" height="100%" />
    <object data="https://10.31.255.202/x8v-drivingcloud-xtest/52b84beca571a5a3?Expires=1683169582&AWSAccessKeyId=CB350C40B87AA1F98EC4&Signature=BdF512kDNfuwyM%2BznnMjl0wiejQ%3D" type="application/pdf" width="100%" height="100%"></object>       -->
    <Table :api="getScenes"
      :columns="columns">
      <template #bodyCell="{column, record}">
          <template v-if="column.dataIndex == 'labels_detail'">
            <a-tooltip :title="record.labels_detail.map((d: any) => d.display_name).join('  ')">
              <span v-for="label in record.labels_detail" :key="label.id" class="text-blue mr-2">
                {{ label.display_name }}
              </span>
            </a-tooltip>
          </template>
          <template v-if="column.dataIndex == 'actions'">
            <a target="_blank" class=" text-blue" href="https://10.31.255.202/x8v-drivingcloud-xtest/52b84beca571a5a3?Expires=1683169582&AWSAccessKeyId=CB350C40B87AA1F98EC4&Signature=BdF512kDNfuwyM%2BznnMjl0wiejQ%3D">查看报告</a>
          </template>
      </template>
    </Table>
  </div>
</template>

<script setup lang="ts">
const task = useRoute().params.id
const getScenes = () => api.result.getScenes({ task })

const columns = [
  { dataIndex: 'id', title: '场景ID'},
  { dataIndex: 'adsName', title: '场景名称'},
  { dataIndex: 'labels_detail', title: '场景标签'},
  { dataIndex: 'batch', title: '仿真轮次', width: 100},
  { dataIndex: 'run-time', title: '开始时间'},
  { dataIndex: 'funish-time', title: '完成时间'},
  {
    dataIndex: 'actions', title: '报告', fixed: 'right', width: 100
  }
]
</script>