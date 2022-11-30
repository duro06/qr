import { defineStore } from 'pinia'
import { uid } from 'quasar'
import { api } from 'src/boot/axios'

export const useQrCodeStore = defineStore('qr_code_store', {
  state: () => ({
    newQr: '',
    loading: false,
    id: ''
  }),
  actions: {
    setComputerId () {
      const compId = uid()
      const localId = localStorage.getItem('uid')
      if (localId === null) {
        localStorage.setItem('uid', compId)
        this.id = compId
      } else {
        this.id = localId
      }
    },
    getQrCode () {
      this.loading = true
      return new Promise((resolve, reject) => {
        api.get('v1/qrcode/get-qr')
          .then(resp => {
            this.loading = false
            console.log(resp)
            if (Object.keys(resp.data).length) {
              this.newQr = resp.data.code
              resolve('has data')
            } else {
              resolve('no data')
            }
          })
          .catch(err => {
            this.loading = false
            reject(err)
          })
      })
    },
    createNewQr () {
      const data = { id: this.id }
      this.loading = true
      return new Promise((resolve, reject) => {
        api.post('v1/qrcode/store', data)
          .then(resp => {
            this.loading = false
            console.log('qr resp', resp)
            this.newQr = resp.data.code
            resolve(resp)
          })
          .catch(err => {
            this.loading = false
            reject(err)
          })
      })
    }
  }
})
