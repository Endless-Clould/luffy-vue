<template>
  <div class="header">
    <el-container>
      <el-header>
        <el-row>
          <el-col class="logo" :span="3">
            <a href="/">
              <img src="@/assets/head-logo.svg" alt="">
            </a>
          </el-col>
          <el-col class="nav" :span="16">
            <el-row>
              <el-col v-for="nav in nav_list" :span="3"><a :class="check(nav.link)?'current':''" :href="nav.link">{{nav.name}}</a>
              </el-col>
            </el-row>
          </el-col>
          <el-col class="login-bar" :span="5">
            <el-row v-if="token">
              <el-col class="cart-ico" :span="9">
                <router-link to="">
                  <b class="goods-number">{{$store.state.cart.count}}</b>
                  <img class="cart-icon" src="@/assets/cart.svg" alt="">
                  <span><router-link to="/cart">购物车</router-link></span>
                </router-link>
              </el-col>
              <el-col class="study" :span="8" :offset="2">
                <router-link to="">学习中心</router-link>
              </el-col>
              <el-col class="member" :span="5">
                <el-menu class="el-menu-demo" mode="horizontal">
                  <el-submenu index="2">
                    <template slot="title">
                      <router-link to=""><img src="@/assets/logo@2x.png" alt=""></router-link>
                    </template>
                    <el-menu-item index="2-1">我的账户</el-menu-item>
                    <el-menu-item index="2-2">我的订单</el-menu-item>
                    <el-menu-item index="2-3">我的优惠卷</el-menu-item>
                    <el-menu-item index="2-3" @click="logout">退出登录</el-menu-item>
                  </el-submenu>
                </el-menu>
              </el-col>
            </el-row>
            <el-row v-else>
              <el-col class="cart-ico" :span="9">
                <router-link to="">
                  <img class="cart-icon" src="@/assets/cart.svg" alt="">
                  <span><router-link to="/cart">购物车</router-link></span>
                </router-link>
              </el-col>
              <el-col :span="10" :offset="5">
                <span class="register">
                  <router-link to="Login">登录</router-link>
                  &nbsp;&nbsp;|&nbsp;&nbsp;
                  <span class="header-register"><router-link to="/register">注册</router-link></span>
                </span>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </el-header>
    </el-container>
  </div>
</template>

<script>
  export default {
    name: "Header",
    data() {
      return {
        // 设置一个登录标识，表示是否登录

        nav_list: [],

        token: sessionStorage.token || localStorage.token,
        user_name: sessionStorage.user_name || localStorage.user_name,
        user_id: sessionStorage.user_id || localStorage.user_id,
      };
    },
    created() {
      // 获取导航
      this.$axios.get('http://127.0.0.1:8000/api/nav/').then(response => {
        this.nav_list = response.data
        console.log(this.nav_list)
      }).catch(error => {
        console.log(error.response)
      })
    },
    methods: {
      check(link) {
        return link == window.location.pathname
      },
      logout() {

        this.token = false;
        this.user_id = false;
        this.user_name = false;

        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user_id");
        sessionStorage.removeItem("user_name");

        localStorage.removeItem("token");
        localStorage.removeItem("user_id");
        localStorage.removeItem("user_name");
        let _this = this;
        this.$alert('退出登录成功!', '路飞学城', {
          confirmButtonText: '确定',
          callback() {
            _this.$router.push("/");
          }
        });
      }
    }
  }
</script>

<style scoped>
  .header {
    top: 0;
    left: 0;
    right: 0;
    margin: auto;
    background-color: #fff;
    height: 80px;
    z-index: 1000;
    position: fixed;
    box-shadow: 0 0.5px 0.5px 0 #c9c9c9;
  }

  .header .el-container {
    width: 1200px;
    margin: 0 auto;
  }

  .el-header {
    height: 80px !important;
    padding: 0;
  }

  .logo {

  }

  .logo img {
    padding-top: 22px;
  }

  .nav {
    margin-top: 22px;
  }

  .nav .el-col a {
    display: inline-block;
    text-align: center;
    padding-bottom: 16px;
    padding-left: 5px;
    padding-right: 5px;
    position: relative;
    font-size: 16px;
    margin-left: 20px;
  }

  .nav .el-col .current {
    color: #4a4a4a;
    border-bottom: 4px solid #ffc210;
  }

  .login-bar {
    margin-top: 22px;
  }

  .cart-ico {
    position: relative;
    border-radius: 17px;
  }

  .cart-ico:hover {
    background: #f0f0f0;
  }

  .goods-number {
    width: 16px;
    height: 16px;
    line-height: 17px;
    font-size: 12px;
    color: #fff;
    text-align: center;
    background: #fa6240;
    border-radius: 50%;
    transform: scale(.8);
    position: absolute;
    left: 16px;
    top: -1px;
  }

  .cart-icon {
    width: 15px;
    height: auto;
    margin-left: 6px;
  }

  .cart-ico span {
    margin-left: 12px;
  }

  .member img {
    width: 26px;
    height: 26px;
    border-radius: 50%;
    display: inline-block;
  }

  .member img:hover {
    border: 1px solid yellow;
  }

</style>
