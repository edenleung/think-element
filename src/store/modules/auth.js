import { ruleList, ruleDelete, addRule, editRule } from '@/api/auth/rule'
import { groupList, groupDelete, addGroup, editGroup } from '@/api/auth/group'
import { addUser, getUserList, saveUser, deleteUser } from '@/api/auth/user'

const auth = {
  state: {
    rules: [],
    groups: [],
    groups_tree: []
  },

  mutations: {
    SET_RULES: (state, data) => {
      state.rules = data
    },
    SET_GROUPS: (state, data) => {
      state.groups = data
    },
    SET_GROUPS_TREE: (state, data) => {
      state.groups_tree = data
    }
  },

  actions: {
    fetchRules({ commit }) {
      return new Promise((resolve, reject) => {
        ruleList().then(res => {
          const data = res.data
          commit('SET_RULES', data)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    deleteRule(state, id) {
      return new Promise((resolve, reject) => {
        ruleDelete(id).then(() => {
          resolve()
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

    editRule(state, params) {
      return new Promise((resolve, reject) => {
        editRule(params).then(() => {
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    fetchGroup({ commit }) {
      return new Promise((resolve, reject) => {
        groupList().then(res => {
          const data = res.data
          commit('SET_GROUPS', data.groups)
          commit('SET_GROUPS_TREE', data.rules)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    deleteGroup(state, id) {
      return new Promise((resolve, reject) => {
        groupDelete(id).then(() => {
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    addGroup(state, params) {
      return new Promise((resolve, reject) => {
        addGroup(params).then(() => {
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    editGroup(state, params) {
      return new Promise((resolve, reject) => {
        editGroup(params).then(() => {
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    fetchGroups({ commit }) {
      return new Promise((resolve, reject) => {
        groupList().then(res => {
          const data = res.data
          commit('SET_GROUPS', data.groups)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    handleAddUser(state, params) {
      return new Promise((resolve, reject) => {
        addUser(params).then(res => {
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    handleSaveUser(state, params) {
      return new Promise((resolve, reject) => {
        saveUser(params).then(res => {
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    handleDeleteUser(state, params) {
      return new Promise((resolve, reject) => {
        deleteUser(params).then(res => {
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    fetchUserList(state) {
      return new Promise((resolve, reject) => {
        getUserList().then(res => {
          resolve(res.data)
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

export default auth
