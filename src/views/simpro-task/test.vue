<template>
  {{ dataSource }}
  <Table :columns="columns" :dataSource="dataSource" :pagination="false">
    <template #bodyCell="{ record, column }">
      <template v-if="column.dataIndex === 'type'">
        <template v-if="record.type === '1'">
          <div class="flex">
            <a-input v-model:value="record.min" />
            <span class="mx-2">-</span>
            <a-input v-model:value="record.max" />
          </div>
        </template>
        <template v-if="record.type === '2'">
          <div class="flex">
            <sapn class="mr-2">>=</sapn>
            <a-input v-model:value="record.value" />
          </div>
        </template>
        <template v-if="record.type === '3'">
          <div class="flex">
            <sapn class="mr-2">=</sapn>
            <a-input v-model:value="record.value" />
          </div>
        </template>
        <template v-if="record.type === '4'">
          <a-select v-model:value="record.value" style="width: 100%">
            <a-select-option value="1">是</a-select-option>
            <a-select-option value="0">否</a-select-option>
          </a-select>
        </template>
      </template>
    </template>
  </Table>
</template>

<script setup lang="ts">
const columns = [
  { dataIndex: 'name', title: '名称' },
  { dataIndex: 'type', title: '值' },
]

const dataSource = ref([
  { type: '1', min: 1, max: 100, name: '区间'},
  { type: '2', value: 10, name: '大于等于'},
  { type: '3', value: 10, name: '小于等于'},
  { type: '4', value: '0', name: '是否'}
])
</script>