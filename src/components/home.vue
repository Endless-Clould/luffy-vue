<template>
  <div>
<Header></Header>
    <Banner></Banner>
    <Footer></Footer>
    </div>
</template>

<script>
  import Header from "./common/Header"
  import Banner from "./common/Banner"
  import Footer from "./common/Footer"
  export default {
  name: "home",
  components:{
  Header,
  Banner,
    Footer,
    }
  }

</script>

<style scoped>
body{
  padding: 0;
  margin: 0;
}
</style>
