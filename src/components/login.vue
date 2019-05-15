<template>
  <div class="login-box">
    <img src="https://www.luffycity.com/static/img/Loginbg.3377d0c.jpg" alt="">
    <div class="login">
      <div class="login-title">
        <img src="https://www.luffycity.com/static/img/Logotitle.1ba5466.png" alt="">
        <p>帮助有志向的年轻人通过努力学习获得体面的工作和生活!</p>
      </div>
      <div class="login_box">
        <div class="title">
          <span @click="login_type=0">密码登录</span>
          <span @click="login_type=1">短信登录</span>
        </div>
        <div class="inp" v-if="login_type==0">
          <input v-model="username" type="text" placeholder="用户名 / 手机号码" class="user">
          <input v-model="password" type="password" name="" class="pwd" placeholder="密码">
          <div id="geetest1"></div>
          <div class="rember">
            <p>
              <input type="checkbox" class="no" name="a"/>
              <span>记住密码</span>
            </p>
            <p>忘记密码</p>
          </div>
          <button class="login_btn" @click="loginhander">登录</button>
          <p class="go_login" >没有账号 <router-link to="/register">立即注册</router-link></p>
        </div>
        <div class="inp" v-show="login_type==1">
          <input v-model="username" type="text" placeholder="手机号码" class="user">
          <input v-model="password" type="text" class="pwd" placeholder="短信验证码">
          <button id="get_code">获取验证码</button>
          <button class="login_btn" >登录</button>
          <p class="go_login" >没有账号 <router-link to="/register">立即注册</router-link></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Login',
    data() {
      return {
        login_type: 0,
        remember: false, // 记住密码
        username: "",
        password: "",
        remember: "",
        is_geek:false,

      }
    },
    mounted() {
      // 请求后端获取生成验证码的流水号
      this.$axios.get('http://127.0.0.1:8000/users/captcha/', {
        responseType: 'json', // 希望返回json数据
      }).then(response => {
        let data = response.data;
        console.log(data)

        // 验证初始化配置
        initGeetest({
          gt: data.gt,
          challenge: data.challenge,
          product: "popup", // 产品形式，包括：float，embed，popup。注意只对PC版验证码有效
          offline: !data.success
        }, this.handlerPopup)
      }).catch(error => {
        console.log(error.response);
      });
    },
    methods: {
      loginhander() {
         // 判断用户是否已经通过了极验验证
      if(!this.is_geek){
        return false;
      }
        this.$axios.post('http://127.0.0.1:8000/users/login/', {
          "username": this.username,
          "password": this.password
        }).then(response => {
          console.log(response.data)
          // 使用浏览器本地存储保存token
               let data = response.data
          if (this.remember) {
            // 记住登录
            sessionStorage.clear();
            localStorage.token =data.token;
            localStorage.id = data.id;
            localStorage.username = data.username;
          } else {
            // 未记住登录
            localStorage.clear();
            sessionStorage.token =data.token;
            sessionStorage.id =data.id;
            sessionStorage.username =data.username;
          }
          // 页面跳转回到上一个页面 也可以使用 this.$router.push("/") 回到首页
          this.$router.go(-1)
        }).catch(error => {
          console.log(error)
        })
      },
      handlerPopup(captchaObj) {
        // 把验证码添加到模板中制定的页面
        captchaObj.appendTo("#geetest1");
      let _this = this;

       // 监听用户对于验证码的操作是否成功了
       captchaObj.onSuccess(()=>{
          var validate = captchaObj.getValidate();
          console.log(validate)

          _this.$axios.post("http://127.0.0.1:8000/users/captcha/",{
              geetest_challenge: validate.geetest_challenge,
              geetest_validate: validate.geetest_validate,
              geetest_seccode: validate.geetest_seccode
          }).then(response=>{
              // 在用户成功添加数据以后,可以允许点击登录按钮
              _this.is_geek = true;

          }).catch(error=>{
              console.log(error.response)
          })

        });

      },

    },

  };
</script>
<style scoped>
  .login-box {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
    margin-top: -80px;
  }

  .login-box img {
    width: 100%;
    min-height: 100%;
  }

  .login-box .login {
    position: absolute;
    width: 500px;
    height: 400px;
    left: 0;
    margin: auto;
    right: 0;
    bottom: 0;
    top: -220px;
  }

  .login .login-title {
    width: 100%;
    text-align: center;
  }

  .login-title img {
    width: 190px;
    height: auto;
  }

  .login-title p {
    font-size: 18px;
    color: #fff;
    letter-spacing: .29px;
    padding-top: 10px;
    padding-bottom: 50px;
  }

  .login_box {
    width: 400px;
    height: auto;
    background: #fff;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .5);
    border-radius: 4px;
    margin: 0 auto;
    padding-bottom: 40px;
  }

  .login_box .title {
    font-size: 20px;
    color: #9b9b9b;
    letter-spacing: .32px;
    border-bottom: 1px solid #e6e6e6;
    display: flex;
    justify-content: space-around;
    padding: 50px 60px 0 60px;
    margin-bottom: 20px;
    cursor: pointer;
  }

  .login_box .title span:nth-of-type(1) {
    color: #4a4a4a;
    border-bottom: 2px solid #84cc39;
  }

  .inp {
    width: 350px;
    margin: 0 auto;
  }

  .inp input {
    outline: 0;
    width: 100%;
    height: 45px;
    border-radius: 4px;
    border: 1px solid #d9d9d9;
    text-indent: 20px;
    font-size: 14px;
    background: #fff !important;
  }

  .inp input.user {
    margin-bottom: 16px;
  }

  .inp .rember {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    margin-top: 10px;
  }

  .inp .rember p:first-of-type {
    font-size: 12px;
    color: #4a4a4a;
    letter-spacing: .19px;
    margin-left: 22px;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-align: center;
    align-items: center;
    /*position: relative;*/
  }

  .inp .rember p:nth-of-type(2) {
    font-size: 14px;
    color: #9b9b9b;
    letter-spacing: .19px;
    cursor: pointer;
  }

  .inp .rember input {
    outline: 0;
    width: 30px;
    height: 45px;
    border-radius: 4px;
    border: 1px solid #d9d9d9;
    text-indent: 20px;
    font-size: 14px;
    background: #fff !important;
  }

  .inp .rember p span {
    display: inline-block;
    font-size: 12px;
    width: 100px;
    /*position: absolute;*/
    /*left: 20px;*/

  }

  #geetest {
    margin-top: 20px;
  }

  .login_btn {
    width: 100%;
    height: 45px;
    background: #84cc39;
    border-radius: 5px;
    font-size: 16px;
    color: #fff;
    letter-spacing: .26px;
    margin-top: 30px;
  }

  .inp .go_login {
    text-align: center;
    font-size: 14px;
    color: #9b9b9b;
    letter-spacing: .26px;
    padding-top: 20px;
  }

  .inp .go_login span {
    color: #84cc39;
    cursor: pointer;
  }
</style>
