<template>
    <div class="cart">
      <Header/>
      <div class="main">
        <div class="cart-title">
          <h3>我的购物车 <span> 共{{$store.state.cart.count}}门课程</span></h3>
        </div>
        <div class="cart-info">
          <el-table
            :data="courseData"
            style="width:100%"
            ref="multipleTable"
            @select="currentSelected"
          >
            <el-table-column type="selection" width="87"></el-table-column>
            <el-table-column label="课程" width="540">
              <template slot-scope="scope">
                <div class="course-box">
                  <img :src="$settings.Host + scope.row.course_img" alt="">
                  {{scope.row.name}}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="有效期" width="216">
              <template slot-scope="scope">
                  <el-select @change="ChangeExpire(scope.row)" v-model="scope.row.expire" placeholder="请选择">
                  <el-option v-for="item in expire_list" :key="item.id" :label="item.title" :value="item.id"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="单价" width="162">
              <template slot-scope="scope">¥{{ scope.row.price.toFixed(2) }}</template>
            </el-table-column>
            <el-table-column label="操作" width="162">
              <template slot-scope="scope">
                <a @click="CartDel(scope.row.id,scope.row.name)">删除</a>
              </template>
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
            {title:"永久有效",id:-1},
        ],
        courseData:[{"id":7,"expire":"-1","course_img":"/media/course/1544059695_pYyn2Ad.jpeg","name":"jvm虚拟机","price":320.0,"is_select":true},{"id":5,"expire":"-1","course_img":"/media/course/3_XdhvMXb.png","name":"docker入门","price":666.0,"is_select":true},{"id":3,"expire":"-1","course_img":"/media/course/1.png","name":"django框架","price":1995.0,"is_select":true},{"id":4,"expire":"3","course_img":"/media/course/3.png","name":"Linux项目部署","price":500.0,"is_select":false}]
      }
    },
    mounted(){
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

          // 在获取到数据以后,对选中数据设置选中效果
          setTimeout(()=>{
            let text_expire_list = [];
            for(let i=0;i<this.expire_list.length;i++){
              text_expire_list[this.expire_list[i].id] = this.expire_list[i].title;
            }
            console.log(text_expire_list);
            for(let i = 0;i<this.courseData.length;i++){
              // 设置选中效果
              this.$refs.multipleTable.toggleRowSelection(this.courseData[i],this.courseData[i].is_select);
              // 修改有效期的显示值
              this.courseData[i].expire = text_expire_list[this.courseData[i].expire];
            }
          },0);

        })

      }
    },
    methods:{
      CartDel(course_id,course_name){
        this.$confirm(`您确定要从购物车删除<<${course_name}>>这个课程么?`,"提示!").then(()=>{
          this.$message("删除成功!");

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
        let expire    = course.expire
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
          this.$message(response.data.message,"提示");
        });
      },
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
