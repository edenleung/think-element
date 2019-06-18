<template>
  <section class="user">
    <el-dialog :visible.sync="visible" title="提示" width="520px" @close="handleClose">
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item
          :rules="[
            { required: true, message: '请输入登录账号！', trigger: 'blur' }
          ]"
          label="登录账号"
          prop="admin_user">
          <el-input v-model="form.admin_user" :readonly="selected > 0"/>
        </el-form-item>

        <el-form-item
          :rules="[
            { required: selected === 0, message: '请输入登录密码!', trigger: 'blur' }
          ]"
          label="登录密码"
          prop="admin_password">
          <el-input v-model="form.admin_password" :placeholder="selected === 0 ? '请入登录密码' : '如需修改密码请输入新密码'" type="password" />
        </el-form-item>

        <el-form-item
          :rules="[
            { required: true, message: '请输入用户名称！', trigger: 'blur' }
          ]"
          label="用户昵称"
          prop="admin_nickname">
          <el-input v-model="form.admin_nickname" />
        </el-form-item>

        <el-form-item
          :rules="[
            { required: true, message: '请选择角色！', trigger: 'change' }
          ]"
          label="选择角色"
          prop="roles">
          <el-select v-model="form.roles" multiple placeholder="请选择" style="width:100%">
            <el-option
              v-for="(role, index) in roles"
              :key="index"
              :label="role.title"
              :value="role.id.toString()" />
          </el-select>
        </el-form-item>

        <el-form-item
          :rules="[
            { required: true, message: '请选择！', trigger: 'change' }
          ]"
          label="状态"
          prop="admin_status">
          <el-select v-model="form.admin_status" placeholder="请选择" style="width:100%">
            <el-option :value="1" label="正常" />
            <el-option :value="0" label="禁用" />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm()">重置</el-button>
        <el-button :loading="loading" type="primary" @click="submitForm('accountForm')">确 定</el-button>
      </span>
    </el-dialog>

    <el-card>
      <el-row class="tools">
        <el-button v-action:add type="primary" plain @click="visible = true">添加</el-button>
      </el-row>

      <el-table v-loading="loading" :data="data" style="width: 100%" stripe>
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-row>
              <el-col v-for="(item, index) in rules" :span="12" :key="index" class="rule-list">
                <el-row>
                  <el-col :span="4">{{ item.title }}：</el-col>
                  <el-col :span="20">
                    <template v-for="(action, i) in item.actions">
                      <el-tag v-if="props.row.rules.indexOf(action.id) !== -1" :key="i" size="small">
                        {{ action.title }}
                      </el-tag>
                    </template>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column prop="nickname" label="账号名" />
        <el-table-column prop="name" label="登录账号" />

        <el-table-column label="状态">
          <template slot-scope="scope">
            <template v-if="scope.row.status">
              正常
            </template>

            <template v-else>
              禁用
            </template>
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button v-action:update size="small" type="primary" @click="handleClick(scope.row)" >编辑</el-button>
            <el-button v-action:delete size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-row class="page-pagination">
        <el-pagination
          :hide-on-single-page="pagination.total === 1"
          :current-page="pagination.current"
          :page-size="pagination.pageSize"
          :total="pagination.total"
          background
          layout="prev, pager, next"
          @current-change="handleChangePage"/>
      </el-row>
    </el-card>
  </section>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  data() {
    return {
      loading: false,
      form: {
        admin_user: '',
        admin_nickname: '',
        admin_password: '',
        admin_status: 1,
        roles: []
      },
      rules: [],
      roles: [],
      data: [],
      visible: false,
      selectd: false,
      selected: 0,
      pagination: {}
    }
  },
  mounted() {
    this.fetch()
  },
  methods: {
    ...mapActions([
      'fetchUser',
      'deleteUser'
    ]),
    fetch(params = {}) {
      this.loading = true
      this.fetchUser(params).then(res => {
        const { roles, rules, users } = res
        this.loading = false
        this.data = users.data
        this.pagination = users.pagination
        this.rules = rules.data
        this.roles = roles.data
      })
    },
    handleChangePage(page) {
      this.fetch({
        page: page,
        pageSize: this.pagination.pageSize
      })
    },
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.submitSave()
        } else {
          return false
        }
      })
    },
    submitSave() {
      const data = { ...this.form }
      data.selectId = this.selected
      console.log(data.selectId)
      const action = this.selected === 0 ? 'addUser' : 'updateUser'
      this.confirmLoading = true
      this.$store.dispatch(action, data).then(() => {
        this.$notify({
          title: '成功通知',
          message: this.selected === 0 ? '添加成功！' : '更新成功！',
          type: 'success'
        })
        this.closeDialog()
        this.fetch()
      }).finally(() => {
        this.confirmLoading = false
      })
    },
    resetForm() {
      this.$refs['form'].resetFields()
    },
    closeDialog() {
      this.resetForm()
      this.visible = false
    },
    handleClick(row) {
      const selected = row.roles.map((item) => {
        return item.id.toString()
      })
      this.form = {
        admin_user: row.name,
        admin_nickname: row.nickname,
        admin_status: row.status,
        roles: selected
      }
      this.visible = true
      this.selected = row.id
    },
    handleDelete(row) {
      this.$confirm('此操作将删除该用户吗, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteUser({ id: row.admin_id }).then(() => {
          this.$notify({
            title: '成功通知',
            message: '删除成功！',
            type: 'success'
          })
          this.fetch()
        })
      })
    },
    handleClose() {
      this.selected = 0
      this.resetForm()
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

