<template>
  <el-container>
  <el-header>
    <div>
      <img src="../assets/faw-vw-white.png" alt="logo"/>
      <img id='yearsLogo' src="../assets/30years.png" alt="logo"/>
      <span>一汽-大众销售数据平台管理系统</span>
    </div>
    <el-button @click="logOut" type='info'>退出</el-button>
  </el-header>
  <el-container>
    <el-aside :width="isCollapse ? '64px' : '200px' ">
      <div class='toggle-button' @click='toggleMenu'>|||</div>
      <el-menu
      :collapse='isCollapse'
      :collapse-transition='false'
      :unique-opened='true'
      :router='true'
      :default-active='activePath'
      background-color="rgb(88, 89, 91)"
      text-color="#fff"
      active-text-color="rgb(0, 130, 214)">
        <!-- 一级菜单 -->
        <el-submenu :index="item.path+''" v-for="item in menuList" :key="item.id">
          <!-- 一级菜单的模板区 -->
          <template slot="title">
            <i :class="item.icon"></i>
            <span>{{item.authName}}</span>
          </template>
          <!-- 二级菜单 -->
          <el-menu-item @click="saveNavState(subItem.path)" :index="subItem.path+''" v-for="subItem in item.children" :key="subItem.id">
            <!-- 二级菜单的模板区 -->
            <template slot="title">
              <i :class="subItem.icon"></i>
              <span>{{subItem.authName}}</span>
            </template>
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </el-aside>
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</el-container>
</template>

<script>
export default {
  data () {
    return {
      menuList: [],
      isCollapse: false,
      activePath: ''
    }
  },
  created () {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logOut () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList () {
      const { data: res } = await this.$http.get('menus')
      if (res.code !== 200) return this.$message.error(res.message)
      this.menuList = res.data
    },
    toggleMenu () {
      this.isCollapse = !this.isCollapse
    },
    saveNavState (activePath) {
      this.activePath = activePath
      window.sessionStorage.setItem('activePath', activePath)
    }
  }
}

</script>

<style lang="less" scoped>
.el-container{
  height:100% !important
}
.el-header{
  background-color: rgb(0, 30, 80);
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div{
    display: flex;
    align-items: center;
    img{
      height: 48px;
    }
    #yearsLogo{
      height: 50px;
      margin-left: 10px;
      box-shadow: 0 0 10px rgb(182, 191, 197);
    }
    span{
      margin-left: 45px
    }
  }
}
.el-aside{
  background-color: rgb(88, 89, 91);
  .el-menu{
    border-right: none
  }
}
.el-main{
  background-color: rgb( 223, 228, 232);
}
.toggle-button{
  background-color: rgb(182, 191, 197);
  color:#fff;
  font-size: 10px;
  line-height: 24px;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
