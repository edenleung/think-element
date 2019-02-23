<template>
  <div class="user">
    <el-dialog :visible.sync="dialog" title="提示" width="30%">
      <el-form ref="accountForm" :model="data" :rules="rules" label-width="100px">
        <el-form-item label="登录名称" prop="admin_user">
          <el-input v-model="data.admin_user" />
        </el-form-item>

        <el-form-item label="用户昵称" prop="admin_nickname">
          <el-input v-model="data.admin_nickname" />
        </el-form-item>

        <el-form-item label="登录密码" prop="admin_password">
          <el-input v-model="data.admin_password" type="password" />
        </el-form-item>

        <el-form-item label="账户状态" prop="admin_status">
          <el-radio-group v-model="data.admin_status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm('accountForm')">重置</el-button>
        <el-button type="primary" @click="submitForm('accountForm')">确 定</el-button>
      </span>
    </el-dialog>
    <el-button @click="dialog = true">添加</el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      data: {
        admin_user: '',
        admin_nickname: '',
        admin_password: '',
        admin_status: 1
      },
      rules: {
        admin_user: [{ required: true, message: '必须', trigger: 'blur' }],
        admin_nickname: [{ required: true, message: '必须', trigger: 'blur' }],
        admin_password: [{ required: true, message: '必须', trigger: 'blur' }],
        admin_status: [{ required: true, message: '必须', trigger: 'change' }]
      },

      dialog: false,
      select: false
    }
  },
  methods: {
    changes(e) {
      console.log(e)
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
      this.$store.dispatch('saveUser', this.data).then(() => {
      })
    }
  }
}
</script>
