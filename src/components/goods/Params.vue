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
              <span>选择商品分类</span>
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
                  <el-table-column type="expand"></el-table-column>
                  <!-- 索引列 -->
                  <el-table-column type="index" label="#"></el-table-column>
                  <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                  <el-table-column label="操作">
                    <template>
                      <el-button size='mini' type='primary' icon="el-icon-edit"></el-button>
                      <el-button size='mini' type='danger' icon="el-icon-delete"></el-button>
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
                  <el-table-column type="expand"></el-table-column>
                  <!-- 索引列 -->
                  <el-table-column type="index" label="#"></el-table-column>
                  <el-table-column label="属性名称" prop="attr_name"></el-table-column>
                  <el-table-column label="操作">
                    <template>
                      <el-button size='mini' type='primary' icon="el-icon-edit"></el-button>
                      <el-button size='mini' type='danger' icon="el-icon-delete"></el-button>
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
            <el-input v-model="addForm.arrt_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addDialogVisible = false">确 定</el-button>
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
      // 添加数据表单
      addForm: {
        attr_name: ''
      },
      // 添加表单的验证规则对象
      addFormRules: {
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
      console.log(this.catelist, '商品分类列表')
    },
    // 级联选中触发
    cateChange () {
      this.getParamsData()
    },
    // 获取参数列表
    async getParamsData () {
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = []
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
      console.log(res.data, '获取成功')
      if (this.activeName === 'many') {
        this.manyTableData = res.data
        // console.log(this.manyTableData, '获取动态参数数据')
      } else {
        this.onlyTableData = res.data
        // console.log(this.onlyTableData, '获取静态参数数据')
      }
    },
    // 触发页签
    handleTabClick () {
      // console.log(this.activeName, '触发页签')
      this.getParamsData()
    },
    // 监听对话框关闭
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
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
</style>
