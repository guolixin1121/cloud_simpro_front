## 输入框组件
对 `a-input`和 `a-input-textarea` 封装，中文字符算两个长度
### maxlength：number
最大长度，默认32
### exclude：string
输入字符的排除
### type：input | textarea   
默认值: input

```
<ch-input :maxlength="12" exclude='_' placeholder="请输入名字，不支持下划线"></ch-input>
<ch-input type="textarea" :maxlength="120"></ch-input>
```