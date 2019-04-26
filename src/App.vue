<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default{
  name: 'App'
}
</script>

<style lang="sass">
#app .app-main
  margin: 20px
  > div
    padding: 24px
    background: #fff
</style>

