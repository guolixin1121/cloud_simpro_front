<template>
  <div class="breadcrumb">
    <span>场景生成</span>
    <span v-if="!isPreview">语义生成</span>
    <template v-else>
      <span class=" cursor-pointer" @click="isPreview = false">语义生成</span>
      <span>场景查看</span>
    </template>
  </div>
</template>

<script lang="ts" setup>
let mediaRecorder: MediaRecorder
HZRecorder.get((rec: MediaRecorder) => mediaRecorder = rec)

const inputRef = ref()
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const isSaimo = (type: number) => type == 1

const isPreview = ref(false)
const previewUrl = ref()
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function preview(chat: Chat) {
  isPreview.value = true
  previewUrl.value = '/scene-simulation-client/#/overview/?type=2&id=' + chat.scene?.id
}

const inputHeight = ref(30)
const data = reactive<LLMData>({
  question: '',            // 问题
  answer: null,              // 答案
  chats: [],               // 所有对话数据
  isWriting: false,        // 是否正在逐行输出结果
  isRecording: false,      // 是否正在语音输入
  isSubmitting: false,     // 是否正在提交到服务器
  placeholder: '请输入场景描述',
  errorMsg: ''
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const onSend = async () => {
  if(data.question.trim().length == 0) {
    data.errorMsg = '请输入您的问题'
    return
  } 

  try {
    data.isSubmitting = true
    const res = await api.llm.generate({ message: data.question.trim()})
    writeChats(res)
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
  const isValidXml = answer.xml.indexOf('<?xml') > -1
  data.chats.push({
    message: isValidXml ? '' : answer.xml,
    type: 1,
    scene: answer.scene
  })
  if(isValidXml) {
    data.isWriting = true
    writeLine(0)
  }
}
// 逐行显示答案
const writeLine = (index: number) => {
  // 检查是否写完
  const answerXml = data.answer?.xml
  if(!answerXml) return 
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
  }, 50)
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

// 录音
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function startRecording() {
  if(data.isWriting || data.isSubmitting) return
  mediaRecorder.start()
  data.isRecording = true
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function stopRecording() {
  mediaRecorder.stop()
  data.isRecording = false

  audioToText()
}

async function audioToText() {
  data.placeholder = '语音转换中...'
  const res = await api.llm.audioToText({
    audio: mediaRecorder.getBlob(),
    rate: new window.AudioContext().sampleRate
  })
  data.placeholder = '请输入场景描述'
  data.question = res.text
}

watch(() => data.question, () => {
  inputHeight.value = inputRef.value.resizableTextArea.textArea.clientHeight
  if(data.question.trim().length > 0) {
    data.errorMsg = ''
  }
})
</script>

<style lang="less" scoped>
.container {
  width: 1000px;
  height: 100%;
  margin: 16px auto;
}
.messages {
    overflow-y: auto;
}
.message-content {
    height: calc(100% - 50px)
}
.message {
    display: flex;
    margin-bottom: 16px;
    .message-left {
        width: 50px;
        height: 50px;
        background-color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;

        margin-right: 16px;
    }

    .message-right {
      width: calc(100% - 66px);

      .username {
          color: #60656E;
      }
      .message-body {
          margin-top: 8px;
          width: 100%;
          background-color: #fff;;
          white-space: pre-wrap;
          overflow-wrap: break-word;
          padding: 24px;
      }
      .message-body-0 {
        background: #E6E7EB;
      }
      .message-footer {
        display: flex;
        border-top: 1px solid #E6E7EB;
        background-color: #fff;
        justify-content: space-between;
        padding: 24px;
      }
    }
}
	
.input-box-wrapper {
  background-color: #fff;
  padding: 16px;
  border-radius: 4px;
  width: 935px;
  margin-left: 65px;
  position: absolute;
  bottom: 24px;
  .submit {
    color: #fff;
    width: 80px;
    height: 38px;
  }
  .recorder {
    cursor: pointer;
    &:hover {
      color: var(--primary-color)
    }
  }
}
</style>