<template>
    <div class="">
      <!-- 导航窗格 -->
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品分类</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 卡片区 -->
      <el-card>
        <!-- 添加分类 -->
        <el-row>
          <el-col>
            <el-button type='primary' @click="showAddcateDialog">添加分类</el-button>
          </el-col>
        </el-row>

        <!-- 商品列表区 -->
        <tree-table
        :data="catelist"
        :columns="columns"
        :selection-type='false'
        :expand-type='false'
        show-index
        index-text='#'
        border
        :show-row-hover='false'
        class="tree-table">
          <!-- 是否有效 -->
          <template slot="isok" slot-scope="scope">
            <!-- {{scope.row.cat_deleted}} -->
            <i class="el-icon-success" v-if="!scope.row.cat_deleted" style="color:lightgreen"></i>
            <i class="el-icon-error" style="color:red" v-else></i>
          </template>
          <!-- 排序 -->
          <template slot="order" slot-scope="scope">
            <el-tag size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
            <el-tag size="mini" type="success" v-else-if="scope.row.cat_level===1">二级</el-tag>
            <el-tag size="mini" type="warning" v-else>三级</el-tag>
          </template>
          <template slot="opt" slot-scope="{}">
            <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
            <el-button type="danger" size="mini"  icon="el-icon-delete">删除</el-button>
          </template>
        </tree-table>

        <!-- 分页区 -->
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[3, 5, 10, 20]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            >
          </el-pagination>
      </el-card>

      <!-- 添加分类对话框 -->
      <el-dialog
        title="添加分类"
        :visible.sync="addCateDialogVisible"
        width="50%"
        @close="addCateDialogClosed">
        <!-- 添加分类表单 -->
        <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
          <el-form-item label="分类名称：" prop="cat_name">
            <el-input v-model="addCateForm.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类：">
            <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCateChanged()"
            clearable>
            </el-cascader>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addCateDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addCate">确 定</el-button>
        </span>
      </el-dialog>
    </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: '',
  data () {
    return {
      catelist: [],
      // 分页数据
      // 臣妾做不到啊臣妾不明白
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 总数据
      total: 0,
      // 为table指定列的定义
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        }, {
          lable: '是否有效',
          // 将该列设置为模板列
          type: 'template',
          // 当前列使用的模板名称
          template: 'isok'
        }, {
          lable: '排序',
          // 将该列设置为模板列
          type: 'template',
          // 当前列使用的模板名称
          template: 'order'
        }, {
          lable: '操作',
          // 将该列设置为模板列
          type: 'template',
          // 当前列使用的模板名称
          template: 'opt',
          width: '200px'
        }
      ],
      // 添加表单的显示与隐藏
      addCateDialogVisible: false,
      // 添加表单的数据对象
      addCateForm: {
        // 将要添加的分类名称
        cat_name: '',
        // 父级分类Id
        cat_pid: 0,
        // 分类等级,默认一级
        cat_level: 0
      },
      // 添加表单的校验规则
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      // 父级分类的列表
      parentCateList: [],
      // 级联选择器配置对象
      cascaderProps: {
        expandTrigger: 'hover',
        checkStrictly: true,
        value: 'cat_id',
        label: 'cat_name',
        childern: 'childern'
      },
      // 选中的腹肌分类id数据
      selectedKeys: []
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    // 获取商品分类数据
    async getCateList () {
      const { data: res } = await this.$http.get('categories', { params: this.queryInfo })
      if (res.meta.status !== 200) {
        return this.$message({
          message: '获取商品分类失败',
          type: 'error'
        })
      }
      // console.log(res.data, '分类')
      this.catelist = res.data.result
      // 为总数居条数赋值
      this.total = res.data.total
      // console.log(this.catelist, '获取商品分类')
    },
    // 监听pagesize改变的事件 拿到最新的pagesize
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      // console.log(this.queryInfo.pagesize, '当前页大小')
      this.getCateList()
    },
    // 监听pagenum的改变
    handleCurrentChange (newNum) {
      this.queryInfo.pagenum = newNum
      this.getCateList()
    },
    // 显示添加分类对话框
    showAddcateDialog () {
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    // 获取父级分类的数据列表
    async getParentCateList () {
      const { data: res } = await this.$http.get('categories', { params: { type: 2 } })
      if (res.meta.status !== 200) {
        return this.$message({
          message: '获取商品分类失败',
          type: 'error'
        })
      }
      // console.log(res.data, '获取商品分类')
      this.parentCateList = res.data
      console.log(this.parentCateList, '获取商品分类')
    },
    // 选择项发生变化直接触发
    parentCateChanged () {
      // console.log(this.selectedKeys, '保存选择id')
      if (this.selectedKeys.length > 0) {
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        // 当前等级赋值
        this.addCateForm.cat_level = this.selectedKeys.length
      } else {
        this.addCateForm.cat_pid = 0
        // 当前等级赋值
        this.addCateForm.cat_level = 0
      }
    },
    // 添加分类操作
    addCate () {
      // 预验证
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return
        // console.log(this.addCateForm, '当前保存的分类信息')
        const { data: res } = await this.$http.post('categories', this.addCateForm)
        this.addCateDialogVisible = false
        if (res.meta.status !== 201) {
          this.$message({
            message: '添加分类失败',
            type: 'error'
          })
        }
        this.$message({
          message: '添加分类成功',
          type: 'success'
        })
        this.getCateList()
        this.addCateDialogVisible = false
      })
    },
    // 监听添加分类对话框关闭事件
    addCateDialogClosed () {
      console.log(this.$refs.addCateFormRef, '是否清空')
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = ''
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
    }
  }
}
</script>

<style lang="less" scoped>
.tree-table{
  margin-top: 15px;
}
.el-cascader{
  width: 100%;
}

</style>
