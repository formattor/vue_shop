<template>
    <div class="">

      <!-- 面包屑导航 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      </el-breadcrumb>

      <!-- 卡片视图区 -->
      <el-card class="box-card">
        <el-row :gutter="20">
          <el-col :span="8">

            <!-- 搜索与添加 -->
            <el-input
            v-model="queryInfo.query"
            placeholder="请输入内容"
            clearable
            @clear="getUserList()">
              <el-button slot="append" icon="el-icon-search" @click="getUserList()"></el-button>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-button type='primary' @click="addDialogVisible=true">添加</el-button>
          </el-col>
        </el-row>

        <!-- 用户列表数据渲染 -->
        <template>
          <el-table
            :data="userList"
            style="width: 100%" border stripe>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="username" label="姓名"></el-table-column>
            <el-table-column prop="email" label="邮箱"></el-table-column>
            <el-table-column prop="mobile" label="电话"></el-table-column>
            <el-table-column prop="role_name" label="角色"></el-table-column>
            <el-table-column label="状态">
              <!-- 作用域插槽 -->
              <template slot-scope="scope">
                <!-- {{scope.row.mg_state}} -->
                <el-switch
                  v-model="scope.row.mg_state"
                  @change="userStateChanged(scope.row)">
                </el-switch>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="180px">
              <template slot-scope="scope">
                <!-- 修改 -->
                <el-button type="primary" class="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
                <!-- 删除 -->
                <el-button type="danger" class="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"></el-button>
                <!-- 角色分配 -->
                <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
                  <el-button type="warning" class="el-icon-setting" size="mini" @click="setRole(scope.row)"></el-button>
                </el-tooltip>
                <!-- {{scope.row.mg_state}} -->
              </template>
            </el-table-column>
          </el-table>
        </template>

        <!-- 分页区域 -->
        <div class="block">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[1, 2, 5, 10]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </div>
      </el-card>

      <!-- 添加用户对话框 -->
      <el-dialog
        title="添加用户"
        :visible.sync="addDialogVisible"
        width="50%"
        @close="addDialogClosed">
        <!-- 内容主体区 -->
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 修改用户对话框 -->
      <el-dialog
        title="修改用户"
        :visible.sync="editDialogVisible"
        width="50%"
        @close="editDialogClosed ()">
        <!-- 内容主体区 -->
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
          <el-form-item label="用户名">
            <el-input v-model="editForm.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="editForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false" @close="editDialogVisible=false">取 消</el-button>
          <el-button type="primary" @click="editUserInfo()">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 分配角色对话框 -->
      <el-dialog
        title="修改角色"
        :visible.sync="setRoleDialogVisible"
        width="50%"
        closed="setRoleDialogClosed()">
        <div>
          <p>当前用户:{{userInfo.username}}</p>
          <p>当前角色:{{userInfo.role_name}}</p>
          <p>
            分配新角色:
            <el-select v-model="selectedRoleId" placeholder="请选择角色">
              <el-option
                v-for="item in rolesList"
                :key="item.id"
                :label="item.roleName"
                :value="item.id">
              </el-option>
            </el-select>
          </p>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="setRoleDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="savaRoleInfo()">确 定</el-button>
        </span>
      </el-dialog>
    </div>
</template>

