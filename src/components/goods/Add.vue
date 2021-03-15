<template>
    <div class="">
      <!-- 导航窗格 -->
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>添加商品</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 卡片视图 -->
      <el-card>
        <!-- 警告框 -->
        <el-alert
          title="添加商品信息"
          type="info"
          show-icon
          :closable="false">
        </el-alert>
        <!-- 进度条 -->
        <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
          <el-step title="基本信息"></el-step>
          <el-step title="商品参数"></el-step>
          <el-step title="商品属性"></el-step>
          <el-step title="商品图片"></el-step>
          <el-step title="商品内容"></el-step>
          <el-step title="完成"></el-step>
        </el-steps>
        <!-- tab栏 -->
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top">
          <el-tabs :tab-position="'left'" v-model="activeIndex"
          :before-leave="beforeTabLeave"
          @tab-click="tabClicked">
            <el-tab-pane label="基本信息" name="0">
              基本信息
               <el-form-item label="商品名称" prop="goods_name">
                <el-input v-model="addForm.goods_name">
                </el-input>
              </el-form-item>
              <el-form-item label="商品价格" prop="goods_price">
                <el-input v-model="addForm.goods_price" type="number">
                </el-input>
              </el-form-item>
              <el-form-item label="商品重量" prop="goods_weight">
                <el-input v-model="addForm.goods_weight" type="number">
                </el-input>
              </el-form-item>
              <el-form-item label="商品数量" prop="goods_number">
                <el-input v-model="addForm.goods_number" type="number">
                </el-input>
              </el-form-item>
              <el-form-item label="商品分类" prop="goods_cat">
                <el-cascader
                v-model="addForm.goods_cat"
                :options="catelist"
                :props="cateProps"
                @change="handleChange"></el-cascader>
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="商品参数" name="1">
              <!-- 渲染表单的item项 -->
              <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
                <el-checkbox-group v-model="item.attr_vals">
                  <el-checkbox :label="cb" v-for="(cb,i) in item.attr_vals" :key="i" border ></el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="商品属性" name="2">
              <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
                <el-input v-model="item.attr_vals"></el-input>
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="商品图片" name="3">
              <el-upload
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerObj"
              :on-success="handleSuccess">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
            </el-tab-pane>
            <el-tab-pane label="商品内容" name="4">
              <!-- 富文本编辑器 -->
              <quill-editor v-model="addForm.goods_introduce">
              </quill-editor>
              <el-button type="primary" class="btnAdd" @click="add">添加商品</el-button>
            </el-tab-pane>
          </el-tabs>
        </el-form>
      </el-card>

      <!-- 图片预览 -->
      <el-dialog
        title="图片预览"
        :visible.sync="previewVisible"
        width="50%">
        <img :src="previewPath" class="preivewImg">
      </el-dialog>
    </div>
</template>

<script type="text/ecmascript-6">
import _ from 'lodash'

