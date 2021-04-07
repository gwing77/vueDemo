<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table striped border :data="roleList">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row :class="['bdbottom', index===0 ? 'bdtop': '']" v-for="(item, index) in scope.row.children" :key="item.id">
              <el-col :span="5">
                <el-tag closable @close="removeRightById(item.id)">
                  {{ item.authName }}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row :class="[index1===0 ? '': 'bdtop']" v-for="(item1, index1) in item.children" :key="item1.id">
                <el-col :span="6">
                   <el-tag type="success" closable @close="removeRightById(item1.id)">
                    {{ item1.authName }}
                  </el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <el-col :span="18">
                  <el-row :class="[index2===0 ? '': 'bdtop']" v-for="(item2, index2) in item1.children" :key="item2.id">
                    <el-col>
                      <el-tag type="warning" closable @close="removeRightById(item2.id)">
                        {{ item2.authName }}
                      </el-tag>
                    </el-col>
                    </el-row>
                </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
            <el-button @click="showSetDialogTree(scope.row)" size="mini" type="warning" icon="el-icon-setting">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog
      title="分配权限"
      :visible.sync="showSetDialog"
      width="50%" @close="setDialogClose">
      <el-tree ref="treeRef" :default-checked-keys="defaultCheckedKeys" default-expand-all node-key="id" :data="rightsList" :props="treeProps" show-checkbox></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showSetDialog = false">取 消</el-button>
        <el-button type="primary" @click="setRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      roleList: [],
      showSetDialog: false,
      rightsList: [],
      treeProps: {
        children: 'children',
        label: 'authName'
      },
      defaultCheckedKeys: []
    }
  },
  created () {
    this.getAllRoles()
  },
  methods: {
    async getAllRoles () {
      const { data: res } = await this.$http.get('role')
      if (res === null) return this.$message.error('获取权限列表失败！')
      this.roleList = [...res.data]
    },
    async removeRightById (id) {
      const result = await this.$confirm('是否确认移除权限？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (result !== 'confirm') return this.$message.info('取消删除')
      this.$message.success(`确认删除id为${id}的权限`)
    },
    showSetDialogTree (role) {
      this.getLeafKeys(role, this.defaultCheckedKeys)
      this.showSetDialog = true
      this.rightsList = [...this.roleList[0].children, ...this.roleList[1].children]
    },
    getLeafKeys (node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getLeafKeys(item, arr)
      })
    },
    setDialogClose () {
      this.defaultCheckedKeys = []
    },
    setRights () {
      console.log([...this.$refs.treeRef.getCheckedKeys(), ...this.$refs.treeRef.getHalfCheckedKeys()])
      this.showSetDialog = false
    }
  }
}
</script>

<style lang='less' scoped>
.el-tag{
  margin: 10px
}
.bdtop{
  border-top: 1px solid #eee
}
.bdbottom{
  border-bottom: 1px solid #eee
}
.el-row{
  display: flex;
  align-items: center;
}
</style>
