<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default{
  name: 'App',
  mounted() {
    console.log('hey, xiaodi')
  }
}
</script>

<style lang="sass">
#app .app-main
  margin: 20px
#app
  .tools
    margin-bottom: 15px
  .rule-list
    .el-tag
      margin-right: 8px
    padding-left: 12px
    padding-right: 12px
    margin-bottom: 12px
</style>

