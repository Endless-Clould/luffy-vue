<template>
  <div class="cart">
    <Header/>
    <div class="cart-info">
        <h3 class="cart-top">购物车结算 <span>共1门课程</span></h3>
        <div class="cart-title">
           <el-row>
             <el-col :span="2">&nbsp;</el-col>
             <el-col :span="10">课程</el-col>
             <el-col :span="8">有效期</el-col>
             <el-col :span="4">价格</el-col>
           </el-row>
        </div>
        <div class="cart-item" v-for="course in order_info.order_courses">
          <el-row>
             <el-col :span="2" class="checkbox">&nbsp;&nbsp;</el-col>
             <el-col :span="10" class="course-info">
               <img style="float: left;" :src="$settings.Host+course.course_img" alt="">
               <span class="course_name">
                 <span>{{course.course_name}}</span><br>
                 <span class="discount_name">{{course.discount_name}}</span>
               </span>
             </el-col>
             <el-col :span="8" class="lh"><span>{{course.expire_text}}</span></el-col>
             <el-col :span="4">
               <div class="course-price">
                  <p class="real_price">¥{{course.real_price}}</p>
                  <span class="original_price">原价: ¥{{course.price}}</span>
               </div>
             </el-col>
           </el-row>
        </div>
        <div>
        <div class="coupon">
          <div id="accordion">
            <div class="coupon-box">
              <div class="coupon-title">
                <span class="select-coupon">使用优惠劵：</span>
                <a data-toggle="collapse" data-parent="#accordion" href="#collapseOne" style="width: 20px; height: 20px" class="collapsed" aria-expanded="false">
                  <img class="sign" src="../../static/img/12.png" width="20" height="20" alt=""></a>
                  <span class="coupon-num">有0张可用</span>
              </div>
              <p class="sum-price-wrap" style="margin-right: 45px">商品总金额：<span class="sum-price">{{order_info.total_price}}元</span></p>
            </div>
            <div style="text-align: left;" id="collapseOne" class="panel-collapse out collapse" aria-expanded="false">
              <ul class="coupon-list" v-if="coupon_list.length>0">
                <li @click="use_coupon=item.id" v-for="item in coupon_list" class="coupon-item" :class="use_coupon==item.id?'coupon_selected':''">
                  <span>{{item.coupon.name}}</span>
                  <span v-if="item.coupon.type==1">￥{{item.coupon.sale}}元</span>
                  <span style="font-size: 12px;">开始使用时间: {{new Date(item.start_time).toLocaleString()}}</span>
                </li>
              </ul>
              <div v-else style="text-align: center; width: 100%; padding: 50px 0px; align-items: center; justify-content: center; border-bottom: 1px solid rgb(232, 232, 232);">
                <span style="font-size: 16px; color: #9b9b9b">暂无可用优惠券</span>
              </div>
            </div>
          </div>
          <div style="height: 30px; margin-top: 40px; display: flex; align-items: center; justify-content: flex-end">
            <input type="checkbox" class="ok" id="color-input-red">
            <label for="color-input-red"><img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTFweCIgaGVpZ2h0PSI5cHgiIHZpZXdCb3g9IjAgMCAxMSA5IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogICAgPCEtLSBHZW5lcmF0b3I6IFNrZXRjaCA0OS4zICg1MTE2NykgLSBodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2ggLS0+CiAgICA8dGl0bGU+5Yu+6YCJPC90aXRsZT4KICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPgogICAgPGRlZnM+PC9kZWZzPgogICAgPGcgaWQ9IumAgumFjU3pobUyIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0i5o+Q5Lqk6K6i5Y2VIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMzM4LjAwMDAwMCwgLTQyMi4wMDAwMDApIiBmaWxsPSIjRkZGRkZGIj4KICAgICAgICAgICAgPGcgaWQ9IkNoZWNrYm94LUNvcHkiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDMzMi4wMDAwMDAsIDQxNC4wMDAwMDApIj4KICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0xMC4wNzc0NjQ3LDEwLjgyMTM3MSBMMTUuMzYwNDQ5NCwxNi4xMDQzNTU3IEMxNS41NTU1OTAyLDE2LjI5OTQ5NjUgMTUuNTU2NDcwOCwxNi42MTUwMDE2IDE1LjM1NTgxMDIsMTYuODE1NjYyMSBMMTQuOTQwMzg1LDE3LjIzMTA4NzQgQzE0Ljc0MjY4MjEsMTcuNDI4NzkwMyAxNC40Mjg3Nzc4LDE3LjQzNTQyNTggMTQuMjI5MDc4NSwxNy4yMzU3MjY1IEw4LjE4NzExODU4LDExLjE5Mzc2NjYgQzguMDc5MzUwNDgsMTEuMDg1OTk4NSA4LjAzMDgyOTYyLDEwLjk0MTUyMDYgOC4wNDI3ODIzNCwxMC43OTk5NDk3IEM4LjA0MjQ1NjUsMTAuNjcyNTEyOSA4LjA4OTMwMDA2LDEwLjU0Njc5MzkgOC4xODE0NjU5OCwxMC40NTQ2MjggTDExLjI1MzU2ODcsNy4zODI1MjUzMyBDMTEuNDQ1NTg3Niw3LjE5MDUwNjM3IDExLjc1ODU2Miw3LjE5MjE1NjUyIDExLjk1OTIyMjYsNy4zOTI4MTcwNiBMMTIuMzc0NjQ3OCw3LjgwODI0MjI5IEMxMi41NzIzNTA3LDguMDA1OTQ1MjEgMTIuNTcwNzM3Myw4LjMyODA5ODM1IDEyLjM4NDkzOTUsOC41MTM4OTYxOCBMMTAuMDc3NDY0NywxMC44MjEzNzEgWiIgaWQ9IuWLvumAiSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTEuNzczNzg0LCAxMi4zMTE0MjMpIHJvdGF0ZSgtOTAuMDAwMDAwKSB0cmFuc2xhdGUoLTExLjc3Mzc4NCwgLTEyLjMxMTQyMykgIj48L3BhdGg+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPgo=" alt=""></label>
            <p class="discount-num" style="color:#9B9B9B">使用我的贝里</p>
            <p class="discount-num" style="margin-right: 45px">
              <span style="display: none;">可用0个已抵扣 ￥0</span>
            </p>
          </div>
          <p class="sun-coupon-num" style="margin-right: 45px;margin-bottom:43px">优惠券抵扣：<span>0元</span></p>
        </div>
        </div>
        <div class="calc">
            <el-row class="pay-row">
              <el-col :span="4" class="pay-col"><span class="pay-text">支付方式：</span></el-col>
              <el-col :span="8">
                <span class="alipay"><img src="../../static/img/alipay2.png" alt=""></span>
                <span class="alipay wechat"><img src="../../static/img/wechat.png" alt=""></span>
              </el-col>
              <el-col :span="8" class="count">实付款： <span>¥{{order_info.real_price}}</span></el-col>
              <el-col :span="4" class="cart-pay"><span @click="payhander">支付宝支付</span></el-col>
            </el-row>
        </div>
    </div>
    <Footer/>
  </div>
