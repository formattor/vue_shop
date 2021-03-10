<template>
    <div class="">
      <el-button type="info" @click="logout">退出</el-button>
    </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: '',
  data () {
    return {}
  },
  components: {},
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
      this.$message.success('退出成功！')
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
