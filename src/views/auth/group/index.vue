<template>
  <div v-loading="loading" class="group">
    <el-dialog :visible.sync="dialogVisible" title="详情" width="400px" @close="dislogClose">
      <el-form
        ref="form"
        :model="formData"
        :rules="rules"
        status-icon
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="分组名称" prop="title">
          <el-input v-model="formData.title" type="text" placeholder="标题" auto-complete="off" />
        </el-form-item>
        <el-form-item label="选择规则" prop="rules">
          <el-tree ref="tree" :data="rulesOrigin" class="tree" show-checkbox node-key="id" />
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
        <el-button type="primary" icon="el-icon-plus" @click="dialogVisible = true">添加</el-button>
      </el-button-group>
    </el-row>
    <el-table v-loading="!tableData" :data="tableData" style="width: 100%" stripe border>
      <el-table-column label="名称">
        <template slot-scope="scope">
          <p v-html="scope.row.title" />
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
          <el-button size="small" type="text" @click="handleClick(scope.row)">编辑</el-button>
          <el-button size="small" type="text" @click="handleDelete(scope.row)">删除</el-button>
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
      defaultKeys: [],
      formData: {
        title: '',
        rules: [],
        status: true
      },
      rules: {
        title: { required: true, message: '分组必须', trigger: 'blur' },
        rules: { required: false, message: '请选择权限', trigger: 'change' }
      },
      selected: false
    }
  },
  computed: {
    rulesOrigin() {
      return this.$store.state.auth.groups_tree
    },
    tableData() {
      return this.$store.state.auth.groups
    }
  },
  created() {
    this.fetch()
  },
  methods: {
    fetch() {
      this.loading = true
      this.$store.dispatch('fetchGroup').then(() => {
        this.loading = false
      })
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
      var rules = []
      const action = this.selected ? 'editGroup' : 'addGroup'
      for (var i in this.$refs.tree.getCheckedNodes()) {
        rules.push(this.$refs.tree.getCheckedNodes()[i].id)
      }
      this.formData.rules = rules
      this.$store.dispatch(action, this.formData).then(() => {
        this.closeDialog()
        this.fetch()
      })
    },
    closeDialog() {
      this.dialogVisible = false
    },
    handleClick(row) {
      let status = false
      if (row.status) {
        status = true
      }
      this.formData = {
        id: row.id,
        title: row.title,
        status: status
      }
      this.dialogVisible = true
      this.selected = true
      setTimeout(() => {
        this.$refs.tree.setCheckedKeys(row.rules.split(','))
      }, 1)
    },
    handleDelete(row) {
      this.$confirm('此操作将删除该分组, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$store.dispatch('deleteGroup', row.id).then(() => {
            this.dialogVisible = false
            this.fetch()
          })
        })
        .catch(() => {})
    },
    dislogClose() {
      this.selected = false
      this.$refs.tree.setCheckedKeys([])
      this.formData = {}
    }
  }
}
</script>
