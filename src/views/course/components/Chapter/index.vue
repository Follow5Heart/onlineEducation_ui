<template>
  <div class="app-content">
    <div style="text-align:center">
      <el-button :disabled="saveBtnDisabled" type="primary" @click="backMethod()">
        上一步
      </el-button>
      <el-button :disabled="saveBtnDisabled" type="primary" @click="nextMethod()">
        下一步
      </el-button>

    </div>
  </div>
</template>

<script>
export default {
  name: 'Chapter',
  data() {
    return {
      saveBtnDisabled: false

    }
  },
  methods: {
    backMethod() {
      this.$parent.active = 0
    },

    nextMethod() {
      this.$parent.active = 2
    }
  }

}
</script>

<style>

</style>
