<template>
    <div class="">
      <!-- 导航窗格 -->
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      </el-breadcrumb>

      <!-- 商品列表 -->
      <el-card>
        <!-- 输入添加框 -->
        <el-row :gutter="20">
          <el-col :span="8">
            <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList">
              <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click="goAddPage">添加商品</el-button>
          </el-col>
        </el-row>

        <!-- 商品列表区 -->
        <el-table :data="goodslist" border stripe>
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column label="商品名称" prop="goods_name"></el-table-column>
          <el-table-column label="商品价格/元" prop="goods_price" width="100px"></el-table-column>
          <el-table-column label="商品重量" prop="goods_weight" width="100px"></el-table-column>
          <el-table-column label="创建时间" width="140px" prop="add_time">
            <template slot-scope="scope">
              <!-- 时间过滤器 -->
              {{scope.row.add_time | dateFormat}}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="130px">
            <template slot-scope="scope">
              <el-button class="el-icon-edit" type="primary" size="mini"></el-button>
              <el-button class="el-icon-delete" type="danger" size="mini" @click="removeGoods(scope.row.goods_id)"></el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页区 -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[2, 5, 10, 20]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </el-card>
    </div>
</template>

<script type="text/ecmascript-6">
export default {
  data () {
    return {
      goodslist: [],
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      total: 0
    }
  },
  created () {
    this.getGoodsList()
  },
  components: {
  },
  methods: {
    // 获取商品列表
    async getGoodsList () {
      // get参数都要用params
      const { data: res } = await this.$http.get('goods', { params: this.queryInfo })
      if (res.meta.status !== 200) {
        return this.$message({
          message: '获取商品数据失败',
          type: 'error'
        })
      }
      // this.$message({
      //   message: '获取商品列表成功',
      //   type: 'success'
      // })
      // console.log(res.data, '获取商品列表成功')
      this.goodslist = res.data.goods
      this.total = res.data.total
      // console.log(res.data, '是对象吗')
      // console.log(this.goodslist, '是数组吗')
      // console.log(this.total, '总页')
    },
    // 监听页面大小变化
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    // 监听当前页变化
    handleCurrentChange (newNum) {
      this.queryInfo.pagenum = newNum
      this.getGoodsList()
    },
    // 删除商品
    async removeGoods (goodsId) {
      const confirmRes = await this.$confirm('删除当前商品不可恢复，确认删除？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmRes !== 'confirm') {
        return this.$message({
          message: '已经取消删除操作',
          type: 'info'
        })
      }
      console.log('删了吗', '')
      const { data: res } = await this.$http.delete('goods/' + goodsId)
      if (res.meta.status !== 200) {
        this.$message({
          message: '删除商品失败',
          type: 'error'
        })
      }
      this.$message({
        message: '删除商品成功',
        type: 'success'
      })
      this.getGoodsList()
    },
    // 前往添加商品页
    goAddPage () {
      this.$router.push('/goods/add')
    }
  }
}
</script>

<style lang="less" scoped>
</style>
