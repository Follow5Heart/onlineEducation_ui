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
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close()">取 消</el-button>
      <el-button type="primary" @click="saveOrUpdate()">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { saveVideo, updateVideo, getVideoById } from '@/api/video'

export default {
  data() {
    return {
      dialogVisible: false, // 是否显示对话框
      video: {
        sort: 0,
        free: false
      },
      dialogTitle: '新增课时'
    }
  },

  methods: {
    // 显示对话框
    open(chapterId, videoId) {
      this.dialogVisible = true
      this.video.chapterId = chapterId

      if (videoId) {
        this.dialogTitle = '编辑课时'
        getVideoById(videoId).then(response => {
          if (response.code === 20000) {
            this.video = response.data.items
          } else {
            this.$message({
              message: response.message,
              type: 'error'
            })
          }
        })
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

