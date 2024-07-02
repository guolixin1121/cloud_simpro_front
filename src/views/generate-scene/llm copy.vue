<template>
  <div class="breadcrumb">
    <router-link to="/generate-scene/">场景生成</router-link>
    <span v-if="!isPreview">语义生成</span>
    <template v-else>
      <span class=" cursor-pointer" @click="isPreview = false">语义生成</span>
      <span>{{ previewSceneName }}</span>
    </template>
  </div>
  <div style="height: 100%;">
    <div class="container" v-show="!isPreview">
      <div class="messages" :style="{ height: 'calc(100% - 150px - '+ inputHeight +'px)'}">
        <!-- 欢迎语 -->
        <div class="message">
          <div class="message-left">
            <img src="@/assets/images/bot_avatar.png" class="avatar"/>
          </div>
          <div class="message-right">
            <div class="username">赛目科技大模型</div>
            <div class="message-body">
              Hi, 我是赛目科技的大模型，很高兴为您服务
            </div>
          </div>
        </div>
        <!-- 聊天记录 -->
        <div class="messages-content">
          <div v-for="(chat, index) in data.chats" :key="index" class="message">
            <div class="message-left">
              <img src="@/assets/images/me_avatar.png" class="avatar" v-if="chat.type == 0"/>
              <img src="@/assets/images/bot_avatar.png" class="avatar" v-else />
            </div>
            <div class="message-right">
              <div class="username">{{ chat.type == 0 ? user.username : '赛目科技大模型' }}</div>
              <div class="message-body" :class="'message-body-' + chat.type">
                {{ chat.message }}
              </div>
              <div class="message-footer" v-if="isSaimo(chat.type) && !data.isWriting">
                <div>
                  场景文件保存路径：我的场景-具体场景-{{ chat.scene?.sceneset_name }}-{{ chat.scene?.adsName }}
                </div>
                <a class="text-link" @click="preview(chat)">查看</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="input-box-wrapper">
        <a-textarea ref="inputRef" :bordered="false" :auto-size="{ minRows: 1, maxRows: 5 }" :placeholder="data.placeholder" 
          class="input" maxlength="500" v-model:value="data.question"></a-textarea>
        <p class="error" style="margin-left: 8px;" v-if="data.errorMsg">{{ data.errorMsg }}</p>
        <div class="mt-2">
          <template v-if="canRecording">
            <svg-icon icon="recorder-stop" class="recorder" 
              :class="'recorder--' + (recordingDisabled ? 'disabled': 'enabled')" @click="stopRecording" v-if="data.isRecording"></svg-icon>
            <svg-icon icon="recorder" class="recorder" 
              :class="'recorder--' + (recordingDisabled ? 'disabled': 'enabled')" @click="startRecording" v-else></svg-icon>
          </template>
          <a-button type="primary" size="small" class="submit" @click="onSend" :disabled="data.isWriting"
            :loading="data.isSubmitting">发送</a-button>
        </div>
      </div>
    </div>
    <iframe :src="previewUrl" v-if="isPreview"></iframe>
  </div>
</template>

<script lang="ts" setup>
let mediaRecorder: MediaRecorder
HZRecorder.get((rec: MediaRecorder) => mediaRecorder = rec)
const canRecording = HZRecorder.canRecording

const user = store.user.user
const inputRef = ref()
const isSaimo = (type: number) => type == 1

const isPreview = ref(false)
const previewUrl = ref()
const previewSceneName = ref()
function preview(chat: Chat) {
  previewSceneName.value = chat.scene?.adsName
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

const onSend = async () => {
  if(data.question.trim().length == 0) {
    data.errorMsg = '请输入场景描述'
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

const recordingDisabled = computed(() => data.isWriting || data.isSubmitting)
// 录音
function startRecording() {
  if(recordingDisabled.value) return

  mediaRecorder.start()
  data.question = ''
  data.placeholder = '正在语音输入'
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
  data.placeholder = '请输入场景描述'
  data.question = res.text
}

watch(() => data.question, () => {
  inputHeight.value = inputRef.value.resizableTextArea.textArea.clientHeight
  if(data.question.trim().length >= 0) {
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
    float: right;
  }
  .recorder {
    cursor: pointer;
    float: left;
    &:hover {
      color: var(--primary-color)
    }

    &--disabled, &--disabled:hover {
      color: #C9CCD1 !important
    }
  }
}
</style>