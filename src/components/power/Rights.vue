<template>
    <div class="">
      <!-- 面包屑导航 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>权限列表</el-breadcrumb-item>
      </el-breadcrumb>

      <!-- 卡片试图 -->
      <el-card>
        <el-table :data="rightsList" border stripe>
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column label="权限名称" prop="authName"></el-table-column>
          <el-table-column label="路径" prop="path"></el-table-column>
          <el-table-column label="权限等级" prop="level">
            <!-- 自定义插槽 -->
            <template slot-scope="scope">
              <!-- {{scope.row.level}} -->
              <el-tag v-if="scope.row.level==0">一级</el-tag>
              <el-tag v-else-if="scope.row.level==1" type="warning">二级</el-tag>
              <el-tag v-else type="danger">三级</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: '',
  data () {
    return {
      // 权限列表
      rightsList: [

      ]
    }
  },
  created () {
    this.getRightsList()
  },
  components: {},
  methods: {
    async getRightsList () {
      const { data: res } = await this.$http.get('rights/list')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限列表失败')
      }
      this.rightsList = res.data
      // console.log(this.rightsList, '权限列表成功')
    }
  }
}
</script>

<style lang="less" scoped>
</style>
