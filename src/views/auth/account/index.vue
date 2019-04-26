<template>
  <div v-loading="loading" class="user">
    <el-dialog :visible.sync="dialog" :before-close="handleClose" title="提示" width="30%">
      <el-form ref="accountForm" :model="data" :rules="rules" label-width="100px">
        <el-form-item label="登录账号" prop="admin_user">
          <el-input v-model="data.admin_user" :readonly="selectd"/>
        </el-form-item>

        <el-form-item label="用户昵称" prop="admin_nickname">
          <el-input v-model="data.admin_nickname" />
        </el-form-item>

        <template v-if="!selectd">
          <el-form-item :rules="[{ required: true, message: '必须', trigger: 'blur' }]" label="登录密码" prop="admin_password">
            <el-input v-model="data.admin_password" type="password" />
          </el-form-item>
        </template>

        <el-form-item label="用户组别" prop="groups">
          <el-select v-model="data.groups" multiple placeholder="请选择">
            <el-option
              v-for="group in groups"
              :key="group.id"
              :label="group.title"
              :value="group.id" />
          </el-select>
        </el-form-item>

        <el-form-item label="账户状态" prop="admin_status">
          <el-radio-group v-model="data.admin_status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm()">重置</el-button>
        <el-button :loading="loading" type="primary" @click="submitForm('accountForm')">确 定</el-button>
      </span>
    </el-dialog>

    <el-button v-permission="['auth-account-add']" type="primary" @click="dialog = true" >添加</el-button>
    <el-row class="account-search">
      <el-form ref="form" :model="form" label-width="10px">
        <el-form-item >
          <el-input v-model="form.keyword" placeholder="搜索账号" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="fetch()">搜索</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-table v-loading="!tableData" :data="tableData" style="width: 100%" stripe>
      <el-table-column label="名称">
        <template slot-scope="scope">
          <p v-html="scope.row.admin_nickname" />
        </template>
      </el-table-column>

      <el-table-column label="登录账号">
        <template slot-scope="scope">
          <p v-html="scope.row.admin_nickname" />
        </template>
      </el-table-column>

      <el-table-column label="状态">
        <template slot-scope="scope">
          <template v-if="scope.row.admin_status">
            <el-tag type="success">使用中</el-tag>
          </template>

          <template v-else>
            <el-tag type="danger">已禁用</el-tag>
          </template>
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button v-permission="['auth-account-update']" size="small" type="text" @click="handleClick(scope.row)" >编辑</el-button>
          <el-button v-permission="['auth-account-delete']" size="small" type="text" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>

    </el-table>

  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      data: {
        admin_user: '',
        admin_nickname: '',
        admin_password: '',
        admin_status: 1,
        groups: []
      },
      rules: {
        admin_user: [{ required: true, message: '必须', trigger: 'blur' }],
        admin_nickname: [{ required: true, message: '必须', trigger: 'blur' }],
        admin_status: [{ required: true, message: '必须', trigger: 'change' }],
        groups: [{ required: true, message: '必须', trigger: 'change' }]
      },
      tableData: [],
      dialog: false,
      selectd: false,
      form: {
        keyword: ''
      }
    }
  },
  computed: {
    groups() {
      return this.$store.state.auth.groups
    }
  },
  mounted() {
    this.fetch()
    this.$store.dispatch('fetchGroups')
  },
  methods: {
    fetch() {
      this.loading = true
      this.$store.dispatch('fetchUserList').then(res => {
        this.loading = false
        this.tableData = res
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.submitSave()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    submitSave() {
      const temp = { ...this.data }
      temp.groups = temp.groups.join(',')

      const action = this.selectd ? 'handleSaveUser' : 'handleAddUser'
      this.loading = true
      this.$store.dispatch(action, temp).then(() => {
        this.closeDialog()
        this.fetch()
      }).catch(() => {
        this.closeDialog()
      })
    },
    resetForm() {
      this.$refs['accountForm'].resetFields()
    },
    closeDialog() {
      this.resetForm()
      this.loading = false
      this.dialog = false
    },
    handleClick(row) {
      this.selectd = true
      this.dialog = true
      delete row.admin_password
      delete row.create_time
      delete row.update_time
      row.groups = row.groups.split(',').map((v) => {
        return parseInt(v)
      })
      this.data = row
    },
    handleDelete(row) {
      this.$confirm('此操作将删除该用户吗, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$store.dispatch('handleDeleteUser', row.admin_id).then(() => {
            this.dialogVisible = false
            this.fetch()
          })
        })
        .catch(() => {})
    },
    handleClose(done) {
      this.selectd = false
      this.resetForm()
      done()
    }
  }
}
</script>

<style lang="sass">
.account-search
  margin-bottom: 15px
  display: flex
  justify-content: flex-end
  > div
    flex: 1
    color: red
    font-size: 20px
    text-align: center
  .el-form
    display: flex
    .el-form-item
      margin-bottom: 0
</style>

