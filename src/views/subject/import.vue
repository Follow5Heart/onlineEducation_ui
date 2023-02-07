<template>
  <div class="main-box">
    <div class="desctionLine">
      <span class="desctionText">信息描述</span>
      <el-button class="button1" type="info" disabled>excel模板说明</el-button>
      <el-button class="button1" type="primary" icon="el-icon-download">点击下载模板</el-button>
    </div>

    <div class="desctionLine">
      <span class="desctionText">选择Excel</span>
      <el-upload
        ref="upload"
        class="upload-demo"
        :action="uploadUrl"
        :on-preview="handlePreview"
        :on-success="fileUploadSuccess"
        :on-remove="handleRemove"
        :auto-upload="false"
        :on-exceed="fileUploadExceed"
        :limit="1"
        accept="application/vnd.ms-excel"
      >
        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        <el-button :disabled="importBtnDisabled" style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>

    </div>

  </div>
</template>

<script>
export default {
  name: 'Import',
  data() {
    return {
      uploadUrl: 'http://127.0.0.1:8110/edu/subject/batchImportExcel',
      importBtnDisabled: false
    }
  },
  methods: {
    // 当选择文件超出约定数量时触发
    fileUploadExceed() {
      this.$message({
        type: 'warning',
        message: '只能上传一个文件'
      })
    },
    // 上文文件成功回调
    fileUploadSuccess(response) {
      this.importBtnDisabled = false // 启动按钮

      this.$message({
        type: 'success',
        message: '上传成功'
      })
      this.$refs.upload.clearFiles() // 清空文件列表
    },
    // 上传文件失败的回调
    fileUploadError(response) {
      this.importBtnDisabled = false // 启动按钮
      this.$message.error(response.message)
      this.$refs.upload.clearFiles() // 清空文件列表
    },
    handleChange(file, fileList) {
      return true
    },
    // 提交文件方法
    submitUpload() {
      // 禁用按钮
      this.importBtnDisabled = true
      // 获取组件对象，调用组件的submit方法，提交文件数据
      this.$refs.upload.submit()
    },
    // 删除文件的回调
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    }

  }
}
</script>

<style>
.main-box{
    width: 100%;
    height: 100%;

}
.desctionLine{
    width: 100%;
    height: 100px;
    float: left;
    margin-top: 100px;
    margin-left: 100px;
}
.desctionText{
    font-size: 25px;

}
.button1{
    margin-left: 20px;
}
.upload-demo{
    margin-top: 20px;
    width: 40%;
}
</style>
