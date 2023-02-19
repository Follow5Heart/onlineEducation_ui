<template>
  <div class="app-content">
    <!-- 课程信息表单 -->
    <el-form label-width="120px">

      <el-form-item label="课程标题">
        <el-input v-model="courseInfo.title" placeholder=" 示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写" />
      </el-form-item>

      <!-- 课程讲师 -->
      <el-form-item label="课程讲师">
        <el-select v-model="courseInfo.teacherId" placeholder="请选择">
          <el-option
            v-for="teacher in teacherList"
            :key="teacher.id"
            :value="teacher.id"
            :label="teacher.name"
          />
        </el-select>
      </el-form-item>

      <!-- 所属分类 -->
      <el-form-item label="课程分类">
        <!-- 一级分类 -->
        <el-select
          v-model="courseInfo.subjectParentId"
          placeholder="请选择"
          @change="subjectChanged"
        >
          <el-option
            v-for="subject in subjectList"
            :key="subject.id"
            :value="subject.id"
            :label="subject.title"
          />
        </el-select>

        <!-- 二级分类 -->
        <el-select
          v-model="courseInfo.subjectId"
          placeholder="请选择"
        >
          <el-option
            v-for="subject in subjectLevelTwoList"
            :key="subject.id"
            :value="subject.id"
            :label="subject.title"
          />
        </el-select>

      </el-form-item>

      <el-form-item label="总课时">
        <el-input-number v-model="courseInfo.lessonNum" :min="0" controls-position="right" placeholder="请填写课程的总课时数" />
      </el-form-item>

      <!-- 课程简介-->
      <el-form-item label="课程简介">
        <tinymce v-model="courseInfo.description" :height="300" />
      </el-form-item>

      <!-- 课程封面 -->
      <el-form-item label="课程封面">
        <el-upload
          :show-file-list="false"
          :on-success="handleCoverSuccess"
          :before-upload="beforeCoverUpload"
          :on-error="handleCoverError"
          class="cover-uploader"
          action="http://127.0.0.1:8120/service-files/upload?module=cover"
        >
          <img v-if="courseInfo.cover" :src="courseInfo.cover">
          <i v-else class="el-icon-plus avatar-uploader-icon" />
        </el-upload>
      </el-form-item>

      <el-form-item label="课程价格">
        <el-input-number v-model="courseInfo.price" :min="0" controls-position="right" placeholder="免费课程请设置为0元" /> 元
      </el-form-item>
    </el-form>
    <div style="text-align:center">
      <el-button :disabled="saveBtnDisabled" type="primary" @click="saveAndNext()">
        保存并下一步
      </el-button>

    </div>

  </div>
</template>

<script>
import { saveCourseInfo, getCourseInfo, updateCourseInfo } from '@/api/course'
import { list } from '@/api/teacher'
import { getCurrentSubjectList } from '@/api/subject'
import Tinymce from '@/components/Tinymce'

export default {
  name: 'Info',
  components: { Tinymce },
  data() {
    return {
      saveBtnDisabled: false,
      courseInfo: { // 表单数据
        price: 0,
        lessonNum: 0,
        // 以下解决表单数据不全时insert语句非空校验
        teacherId: '',
        subjectId: '',
        subjectParentId: '',
        cover: '',
        description: '',
        title: ''
      },

      teacherList: [], // 讲师列表
      subjectList: [], // 一级分类
      subjectLevelTwoList: [] // 二级分类

    }
  },
  watch: {
    courseInfo: {
      deep: true,
      handler(newValue, oldValue) {
        if (this.$parent.courseId) {
          this.getTwoSubjectList(this.courseInfo.subjectParentId)
        }
      }
    }
  },
  mounted() {
    // 判断父组件的课程id是否存在，如果存在，回显数据
    if (this.$parent.courseId) {
      this.echoCourseInfo(this.$parent.courseId)
      this.getFirstSubjectList()

      this.getTwoSubjectList(this.courseInfo.subjectParentId)
    } else {
      this.getFirstSubjectList()
    }
    this.getTeacherList()
  },
  methods: {
    // 点击保存并下一步按钮方法
    saveAndNext() {
      // 保存按钮禁用
      this.saveBtnDisabled = true

      // 判断是否是新增课程还是更新课程
      if (this.$parent.courseId) {
        this.updateCourse()
      } else {
        // 把当前信息发送到后端进行保存
        this.savaCourse()
      }
    },
    // 保存课程基本信息
    savaCourse() {
      saveCourseInfo(this.courseInfo).then(response => {
        if (response.code === 20000) {
          this.$parent.courseId = response.data.courseId
          // 如果成功的话，进行下一个步骤
          this.$parent.active = 1 // 使用this.$parent 访问父组件的数据
          this.$message({
            message: '保存成功',
            type: 'success'
          })
        }
      })
    },
    // 更新课程基本信息
    updateCourse() {
      updateCourseInfo(this.courseInfo).then(response => {
        if (response.code === 20000) {
          this.$parent.active = 1 // 使用this.$parent 访问父组件的数据
          this.$message({
            message: '更新成功',
            type: 'success'
          })
        }
      })
    },
    // 获取讲师列表
    getTeacherList() {
      list().then(response => {
        if (response.code === 20000) {
          this.teacherList = response.data.items
        }
      })
    },

    // 获取所有课程的一级分类
    getFirstSubjectList() {
      getCurrentSubjectList({ parentId: '0' }).then(response => {
        if (response.code === 20000) {
          this.subjectList = response.data.currentSubjectList
        }
      })
    },

    getTwoSubjectList(Id) {
      getCurrentSubjectList({ parentId: Id }).then(response => {
        if (response.code === 20000) {
          this.subjectLevelTwoList = response.data.currentSubjectList
        }
      })
    },
    // 选择课程一级分类触发事件方法
    subjectChanged(value) {
      this.courseInfo.subjectId = ''
      this.getTwoSubjectList(value)
    },
    // 上传成功回调
    handleCoverSuccess(res, file) {
      if (res.success) {
        // console.log(res)
        this.courseInfo.cover = res.data.fileInfo.url
        // 强制重新渲染
        this.$forceUpdate()
      } else {
        this.$message.error('上传失败1（非20000）')
      }
    },

    // 上传校验
    beforeCoverUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },

    // 错误处理
    handleCoverError() {
      console.log('error')
      this.$message.error('上传失败（http错误）')
    },

    // 根据课程id回显数据
    echoCourseInfo(courseId) {
      getCourseInfo(courseId).then(response => {
        if (response.code === 20000) {
          this.courseInfo = response.data.courseInfo
        }
      })
    }

  }

}
</script>

<style scoped>
.tinymce-container{
  position:relative;
  line-height:normal;
}
.cover-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width:640px;
  height: 357px;
}
.cover-uploader .el-upload:hover {
  border-color: #409EFF;
}
.cover-uploader .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 640px;
  height: 357px;
  line-height: 357px;
  text-align: center;
}
.cover-uploader img {
  width: 640px;
  height: 357px;
  display: block;
}
</style>
