<template>
  <div class="breadcrumb">
    <span>场景生成</span>
    <span>语义生成</span>
  </div>
  <div class="main">
    <!-- <span class="title">语义生成</span> -->
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
              <image src="@/assets/images/me_avatar.png" class="avatar" v-if="chat.type == 0"/>
              <image src="@/assets/images/bot_avatar.png" class="avatar" v-else />
            </div>
            <div class="message-right">
              <div class="username">{{ chat.type == 0 ? 'YOU' : '赛目科技大模型' }}</div>
              <div class="message-body" :class="'message-body-' + chat.type">
                {{ chat.message }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="recorder" v-if="data.isRecording">
        <div class="circle"></div>
        <image src="@/assets/images/recorder.png"></image>
      </div>
      <div class="input-box-wrapper">
        <div class="input-box">
          <a-button class="audio-button" @click="onSwitchInputType" title="语音输入" v-if="data.inputType == InputType.Text">🎙️</a-button>
          <a-button class="audio-button" @click="onSwitchInputType" title="文本输入" v-else>⏹</a-button>
          <a-textarea :placeholder="data.placeholder" rows="1" class="input" v-model="data.question"
            @input="onInputChange"></a-textarea>
          <a-button type="primary" class="submit" @click="onSend" v-if="!data.isWriting">
            <img src="@/assets/images/loading.png" class="loading" v-if="data.isSubmitting"/>
            发送
          </a-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import axios from 'axios'
import '@/utils/recorder'

const InputType = {
    Text: 1,
    Voice: 2
}

const axiosInstance = axios.create({
    baseURL: '',
    timeout: 10000,
})
let mediaRecorder: MediaRecorder
HZRecorder.get((rec: MediaRecorder) => mediaRecorder = rec)

const data = reactive<LLMData>({
  question: '',            // 问题
  answer: null,              // 答案
  chats: [],               // 所有对话数据
  isWriting: false,        // 是否正在逐行输出结果
  isRecording: false,      // 是否正在语音输入
  isSubmitting: false,     // 是否正在提交到服务器
  inputType: InputType.Text, // 当前为文本输入还是语音输入
  placeholder: '请输入场景描述'
})

// 切换输入方式
const onSwitchInputType = () => {
  data.question = ''
  data.inputType = data.inputType == InputType.Text ? InputType.Voice : InputType.Text
  data.placeholder = data.inputType == InputType.Text ? '请输入场景描述' : '正在录音...'
  data.inputType == InputType.Text ? stopRecording() : startRecording()
}

// 动态调整textarea高度
const onInputChange = (event: { target: any }) => {
  const target = event.target
  if(target.scrollHeight > target.clientHeight) {
    target.style.height = target.scrollHeight - 20 + 'px'  // 20 == padding
  }
}

const onSend = () => {
  if(data.question.trim().length == 0) {
    message.error('请输入您的问题')
    return
  }
  
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
</script>

<style lang="less" scoped>
.container {
  background-color: #fff;
  width: 1000px;
  height: calc(100% - 110px);
  // margin: 16px 0px;
}

button {
  color: #fff;
  border-radius: 10px;
  border: 0px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.loading {
    width: 20px !important;
    height: 20px !important;
    animation: loading 2s linear infinite;
}
@keyframes loading {
    from {  transform: rotate(0) }
    to { transform: rotate(360deg) }
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
    margin-bottom: 10px;
}
		
.message .avatar {
    width: 50px;
    height: 50px;

    margin-right: 20px;
}
		
.message .username {
    font-weight: 600;
}
		
.message .message-body-1 {
    margin-top: 4px;
    border: 1px solid #375141;
    // background-color: #111827;
    white-space: pre-wrap;
    overflow-wrap: break-word;
    padding: 8px;
    margin-bottom: 4px;
}
	
.input-box-wrapper {
    // background-color: #0b0f19;
    width: 1000px;
    position: fixed;
    bottom: 24px;
}
.input-box-wrapper .input-box {
    display: flex;
    align-items: flex-end;
}
		
.input-box-wrapper .input {
    border: 1px solid #374151;
    border-radius: 5px;
    width: 100%;
    margin: 0px 4px;
}
.input-box-wrapper .voice {
    box-sizing: border-box;
    text-align: center;
    line-height: 40px;
    height: 40px;
}
	
.recorder {
    position: fixed;
    bottom: 80px;
    width: 1000px;
    height: 80px;
    background-color: #0b0f19;
    display: flex;
    justify-content: center;
    align-items: center;
}
.recorder .circle {
    position: absolute;
    background-color: #374151;
    height: 50px;
    width: 50px;
    border-radius: 50px;
    animation: blur 1s infinite;
}
@keyframes blur
{
    from { width: 40px; height: 40px; }
    to { width: 70px; height: 70px; }
}
.recorder img {
    width: 40px;
    height: 40px;
    z-index: 1;
}

.submit {
    // background-color: #f97316;
    color: #fff;
    width: 100px;
    height: 40px;
}

.audio-button {
    width: 100px;
    height: 40px;
    cursor: pointer;
    // background: linear-gradient(to bottom right, #4b5563 , #374151 );
}
</style>