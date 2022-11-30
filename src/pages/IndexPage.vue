<template>
  <q-page class="q-pa-lg">
    <q-input
      v-model="id"
      label="alamat"
    />
    <q-btn
      label="pura-pura scan masuk"
      no-caps
      color="primary"
      @click="mockScan"
    />
    <q-btn
      label="pura-pura scan pulang"
      no-caps
      color="negative"
      @click="mockScanOut"
    />
    {{ seconds }}
    <div v-if="!store.newQr">
      <app-no-data />
    </div>
    <div v-if="store.newQr">
      <div class="q-pa-lg f-10">
        {{ store.newQr }}
      </div>
      <div
        v-if="!store.loading"
        class="flex flex-center"
      >
        <canvas id="qrcode" />
      </div>
      <!-- <div v-if="store.loading">
        <app-loading />
      </div> -->
    </div>
  </q-page>
</template>
<script setup>
// import { ref } from 'vue'
import QRious from 'qrious'
import { api } from 'src/boot/axios'
import { qrcodeChannel } from 'src/modules/sockets'
import { notifErrVue } from 'src/modules/utils'
// import { qrcodeChannel } from 'src/modules/sockets'
import { useQrCodeStore } from 'src/stores/qrcode/qrcode'
import { onMounted, ref } from 'vue'
// const qrString = ref('')
const store = useQrCodeStore()
const id = ref('')
const mockScan = () => {
  const temp = {
    qr: id.value,
    absen: 'masuk'
  }
  console.log('id', id.value)
  return new Promise(resolve => {
    api.post('v1/pegawai/absensi/qr/scan', temp)
      .then(resp => {
        console.log(resp)
        resolve(resp)
      })
  })
}
const mockScanOut = () => {
  const temp = {
    qr: id.value,
    absen: 'pulang'
  }
  console.log('id', id.value)
  return new Promise(resolve => {
    api.post('v1/pegawai/absensi/qr/scan', temp)
      .then(resp => {
        console.log(resp)
        resolve(resp)
      })
  })
}
store.getQrCode().then(data => {
  console.log(' has data ', data)
  if (data === 'has data') {
    generate()
  }
})
const generate = () => {
  if (store.newQr !== '') {
    if (store.newQr !== '\n') {
      const temp = new QRious({
        level: 'H',
        padding: 25,
        size: 300,
        element: document.getElementById('qrcode'),
        value: store.newQr
      })
      console.log(temp)
    } else {
      notifErrVue('input value cannot has anter')
    }
  } else {
    notifErrVue('No qr to generate')
  }
  console.log('gnerate qr')
}

qrcodeChannel.subscribed(() => {
  console.log('Chanel QRCODE Page Qr')
}).listen('.qr-baru', e => {
  console.log('string qr pageQr', e)
  store.newQr = e.message.code
  generate()
  timer = 60
})
store.setComputerId()

const seconds = ref(60)
const duration = 60
let timer = duration
const countDown = () => {
  setInterval(() => {
    seconds.value = parseInt(timer % 60, 10)
    // console.log('timer', timer)
    if (--timer < 0) {
      timer = duration
      getNewQr()
    }
  }, 1000)
}
const getNewQr = () => {
  store.createNewQr().then(() => {
    generate()
  })
}
onMounted(() => {
  getNewQr()
  countDown()
})

</script>
