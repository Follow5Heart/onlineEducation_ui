<template>
  <div class="app-content">
    <div style="text-align:center">
      <el-button :disabled="saveBtnDisabled" type="primary" @click="saveAndNext()">
        保存并下一步
      </el-button>

    </div>

  </div>
</template>

<script>
export default {
  name: 'Info',
  data() {
    return {
      saveBtnDisabled: false

    }
  },
  methods: {
    saveAndNext() {
      // 保存按钮禁用
      this.saveBtnDisabled = true

      // 把当前信息发送到后端进行保存

      // 如果成功的话，进行下一个步骤
      this.$parent.active = 1 // 使用this.$parent 访问父组件的数据
    }

  }

}
</script>

<style>

</style>
