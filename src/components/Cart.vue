<template>
    <div class="cart">
      <Header/>
      <div class="main">
        <div class="cart-title">
          <h3>我的购物车 <span> 共2门课程</span></h3>
        </div>
        <div class="cart-info">
          <el-table
            :data="courseData"
            style="width:100%"
            ref="multipleTable"
            @select="currentSelected"
            @selection-change="SelectionChange"
          >
            <el-table-column type="selection" width="87"></el-table-column>
            <el-table-column label="课程" width="540">
              <template slot-scope="scope">
                <div class="course-box">
                  <img :src="$settings.Host + scope.row.course_img" alt="">
                  <router-link :to="'/detail?id='+scope.row.id">{{scope.row.name}}</router-link>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="有效期" width="216">
              <template slot-scope="scope">
                <el-select @change="ChangeExpire(scope.row)" v-model="scope.row.expire" placeholder="请选择">
                  <el-option v-for="item in scope.row.expire_list" :key="item.timer" :label="item.title" :value="item.timer"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="单价" width="162">
              <template slot-scope="scope">¥{{ scope.row.price.toFixed(2) }}</template>
            </el-table-column>
            <el-table-column label="操作" width="162">
              <template slot-scope="scope">
                <a @click="CartDel(scope.row,scope.row.name)">删除</a>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="cart-bottom">
          <div class="select-all"><el-checkbox>全选</el-checkbox></div>
          <div class="delete-any"><img src="../../static/img/ico3.png" alt="">删除</div>
          <div class="cart-bottom-right">
            <span class="total">总计：¥<span>{{total_price}}</span></span>
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
        // 注释掉原来的有效周期测试数据
        // expire:3,
        // expire_list:[]
        courseData:[], // 购物车中的商品信息
        selection:[],  // 购物车中被勾选的商品信息
        total_price:0.00,
      }
    },
    watch:{
      selection(){
        // 当课程勾选状态发生变化时核算价格
        this.getTotalPrice();
      },
      courseData(){
        // 当课程数量发生变化时核算价格
        this.getTotalPrice();
      },
    },
    created(){
      // 判断是否登录
      this.token = sessionStorage.token || localStorage.token;
      if( !this.token ){
        this.$confirm("对不起,您尚未登录!请登录",'提示').then(() => {
          this.$router.push("/login");
        }).catch(()=>{
          this.$router.go(-1);
        });
      }else{
        // 获取购物车商品数据
        this.$axios.get(this.$settings.Host+"/cart/course/",{
          headers:{
            // 注意下方的空格!!!
            "Authorization":"jwt " + this.token
          }
        }).then(response=>{

          this.courseData = response.data;
          // 更新在vuex里面的数据
          this.$store.state.cart.count = response.data.length;

          // 调整因为ajax数据请求导致勾选状态人没有出现的原因,使用定时器进行延时调用
          setTimeout(()=>{
            let expire_data = [];
            this.courseData.forEach(course=>{
              course.expire_list.forEach(row=>{
                expire_data[row.timer] = row.title;
              });
            });

            // row 就是字典数据[json]
            this.courseData.forEach(row => {
              // 设置商品课程的选中状态
              if(row.is_select){
                this.$refs.multipleTable.toggleRowSelection(row);
              }
              // 调整有效期选项中数值变成文本内容
              row.expire = expire_data[row.expire];

            });
          },0)

        }).catch(error=>{
          let status = error.response.status;
          if( status == 401 ){
            this.token = null;
            sessionStorage.removeItem("token");
            localStorage.removeItem("token");
            let _this = this;
            this.$alert("您尚未登录或登录超时!请重新登录","警告",{
              callback(){
                _this.$router.push("/login");
              }
            });
          }
        })

      }
    },
    methods:{
      getTotalPrice(){
        // 核算购物车中所有勾选商品的总价格
        let total = 0;
        this.selection.forEach(row=>{
          total += row.price;
        });
        // 保留2个小数位
        this.total_price = total.toFixed(2);
      },
      CartDel(course,course_name){
        this.$confirm(`您确定要从购物车删除<<${course_name}>>这个课程么?`,"提示!").then(()=>{
          let course_id = course.id;
          // 发送请求
          this.$axios.delete(this.$settings.Host+"/cart/course/",{
            params:{
              course_id:course_id,
            },
            headers:{
              // 注意下方的空格!!!
              "Authorization":"jwt " + this.token
            },
          }).then(response=>{
            let index = this.courseData.indexOf(course);
            this.courseData.splice(index,1);
            this.$message("删除成功!");

          }).catch(error=>{
            console.log(error.response);
          });

        }).catch(()=>{
          // 取消操作

        });
      },
      currentSelected(selection,row){
        // selection 表示所有被勾选的信息
        // row 当前操作的数据
        let is_select = true;
        if( selection.indexOf(row) == -1 ){
          is_select = false;
        }

        // 获取当前课程ID
        let course_id = row.id;
        // 切换勾选状态

        // 发送请求
        this.$axios.put(this.$settings.Host+"/cart/course/",{
          course_id: course_id,
          is_select: is_select,
        },{
          headers:{
            // 注意下方的空格!!!
            "Authorization":"jwt " + this.token
          },
        }).then(response=>{

          this.$message(response.data.message,"提示");
        }).catch(error=>{

          console.log(error.response)
        })
      },
      // 更新课程的有效期
      ChangeExpire(course){
        // 获取课程ID和有效期
        let course_id = course.id;
        let expire    = course.expire;

        // 发送patch请求更新有效期
        this.$axios.patch(this.$settings.Host+"/cart/course/",{
          course_id,
          expire,  // 这里是简写,相当于 expire:expire,
        },{
          headers:{
            // 注意下方的空格!!!
            "Authorization":"jwt " + this.token
          },
        }).then(response=>{
          // 更新购买的商品课程的价格
          course.price = response.data.price;
          // 重新计算购物车中的商品总价
          this.getTotalPrice();
          this.$message(response.data.message,"提示");
        });
      },
      // 获取勾选过的商品课程列表
      SelectionChange(data){
        this.selection = data;
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
