<template>
  <div class="breadcrumb">
    <span>场景生成</span>
    <span>语义生成</span>
  </div>
</template>

<script lang="ts" setup>

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