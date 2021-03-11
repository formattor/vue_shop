<template>
      <el-container class="home-container">
        <!-- 头部区域 -->
        <el-header>
          <div>
            <img class="logo" src="../assets/logo.png" alt="">
            <span>奖学金管理系统</span>
          </div>
          <el-button type="info" @click="logout">退出</el-button></el-header>
        <!-- 主题区域 -->
        <el-container>
          <!-- 侧标栏 -->
          <el-aside :width="isCollapse?'64px':'200px'">
            <div class="toggle-button" @click="toggleCollapse">|||</div>
            <!-- 侧边栏菜单 -->
            <el-menu
              background-color="#282C34"
              text-color="#fff"
              active-text-color="#2879FF"
              :unique-opened="true"
              :collapse='isCollapse'
              :collapse-transition='false'
              :router='true'
              :default-active=activePath>
              <!-- 一级菜单 -->
              <el-submenu :index="item.id+''"  v-for="item in menulist" :key="item.id">
                <!-- 一级菜单模板 -->
                <template slot="title">
                  <i :class="iconsObj[item.id]"></i>
                  <span>{{item.authName}}</span>
                </template>
                <!-- 二级菜单 -->
                <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="saveNavstate('/'+subItem.path)">
                  <template slot="title">
                    <i class="el-icon-menu"></i>
                    <span>{{subItem.authName}}</span>
                  </template>
                </el-menu-item>
              </el-submenu>
            </el-menu>
          </el-aside>
          <!-- 内容区域 -->
          <el-main>
            <!-- 路由占位符 -->
            <router-view></router-view>
          </el-main>
        </el-container>
      </el-container>
</template>

<script>
export default {
  data () {
    return {
      // 左侧菜单
      menulist: [],
      iconsObj: {
        125: 'el-icon-user-solid',
        103: 'el-icon-s-tools',
        101: 'el-icon-s-goods',
        102: 'el-icon-s-order',
        145: 'el-icon-s-marketing'
      },
      isCollapse: false,
      // 被激活的路由地址
      activePath: ''
    }
  },
  components: {

  },
  created () {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
      this.$message.success('退出成功！')
    },
    async getMenuList () {
      const { data: res } = await this.$http.get('menus')
      // console.log(res, '菜单列表')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menulist = res.data
      // console.log(this.menulist, '二级菜单')
    },
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    },
    saveNavstate (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      // 没有特别明白
      this.activePath = activePath
    }
  }
}
</script>

<style lang="less" scoped>
.home-container{
  height: 100%;
}
.el-header{
  background-color: #21252B;
  display: flex;
  // 左右贴边对齐
  justify-content: space-between;
  // 上下对齐
  align-items: center;
  color: #FAFAFA;
  font-size: 20px;
  >div{
    display: flex;
    align-items: center;
    span{
      margin-left: 15px;
    }
  }
}
.el-aside{
  background-color: #282C34;
  .el-menu{
  border-right: 0;
  }
}
.el-main{
  background-color: #eee;
}
.logo{
  width: 45px;
  // margin-top: 7px;
}
.iconfont{
  margin: 10px;
}
.toggle-button{
  background-color: #2F323B;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
