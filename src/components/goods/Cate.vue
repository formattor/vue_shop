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
        width="50%">
        <span>这是一段信息</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addCateDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addCateDialogVisible = false">确 定</el-button>
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
      addCateDialogVisible: false
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
      this.addCateDialogVisible = true
    }
  }
}
</script>

<style lang="less" scoped>
.tree-table{
  margin-top: 15px;
}
</style>
