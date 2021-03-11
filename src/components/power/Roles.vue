<template>
    <div class="">
      <!-- 面包屑导航 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色列表</el-breadcrumb-item>
      </el-breadcrumb>

      <!-- 卡片区域 -->
      <el-card>
        <!-- 添加角色按钮 -->
        <el-row>
          <el-col>
            <el-button type="primary">添加角色</el-button>
          </el-col>
        </el-row>
        <!-- 添加角色列表 -->
        <el-table :data="rolelist" border>
          <el-table-column type="expand"></el-table-column>
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column label="角色名称" prop="roleName"></el-table-column>
          <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
          <el-table-column label="操作" width="350px">
            <template slot-scope="{}">
              <!-- {{scope.row.id}} -->
              <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
              <el-button type="warning" icon="el-icon-setting" size="mini">分配权限</el-button>
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
      // 所有角色列表
      rolelist: []
    }
  },
  created () {
    this.getRolesList()
  },
  components: {},
  methods: {
    // 获取所有角色列表
    async getRolesList () {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message({
          message: '获取角色失败',
          type: 'err'
        })
      }
      this.rolelist = res.data
      console.log(this.rolelist, '')
    }
  }
}
</script>

<style lang="less" scoped>
</style>
