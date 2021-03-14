<template>
    <div class="">
      <!-- 面包屑导航 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>参数列表</el-breadcrumb-item>
      </el-breadcrumb>

      <!-- 卡片视图区域 -->
      <el-card>
          <!-- 警告框 -->
          <el-alert
            title="注意：只允许为第三级分类设置相关参数！"
            type="warning"
            show-icon
            :closable="false">
          </el-alert>

          <!-- 商品分类选择 -->
          <el-row class="cat_opt">
            <el-col>
              <span>选择商品分类:</span>
              <el-cascader
              v-model="selectedCateKeys"
              :options="catelist"
              :props="cateProps"
              @change="cateChange ()"
              ></el-cascader>
            </el-col>
          </el-row>

          <!-- 参数表tab -->
            <el-tabs
            v-model="activeName"
            @tab-click="handleTabClick"
            >
              <el-tab-pane label="动态参数" name="many">
                <el-button size='mini' type='primary' :disabled="isBtnDisabled" @click="addDialogVisible=true">添加参数</el-button>
                <!-- 动态参数表格 -->
                <el-table :data="manyTableData" border stripe>
                  <!-- 展开行 -->
                  <el-table-column type="expand">
                    <template slot-scope="scope">
                      <el-tag v-for="(item,id) in scope.row.attr_vals" :key="id" closable @close="handleClose(id,scope.row)">{{item}}</el-tag>
                      <el-input
                        class="input-new-tag"
                        v-if="scope.row.inputVisible"
                        v-model="scope.row.inputValue"
                        ref="saveTagInput"
                        size="small"
                        @keyup.enter.native="handleInputConfirm"
                        @blur="handleInputConfirm(scope.row)"
                      >
                      </el-input>
                      <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)"
                      >+ New Tag</el-button>
                    </template>
                  </el-table-column>
                  <!-- 索引列 -->
                  <el-table-column type="index" label="#"></el-table-column>
                  <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                  <el-table-column label="操作">
                    <template slot-scope="scope">
                      <el-button size='mini' type='primary' icon="el-icon-edit"
                      @click="showEditDialog(scope.row.attr_id)"></el-button>
                      <el-button size='mini' type='danger' icon="el-icon-delete" @click="removeParams(scope.row.attr_id)"></el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>

              <!-- 静态属性对话框 -->
              <el-tab-pane label="静态属性" name="only">
                <el-button size='mini' type='primary' :disabled="isBtnDisabled" @click="addDialogVisible=true">添加属性
                </el-button>
                <el-table :data="onlyTableData" border stripe >
                  <!-- 展开行 -->
                  <el-table-column type="expand">
                    <template slot-scope="scope">
                      <el-tag v-for="(item,id) in scope.row.attr_vals" :key="id" closable @close="handleClose(id,scope.row)">{{item}}</el-tag>
                      <el-input
                        class="input-new-tag"
                        v-if="scope.row.inputVisible"
                        v-model="scope.row.inputValue"
                        ref="saveTagInput"
                        size="small"
                        @keyup.enter.native="handleInputConfirm"
                        @blur="handleInputConfirm(scope.row)"
                      >
                      </el-input>
                      <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)"
                      >+ New Tag</el-button>
                    </template>
                  </el-table-column>
                  <!-- 索引列 -->
                  <el-table-column type="index" label="#"></el-table-column>
                  <el-table-column label="属性名称" prop="attr_name"></el-table-column>
                  <el-table-column label="操作">
                    <template slot-scope="scope">
                      <el-button size='mini' type='primary' icon="el-icon-edit"
                      @click="showEditDialog(scope.row.attr_id)"></el-button>
                      <el-button size='mini' type='danger' icon="el-icon-delete" @click="removeParams(scope.row.attr_id)"></el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
            </el-tabs>
      </el-card>

      <!-- 添加参数对话框 不写死 -->
      <el-dialog
        :title="'添加'+titleText"
        :visible.sync="addDialogVisible"
        width="50%"
        @close="addDialogClosed">
        <!-- 添加参数的表单 -->
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
          <el-form-item :label="titleText" prop="attr_name">
            <el-input v-model="addForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="this.editDialogVisible=false">取 消</el-button>
          <el-button type="primary" @click="addParams">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 添加修改参数对话框 不写死 -->
      <el-dialog
        :title="'修改'+titleText"
        :visible.sync="editDialogVisible"
        width="50%"
        @close="editDialogClosed">
        <!-- 添加参数的表单 -->
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
          <el-form-item :label="titleText" prop="attr_name">
            <el-input v-model="editForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editParams">确 定</el-button>
        </span>
      </el-dialog>

    </div>
</template>

