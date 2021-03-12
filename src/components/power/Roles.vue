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
          <el-table-column type="expand">
            <!-- 作用域插槽 -->
            <template slot-scope="scope">
              <el-row
              v-for="(item1,i1) in scope.row.children" :key="item1.id"
              :class="['bdbottom',i1===0?'bdtop':'','vcenter']">
                <!-- 渲染一级权限 -->
                <el-col :span="5">
                  <el-tag
                      closable
                      @close="removeRightById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <!-- 渲染二级权限 -->
                <el-col :span="19">
                  <!-- for循环渲染二级权限 -->
                  <el-row
                  v-for="(item2,i2) in item1.children"
                  :key="item2.id"
                  :class="[i2===0?'':'bdtop','vcenter']">
                    <el-col :span="6">
                      <el-tag type="success"
                      closable
                      @close="removeRightById(scope.row,item2.id)">{{item2.authName}}</el-tag>
                      <i class="el-icon-caret-right"></i>
                    </el-col>
                    <!-- 三级权限 -->
                    <el-col :span="18">
                      <el-tag
                      type='warning'
                      v-for="(item3,) in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRightById(scope.row,item3.id)">
                        {{item3.authName}}
                      </el-tag>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
              <!-- <pre>
                {{scope.row}}
              </pre> -->
            </template>
          </el-table-column>
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column label="角色名称" prop="roleName"></el-table-column>
          <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
          <el-table-column label="操作" width="350px">
            <template slot-scope="scope">
              <!-- {{scope.row.id}} -->
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="test()">编辑</el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
              <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRightDialog(scope.row)">分配权限</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <!-- 分配权限对话框 -->
      <el-dialog
        title="分配权限"
        :visible.sync="setRightDialogVisible"
        width="50%"
        @close="setRightDialogClosed()">
        <!-- 树形控件 -->
        <el-tree
        :data="rightsList"
        :props="treeProps"
        node-key="id"
        :default-expand-all="true"
        :default-checked-keys="defKeys"
        show-checkbox
        ref="treeRef">
        </el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="setRightDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="allotRights">确 定</el-button>
        </span>
      </el-dialog>
    </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: '',
  data () {
    return {
      // 所有角色列表
      rolelist: [],
      // 所有权限列表
      rightsList: [],
      // 权限分配对话框的显示与隐藏
      setRightDialogVisible: false,
      treeProps: {
        children: 'children',
        label: 'authName'
      },
      // 默认被勾选Id数组
      defKeys: [],
      // 角色Id用于修改权限
      roleId: ''
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
      // console.log(this.rolelist, '获取角色数据')
    },
    // 根据Id删除用户权限
    async removeRightById (role, rightId) {
      // 弹框提示
      const confirmRes = await this.$confirm('此操作将永久删除该权限', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmRes !== 'confirm') {
        return this.$message({
          message: '取消删除权限',
          type: 'info'
        })
      }
      // console.log('确认删除')
      const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
      if (res.meta.status !== 200) {
        return this.$message({
          message: '删除权限失败',
          type: 'error'
        })
      }
      this.$message({
        message: '删除权限成功',
        type: 'success'
      })
      // this.getRolesList()
      role.children = res.data
    },
    // 展示分配权限对话框
    async showSetRightDialog (role) {
      this.roleId = role.id
      // console.log(this.roleId, '当前角色id')
      // 获取所有权限数据
      const { data: res } = await this.$http.get('rights/tree')
      console.log(res, '所有权限数据')
      if (res.meta.status !== 200) {
        return this.$message({
          message: '获取权限数据失败',
          type: 'error'
        })
      }
      // 获取到的权限数据保存在data
      this.rightsList = res.data
      // console.log(this.rightsList, '权限数据')

      // 递归调用权限id获取数组
      this.getLeafKeys(role, this.defKeys)
      // console.log(this.defKeys, '获取的权限数组')

      this.setRightDialogVisible = true
    },
    // 递归获取已有的权限id数组
    getLeafKeys (node, arr) {
      // 三级节点
      if (!node.children) {
        return arr.push(node.id)
      }
      // 臣妾做不到 node-key为什么是id
      node.children.forEach(item =>
        this.getLeafKeys(item, arr)
      )
    },
    // 监听分配权限对话框关闭事件
    setRightDialogClosed () {
      this.defKeys = []
    },
    // 点击为角色分配权限
    async allotRights () {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      console.log(keys, '获取选中引用节点')
      const idStr = keys.join(',')
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr })
      if (res.meta.status !== 200) {
        return this.$message({
          message: '修改角色权限失败',
          type: 'error'
        })
      }
      this.$message({
        message: '修改角色权限成功',
        type: 'success'
      })
      this.getRolesList()
      this.setRightDialogVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag{
  margin: 7px;
}

.bdtop{
  border-top: 1px solid #eee;
}

.bdbottom{
  border-bottom: 1px solid #eee;
}
// 纵向上的对齐
.vcenter{
  display: flex;
  align-items: center;
}
</style>
