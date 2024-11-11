<template>
  <div class="breadcrumb">
    <router-link to="/generate-scene/">场景生成</router-link>
    <span>语义生成</span>
  </div>
  <div style="height: 100%;">
    <div class="container">
      <div class="messages" :style="{ height: 'calc(100% - 150px - '+ inputHeight +'px)'}">
        <!-- 欢迎语 -->
        <div class="message">
          <div class="message-avatar">赛目</div>
          <div class="message-body">
              HI～我是赛目语义场景生成大模型，我可以帮您快速生成仿真场景文件，例如您可以说：主车在高速路上行驶，前方小汽车强行变道。
          </div>
        </div>
        <!-- 聊天记录 -->
        <div class="messages-content">
          <div v-for="(chat, index) in data.chats" :key="index" :class="'message message--' + chat.type">
            <template v-if="chat.type == 0">
              <div class="message-body">{{ chat.message }}</div>
              <div class="message-avatar">我</div>
            </template>
            <template v-else>
              <div class="message-avatar">赛目</div>
              <div class="message-body">
                {{ chat.message }}
                <div class="message-footer" v-if="showPath(chat)">
                  <div>
                    场景文件保存路径：我的场景-具体场景-{{chat.scene?.sceneset_name}}-{{chat.scene?.adsName }}
                  </div>
                  <a class="text-link" @click="preview(chat)">查看</a>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
      <div class="input-box-wrapper">
        <a-textarea ref="inputRef" :bordered="false" :auto-size="{ minRows: 1, maxRows: 5 }" :placeholder="data.placeholder" 
          class="input" v-model:value="data.question"
          :allow-clear="true" :maxlength="500" @keydown="onKeyDown" @keyup="onKeyUp"></a-textarea>
        <p class="error" style="margin-left: 8px;" v-if="data.errorMsg">请输入文字</p>
        <div class="mt-2">
          <template v-if="canRecording">
            <svg-icon icon="recorder-stop"  class="recorder" 
              @click="stopRecording" v-if="data.isRecording"></svg-icon>
            <svg-icon icon="recorder"
              :class="'recorder recorder--' + (canStartRecording ? 'disabled' : 'enabled')"
              @click="startRecording" v-else></svg-icon>
          </template>
          <a-button type="primary" size="small" class="submit" @click="onSend" :disabled="data.isWriting"
            :loading="data.isSubmitting">发送</a-button>
        </div>
      </div>
    </div>
  </div>
  <upgrade ref="upgradeModal" module="onlineSimulation"></upgrade>
</template>

<script lang="ts" setup>
// const user = store.user.user

let mediaRecorder: MediaRecorder
HZRecorder.get((rec: MediaRecorder) => mediaRecorder = rec)
const canRecording = HZRecorder.canRecording

const inputRef = ref()
const router = useRouter()
const preview = (chat: Chat) => router.push('/my-sceneset/scene/preview/' + chat.scene?.id)
const showPath = (chat: Chat) => chat.scene && !data.isWriting

const inputHeight = ref(30)
const defaultPlaceholder = '直接输入指令；Shift+回车换行'
const data = reactive<LLMData>({
  question: '',            // 问题
  answer: null,            // 答案
  chats: [],               // 所有对话数据
  isWriting: false,        // 是否正在逐行输出结果
  isRecording: false,      // 是否正在语音输入
  isSubmitting: false,     // 是否正在提交到服务器
  placeholder: defaultPlaceholder,
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

// 录音
const canStartRecording = computed(() => data.isSubmitting || data.isWriting)
function startRecording() {
  if(canStartRecording.value) return

  mediaRecorder.start()
  data.placeholder = '正在录音'
  data.question = ''
  data.isRecording = true
}

async function stopRecording() {
  mediaRecorder.stop()
  data.isRecording = false

  data.placeholder = '正在语音转换'
  const res = await api.llm.audioToText({
    audio: mediaRecorder.getBlob(),
    rate: new window.AudioContext().sampleRate
  })
  data.placeholder = defaultPlaceholder
  data.question = res.text
}

watch(() => data.question, () => {
  inputHeight.value = inputRef.value.resizableTextArea.textArea.clientHeight
  if(data.question.length > 0) {
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
        border-top: 1px solid #E6E7EB;
        background-color: #fff;
        justify-content: space-between;
        padding-top: 16px;
      }
    }
}
.message--0 {
  justify-content: right;
  .message-avatar {
    margin-left: 8px;
  }

  .message-body {
    color: #fff;
    background: #00AF59;
    border-radius: 10px 0px 10px 10px;
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
    float: right;
  }
  .recorder {
    cursor: pointer;
    float: left;
    &:hover {
      color: var(--primary-color)
    }
    &--disabled, &--disabled:hover {
       color: #C9CCD1
    }
  }
}
</style>
