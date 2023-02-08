<template>
  <div class="listBox">
    <el-input
      v-model="filterText"
      placeholder="输入关键字进行过滤"
    />
    <el-tree
      ref="tree"
      :data="nextedSubjectList"
      :props="defaultProps"
      default-expand-all
      :filter-node-method="filterNode"
    />
  </div></template>

<script>
import { getNextedTreeList } from '@/api/subject'
export default {
  name: 'SubjectList',
  data() {
    return {
      nextedSubjectList: [],
      defaultProps: {
        label: 'title',
        children: 'children'
      },
      filterText: ''
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {
    this.fetchNextedTreeData()
  },
  methods: {
    fetchNextedTreeData() {
      getNextedTreeList().then(response => {
        if (response.code === 20000) {
          this.nextedSubjectList = response.data.items
        }
      })
    },
    filterNode(value, data) {
      if (!value) return true
      return data.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
    }
  }

}
</script>

<style scoped>
.listBox{
  margin: 20px 0px 0px 20px;
}
</style>