<script type="text/ecmascript-6">
export default {
  data () {
    var checkEmail = (rule, value, callback) => {
      // 验证邮箱的正则
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) return callback()
      callback(new Error('请输入合法邮箱'))
    }
    var checkMobile = (rule, value, callback) => {
      // 验证手机的正则
      const regMobile = /^(0|86|17951)?(13[1-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) return callback()
      callback(new Error('请输入合法手机号'))
    }
    return {
      // 获取用户列表的对象
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      userList: [],
      total: 0,
      // 添加对话框显示与隐藏
      addDialogVisible: false,
      // 修改对话框显示与隐藏
      editDialogVisible: false,
      // 分配角色对话框显示与隐藏
      setRoleDialogVisible: false,
      // 添加用户的表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 查询到的用户信息
      editForm: {
      },
      // 添加用户的验证规则
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          // { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机', trigger: 'blur' },
          // { min: 11, max: 11, message: '长度为11位', trigger: 'blur' }
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 修改用户的验证规则
      editFormRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 需要被分配角色的用户信息
      userInfo: {},
      // 所有角色数据
      rolesList: [],
      // 已选中的角色id
      selectedRoleId: ''
    }
  },
  created () {
    this.getUserList()
  },
  components: {},
  methods: {
    async getUserList () {
      const { data: res } = await this.$http.get('users', { params: this.queryInfo })
      // console.log(res, '用户数据')
      if (res.meta.status !== 200) return this.$message.error('获取用户列表失败')
      this.userList = res.data.users
      this.total = res.data.total
      // console.log(this.userList, '用户数据2')
    },
    // 监听最新的pagesize改变事件
    handleSizeChange (newSize) {
      console.log(newSize, '新页面大小')
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    // 监听页码值改变的事件
    handleCurrentChange (newPage) {
      console.log(newPage, '新页')
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    // 监听switch开关状态的改变
    async userStateChanged (userInfo) {
      console.log(userInfo, '用户状态信息')
      const { data: res } = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
      const x = `users/${userInfo.id}/state/${userInfo.mg_state}`
      console.log(x, '接口信息')
      console.log(res, '用户状态信息')
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state
        return this.$message.error('更新用户状态失败')
      }
      this.$message.success('更新用户状态成功')
      // this.getUserList()
    },
    // 监听添加对话框关闭事件
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    // 监听编辑对话框关闭事件
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    // 添加新用户
    addUser () {
      // 预校验
      this.$refs.addFormRef.validate(async valid => {
        // console.log(valid, '添加用户预校验')
        if (!valid) return
        // 发起网络请求
        const { data: res } = await this.$http.post('users', this.addForm)
        // console.log(res, '添加信息')
        console.log(res.meta, '添加信息2')
        console.log(res.meta.stutus, '添加信息3')
        // console.log(res.meta.msg, '添加信息4')
        // 臣妾做不到啊
        if (res.meta.msg !== '创建成功') {
          return this.$message.error('添加用户失败')
        }
        this.$message.success('添加用户成功')
        this.addDialogVisible = false
        this.getUserList()
      })
    },
    // 修改用户信息
    editUserInfo () {
      this.$refs.editFormRef.validate(async valid => {
        console.log(valid, '修改用户预校验')
        if (!valid) return
        console.log(this.editForm.id, '用户id')
        const { data: res } = await this.$http.put('users/' + this.editForm.id,
          {
            email: this.editForm.email,
            mobile: this.editForm.mobile
          })
        // console.log(res, '我的res')
        if (res.meta.status !== 200) return this.$message.error('更新信息失败')
        this.editDialogVisible = false
        this.getUserList()
        this.$message.success('信息修改成功')
      })
    },
    // 显示修改用户对话框
    async showEditDialog (id) {
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) return this.$message.error('用户查询失败')
      this.editForm = res.data
      // console.log(this.editForm, '查询到的用户信息')
      this.editDialogVisible = true
      console.log(id, '传入的用户id')
    },
    // 通过id删除用户
    async removeUserById (id) {
      console.log(id, '')
      // 询问弹框
      const confirmRes = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // .catch(err => {
      //   return err
      // })
      // 确认返回为文本
      console.log(confirmRes, '弹框的返回值')
      if (confirmRes !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      // console.log('确认删除', '')
      const { data: res } = await this.$http.delete('users/' + id)
      console.log(res, '')
      if (res.meta.status !== 200) {
        return this.$message.error('删除用户失败')
      }
      this.$message.success('删除用户成功')
      this.getUserList()
    },
    // 展示分配角色的对话框
    async setRole (userInfo) {
      // console.log('触发事件', '')
      console.log(userInfo, '该角色信息')
      // 获取该信息的角色信息
      this.userInfo = userInfo
      // 获取所有角色的列表
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message({
          message: '获取角色列表失败',
          type: 'error'
        })
      }
      console.log(res, '获取角色列表成功')
      this.rolesList = res.data
      this.setRoleDialogVisible = true
    },
    // 保存分配角色
    async savaRoleInfo () {
      if (!this.selectedRoleId) {
        return this.$message({
          message: '请选择要分配的角色',
          type: 'error'
        })
      }
      const { data: res } = await this.$http.put(`users/${this.userInfo.id}/role`, { rid: this.selectedRoleId })
      if (res.meta.status !== 200) {
        return this.$message({
          message: '更新用户角色失败',
          type: 'error'
        })
      }
      this.$message({
        message: '更新用户角色成功',
        type: 'success'
      })
      this.getUserList()
      // 关闭对话框
      this.setRoleDialogVisible = false
    },
    // 监听分配角色对话框的关闭事件
    setRoleDialogClosed () {
      this.selectedRoleId = ''
      this.userInfo = {}
    }
  }
}
</script>

<style lang="less" scoped>
</style>
