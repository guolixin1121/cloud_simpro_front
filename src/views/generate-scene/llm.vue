<template>
  <div class="breadcrumb">
    <router-link to="/generate-scene/">场景生成</router-link>
    <span>语义生成</span>
  </div>
  <div class="wrapper">
    <div class="messages" :style="{ height: 'calc(100% - 94px - '+ inputHeight +'px)'}">
      <!-- 聊天记录 -->
      <div class="messages-content">
        <div v-for="(chat, index) in data.chats" :key="index" :class="'message message--' + chat.type">
          <template v-if="chat.type == 0">
            <div class="message-body">{{ chat.message }}</div>
            <div class="message-avatar">{{ user }}</div>
          </template>
          <template v-else>
            <div class="message-avatar">赛目</div>
            <div class="message-body">
              {{ chat.message }}
              <div class="message-footer" v-if="showPath(chat)">
                <div>场景文件保存路径：我的场景/具体场景/场景集：{{chat.scene?.sceneset_name}}/场景：{{chat.scene?.adsName }}</div>
                <a class="text-link" @click="preview(chat)">查看</a>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
    <div class="input-box-wrapper">
      <div class="flex justify-between items-end">
        <a-textarea ref="inputRef" placeholder="请输入场景描述" class="input" 
          :bordered="false" :auto-size="{ minRows: 1, maxRows: 5 }" :allow-clear="true" :maxlength="500" 
          v-model:value="data.question" @keydown="onKeyDown" @keyup="onKeyUp"></a-textarea>
        <a-button type="primary" size="small" class="submit" @click="onSend" :disabled="data.isWriting || data.question.length == 0"
          :loading="data.isSubmitting">发送</a-button>
      </div>
      <div class="error" style="margin-left: 8px;" v-if="data.errorMsg">请输入文字</div>
    </div>
  </div>
  <upgrade ref="upgradeModal" module="onlineSimulation"></upgrade>
</template>

<script lang="ts" setup>
import { openLink} from '@/utils/tools'
const user = store.user.user?.username.substring(0,3).toUpperCase()

const inputRef = ref()
// const router = useRouter()
const preview = (chat: Chat) => {
  openLink('/scene-simulation-client/#/overview/?type=2&id=' + chat.scene?.id)
  // router.push('/my-sceneset/scene/preview/' + chat.scene?.id)
}
const showPath = (chat: Chat) => chat.scene && !data.isWriting

const inputHeight = ref(0)
const data = reactive<LLMData>({
  question: '',            // 问题
  answer: null,            // 答案
  chats: [{
    type: 1,
    message: 'HI ~ 我是赛目语义场景生成大模型，我可以帮您快速生成仿真场景文件，例如您可以输入：主车在高速公路上行驶，前方小汽车强行变道。'
  }],               // 所有对话数据
  isWriting: false,        // 是否正在逐行输出结果
  isRecording: false,      // 是否正在语音输入
  isSubmitting: false,     // 是否正在提交到服务器
  errorMsg: ''
})
const upgradeModal = ref()  

