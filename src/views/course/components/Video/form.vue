<template>
  <!-- 添加和修改课时表单 -->
  <el-dialog :visible="dialogVisible" :title="dialogTitle" @close="close()">
    <el-form :model="video" label-width="120px">
      <el-form-item label="课时标题">
        <el-input v-model="video.title" />
      </el-form-item>
      <el-form-item label="课时排序">
        <el-input-number v-model="video.sort" :min="0" />
      </el-form-item>
      <el-form-item label="是否免费">
        <el-radio-group v-model="video.isFree">
          <el-radio label="1">免费</el-radio>
          <el-radio label="0">默认</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="上传视频">
        <uploader
          ref="uploader"
          :key="uploader_key"
          :options="options"
          :auto-start="false"
          class="uploader-example"
          @file-success="onFileSuccess"
          @file-added="filesAdded"
          @file-removed="removeFile"
        >
          <uploader-unsupport />
          <uploader-btn :single="true" class="uploaderBtn1">选择视频</uploader-btn>
          <el-button size="small" class="uploaderBtn2" @click="startUpload">上传</el-button>
          <uploader-list />
        </uploader>

        <!-- <el-button @click="pause">暂停</el-button>
        <el-button @click="start">恢复</el-button> -->

      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close()">取 消</el-button>
      <el-button type="primary" @click="saveOrUpdate()">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mergeChunk } from '@/api/simpleUpload'
import SparkMD5 from 'spark-md5'
import { saveVideo, updateVideo, getVideoById } from '@/api/video'
import { removeVideo } from '@/api/vod'

