<template>
  <div class="app-container">
    <span v-if="active===0" style="float:left width: 50px;" @click="backList"><i class="el-icon-arrow-left" />返回</span>
    <h2 style="text-align: center">发布新课程</h2>
    <div>
      <!-- 步骤导航 -->
      <el-steps :active="active" finish-status="success" simple style="margin-top: 20px;margin-bottom: 20px;">
        <el-step title="填写课程基本信息" />
        <el-step title="创建课程大纲" />
        <el-step title="发布课程" />
      </el-steps>

      <!-- 步骤1 info-->
      <Info v-if="active==0" />

      <!-- 步骤2 chapterIndex-->
      <Chapter v-if="active==1" />

      <!-- 步骤3 -->
      <Publish v-if="active==2 || active==3" />

    </div>
  </div></template>

<script>
import Info from '@/views/course/components/info.vue'
import Chapter from '@/views/course/components/Chapter/index.vue'
import Publish from '@/views/course/components/publish.vue'
export default {
  components: {
    Info,
    Chapter,
    Publish
  },
  data() {
    return {
      active: 0,
      courseId: null
    }
  },
  created() {
    if (this.$route.name === 'CourseInfoEdit') {
      this.active = 0
      this.courseId = this.$route.params.id
    } else if (this.$route.name === 'CourseChapterEdit') {
      this.active = 1
      this.courseId = this.$route.params.id
    }
  },
  methods: {
    backList() {
      this.$router.push('/course/list')
    }
  }

}
</script>

<style>
.app-container{
    height: 100%;
    width: 100%;
}

/* p{
    color: red;
}
p{
  color:blue;
}
p{
  color:rgb(241, 8, 137);
} */
.box{
    height: 100px;
    width:100px;
    font-size:20px
}
.red{

    background-color: red;
}
.green{

    background-color: green;
}
.fontStyle01{
    font-family: '微软雅黑';
    line-height: 100px;
}
</style>
