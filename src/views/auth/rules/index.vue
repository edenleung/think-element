<template>
  <div v-loading="loading" class="rule">
    <el-dialog :visible.sync="dialogVisible" title="详情" width="400px" @close="dislogClose">
      <el-form
        v-loading="!tableData"
        ref="form"
        :model="formData"
        :rules="rules"
        status-icon
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="父级" prop="pid">
          <el-select v-model="formData.pid" placeholder="请选择活动区域">
            <el-option :value="0" label="顶级分类" />
            <el-option
              v-for="item in tableData"
              :label="item.title"
              :value="item.id"
              :key="item.id"
              v-html="item.cname"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="名称" prop="title">
          <el-input v-model="formData.title" type="text" placeholder="标题" auto-complete="off" />
        </el-form-item>
        <el-form-item label="规则" prop="name">
          <el-input v-model="formData.name" type="text" placeholder="规则" auto-complete="off" />
        </el-form-item>
        <el-form-item label="菜单路由" prop="role">
          <el-input v-model="formData.role" type="text" placeholder="菜单路由" auto-complete="off" />
        </el-form-item>
        <el-form-item label="启用">
          <el-switch v-model="formData.status" />
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('form')">确 定</el-button>
      </div>
    </el-dialog>

    <el-row style="margin-bottom:15px">
      <el-button-group>
        <el-button v-permission="['auth-rule-add']" type="primary" @click="dialogVisible= true">添加</el-button>
      </el-button-group>
    </el-row>
    <el-table :data="tableData" style="width: 100%" stripe>
      <el-table-column label="名称">
        <template slot-scope="scope">
          <p v-html="scope.row.cname" />
        </template>
      </el-table-column>

      <el-table-column prop="name" label="规则">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.name }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="菜单路由">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.role }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="状态">
        <template slot-scope="scope">
          <template v-if="scope.row.status">
            <el-tag type="success">使用中</el-tag>
          </template>

          <template v-else>
            <el-tag type="danger">已禁用</el-tag>
          </template>
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button v-permission="['auth-rule-update']" type="text" size="small" @click="handleClick(scope.row)">编辑</el-button>
          <el-button v-permission="['auth-rule-delete']" type="text" size="small" @click="handleDelete(scope.row)">删除</el-button>
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
      dialogVisible: false,
      formData: {
        pid: 0,
        title: '',
        name: '',
        status: true,
        role: ''
      },
      rules: {
        pid: { required: true, message: '父级必须', trigger: 'change' },
        title: { required: true, message: '名称必须', trigger: 'blur' },
        name: { required: true, message: '规则必须', trigger: 'blur' },
        role: { required: true, message: '菜单路由必须', trigger: 'blur' }
      },
      selected: false
    }
  },
  computed: {
    tableData() {
      return this.$store.state.auth.rules
    }
  },
  created() {
    this.fetch()
  },
  methods: {
    fetch() {
      this.loading = true
      this.$store.dispatch('fetchRules').then(() => {
        this.loading = false
      })
    },

    handleClick(row) {
      let status = false
      if (row.status) {
        status = true
      }

      this.formData = {
        id: row.id,
        pid: row.pid,
        title: row.title,
        name: row.name,
        status: status,
        role: row.role
      }

      this.dialogVisible = true
      this.selected = true
    },

    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.doSubmit()
        } else {
          return false
        }
      })
    },

    doSubmit() {
      const action = this.selected ? 'editRule' : 'addRule'
      this.$store.dispatch(action, this.formData).then(() => {
        this.closeDialog()
        this.fetch()
      })
    },

    closeDialog() {
      this.dialogVisible = false
    },

    handleDelete(row) {
      this.$confirm('此操作将删除该规则, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$store.dispatch('deleteRule', row.id).then(() => {
            this.fetch()
          })
        })
        .catch(() => {})
    },

    dislogClose() {
      this.$refs['form'].resetFields()
      this.selected = false
    }
  }
}
</script>