export default {
  data () {
    return {
      activeIndex: '0',
      // 添加商品的表单数据对象
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        // 商品所属的分类数组
        goods_cat: [],
        // 图片的数组
        pics: [],
        goods_introduce: '',
        attrs: []
      },
      // 验证规则
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选择商品种类', trigger: 'blur' }
        ]
      },
      catelist: [],
      // 级联选择器配置项
      cateProps: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      // 动参数据
      manyTableData: [],
      // 静态属性
      onlyTableData: [],
      // 上传图片的地址
      uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      // 图片上传的headers请求头
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      // 预览路径
      previewPath: '',
      // 预览显示隐藏
      previewVisible: false
    }
  },
  created () {
    this.getCateList()
  },
  components: {},
  methods: {
    // 获取所有商品数据
    async getCateList () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message({
          message: '获取商品数据失败',
          type: 'error'
        })
      }
      this.catelist = res.data
      // console.log(res.data, '获取商品数据成功')
    },
    // 监听级联选择器的变化
    handleChange () {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
      // console.log(this.addForm.goods_cat, '监听商品种类')
    },
    // 页面跳转之前 （对跳转的判定）
    beforeTabLeave (activeName, oldActiveName) {
      // console.log(activeName + oldActiveName, '新老')
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message({
          message: '请先填写商品基本信息',
          type: 'error'
        })
        return false
      }
    },
    // 页面跳转
    async tabClicked () {
      // console.log(this.activeIndex, '激活页面')
      // console.log(this.cateId, '种类层级3')
      // 访问动参
      if (this.activeIndex === '1') {
        console.log('访问动参面板', '')
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: 'many' } })
        if (res.meta.status !== 200) {
          this.$message({
            message: '获取动态参数失败',
            type: 'error'
          })
        }
        // console.log(res.data, '获取参数数据成功')
        res.data.forEach(item => {
          // item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
          if (item.attr_vals.length === 0) {
            item.attr_vals = []
          }
          item.attr_vals = item.attr_vals.toString().split(' ')
          // console.log(item.attr_vals, '为什么不是数组阿')
        })
        this.manyTableData = res.data
        console.log(this.manyTableData, '获取动态参数成功')
      } else if (this.activeIndex === '2') {
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: 'only' } })
        if (res.meta.status !== 200) {
          this.$message({
            message: '获取静态属性失败',
            type: 'error'
          })
        }
        this.onlyTableData = res.data
        console.log(this.onlyTableData, '获取静态属性成功')
      }
    },
    // 处理图片预览
    handlePreview (file) {
      // console.log(file, '预览')
      this.previewPath = file.response.data.url
      // console.log(this.previewPath, '预览')
      this.previewVisible = true
    },
    // 移除图片
    handleRemove (file) {
      console.log(file, '要移除的文件')
      const removePath = file.response.data.temp_path
      // this.addForm.pics.splice(removePath)
      // console.log(this.addForm.pics, '删除成功')
      // 查找pics的索引值
      const i = this.addForm.pics.findIndex(x => x.pic === removePath)
      this.addForm.pics.splice(i, 1)
      console.log(this.addForm.pics, '删除成功')
    },
    // 监听图片上传成功时间
    handleSuccess (response) {
      // console.log(response, '上传成功监听')
      const picInfo = { pic: response.data.tmp_path }
      this.addForm.pics.push(picInfo)
      // console.log(this.addForm, '添加的图片结果')
    },
    // 添加商品
    add () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return this.$message({
            message: '请填写必要的表单项',
            type: 'error'
          })
        }
        // 商品添加到服务器
        // lodash cloneDeep(obj)  323我没bug阿
        // console.log(this.addForm, '所有表项')
        const form = _.cloneDeep(this.addForm)
        form.goods_cat = form.goods_cat.join(',')
        console.log(form, '深拷贝form')
        // 处理动参和静态属性
        this.manyTableData.forEach(item => {
          const newInfo = { attr_id: item.attr_id, attr_value: item.attr_vals.join(' ') }
          this.addForm.attrs.push(newInfo)
        })
        this.onlyTableData.forEach(item => {
          const newInfo = { attr_id: item.attr_id, attr_value: item.attr_vals }
          this.addForm.attrs.push(newInfo)
        })
        //
        form.attrs = this.addForm.attrs
        console.log(form, '完整商品数据')
        const { data: res } = await this.$http.post('goods', form)
        // console.log(res, '为啥失败')
        if (res.meta.status !== 201) {
          return this.$message({
            message: '添加商品失败',
            type: 'error'
          })
        }
        this.$message({
          message: '添加商品成功',
          type: 'success'
        })
        this.$router.push('/goods')
      })
    }
  },
  computed: {
    cateId () {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }
  }
}
</script>

<style lang="less" scoped>
.el-checkbox{
  margin: 0 10px 0 0 !important;
}
.preivewImg{
  width: 100%;
}
.btnAdd{
  margin-top: 15px;
}
</style>