<script type="text/ecmascript-6">
export default {
  data () {
    return {
      // 商品分类列表
      catelist: [],
      cateProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 级联选择绑定保存
      selectedCateKeys: [],
      // 被激活的页签名
      activeName: 'many',
      // 动态参数数据
      manyTableData: [],
      // 静态属性数据
      onlyTableData: [],
      // 控制添加对话框的显示与隐藏
      addDialogVisible: false,
      // 控制修改对话框的显示与隐藏
      editDialogVisible: false,
      // 添加数据表单
      addForm: {
        attr_name: ''
      },
      // 添加表单的验证规则对象
      addFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      },
      // 修改表单数据对象
      editForm: {

      },
      // 修改表单验证规则
      editFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getCateList()
    this.getParamsData()
  },
  components: {},
  methods: {
    async getCateList () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message({
          message: '获取商品分类失败',
          type: 'error'
        })
      }
      this.catelist = res.data
      // console.log(this.catelist, '商品分类列表')
    },
    // 级联选中触发
    cateChange () {
      this.getParamsData()
    },
    // 获取参数列表
    async getParamsData () {
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = []
        this.manyTableData = []
        this.onlyTableData = []
        return
      }
      // console.log(this.selectedCateKeys, '保存触发')
      // 获取分类列表
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: this.activeName } })
      // console.log(res, '为什么失败阿')
      if (res.meta.status !== 200) {
        return this.$message({
          message: '获取分类失败',
          type: 'error'
        })
      }
      // 获取attr_vals
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        // 控制文本框的显示与隐藏 自己的
        item.inputVisible = false
        // 文本框输入的值
        item.inputValue = ''
      })

      console.log(res.data, '获取成功')
      if (this.activeName === 'many') {
        this.manyTableData = res.data
        // console.log(this.manyTableData, '获取动态参数数据')
      } else {
        this.onlyTableData = res.data
        // console.log(this.onlyTableData, '获取静态参数数据')
      }
      // console.log(res.data, '获取成功')
    },
    // 触发页签
    handleTabClick () {
      // console.log(this.activeName, '触发页签')
      this.getParamsData()
    },
    // 监听对话框关闭
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    // 添加参数
    addParams () {
      // 预校验
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(`categories/${this.cateId}/attributes`, {
          attr_name: this.addForm.attr_name,
          attr_sel: this.activeName
        })
        if (res.meta.status !== 201) {
          return this.$message({
            message: '添加参数失败',
            type: 'error'
          })
        }
        this.$message({
          message: '添加参数成功',
          type: 'success'
        })
      })
      this.getParamsData()
      // 臣妾做不到阿
      console.log('刷新了吗', '')
      this.addDialogVisible = false
    },
    // 展示对话框
    async showEditDialog (attrId) {
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes/${attrId}`, { params: { sel: this.activeName } })
      if (res.meta.status !== 200) {
        return this.$message({
          message: '获取该参数失败',
          type: 'error'
        })
      }
      console.log(res.data, '获取参数成功')
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 监听修改对话框关闭事件 清空表单
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
      console.log('对话框已清空', '')
    },
    // 修改对话框提交参数
    editParams () {
      // 所有put表单 都要预校验一下
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        console.log(this.activeName, '要提交的sel')
        const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`, {
          // params: {
          attr_name: this.editForm.attr_name,
          attr_sel: this.activeName
          // }
        })
        if (res.meta.status !== 200) {
          this.$message({
            message: '修改参数失败',
            type: 'error'
          })
        }
        this.$message({
          message: '修改参数成功',
          type: 'success'
        })
        console.log(res, '得到的返回值')
        this.getParamsData()
        this.editDialogVisible = false
        // console.log('已经修改', '')
      })
    },
    // 删除属性操作
    async removeParams (attrId) {
      const confirmRes = await this.$confirm('此操作将永久删除该参数，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // 用户取消删除
      if (confirmRes !== 'confirm') {
        return this.$message({
          message: '已取消',
          type: 'info'
        })
      }
      // console.log(this.cateId, '')
      const { data: res } = await this.$http.delete(`categories/${this.cateId}/attributes/${attrId}`)
      if (res.meta.status !== 200) {
        this.$message({
          message: '参数删除失败',
          type: 'error'
        })
      }
      // console.log(res.meta, '状态码')
      this.$message({
        message: '参数删除成功',
        type: 'success'
      })
      // console.log(res.data, '删除的东西')
      this.getParamsData()
    },
    // 文本框失焦或确认
    async handleInputConfirm (row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      console.log(row.inputValue, '输入的值')
      console.log(row, '输入的所有值')
      row.attr_vals.push(row.inputValue.trim())
      // 发起 请求保存数据库
      // console.log(row.attr_vals, '新字符串')
      // 数组拼接字符串
      // row.attr_vals.join(' ')
      this.saveAttrVals(row)
      row.inputValue = ''
      row.inputVisible = false
    },
    // 保存attr_vals
    async saveAttrVals (row) {
      const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(' ')
      })
      if (res.meta.status !== 200) {
        this.$message({
          message: '保存参数失败',
          type: 'error'
        })
      }
      this.$message({
        message: '保存参数成功',
        type: 'success'
      })
    },
    // 显示输入框
    showInput (row) {
      row.inputVisible = true
      // 自动获取焦点 当页面元素被重新渲染后，指定回调获得方法
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 删除参数
    handleClose (id, row) {
      row.attr_vals.splice(id, 1)
      this.saveAttrVals(row)
    }
  },
  // 计算属性
  computed: {
    // 如果按钮需要被禁用则返回true
    isBtnDisabled () {
      if (this.selectedCateKeys.length !== 3) {
        return true
      } else return false
    },
    // 选中的三级id
    cateId () {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2]
      } else {
        return null
      }
    },
    // 动态计算标题的文本
    titleText () {
      if (this.activeName === 'many') {
        return '动态参数'
      }
      return '静态属性'
    }
  }
}
</script>

<style lang="less" scoped>
.cat_opt{
  margin: 15px 0;
}
.el-tag{
  margin: 7px;
}
.input-new-tag{
  width: 150px;
}
</style>
