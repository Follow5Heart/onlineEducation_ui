<template>
  <div class="app-content">

    <!-- 添加章节按钮 -->
    <div>
      <el-button type="primary" @click=" addChapter">添加章节按钮</el-button>
    </div>

    <!-- 章节列表 -->
    <ul class="chapterList">
      <li v-for="chapter in chapterList" :key="chapter.id">
        <p>{{ chapter.title }}
          <span class="acts">
            <el-button type="text" @click="addVideo(chapter.id)">添加课时</el-button>
            <el-button type="text" @click="editChapter(chapter.id)">编辑</el-button>
            <el-button type="text" @click="removeChapterById(chapter.id)">删除</el-button>
          </span>
        </p>

        <ul class="chapterList videoList">
          <li v-for="children in chapter.children" :key="children.id">
            <p>{{ children.title }}
              <el-tag v-if="!children.videoSourceId" size="mini" type="danger">尚未上传视频</el-tag>
              <span class="acts">
                <el-tag v-if="children.isFree==='1'?true:false" size="mini" type="success">免费观看</el-tag>
                <el-button type="text" @click="editVideo(chapter.id,children.id)">编辑</el-button>
                <el-button type="text" @click="deleteVideoById(children.id)">删除</el-button>
              </span>
            </p>

          </li>
        </ul>
      </li>
    </ul>

    <!-- 章节表单对话框 -->
    <chapter-form ref="chapterForm" />

    <!-- 课时表单对话框 -->
    <video-form ref="videoForm" />

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
import { getNestedList, deleteChapter } from '@/api/chapter'
import { deleteVideo } from '@/api/video'
// 引入组件
import ChapterForm from '@/views/course/components/Chapter/form'
import VideoForm from '@/views/course/components/Video/form.vue'
export default {
  name: 'Chapter',
  components: { VideoForm, ChapterForm },
  data() {
    return {
      saveBtnDisabled: false,
      chapterList: [] // 章节嵌套列表

    }
  },
  created() {
    this.fetchChapterNestedList()
  },
  methods: {
    backMethod() {
      this.$parent.active = 0

      // 通过课程id，调用info.vue中的方法，进行回显
    },

    nextMethod() {
      this.$parent.active = 2
    },
    // 获取嵌套章节列表
    fetchChapterNestedList() {
      getNestedList(this.$parent.courseId).then(res => {
        if (res.code === 20000) {
          this.chapterList = res.data.items
        }
      })
    },
    // 添加章节
    addChapter() {
      this.$refs.chapterForm.open()
    },
    // 编辑章节
    editChapter(chapterId) {
      this.$refs.chapterForm.open(chapterId)
    },
    // 删除章节
    removeChapterById(chapterId) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteChapter(chapterId).then(res => {
          if (res.code === 20000) {
            this.$message({
              message: res.message,
              type: 'success'
            })
            this.fetchChapterNestedList()
          } else {
            this.$message({
              message: res.message,
              type: 'error'
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 添加课时
    addVideo(chapterId) {
      this.$refs.videoForm.open(chapterId)
    },
    // 编辑课时
    editVideo(chapterId, videoId) {
      this.$refs.videoForm.open(chapterId, videoId)
    },
    // 删除课时
    deleteVideoById(videoId) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteVideo(videoId).then(res => {
          if (res.code === 20000) {
            this.$message({
              message: res.message,
              type: 'success'
            })
            this.fetchChapterNestedList()
          } else {
            this.$message({
              message: res.message,
              type: 'error'
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }

}
</script>

<style>

.chapterList{
    position: relative;
    list-style: none;
    margin: 0;
    padding: 0;
}
.chapterList li{
  position: relative;
}
.chapterList p{
  color:black;
  float: left;
  font-size: 20px;
  margin: 10px 0;
  padding: 10px;
  height: 70px;
  line-height: 50px;
  width: 100%;
  border: 1px solid #DDD;
}
.chapterList .acts {
    float: right;
    font-size: 14px;
}

.videoList{
  padding-left: 50px;
}
.videoList p{
  float: left;
  font-size: 14px;
  margin: 10px 0;
  padding: 10px;
  height: 50px;
  line-height: 30px;
  width: 100%;
  border: 1px dashed #DDD;
}
</style>
