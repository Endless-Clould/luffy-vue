<template>
    <div class="cart">
      <Header/>
      <div class="main">
        <div class="cart-title">
          <h3>我的购物车 <span> 共2门课程</span></h3>
        </div>
        <div class="cart-info">
          <el-table :data="courseData" style="width:100%">
            <el-table-column type="selection" label="" width="87"></el-table-column>
            <el-table-column label="课程" width="540">
              <template slot-scope="scope">
                <div class="course-box">
                  <img :src="scope.row.img" alt="">
                  {{scope.row.title}}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="有效期" width="216">
              <template slot-scope="scope">
                <el-form ref="form" label-width="60px">
                  <el-form-item>
                    <el-select v-model="expire" placeholder="请选择有效期">
                      <el-option v-for="item in expire_list" :key="item.id" :label="item.title" :value="item.id"></el-option>
                    </el-select>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column label="单价" width="162">
              <template slot-scope="scope">¥{{ scope.row.price }}</template>
            </el-table-column>
            <el-table-column label="操作" width="162">
              <a href="">删除</a>
            </el-table-column>
          </el-table>
        </div>
        <div class="cart-bottom">
          <div class="select-all"><el-checkbox>全选</el-checkbox></div>
          <div class="delete-any"><img src="../../static/img/ico3.png" alt="">删除</div>
          <div class="cart-bottom-right">
            <span class="total">总计：¥<span>0.0</span></span>
            <span class="go-pay">去结算</span>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
</template>

<script>
import Header from "./common/Header"
import Footer from "./common/Footer"
export default {
    name: "Cart",
    data(){
      return{
        expire:3,
        expire_list:[
            {title:"一个月有效",id:1},
            {title:"两个月有效",id:2},
            {title:"三个月有效",id:3},
            {title:"永久有效",id:4},
        ],
        courseData:[
          {img:"../../static/course/1544059695.jpeg",title:"课程标题一",expire:"2016",price:"12.00"},
          {img:"../../static/course/1544059695.jpeg",title:"课程标题一",expire:"2016",price:"12.00"},
        ]
      }
    },
    components:{Header,Footer}
}
</script>

<style scoped>
.main{
  width: 1200px;
  margin: 0 auto;
  overflow: hidden; /* 解决body元素和标题之间的上下外边距的塌陷问题 */
}
.cart-title h3{
  font-size: 18px;
  color: #666;
  margin: 25px 0;
}
.cart-title h3 span{
  font-size: 12px;
  color: #d0d0d0;
  display: inline-block;
}
.course-box img{
    max-width: 175px;
    max-height: 115px;
    margin-right: 35px;
    vertical-align: middle;
}
.cart-bottom{
  overflow: hidden;
  height: 80px;
  background: #F7F7F7;
  margin-bottom: 300px;
  margin-top: 50px;
}
.select-all{
  float: left;
  margin-right: 58px;
  line-height: 80px;
}
.delete-any{
  cursor: pointer;
  float: left;
  line-height: 80px;
}
.delete-any img{
  width:18px;
  height: 18px;
  vertical-align: middle;
  padding-right: 15px;
}
.cart-bottom-right{
  float: right;
  text-align: right; /* 文本右对齐 */
}
.total{
  margin-right: 62px;
  font-size: 18px;
  color: #666;
}
.go-pay{
  outline: none;
  background: #ffc210;
  display: inline-block;
  padding: 27px 50px;
  font-size: 18px;
  cursor: pointer;
  color: #fff;
}
</style>