export default {
  data() {
    const vm = this // 保存 Vue 实例的 this
    return {
      currentFile: null,
      dialogVisible: false, // 是否显示对话框
      video: {
        sort: 0,
        free: false,
        videoSourceId: '',
        videoOriginalName: '',
        url: ''
      },
      dialogTitle: '新增课时',
      uploader_key: new Date().getTime(), // 这个用来刷新组件--解决不刷新页面连续上传的缓存上传数据（注：每次上传时，强制这个值进行更改---根据自己的实际情况重新赋值）
      options: {
        target: 'http://127.0.0.1:8130/service-vod/video/chunkUpload', // SpringBoot后台接收文件夹数据的接口
        testChunks: true, // 是否测试分片
        testMethod: 'GET',
        simultaneousUploads: 3,
        chunkSize: 52428800,
        // 服务器分片校验函数，秒传及断点续传基础
        checkChunkUploadedByResponse: function(chunk, message) {
          const objMessage = JSON.parse(message)
          if (objMessage.data.skipUpload) {
            vm.video.videoSourceId = objMessage.data.videoId
            vm.video.url = objMessage.data.url
            vm.video.videoOriginalName = objMessage.data.filename
            return true
          }

          return (objMessage.data.uploaded || []).indexOf(chunk.offset + 1) >= 0
        }

      }
    }
  },

  methods: {
    removeFile(file) {
      // if (!this.video.videoSourceId) {
      //   return
      // }

      // // 删除视频
      // removeVideo(this.video.videoSourceId).then(res => {
      //   this.video.videoSourceId = ''
      //   this.video.videoOriginalName = ''
      //   // 删除完成之后直接进行更新操作
      //   debugger
      //   updateVideo(this.video)
      //   this.$message.success(res.message)
      // })
      console.log(file, '已经被移除')
    },
    // 开始上传
    startUpload() {
      this.$refs.uploader.uploader.resume()
    },
    onFileAdded(file) {
      console.log('... onFileAdded')
      this.computeMD5(file)
    },
    onFileProgress(rootFile, file, chunk) {
      console.log('... onFileProgress')
    },
    onFileSuccess(rootFile, file, response, chunk) {
      const res = JSON.parse(response)
      // 如果服务端返回需要合并
      if (res.data.needMerge) {
        const param = {
          'filename': rootFile.name,
          'identifier': rootFile.uniqueIdentifier,
          'contentType': rootFile.fileType,
          'filesize': rootFile.size
        }
        mergeChunk(param).then(response => {
          // 合并完后，赋值
          const res = JSON.parse(response)
          this.video.videoSourceId = res.data.videoId
          this.video.url = res.data.url
          this.video.videoOriginalName = res.data.filename
        }).catch(e => {
          console.log('合并异常,重新发起请求,文件名为:', file.name)
          file.retry()
        })
      }
    },
    onFileError(rootFile, file, response, chunk) {
      console.log('... onFileError')
    },
    // onFileSuccess: function(rootFile, file, response, chunk) {
    //   console.log(rootFile)
    //   console.log(file)
    //   console.log(response)
    //   console.log(chunk)
    // },
    /**
     * 计算md5，实现断点续传及秒传
     * @param file
     */
    computeMD5(file) {
      // 大文件的md5计算时间比较长，显示个进度条
      const loading = this.$loading({
        lock: true,
        text: '正在计算MD5',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      const fileReader = new FileReader()
      const time = new Date().getTime()
      const blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice
      let currentChunk = 0
      const chunkSize = 10 * 1024 * 1000 * 50
      const chunks = Math.ceil(file.size / chunkSize)
      const spark = new SparkMD5.ArrayBuffer()
      file.pause()

      loadNext()

      fileReader.onload = e => {
        spark.append(e.target.result)
        if (currentChunk < chunks) {
          currentChunk++
          loadNext()
          // 实时展示MD5的计算进度
          this.$nextTick(() => {
            console.log('校验MD5 ' + ((currentChunk / chunks) * 100).toFixed(0) + '%')
          })
        } else {
          const md5 = spark.end()
          loading.close()
          this.computeMD5Success(md5, file)
          console.log(`MD5计算完毕：${file.name} \nMD5：${md5} \n分片：${chunks} 大小:${file.size} 用时：${new Date().getTime() - time} ms`)
        }
      }
      fileReader.onerror = function() {
        this.error(`文件${file.name}读取出错，请检查该文件`)
        loading.close()
        file.cancel()
      }
      function loadNext() {
        const start = currentChunk * chunkSize
        const end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize
        fileReader.readAsArrayBuffer(blobSlice.call(file.file, start, end))
      }
    },

    computeMD5Success(md5, file) {
      file.uniqueIdentifier = md5// 把md5值作为文件的识别码
      // file.resume()// 开始上传
    },
    /**
     * 添加文件后触发
     * @param file
     * @param event
     */
    filesAdded(file, event) {
      debugger
      if (this.$refs.uploader.uploader.files.length >= 1) {
        // this.$message({
        //   message: '只能上传一个视频',
        //   type: 'warning'
        // })
        this.$refs.uploader.uploader.removeFile(file)
        return
      }
      debugger
      // if (this.dialogTitle !== '编辑课时') {

      // }
      this.computeMD5(file)
    },
    // 显示对话框
    open(chapterId, videoId) {
      debugger
      this.dialogVisible = true
      this.video.chapterId = chapterId

      if (videoId) {
        this.dialogTitle = '编辑课时'
        getVideoById(videoId).then(response => {
          if (response.code === 20000) {
            this.video = response.data.items
            // 回显视频列表
            debugger
            if (this.video.videoSourceId) {
              // 通过文件信息，自己创建一个文件对象，添加到文件列表中
              const fileName = this.video.videoOriginalName
              const fileType = this.video.fileType
              const fileSize = this.video.fileSize
              const fileOptions = {
                type: fileType,
                lastModified: Date.now()
              }
              const file = new File([new ArrayBuffer(fileSize)], fileName, fileOptions)
              this.$refs.uploader.uploader.addFile(file)
              this.currentFile = file
              // file.pause()
            }
          } else {
            this.$message({
              message: response.message,
              type: 'error'
            })
          }
        })
      } else {
        this.dialogTitle = '新增课时'
      }
      if (this.dialogVisible && this.dialogTitle === '新增课时') {
        this.$refs.uploader.files = []
        this.$refs.uploader.fileList = []
      }
    },

    // 关闭页面
    close() {
      this.dialogVisible = false
      // 重置表单
      this.resetForm()
    },

    resetForm() {
      this.video = {
        sort: 0,
        free: false
      }
      // 清空文件列表
      debugger
      console.log(this.$refs.uploader.uploader)
      this.$refs.uploader.files = []
      this.$refs.uploader.fileList = []
      // this.$refs.uploader.uploader.removeFile(this.currentFile)
    },

    // 保存和更新
    saveOrUpdate() {
      if (!this.video.id) {
        this.save()
      } else {
        this.update()
      }
    },

    save() {
      this.video.courseId = this.$parent.$parent.courseId
      saveVideo(this.video).then(response => {
        this.$message.success(response.message)
        // 关闭组件
        this.close()
        // 刷新列表
        this.$parent.fetchChapterNestedList()
      })
    },

    update() {
      updateVideo(this.video).then(response => {
        this.$message.success(response.message)
        // 关闭组件
        this.close()
        // 刷新列表
        this.$parent.fetchChapterNestedList()
      })
    }
  }
}
</script>
<style scoped>
.uploader-example {

 }
 .uploader-example .uploader-btn {
  margin-right: 4px;
 }
 .uploader-example .uploader-list {
  max-height: 440px;
  overflow: auto;
  overflow-x: hidden;
  overflow-y: auto;
 }
 .uploaderBtn1{
  background-color: #409eff;
  color: #ffffff;
  border: 0;
 }
 .uploaderBtn2{
  background-color: #00c14a;
  color: #ffffff;
  border: 0;
 }
</style>

