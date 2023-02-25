<template>
  <div class="app-content">
    <div style="text-align:center">

      <div class="ccInfo">
        <img :src="coursePublis.cover" alt="" class="img1">
        <div class="main">
          <h2>{{ coursePublis.title }}</h2>
          <p class="gray">
            <span>共{{ coursePublis.lessonNum }}课时</span><br>
            <span>所属分类：{{ coursePublis.subjectParentTitle }}-{{ coursePublis.subjectTitle }}</span><br>
            <span>课程讲师：{{ coursePublis.teacherName }}</span>

          </p>

          <h3 class="red1">￥{{ coursePublis.price }}</h3>
        </div>

      </div>
      <div class="btnclass">
        <el-button type="primary" @click="backMethod">
          上一步
        </el-button>
        <el-button :disable="btnStatus" type="primary" @click="publish">
          发布课程
        </el-button>

      </div>

    </div>
  </div>
</template>

<script>
import { getPublishCourse, publishCourseById } from '@/api/course'
export default {
  name: 'Publish',
  data() {
    return {
      btnStatus: false, // 按钮是否禁用
      coursePublis: {} // 课程信息

    }
  },
  created() {
    if (this.$parent.courseId) {
      this.fetchCoursePublishById(this.$parent.courseId)
    }
  },
  methods: {
    // 获取课程发布信息
    fetchCoursePublishById(courseId) {
      getPublishCourse(courseId).then(res => {
        if (res.code === 20000) {
          console.log(res.data.items)
          this.coursePublis = res.data.items
        }
      })
    },

    backMethod() {
      this.$parent.active = 1
    },
    publish() {
      this.btnStatus = true
      publishCourseById(this.coursePublis.id).then(res => {
        console.log(res, '1111111111111')
      })
    }
  }

}
</script>

<style scoped>
.ccInfo{
  width:98%;
  height:400px;
  margin:0 auto;
  background-color:#f5f5f5;
  border-style: dashed;
  border-color:#b2bec3;
  border-width: 2px;
}
.btnclass{
  margin-top:20px;
}

.red1{
  color:red;
  font-size: 24px;
  margin-top:50px;
}
.img1{
  width:700px;
  height:325px;
  float: left;
  margin-left:33px;
  margin-top:33px;
}

.main{
  float: left;
  margin-left: 20px;
  text-align: left;
  height:325px;
  margin-top:33px

}
p{
  color:black;
}

span{
  margin-top:5px;
  display:block
}
.gray{
 margin-top:50px;
}

</style>
