<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
           <el-input clearable placeholder="请输入内容" v-model='queryInfo.query'>
            <el-button @click="getUserList" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button @click="addDialogVisible = true" type="primary">添加用户</el-button>
        </el-col>
      </el-row>
        <el-table
          stripe
          :data="userList"
          style="width: 100%">
          <el-table-column
            type="index"
            label="#"
            width="50">
          </el-table-column>
          <el-table-column
            prop="username"
            label="姓名"
            width="180">
          </el-table-column>
          <el-table-column
            prop="department"
            label="部门"
            width="180">
          </el-table-column>
          <el-table-column
            prop="age"
            label="年龄">
          </el-table-column>
          <el-table-column
            prop="tel"
            label="电话">
          </el-table-column>
          <el-table-column
            prop="role"
            label="权限">
          </el-table-column>
          <el-table-column
            width="100"
            label="状态">
            <template slot-scope="scope">
              <el-switch
                @change="userStateChange(scope.row.username)"
                v-model="scope.row.status"
                :active-value="1"
                :inactive-value="0">
              </el-switch>
            </template>
          </el-table-column>
           <el-table-column
            width="200"
            label="操作">
            <template slot-scope="scope">
              <el-tooltip :enterable='false' content="编辑信息" placement="top" effect="dark">
                <el-button @click="showEditDialog(scope.row)" size="mini" type="primary" icon="el-icon-edit" circle></el-button>
              </el-tooltip>
              <el-tooltip :enterable='false' content="删除" placement="top" effect="dark">
                <el-button @click="removeUserById(scope.row.username)" size="mini" type="danger" icon="el-icon-delete" circle></el-button>
              </el-tooltip>
              <el-tooltip :enterable='false' content="分配角色" placement="top" effect="dark">
                <el-button size="mini" type="warning" icon="el-icon-setting" circle></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
         <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[1, 2, 5, 10]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
    </el-card>

    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%">
      <!-- 内容主体区域 -->
      <el-form status-icon :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="部门" prop="department">
          <el-input v-model="addForm.department"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="tel">
          <el-input v-model="addForm.tel"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="修改"
      :visible.sync="editDialogVisible"
      width="50%">
      <!-- 内容主体区域 -->
      <el-form status-icon :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input disabled v-model="editForm.username"></el-input>
        </el-form-item>
        <el-form-item label="部门" prop="department">
          <el-input v-model="editForm.department"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="tel">
          <el-input v-model="editForm.tel"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editFormDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    var checkTel = (rule, value, callback) => {
      const regTel = /^(175)[0-9]{8}$/
      if (regTel.test(value)) {
        return callback()
      }
      callback(new Error('手机号必须是175开头的！'))
    }
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      addForm: {
        username: '',
        department: '',
        password: '',
        tel: ''
      },
      addFormRules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          }, {
            min: 3,
            max: 10,
            message: '用户名的长度在3-10个字符之间',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          }, {
            min: 6,
            max: 15,
            message: '密码的长度在6-15个字符之间',
            trigger: 'blur'
          }
        ],
        department: [
          {
            required: true,
            message: '请输入部门',
            trigger: 'blur'
          }
        ],
        tel: [
          {
            validator: checkTel,
            trigger: 'blur'
          }, {

          }
        ]
      },
      userList: [],
      total: 0,
      addDialogVisible: false,
      editDialogVisible: false,
      editForm: {
        username: '',
        department: '',
        tel: ''
      },
      editFormRules: {
        department: [
          { required: true, message: '请输入部门信息', trigger: 'blur' }
        ],
        tel: [
          { required: true, message: '请输入联系信息', trigger: 'blur' },
          { validator: checkTel, trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getUserList()
  },
  watch: {
    addDialogVisible (val, oldVal) {
      console.log(1)
      if (oldVal === true && val === false) return this.$refs.addFormRef.resetFields()
    }
  },
  methods: {
    async getUserList () {
      const { data: res } = await this.$http.get('getUser', { params: this.queryInfo })
      if (res.code !== 200) return this.$message.err('获取用户列表失败')
      this.userList = res.data
      this.total = this.userList.length
    },
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
    },
    userStateChange (row) {
      const { data: res } = this.$http.put(`user/${row.username}/status/${row.status}`)
      if (res.meta.status !== 200) {
        if (row.status === 1) row.status = 0
        row.status = 1
        return this.$message.error('更新用户失败')
      }
      this.$message.success('更新用户成功')
    },
    addUser () {
      this.$refs.addFormRef.validate(valid => {
        if (!valid) return
        this.$message.success('添加用户成功')
        this.addDialogVisible = false
      })
    },
    showEditDialog (row) {
      this.editDialogVisible = true
      this.editForm.username = row.username
      this.editForm.department = row.department
      this.editForm.tel = row.tel
    },
    editUser () {
      this.$refs.editFormRef.validate(valid => {
        if (!valid) return
        this.editDialogVisible = false
        this.$message.success('ok了')
      })
    },
    async removeUserById (username) {
      const confirmResult = await this.$confirm('确定删除用户信息', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      this.$message.success('删除成功')
      this.getUserList()
    }
  }
}
</script>

<style lang='less' scoped>

</style>
