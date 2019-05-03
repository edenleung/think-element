<template>
  <section class="role">
    <el-dialog :visible.sync="visible" title="详情" width="520px" @close="dislogClose">
      <el-form
        ref="form"
        :model="form"
        status-icon
        label-width="100px"
      >
        <el-form-item
          :rules="[
            { required: true, message: '请输入唯一标识!', trigger: 'blur' }
          ]"
          label="唯一标识"
          prop="name">
          <el-input v-model="form.name" type="text" placeholder="请入唯一标识（英文即可）" auto-complete="off" />
        </el-form-item>

        <el-form-item
          :rules="[
            { required: true, message: '请输入角色名称!', trigger: 'blur' }
          ]"
          label="角色名称"
          prop="title">
          <el-input v-model="form.title" type="text" placeholder="请入角色名称" auto-complete="off" />
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择" style="width:100%">
            <el-option :value="1" label="正常" />
            <el-option :value="0" label="关闭" />
          </el-select>
        </el-form-item>

        <el-form-item label="拥有权限" style="margin-bottom:0"/>
        <el-row v-for="(item, index) in rules" :key="index" style="margin-left:32px;min-height:39px;display:flex;align-items: center;">
          <el-col :span="4">{{ item.title }}</el-col>
          <el-col :span="20">
            <el-checkbox-group v-model="checkedList">
              <el-checkbox v-for="(action, index) in item.action" :label="action.id" :key="index">{{ action.title }}</el-checkbox>
            </el-checkbox-group>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dislogClose">取 消</el-button>
        <el-button type="primary" @click="submitForm('form')">确 定</el-button>
      </div>
    </el-dialog>

    <el-card>
      <el-row class="tools">
        <el-button v-action:add type="primary" plain @click="visible = true">添加</el-button>
      </el-row>
      <el-table v-loading="loading" :data="data" style="width: 100%" stripe>
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-row>
              <el-col v-for="(item, index) in rules" :key="index" :span="12" class="rule-list">
                <el-row>
                  <el-col :span="4">{{ item.title }}：</el-col>
                  <el-col :span="20">
                    <template v-for="(action, i) in item.action">
                      <el-tag v-if="props.row.rules.split(',').indexOf(action.id.toString()) !== -1" :key="i" size="small">
                        {{ action.title }}
                      </el-tag>
                    </template>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>

        <el-table-column prop="name" label="唯一识别码" />
        <el-table-column prop="title" label="角色名称" />

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
            <el-button v-action:update size="small" type="primary" @click="handleClick(scope.row)">编辑</el-button>
            <el-button v-action:delete size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
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
      data: [],
      rules: [],
      checkedList: [],
      form: {
        title: '',
        name: '',
        status: 1
      },
      selected: 0
    }
  },
  mounted() {
    this.fetch()
  },
  methods: {
    ...mapActions([
      'fetchRole',
      'deleteRole'
    ]),
    fetch() {
      this.loading = true
      this.fetchRole().then((res) => {
        this.data = res.roles
        this.rules = res.rules
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
      const action = this.selected === 0 ? 'addRole' : 'updateRole'

      const data = { ...this.form }
      data.selectId = this.selected

      data.rules = this.checkedList

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
    closeDialog() {
      this.visible = false
    },
    handleClick(row) {
      this.form = {
        id: row.id,
        title: row.title,
        status: row.status,
        name: row.name
      }

      this.checkedList = row.rules.split(',').map(item => parseInt(item))

      this.visible = true
      this.selected = row.id
    },
    handleDelete(row) {
      this.$confirm('此操作将删除该分组, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.deleteRole({ id: row.id }).then(() => {
            this.visible = false
            this.fetch()
          })
        })
    },
    dislogClose() {
      this.selected = 0
      this.$refs['form'].resetFields()
      this.checkedList = []
      this.visible = false
    }
  }
}
</script>
