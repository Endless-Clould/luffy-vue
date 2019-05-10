<template>
  <div>
    <el-carousel height="506px">
      <el-carousel-item v-for="(banner,index) in banner_list" :key="index">
        <a :href="banner.link"><img width="100%" :src="banner.img" alt=""></a>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
  export default {
    name: "Banner",
    data() {
      return {
        banner_list: [
          {link: "http://www.baidu.com", img: "/static/banner/1.png"},
          {link: "http://www.baidu.com", img: "/static/banner/2.png"},
          {link: "http://www.baidu.com", img: "/static/banner/3.png"},
        ]
      }

    }
  }
</script>

<style scoped>

</style>
