<template>
	<div class="box">
		<img src="../../static/img/Loginbg.3377d0c.jpg" alt="">
		<div class="register">
			<div class="register_box">
        <div class="register-title">注册路飞学城</div>
				<div class="inp">
					<input v-model = "mobile" type="text" placeholder="手机号码" class="user">
					<input v-model = "password" type="password" placeholder="登录密码" class="user">
					<input v-model = "password2" type="password" placeholder="确认密码" class="user">
					<div id="geetest"></div>
					<div class="sms-box">
            <input v-model = "sms" type="text" placeholder="输入验证码" class="user">
            <div class="sms-btn" @click="smsHandle">{{sms_text}}</div>
          </div>
					<button class="register_btn" @click="registerHander">注册</button>
					<p class="go_login" >已有账号 <router-link to="/login">直接登录</router-link></p>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
  name: 'Register',
  data(){
    return {
        sms:"",
        mobile:"",
        password:"",
        password2:"",
        validateResult:false,
        is_send: false,    // 是否已经发送短信的状态
        send_intervel:60, //  发送短信的间隔
        sms_text:"点击发送短信", // 发送短信的提示
    }
  },
  methods:{
    // 发送短信
    smsHandle() {
      // 判断是否填写了手机
      if( !/^\d{11}$/.test(this.mobile) ){
        this.$alert('手机号码格式有误!', '警告');
        return false;
      }

      // 判断是否在60s内有发送过短信,如果有则,不能点击发送
      if(this.is_send){
        this.$alert('60s内不能频繁发送短信!', '警告');
        return false;
      }


      let _this = this;

      _this.$axios.get(_this.$settings.Host+`/users/sms/${_this.mobile}/`).then(response=>{
        let data = response.data;
        if( data.result == '-1' ){
          _this.$alert("发送短信失败!","错误");
        }else{
          _this.is_send = true;
          _this.$alert("发送短信成功了!","成功",{
            callback(){
              let num = _this.send_intervel
              let timer = setInterval(()=>{
                if(num<1){
                  clearInterval(timer);
                  _this.sms_text = "点击发送短信";
                  _this.is_send = false;
                }else{
                  num--;
                  _this.sms_text = num+"后可继续点击发送";
                }
              },1000)
            }
          });
        }
      }).catch(error=>{
          console.log(error.response)
      })

    },
    // 提交注册信息
    registerHander(){
      // 验证手机号码
      if( !/^\d{11}$/.test(this.mobile) ){
        this.$alert('手机号码格式有误!', '警告');
        return false;
      }

      // 密码长度
      if( !/^.{6,16}$/.test(this.password) ){
        this.$alert('密码长度必须在6-16位字符之间!', '警告');
        return false;
      }

      // 密码和确认密码
      if( this.password != this.password2 ){
        this.$alert('确认密码必须和密码保持一致!', '警告');
        return false;
      }

      // 发送请求注册用户
      this.$axios.post(this.$settings.Host+"/users/register/",{
        mobile:this.mobile,
        password:this.password,
        password2:this.password2,
        sms_code:this.sms,
      }).then(response=>{
        let _this = this;
        _this.$alert("注册成功!","路飞学成",{
          callback(){
            let data = response.data;
            console.log(data);
            // 保存登录状态
            sessionStorage.token = data.token;
            sessionStorage.user_id = data.id;
            sessionStorage.user_name = data.username;

            // 跳转到首页
            _this.$router.push("/");
          }
        });

      }).catch(error=>{
        console.log( error.response )
      })

    }
  },

};
</script>

<style scoped>
.box{
	width: 100%;
  height: 100%;
	position: relative;
  overflow: hidden;
  margin-top: -80px;
}
.box img{
	width: 100%;
  min-height: 100%;
}
.box .register {
	position: absolute;
	width: 500px;
	height: 400px;
	top: 0;
	left: 0;
  margin: auto;
  right: 0;
  bottom: 0;
  top: -220px;
}
.register .register-title{
    width: 100%;
    font-size: 24px;
    text-align: center;
    padding-top: 30px;
    padding-bottom: 30px;
    color: #4a4a4a;
    letter-spacing: .39px;
}
.register-title img{
    width: 190px;
    height: auto;
}
.register-title p{
    font-family: PingFangSC-Regular;
    font-size: 18px;
    color: #fff;
    letter-spacing: .29px;
    padding-top: 10px;
    padding-bottom: 50px;
}
.register_box{
    width: 400px;
    height: auto;
    background: #fff;
    box-shadow: 0 2px 4px 0 rgba(0,0,0,.5);
    border-radius: 4px;
    margin: 0 auto;
    padding-bottom: 40px;
}
.register_box .title{
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
.register_box .title span:nth-of-type(1){
	color: #4a4a4a;
    	border-bottom: 2px solid #84cc39;
}

.inp{
	width: 350px;
	margin: 0 auto;
}
.inp input{
    border: 0;
    outline: 0;
    width: 100%;
    height: 45px;
    border-radius: 4px;
    border: 1px solid #d9d9d9;
    text-indent: 20px;
    font-size: 14px;
    background: #fff !important;
}
.inp input.user{
    margin-bottom: 16px;
}
.inp .rember{
     display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    margin-top: 10px;
}
.inp .rember p:first-of-type{
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
.inp .rember p:nth-of-type(2){
    font-size: 14px;
    color: #9b9b9b;
    letter-spacing: .19px;
    cursor: pointer;
}

.inp .rember input{
    outline: 0;
    width: 30px;
    height: 45px;
    border-radius: 4px;
    border: 1px solid #d9d9d9;
    text-indent: 20px;
    font-size: 14px;
    background: #fff !important;
}

.inp .rember p span{
    display: inline-block;
  font-size: 12px;
  width: 100px;
  /*position: absolute;*/
/*left: 20px;*/

}
#geetest{
	margin-top: 20px;
}
.register_btn{
     width: 100%;
    height: 45px;
    background: #84cc39;
    border-radius: 5px;
    font-size: 16px;
    color: #fff;
    letter-spacing: .26px;
    margin-top: 30px;
}
.inp .go_login{
    text-align: center;
    font-size: 14px;
    color: #9b9b9b;
    letter-spacing: .26px;
    padding-top: 20px;
}
.inp .go_login span{
    color: #84cc39;
    cursor: pointer;
}
.sms-box{
  position: relative;
}
.sms-btn{
    font-size: 14px;
    color: #ffc210;
    letter-spacing: .26px;
    position: absolute;
    right: 16px;
    top: 10px;
    cursor: pointer;
    overflow: hidden;
    background: #fff;
    border-left: 1px solid #484848;
    padding-left: 16px;
    padding-bottom: 4px;
}
</style>
