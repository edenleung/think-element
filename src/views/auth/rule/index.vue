<template>
  <section class="rule">
    <el-dialog :visible.sync="visible" title="详情" width="400px" @close="dislogClose">
      <el-form
        v-loading="loading"
        ref="form"
        :model="form"
        :rules="rules"
        status-icon
        label-width="100px"
      >
        <el-form-item label="唯一识别码" prop="role">
          <el-input v-model="form.role" type="text" placeholder="前端路由菜单识别码" auto-complete="off" />
        </el-form-item>
        <el-form-item label="权限名称" prop="title">
          <el-input v-model="form.title" type="text" placeholder="权限名称" auto-complete="off" />
        </el-form-item>
        <el-form-item label="权限规则" prop="name">
          <el-input v-model="form.name" type="text" placeholder="模块/控制器/方法" auto-complete="off" />
        </el-form-item>

        <el-form-item label="所属组别" prop="pid">
          <el-select v-model="form.pid" placeholder="请选择所属组别" style="width:100%">
            <el-option :value="0" label="顶级分类" />
            <el-option
              v-for="item in tree"
              :label="item.title"
              :value="item.id"
              :key="item.id"
              v-html="item.cname"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择" style="width:100%">
            <el-option :value="1" label="正常" />
            <el-option :value="0" label="关闭" />
          </el-select>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>

    <el-card shadow="never">
      <el-row style="margin-bottom:15px">
        <el-button v-action:add type="primary" plain @click="visible= true">添加</el-button>
      </el-row>

      <el-table v-loading="loading" :data="data" style="width: 100%" stripe>
        <el-table-column prop="permissionId" label="唯一识别码" />
        <el-table-column prop="title" label="权限名称" />

        <el-table-column label="可操作权限">
          <template slot-scope="scope">
            <div class="actions">
              <template v-for="(action, index) in scope.row.action">
                <el-popover
                  :key="index"
                  :ref="'popover_' + action.id"
                  trigger="click"
                  title="详情"
                  @show="onShowPopover(action.id)"
                >
                  <div style="margin-bottom:15px">唯一识别码: {{ action.role }}</div>

                  <div style="text-align: right; margin: 0">
                    <el-button type="primary" v-action:update size="mini" @click="openModal(action)">编辑</el-button>
                    <el-button type="danger" v-action:delete size="mini" style="margin-left:0" @click="handleDelete(action)">删除</el-button>
                  </div>

                  <el-tag slot="reference">{{ action.title }}</el-tag>
                </el-popover>
              </template>
            </div>
          </template>
        </el-table-column>

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
            <el-button v-action:update type="primary" size="small" @click="openModal(scope.row)">编辑</el-button>
            <el-button v-action:delete type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

  </section>
</template>
<script>
import { mapActions } from 'vuex'

export default {
  data() {
    return {
      loading: false,
      confirmLoading: false,
      visible: false,
      tree: [],
      data: [],
      form: {
        pid: 0,
        title: '',
        name: '',
        status: 1,
        role: ''
      },
      rules: {
        pid: { required: true, message: '请选择所属组别!', trigger: 'change' },
        title: { required: true, message: '请输入权限名称!', trigger: 'blur' },
        name: { required: true, message: '请输入权限规则!', trigger: 'blur' },
        role: { required: true, message: '请输入唯一识别码!', trigger: 'blur' }
      },
      selected: 0
    }
  },
  mounted() {
    this.fetch()
    this.fetchTree().then(res => {
      this.tree = res
    })
  },
  methods: {
    ...mapActions([
      'fetchRule',
      'fetchTree',
      'deleteRule'
    ]),
    fetch() {
      this.loading = true
      this.fetchRule().then((res) => {
        this.data = res
        this.loading = false
      })
    },
    openModal(row) {
      this.form = {
        title: row.title,
        name: row.name,
        role: row.role,
        pid: row.pid,
        status: row.status
      }
      this.selected = row.id
      this.visible = true
    },
    onShowPopover(id) {
      this.data.map(item => {
        item.action.map(action => {
          if (id !== action.id) {
            this.$refs[`popover_${action.id}`][0].doClose()
          }
        })
      })
    },
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.doSubmit()
        } else {
          return false
        }
      })
    },

    doSubmit() {
      const action = this.selected === 0 ? 'addRule' : 'updateRule'
      const data = { ...this.form }
      data.selectId = this.selected
      this.$store.dispatch(action, data).then(() => {
        this.$notify({
          title: '成功通知',
          message: this.selected === 0 ? '添加成功！' : '更新成功！',
          type: 'success'
        })
        this.closeDialog()
        this.fetch()
      })
    },

    closeDialog() {
      this.visible = false
      this.selected = 0
    },

    handleDelete(row) {
      this.$confirm('确定删除此规则吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.deleteRule({ id: row.id }).then(() => {
            this.$notify({
              title: '成功通知',
              message: '删除成功！',
              type: 'success'
            })
            this.fetch()
          })
        })
    },

    dislogClose() {
      this.$refs['form'].resetFields()
      this.selected = 0
    }
  }
}
</script>

<style lang="sass">
.actions
  .el-tag
    margin-right: 8px
</style>
