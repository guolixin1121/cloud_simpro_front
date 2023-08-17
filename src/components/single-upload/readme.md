# 封装a-upload
上传限定为单文件的`a-upload`组件

## text：String
上传按钮的文案，默认：‘选择文件’

## accept: String
允许上传的文件格式

```
<single-upload accept=".py" v-model:value="pyfile"></single-upload>
<single-upload accept=".py" v-model:value="pyfile" text="点击上传"></single-upload>
```
