<template>
  <div class="app-container">
    <el-form>
      <el-form-item label="讲师名称" label-width="80px">
        <el-input v-model="teacherObj.name" style="width:50%" placeholder="请输入讲师名称" />
      </el-form-item>
      <el-form-item label="入住时间" label-width="80px">
        <el-date-picker v-model="teacherObj.joinDate" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" style="width: 13%;" />
      </el-form-item>
      <el-form-item label="讲师排序" label-width="80px">
        <el-input-number v-model="teacherObj.sort" :min="1" />
      </el-form-item>
      <el-form-item label="讲师头衔" label-width="80px">
        <el-select v-model="teacherObj.level" clearable placeholder="请选择头衔">
          <el-option
            label="首席讲师"
            value="1"
          />
          <el-option
            label="高级讲师"
            value="2"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="讲师资历" label-width="80px">
        <el-input
          v-model="teacherObj.career"
          type="textarea"
          :rows="6"
          placeholder="请输入讲师资历"
        />
      </el-form-item>
      <el-form-item label="讲师简历" label-width="80px">
        <el-input
          v-model="teacherObj.intro"
          type="textarea"
          :rows="8"
          placeholder="请输入讲师简历"
        />
      </el-form-item>
      <el-form-item label="头像上传" label-width="80px">
        <!-- 头像上传 -->
        <el-upload
          class="avatar-uploader"
          action="http://127.0.0.1:8120/service-file/files/upload"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :on-error="handleAvatarError"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="teacherObj.avatar" :src="teacherObj.avatar" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon" />
        </el-upload>
      </el-form-item>
      <el-form-item align="center">
        <el-button v-if="saveButtonDisabled" type="primary" @click="saveTeacher">保存</el-button>
        <el-button v-else type="primary" @click="update">更新</el-button>
        <router-link :to="'/teacher/list'">
          <el-button type="primary" style="margin:0 0 0 20px">返回</el-button>
        </router-link>

      </el-form-item>

    </el-form>
  </div>
</template>

<script>
import { saveTeacher, queryTeacherById, updateTeacher } from '@/api/teacher'

export default {
  name: 'Form',
  data() {
    return {
      teacherObj: {
        'sort': '1',
        'avatar': ''

      },
      saveButtonDisabled: true
    }
  },
  created() {
    if (this.$route.params.id) {
      this.fetchDataById(this.$route.params.id)
      this.saveButtonDisabled = false
    }
  },
  methods: {
    // 保存讲师数据
    saveTeacher() {
      saveTeacher(this.teacherObj).then(
        response => {
          if (response.code === 20000) {
            this.$message({
              message: '保存成功',
              type: 'success'
            })
            setTimeout(() => {
              this.$router.push('/teacher/list')
            }, 500)
          } else {
            this.$message.error('保存失败')
          }
        }
      )
    },
    // 更新讲师数据
    update() {
      updateTeacher(this.teacherObj).then(response => {
        if (response.code === 20000) {
          this.$message({
            message: '更新成功',
            type: 'success'
          })
          setTimeout(() => {
            this.$router.push('/teacher/list')
          }, 500)
        } else {
          this.$message.error('更新失败')
        }
      })
    },

    fetchDataById(id) {
      queryTeacherById(id).then(response => {
        if (response.code === 20000) {
          this.teacherObj = response.data.items
        }
      })
    },
    handleAvatarSuccess(response, file) {
      if (response.code === 20000) {
        this.teacherObj.avatar = response.data.fileInfo.url
        this.teacherObj.fileInfo = JSON.stringify(response.data.fileInfo)
      } else {
        this.$message.error('文件上传失败')
      }
    },
    handleAvatarError() {
      this.$message.error('文件上传失败（http问题）')
    },
    beforeAvatarUpload() {

    }
  }
}

</script>
<style>
 .avatar-uploader .el-upload {
    border: 1px dashed #a9a9a9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
