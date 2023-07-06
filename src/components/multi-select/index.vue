<template>
  <a-form-item-rest>
    <div class="mb-2">
      <span>GAC</span>
      <scroll-select 
        v-for="index in count" :key="index"
        v-model:value="names[index - 1]"
        :options="options[index-1]"
        @change="(value: string) => handleSelectChange(index - 1, value)"></scroll-select>
    </div>
    <ch-input v-model:value="inputName" :maxlength="20" :filter="'_'" placeholder="场景名最多16位，不支持下划线"></ch-input>
  </a-form-item-rest>
</template>

<script setup lang="ts">
defineProps({
  value: {
    type: String,
    default: () => ''
  }
})
const emits = defineEmits(['update:value'])

const count = 10
const inputName = ref()
const names = ref<string[]>([])
const options = ref<Record<string, string>[]>([])

const handleSelectChange = async (index: number, value: string) => {
  // 清空后续所有值
  for(let i = index + 1; i < count; i++) {
    names.value[i] = null as any
  }
  // 更新下一级下拉数据
  if(index < count - 1) {
    options.value[index+1] = await getChildOptions(value, index)
  }
  emitsFullName()
}
const init = async () => {
  try {
  options.value[0] = await getChildOptions()
  } catch {
    console.log('error')
  }
}

const getChildOptions = async (parent?: string, pLevel?: number) => {
  const params = pLevel == undefined ? null : {
    first_catalog_value: names.value[0],
    pre_level: pLevel,
    pre_option: parent
  }
  const res = await api.logicScene.getCatalog(params)
  return res.map((item: any) => ({
    label: item.option_value,
    value: item.option_value
  }))
}

const emitsFullName = () => {
  let isAllNameSelected = true
  names.value.forEach((value: string) => isAllNameSelected = isAllNameSelected && (value != null) )
  if(isAllNameSelected && inputName.value) {
    emits('update:value', names.value.join('_') + '_' + inputName.value)
  } else {
    emits('update:value', '')
  }
}

watch(inputName, emitsFullName)

init()
</script>

<style lang="less" scoped>
.ant-select {
  width: 18%; 
  margin-left: 4px
}
</style>