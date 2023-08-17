# 表单组件
对`a-form`的封装   
form包含自定义组件时，需要主动触发validateFileds()消除红色alert信息

## slot：表单内容

```
<Form :model="formState" @finish="add">
  <a-form-item></a-form-item>
</Form>
```