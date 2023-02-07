<template>

  <div class="app-container">
    <!--查询表单-->
    <el-form :inline="true">
      <el-form-item label="讲师名称">
        <!-- <el-input v-model="searchObj.name" placeholder="请输入讲师" /> -->
        <el-autocomplete
          v-model="searchObj.name"
          class="inline-input"
          :fetch-suggestions="querySearch"
          placeholder="请输入讲师"
          :trigger-on-focus="false"
          value-key="name"
        />
      </el-form-item>

      <el-form-item label="头衔">
        <el-select v-model="searchObj.level" clearable placeholder="请选择头衔">
          <el-option value="1" label="首席讲师" />
          <el-option value="2" label="高级讲师" />
        </el-select>
      </el-form-item>

      <el-form-item label="入驻时间">
        <el-date-picker
          v-model="searchObj.joinDateBegin"
          placeholder="开始时间"
          value-format="yyyy-MM-dd"
        />
      </el-form-item>
      <el-form-item label="--" />
      <el-form-item>
        <el-date-picker
          v-model="searchObj.joinDateEnd"
          placeholder="结束时间"
          value-format="yyyy-MM-dd"
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="searchData()">查询</el-button>
        <el-button type="default" @click="resetData()">清空</el-button>
      </el-form-item>
      <div class="batchDeleteBtn">
        <el-button size="mini" type="danger" @click="batchDelete">
          批量删除
        </el-button>
      </div>
    </el-form>

    <el-table
      :data="list"
      border
      stripe
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
      />

      <el-table-column
        label="ID"
        width="50"
      >
        <template slot-scope="scope">
          {{ (page-1)*limit +scope.$index+1 }}

        </template>
      </el-table-column>
      <el-table-column
        label="讲师名称"
        prop="name"
        width="100"
      />
      <el-table-column
        label="头衔"
        prop="level"
        width="100"
      >
        <template slot-scope="scope">
          <el-tag v-if="scope.row.level==='1'" type="success">首席讲师</el-tag>
          <el-tag v-else-if="scope.row.level==='2'" type="warning">高级讲师</el-tag>
          <el-tag v-else>代理讲师</el-tag>

        </template>
      </el-table-column>

      <el-table-column
        label="资历"
        prop="intro"
      />
      <el-table-column
        label="排序"
        prop="sort"
        width="100"
        sortable
      />
      <el-table-column
        label="入驻时间"
        prop="joinDate"
        width="160"
        sortable
      />
      <el-table-column label="操作" width="180" align="center">
        <template slot-scope="scope">
          <router-link :to="'/Layout/edit/'+scope.row.id">
            <el-button
              size="mini"
              @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button>
          </router-link>

          <el-button
            size="mini"
            type="danger"
            class="deleteBtn"
            @click="handleDelete(scope.$index, scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>

    </el-table>
    <el-pagination
      :current-page="page"
      :page-sizes="[2, 4, 6, 10]"
      :page-size="limit"
      layout="sizes, prev, pager, next, jumper,->,total"
      :total="total"
      style="margin:30px 0;text-align:center"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

  </div>
</template>

<script>
import { list, pageList, deleteTeacher, batchDelete, queryListNameByKeyword } from '@/api/teacher'

export default {
  name: 'List',
  data() {
    return {
      list: [], // 讲师列表
      total: 0, // 总记录数
      page: 1, // 页码
      limit: 10, // 每页显示的个数
      searchObj: {
        'joinDateBegin': '',
        'name': '',
        'joinDateEnd': '',
        'level': ''

      }, // 查询参数
      mulitpleSelection: [] // 批量选中数据

    }
  },
  created() {
    this.searchData()
  },
  mounted() {

  },
  methods: {
    // 实时查询讲师姓名，并下拉展示
    querySearch(queryString, callback) {
      queryListNameByKeyword(queryString).then(response => {
        if (response.code === 20000) {
          callback(response.data.items)
        }
      })
    },
    // 多选中，提取id
    handleSelectionChange(selection) {
      this.mulitpleSelection = selection.map(item =>
        item.id
      )
    },

    // 批量删除
    batchDelete() {
      if (this.mulitpleSelection.length <= 0) {
        this.$message({
          message: '至少选中一条数据',
          type: 'warning'
        })
        return
      }
      this.$confirm('此操作将永久删除该条数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const idList = this.mulitpleSelection
        batchDelete(idList).then(
          response => {
            if (response.code === 20000) {
              this.$message({
                message: '批量删除成功！',
                type: 'success'
              })
              this.searchData()
            } else {
              this.$message.error('批量删除失败')
            }
          }
        )
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 查询数据
    searchData() {
      pageList(this.page, this.limit, this.searchObj).then(
        response => {
          if (response.code === 20000) {
            this.list = response.data.items.list
            this.total = response.data.items.total
          }
        }

      )
    },
    // 清空查询条件
    resetData() {
      this.searchObj = {}
      this.searchData()
    },

    handleCurrentChange(page) {
      this.page = page
      this.searchData()
    },
    handleSizeChange(limit) {
      this.limit = limit
      this.searchData()
    },
    handleEdit(index, data) {
      console.log(index, data)
    },
    handleDelete(index, data) {
      this.$confirm('此操作将永久删除该条数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const teacherObj = {
          'id': data.id
        }
        deleteTeacher(teacherObj).then(response => {
          if (response.code === 20000) {
            this.$message({
              message: '删除成功！',
              type: 'success'
            })
            this.searchData()
          } else {
            this.$message.error('删除失败')
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
<style scoped>
.el-form-item{
  margin:0 40px 10px 0
}
.deleteBtn{
  margin: 0 0 0 10px;
}
.batchDeleteBtn{
  float: right;
  margin-right: 50px;
}
</style>

