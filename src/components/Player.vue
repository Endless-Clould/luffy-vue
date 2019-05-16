<template>
    <div class="player">
      <div id="player"></div>
    </div>
</template>

<script>
export default {
  name:"Player",
  data () {
    return {
      token: sessionStorage.token || localStorage.token,
      user_id: sessionStorage.user_id || localStorage.user_id,
      user_name: sessionStorage.user_name || localStorage.user_name,
    }
  },
  methods: {

  },
  created(){
    // 判断用户用户是否已经登录了
    if(!this.token){
      let _this = this;
      this.$alert("对不起,您尚未登录!请登录!","警告",{
        callback(){
          _this.$router.push("/login");
        }
      })
    }
  },
  mounted(){
    let _this = this;
    let video_id = this.$route.query.vid;
    var player = polyvObject('#player').videoPlayer({
        wrap: '#player',
        width: document.documentElement.clientWidth, // 宽度
        height: document.documentElement.clientHeight, // 高度
        forceH5: true,
        vid:video_id, // vid:vid,的简写
        code: _this.user_name, // 跑马灯的显示信息,一般是用户昵称
        // 视频加密播放的配置
        playsafe: function (vid, next) { // 向后端发送请求获取加密的token
            _this.$axios.get(_this.$settings.Host+`/courses/polyv/token/`,{
              // 附带jwt token
              headers:{
                // 注意下方的空格!!!
                "Authorization":"jwt " + _this.token
              },
              params:{
                vid:video_id,
              }
            }).then(function (response) {
                console.log(response);
                next(response.data.token);
            })

        }
    });
  },
  computed: {
  }
}
</script>

<style scoped>
</style>