const onKeyDown = (event: any) => {
  if(event.key == 'Enter' && !event.shiftKey) {
    event.preventDefault()
    onSend()
  }
}
const onKeyUp = (event: any) => {
  if(event.key == 'Enter' && event.shiftKey) {
    data.quetion += '\n'
  }
}
const onSend = async () => {
  if(store.user.isRegisterUser()) {
    upgradeModal.value.show()
    return
  }
  if(data.question.trim().length == 0) {
    data.errorMsg = '请输入文本'
    return
  } 

  try {
    data.isSubmitting = true
    const res = await api.llm.generate({ message: data.question.trim()})
    writeChats(res)
    data.question = ''
  } finally {
    data.isSubmitting = false
  }
}
// 显示答案
const writeChats = (answer: { xml?: any, scene: Scene}) => {
  data.isSubmitting = false
  data.answer = {
    scene: answer.scene,
    xml: answer.xml.split('\n')
  }
  
  // 显示问题
  data.chats.push({
    message: data.question,
    type: 0,
  })

  // 显示答案
  const isValidScene = answer.xml.indexOf('<?xml') > -1
  data.chats.push({
    message: isValidScene ? '' : answer.xml,
    type: 1,
    scene: answer.scene
  })
  if(isValidScene) {
    // 逐行输出场景文件
    writeLine(0)
  }
  scroll()
}
// 逐行显示答案
const writeLine = (index: number) => {
  data.isWriting = true
  const answerXml = data.answer?.xml
  if(!answerXml) return 

  // 检查是否写完
  if(index > answerXml.length - 1) {
    data.isWriting = false
    return
  }
  
  // 追加下一行数据到聊天区
  const line = answerXml[index]
  const answerInChat = data.chats[data.chats.length - 1]
  answerInChat.message += line + '\n'
  setTimeout(() => {
    writeLine(++index)
    scroll()
  }, 20)
}

const scroll = () => {
  nextTick(() => {
    const container = document.querySelector('.messages')
    const contentHeight = document.querySelector('.messages-content')?.clientHeight
    if(contentHeight && container && contentHeight > container.clientHeight) {
      container.scrollTo({ top: contentHeight })
    }
  })
}

watch(() => data.question, () => {
  if(data.question.length > 0) {
    data.errorMsg = ''
  }
  // 等待输入框实际变化后再计算
  setTimeout(() => inputHeight.value = inputRef.value.resizableTextArea.textArea.clientHeight, 20)
})
</script>

<style lang="less" scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  margin: 0px -16px;
}
.messages {
  width: 100%;
  overflow-y: auto;
}
.messages-content {
  width: 1000px;
  margin: 0 auto;
}
.message {
    display: flex;
    margin-bottom: 16px;
    &:last-child {
      margin-bottom: 0px;
    }
    .message-avatar {
      width: 40px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      font-size: 12px;
      background: rgba(50,208,191,0.26);
      border-radius: 20px;
      margin-right: 8px;
    }

    .message-body {
      padding: 16px;
      background-color: #fff;;
      white-space: pre-wrap;
      overflow-wrap: break-word;
      border-radius: 0px 8px 8px 8px;

      .message-footer {
        display: flex;
        border-top: 1px dashed #E6E7EB;
        background-color: #fff;
        justify-content: space-between;
        padding-top: 16px;
        color: var(--text-second-color);
      }
    }
}
.message--0 {
  justify-content: right;
  .message-avatar {
    margin-left: 8px;
    margin-right: 0px;
    flex: 0 0 40px;
  }

  .message-body {
    color: #fff;
    background: #00AF59;
    border-radius: 10px 0px 10px 10px;
    margin-left: 48px;
    &::selection {
      background-color: fade(#fff, 15);
    }
  }
}
.message--1 {
  margin-right: 48px;
}
	
.input-box-wrapper {
  background-color: #fff;
  padding: 16px;
  padding-left: 16px;
  width: 1000px;
  position: absolute;
  bottom: 24px;
  box-shadow: 0px 0px 10px 0px rgba(1,27,74,0.06);
  border-radius: 10px;
  border: 1px solid #DADCE0;

  &:has(:focus) {
    border: 1px solid transparent;
    background-clip: padding-box, border-box;
    // background-origin: padding-box, border-box;
    background-image: linear-gradient(to right, #fff, #fff), linear-gradient(90deg, rgba(33, 204, 170, 1), rgba(102, 210, 127, 1));
    // border-image: linear-gradient(90deg, rgba(33, 204, 170, 1), rgba(102, 210, 127, 1)) 1 1;
  }
  .input {
    margin-left: -8px;
    width: calc(100% - 65px);
  }
  .submit {
    color: #fff;
    width: 60px;
    height: 32px;
    border: none;
    border-radius: 6px;
    // margin-left: 8px;
  }
}
</style>
<style>
.ant-input:focus {
  box-shadow: none !important;
}
</style>