</template>

<script>
  import Header from "./common/Header"
  import Footer from "./common/Footer"
  export default {
    name:"Order",
    data(){
      return {
        use_coupon: 0,  // 使用的优惠券ID
        order_info:{},
        coupon_list:[], // 用于展示优惠券列表
        coupon_list2:[],// 用于勾选优惠券功能
      }
    },
    components:{
      Header,
      Footer,
    },
    watch:{
      use_coupon(coupon_id){
        let data = this.coupon_list2[ coupon_id ];
        let sale = parseFloat( data.coupon.sale.slice(1) );
        if( data.coupon.coupon_type == 0 ){
          // 折扣优惠券
          this.order_info.real_price = this.order_info.total_price * sale;
        }else if(data.coupon.coupon_type == 1){
          // 减免优惠券
          this.order_info.real_price = this.order_info.total_price - sale;
        }
        this.order_info.real_price = this.order_info.real_price.toFixed(2);

        // 发送数据到后端,进行同步
      }
    },
    created(){
      // 判断用户是否已经登录
      let token = sessionStorage.token || localStorage.token;
      let _this = this;
      if(!token){
        this.$alert("对不起,您尚未登录!请登录!","警告",{
          callback(){
            _this.$router.push("/login");
          }
        })
      }
      // 获取地址栏上面的订单号
      let order_number = this.$route.params.order;

      // 发送请求获取数据
      this.$axios.get(this.$settings.Host+`/orders/${order_number}/`,{
          headers:{
            // 注意下方的空格!!!
            "Authorization":"jwt " + token,
          },
      }).then(response=>{
        this.order_info = response.data;
      }).catch(error=>{
        console.log(error.response);
      });

      // 获取用户的优惠券
      this.get_coupon_list()
    },
    methods: {
      get_coupon_list(){
        let user_id = localStorage.user_id || sessionStorage.user_id;
        let token = localStorage.token || sessionStorage.token;
        // 获取当前用户的优惠券
        this.$axios.get(this.$settings.Host+"/coupon/list/",{
          params:{
            user_id,
          },
          headers:{
            // 注意下方的空格!!!
            "Authorization":"jwt " + token,
          },
        }).then(response=>{
          // 调整获取到优惠券列表,以优惠券ID作为下标
          let data_list = [];
          response.data.forEach(row=>{
            data_list[row.id] = row;
          });
          this.coupon_list2= data_list;
          this.coupon_list = response.data;
        }).catch(error=>{
          console.log(error.response);
        })
      },
      payhander(){

        this.$confirm("您即将跳转到支付宝页面进行订单支付?","提示").then(()=>{
            let token = localStorage.token || sessionStorage.token;
            // 获取订单号
            let order_number = this.$route.params.order;
            // 发起支付请求
            this.$axios.get(this.$settings.Host+"/payments/alipay/url/",{
              params:{
                order_number: order_number,
                coupon_id: this.use_coupon,
              },
              headers:{
                // 注意下方的空格!!!
                "Authorization":"jwt " + token,
              },
            }).then(response=>{
              let url = response.data.url;
              console.log(url);
              // 页面跳转
              location.assign( url );
            }).catch(error=>{
              console.log(error.response)
            })

        });


      },

    }
  }
