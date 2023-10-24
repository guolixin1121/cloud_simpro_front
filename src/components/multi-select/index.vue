<template>
  <a-form-item-rest>
    <div style="height: 22px; margin-top: 4px">{{ fullName }}</div>
    <div class="select-list" v-for="row in 2" :key="row">
      <div class="select-item"
        v-for="col in count/2" :key="col">
        <template v-if="isVisible(row, col)">
          <span class="select-item-label" :class="'label--' + col">{{ labels[index(row, col)] }}</span>
          <a-select 
            placeholder="请选择"
            v-model:value="names[index(row, col)]"
            :options="options[index(row, col)]"
            @change="(value: string) => handleSelectChange(index(row, col), value)">
          </a-select>
        </template>
      </div> 
    </div>
    <div class="input">
      <span class="select-item-label label--1">自定义</span>
      <ch-input style="width: 365px;" v-model:value="inputName" :maxlength="16" :exclude="'_'" placeholder="最多16位，不支持下划线"></ch-input>
    </div>
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
const index = (row: number, col: number) => (row - 1 ) * (count / 2) + col - 1
const isVisible = (row: number, col: number) => {
  const indexNo = index(row, col)
  return (indexNo < count - 1) ? true : isLastVisible()
  // if(indexNo < count - 1) return true

  // 控制最后一个级别是否显示
  // const lastOptions = options.value[count - 1]
  // return lastOptions && lastOptions.length && lastOptions[0].value != "None"
}
const isLastVisible = () => {
  const firstName = names.value[0]
  return firstName && (['Natural', 'Accident', 'Exp'].indexOf(firstName) == -1)
}

const labels = ['场景来源', '功能类型', '区域', '道路类型', '车道', '主车行为', '交通参与者类型', '交通参与行为', '环境', '其他']
const inputName = ref('')
const fullName = ref('SAIMO_')
const names = ref<string[]>([])
const options = ref<Record<string, string>[][]>([])

const handleSelectChange = async (index: number, value: string) => {
  // 清空后续所有值
  for(let i = index + 1; i < count; i++) {
    options.value[i] = [] as any
    if(names.value[i]) {
      names.value[i] = null as any
    }
  }
  // 更新下一级下拉数据
  if(index < count - 1) {
    options.value[index+1] = await getChildOptions(value, index)
  }
  emitsFullName()
}
const getChildOptions = async (parent?: string, pLevel?: number) => {
  const params = pLevel == undefined ? null : {
    first_catalog_value: names.value[0],
    pre_level: pLevel,
    pre_option: parent
  }
  const res = await api.logicScene.getCatalog(params)
  return res.map((item: any) => ({
    label: item.option_name,
    value: item.option_value,
    title: item.option_value
  }))
}

const emitsFullName = () => {
  const namesString = names.value.reduce((sum, name) => sum += name ? (name + '_') : '', '')
  fullName.value = 'SAIMO_' + namesString + inputName.value

  // 判断是9级还是10级, 是否所有级别有数据
  const levels = isLastVisible() ? 10 : 9
  const isAllNameSelected = names.value.length == levels

  if(isAllNameSelected && inputName.value) {
    emits('update:value', fullName.value)
  } else {
    emits('update:value', '')
  }
}
watch(inputName, emitsFullName)

const init = async () => {
  try {
    options.value[0] = await getChildOptions()
  } catch {
    console.log('error')
  }
}
init()
</script>

<style lang="less" scoped>
.select-list {
  display: flex;
  margin-top: 16px;
}
.input {
  margin-top: 16px;
}
.select-list, .input {
  margin-left: -70px;
}
.select-item {
  // width: 20%;
  &-label {
    color: #60656E;
    margin-right: 8px;
    display: inline-block;
    text-align: right;
  }

  .ant-select {
    width: 120px;
    margin-right: 16px;
  }
}

.label--1 {
  width: 60px;
}
.label--2 {
  width: 100px;
}
.label--3 {
  width: 90px;
}
.label--4 {
  width: 60px;
}
</style>