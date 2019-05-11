import { fetchRule, addRule, updateRule, deleteRule, fetchTree } from '@/api/auth/rule'
import { fetchRole, addRole, updateRole, deleteRole } from '@/api/auth/role'
import { fetchUser, addUser, updateUser, deleteUser } from '@/api/auth/user'

const auth = {
  state: {
  },

  mutations: {
  },

  actions: {
    fetchTree() {
      return new Promise((resolve, reject) => {
        fetchTree().then(res => {
          const data = res.data
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    },

    fetchRule(state, params) {
      return new Promise((resolve, reject) => {
        fetchRule(params).then(res => {
          const data = res.data
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    },

    addRule(state, params) {
      return new Promise((resolve, reject) => {
        addRule(params).then(() => {
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    updateRule(state, data) {
      const id = data.selectId
      delete data.selectId
      return new Promise((resolve, reject) => {
        updateRule(id, data).then(() => {
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    deleteRule(state, params) {
      return new Promise((resolve, reject) => {
        deleteRule(params).then(() => {
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    fetchRole({ commit }, params) {
      return new Promise((resolve, reject) => {
        fetchRole(params).then(res => {
          const data = res.data
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    },

    addRole(state, params) {
      return new Promise((resolve, reject) => {
        addRole(params).then(() => {
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    updateRole(state, data) {
      const id = data.selectId
      delete data.selectId
      return new Promise((resolve, reject) => {
        updateRole(id, data).then(() => {
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    deleteRole(state, params) {
      return new Promise((resolve, reject) => {
        deleteRole(params).then(() => {
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    fetchUser(state, params) {
      return new Promise((resolve, reject) => {
        fetchUser(params).then(res => {
          resolve(res.data)
        }).catch(error => {
          reject(error)
        })
      })
    },

    addUser(state, data) {
      return new Promise((resolve, reject) => {
        addUser(data).then(res => {
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    updateUser(state, data) {
      const id = data.selectId
      delete data.selectId
      return new Promise((resolve, reject) => {
        updateUser(id, data).then(res => {
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    deleteUser(state, params) {
      return new Promise((resolve, reject) => {
        deleteUser(params).then(res => {
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

export default auth