</script>

<style scoped>
.cart{
  margin-top: 80px;
}
.cart-info{
  overflow: hidden;
  width: 1200px;
  margin: auto;
}
.cart-top{
  font-size: 18px;
  color: #666;
  margin: 25px 0;
  font-weight: normal;
}
.cart-top span{
    font-size: 12px;
    color: #d0d0d0;
    display: inline-block;
}
.cart-title{
    background: #F7F7F7;
    height: 70px;
}
.calc{
  margin-top: 25px;
  margin-bottom: 40px;
}

.calc .count{
  text-align: right;
  margin-right: 10px;
  vertical-align: middle;
}
.calc .count span{
    font-size: 36px;
    color: #333;
}
.calc .cart-pay{
    margin-top: 5px;
    width: 110px;
    height: 38px;
    outline: none;
    border: none;
    color: #fff;
    line-height: 38px;
    background: #ffc210;
    border-radius: 4px;
    font-size: 16px;
    text-align: center;
    cursor: pointer;
}
.cart-item{
  height: 120px;
  /*line-height: 120px;*/
}
.cart-item .lh{
  line-height: 120px;
}
.course-info img{
    width: 175px;
    height: 115px;
    margin-right: 35px;
    vertical-align: middle;
}
.course-price{
  margin-top: 40px;
}
.alipay{
  display: inline-block;
  height: 48px;
}
.alipay img{
  height: 100%;
  width:auto;
}

.pay-text{
  display: block;
  text-align: right;
  height: 100%;
  line-height: 100%;
  vertical-align: middle;
  margin-top: 20px;
}
.real_price{
    color: #333;
    margin-bottom: 10px;
}
.original_price{
    color: #9b9b9b;
    letter-spacing: .36px;
    text-decoration: line-through;
}
.coupon{
  margin-top: 30px;
}
.coupon-box{
  text-align: left;
  display: flex;
  padding-bottom: 22px;
  padding-left:30px;
  border-bottom: 1px solid #e8e8e8;
}
.coupon-title{
  display: flex;
}
.sum-price-wrap{
    display: inline-block;
    margin-left: auto;
    font-size: 16px;
    color: #4a4a4a;
}
.discount_name{
    color: #ffc210;
    margin-top: 24px;
    font-size: 14px;
    letter-spacing: .32px;
}
.course_name{
  margin-top: 40px;
  display: block;
}
.coupon-list{
  overflow: hidden;
}
.coupon-item{
  float: left;
  margin-left: 10px;
  margin-right: 10px;
  width: 200px;
  height: 60px;
  border: 1px solid #000;
  padding: 10px;
}
.coupon-item span{
  display: block;
  font-size: 14px;
}
.coupon_selected{
  border-color: red;
  color: indianred;
}
</style>
