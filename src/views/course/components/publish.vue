<template>
  <div class="app-content">
    <div style="text-align:center">
      <el-button type="primary" @click="backMethod">
        上一步
      </el-button>
      <el-button :disable="btnStatus" type="primary" @click="publish">
        发布课程
      </el-button>

    </div>
  </div>
</template>

<script>
export default {
  name: 'Publish',
  data() {
    return {
      btnStatus: false
    }
  },
  methods: {
    backMethod() {
      this.$parent.active = 1
    },
    publish() {
      this.$parent.active = 3
      this.btnStatus = true
    }
  }

}
</script>

<style>

</style>
