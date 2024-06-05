<template>
  <div class="breadcrumb">
    <span>场景生成</span>
    <span>语义生成</span>
  </div>
  <div>
    <div class="container">
      <div class="messages">
        <!-- 欢迎语 -->
        <div class="message">
          <div class="message-left">
            <img src="@/assets/images/bot_avatar.png" class="avatar"/>
          </div>
          <div class="message-right">
            <div class="username">赛目科技大模型</div>
            <div class="message-body">
              <text :user-select="true" space="ensp">Hi, 我是赛目科技的大模型，很高兴为您服务</text>
            </div>
          </div>
        </div>
        <!-- 聊天记录 -->
        <div class="messages-content">
          <div v-for="(chat, index) in data.chats" :key="index" class="message">
            <div class="message-left">
              <img src="@/assets/images/bot_avatar.png" class="avatar" v-if="isSaimo(chat.type)" />
              <img src="@/assets/images/me_avatar.png" class="avatar" v-else/>
            </div>
            <div class="message-right">
              <div class="username">{{ isSaimo(chat.type) ? '赛目科技大模型' : 'YOU' }}</div>
              <div class="message-body" :class="'message-body-' + chat.type">
                {{ chat.message }}
              </div>
              <div class="message-footer" v-if="isSaimo(chat.type)">
                <div>
                  场景文件保存路径：我的场景-具体场景-赛目大模型-set20244
                </div>
                <a @click="preview(chat)">查看</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="input-box-wrapper">
        <a-textarea :placeholder="data.placeholder" rows="1" class="input" v-model:value="data.question"></a-textarea>
        <div class="flex justify-between items-center">
          <svg-icon icon="recorder-stop" class="recorder" @click="stopRecording" v-if="data.isRecording"></svg-icon>
          <svg-icon icon="recorder" class="recorder" @click="startRecording" v-else></svg-icon>
          <a-button type="primary" size="small" class="submit" @click="onSend" v-if="!data.isWriting"
            :loading="data.isSubmitting">发送</a-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import axios from 'axios'
import '@/utils/recorder'

const axiosInstance = axios.create({
    baseURL: '',
    timeout: 10000,
})
let mediaRecorder: MediaRecorder
HZRecorder.get((rec: MediaRecorder) => mediaRecorder = rec)

const isSaimo = (type: number) => type == 1

const data = reactive<LLMData>({
  question: '',            // 问题
  answer: null,              // 答案
  chats: [{ type: 0, message: '欢迎使用赛目科技大模型，请输入您的问题。'}, { type: 1, message: '赛目科技大模型已就绪，请输入您的问题。'}],               // 所有对话数据
  isWriting: false,        // 是否正在逐行输出结果
  isRecording: false,      // 是否正在语音输入
  isSubmitting: false,     // 是否正在提交到服务器
  placeholder: '请输入场景描述'
})

const onSend = () => {
  if(data.question.trim().length == 0) {
    message.error('请输入您的问题')
    return
  }
  try {
    data.isSubmitting = true
    axiosInstance.request({
      url: '/api/predict/',
      data: { message: data.question.trim() },
      method: 'POST'
    }).then(res => {
      if(res.data.code == 200) {
        writeChats(res.data.data)
      } else {
        message.error('服务器发生错误')
      }
    })
  } finally {
    data.isSubmitting = false
  }
}
// 显示答案
const writeChats = (answer: { xml?: any; id?: any }) => {
  data.isSubmitting = false
  data.answer = {
    ...answer,
    id: answer.id,
    xml: answer.xml.split('\n')
  }
  
  // 显示问题
  data.chats.push({
    message: data.question,
    type: 0
  })

  // 显示答案
  const isValidXml = answer.xml.indexOf('<?xml') > -1
  data.chats.push({
    message: isValidXml ? '' : answer.xml,
    type: 1,
    id: answer.id
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
function startRecording() {
  data.placeholder = '正在录音...'
  mediaRecorder.start()
  data.isRecording = true
}

function stopRecording() {
  mediaRecorder.stop()
  data.isRecording = false

  audioToText()
}

function audioToText() {
  data.placeholder = '语音转换中...'
  const rate = new window.AudioContext().sampleRate
  const formData = new FormData();
  formData.append("audio", mediaRecorder.getBlob());
  formData.append('rate', rate.toString())

  axiosInstance.request({
    url: '/api/audio_to_text/',
    data: formData,
    method: 'POST'
  }).then(res => {
    data.question = res.data.data.text
  })
}

const router = useRouter()
function preview(chat: Chat) {
  console.log(chat)
  router.push('/my-sceneset/scene/preview/793')
}
</script>

<style lang="less" scoped>
.container {
  width: 1000px;
  margin: 16px auto;
}

.messages {
    height: 100%;
    overflow-y: auto;
}
.message-content {
    height: calc(100% - 50px)
}
	
.message {
  display: flex;
  margin-bottom: 16px;

  .message-left {
    width: 40px;
    height: 40px;
    background-color: #fff;
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 10px;
  }

  .message-right {
    width: 100%;
  }
  .username {
    color: var(--text-second-color);
  }
  .message-body {
    background-color: #fff;
    width: 100%;
    padding: 16px;
    border-radius: 4px;
    margin-top: 4px;
    white-space: pre-wrap;
    overflow-wrap: break-word;
  }

  .message-body-0 {
    background-color: #E6E7EB;
  }
  .message-footer {
    border-top: 1px solid #E6E7EB;
    background-color: #fff;
    padding: 16px;
    display: flex;
    justify-content: space-between;
  }
}
.input-box-wrapper {
    background-color: #fff;
    padding: 16px;
    border-radius: 4px;
    width: 1000px;
    position: fixed;
    bottom: 24px;

    .input {
      margin-bottom: 16px;
      border: 0px;
      max-height: 100px;
    }
    button {
      height: 32px;
      width: 80px;
    }
    .recorder {
      cursor: pointer;

      &:hover {
        color: var(--primary-color);
      }
    }
}
</style>