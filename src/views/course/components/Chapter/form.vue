<template>

  <!-- 添加和修改章节表单 -->
  <el-dialog :visible="dialogVisible" :title="dialogTitle" @close="close()">
    <el-form :model="chapter" label-width="120px">
      <el-form-item label="章节标题">
        <el-input v-model="chapter.title" />
      </el-form-item>
      <el-form-item label="章节排序">
        <el-input-number v-model="chapter.sort" :min="0" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close()">取 消</el-button>
      <el-button type="primary" @click="saveOrUpdate()">确 定</el-button>
    </div>
  </el-dialog>

</template>

<script>
import { getChapter, saveChapter, updateChapter } from '@/api/chapter'

export default {

  data() {
    return {
      dialogVisible: false, // 是否显示对话框
      chapter: { // 章节对象
        sort: 0
      },
      dialogTitle: '添加章节'
    }
  },

  methods: {

    // 显示对话框
    open(chapterId) {
      this.dialogVisible = true
      if (chapterId) {
        this.dialogTitle = '编辑章节'
        getChapter(chapterId).then(response => {
          this.chapter = response.data.items
        })
      }
    },

    // 关闭对话框
    close() {
      this.dialogVisible = false
      this.resetForm()
    },

    // 重置表单
    resetForm() {
      this.chapter = {
        sort: 0
      }
    },

    // 保存或更新章节
    saveOrUpdate() {
      if (!this.chapter.id) {
        this.save()
      } else {
        this.update()
      }
    },

    // 保存章节
    save() {
      this.chapter.courseId = this.$parent.$parent.courseId
      saveChapter(this.chapter).then(response => {
        this.$message.success(response.message)
        // 关闭组件
        this.close()
        // 刷新列表
        this.$parent.fetchChapterNestedList()
      })
    },

    // 更新章节
    update() {
      updateChapter(this.chapter).then(response => {
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

