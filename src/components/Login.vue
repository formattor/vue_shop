<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="">
      </div>
      <!-- 表单区域 -->
      <el-form :model="loginForm" :rules="loginFormRules" ref="loginFormRef" label-width="0" class="login_form">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="el-icon-user-solid"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" prefix-icon="el-icon-lock" type="password"></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="primary" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 登录表单数据绑定对象
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 表单验证规则
      loginFormRules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetLoginForm () {
      // console.log(this)
      this.$refs.loginFormRef.resetFields()
      this.loginForm.username = ''
      this.loginForm.password = ''
    },
    login () {
      this.$refs.loginFormRef.validate(async (valid) => {
        // 自校验
        // console.log(valid, '')
        // const result = await this.$http.post('login', this.loginForm)
        // console.log(result, '')
        // 解构出data
        const { data: res } = await this.$http.post('login', this.loginForm)
        // console.log(res, '')
        if (res.meta.status !== 200) return this.$message.error('登陆失败')
        this.$message.success('登录成功')
        // console.log(res, '获取登录信息')
        window.sessionStorage.setItem('token', res.data.token)
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .login_container{
    background-color: #2b4b6b;
    height: 100%;
  }
  .login_box{
    width: 450px;
    height: 300px;
    border-radius: 3px;
    background-color: #FFF;
    // margin: 0 auto;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    .avatar_box{
      height: 130px;
      width: 130px;
      border: 1px solid #eee;
      border-radius: 50%;
      padding: 10px;
      box-shadow: 0 0 10px #ddd;
      position: absolute;
      left: 50%;
      transform: translate(-50%,-50%);
      background-color: #FFF;
      img{
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #EEE;
      }
    }
    .login_form{
      position: absolute;
      bottom: 0;
      width: 100%;
      padding: 0 20px;
      box-sizing: border-box;
    }
  }
  .btns{
    display: flex;
    justify-content: flex-end;
    // background-color: #123;
  }
</style>
