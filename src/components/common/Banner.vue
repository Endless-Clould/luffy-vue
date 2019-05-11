<template>
  <div>
    <el-carousel height="506px">
      <el-carousel-item v-for="(item,index) of banner_list" :key="index">
        <a :href="item.link"><img :src="item.image"></a>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
  export default {
    name: "Banner",
    data() {
      return {
        banner_list: []
      };


    },
    created: function () {
      // 获取轮播图
      this.$axios.get('http://127.0.0.1:8000/api/banner/').then(response => {
        console.log(response.data)
        this.banner_list = response.data
      }).catch(error => {
        console.log(error.response);
      });
    }

  }
</script>

<style scoped>

</style>
