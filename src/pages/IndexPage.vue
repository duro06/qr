<template>
  <q-page class="bg-white">
    <div class="full-width row justify-between items-center content-between">
      <div class="bg-white col-6">
        <div
          class="flex flex-column items-center flex-center"
          style="height:100vh;"
        >
          <div class="col-12">
            <div class="row q-col-gutter-sm q-mb-lg items-center">
              <div class="col-6 text-right">
                <q-img
                  :src="`src/assets/logos/logo-rsud.png`"
                  height="70px"
                  ratio="1"
                  fit="contain"
                />
              </div>
              <div class="col-6 text-left">
                <div class="row f-14 text-weight-bold">
                  UOBK RUSD Dr. MUHAMMAD SALEH
                </div>
                <div class="row f-12 text-weight-bold">
                  KOTA PROBOLINGGO
                </div>
              </div>
            </div>
            <div
              v-if="store.newQr"
              class="row"
            >
              <div class="apem">
                <div class="row">
                  <canvas id="qrcode" />
                </div>
                <div class="row bg-primary">
                  <div class="col-12 text-center text-white f-16 q-py-md">
                    Scan untuk Absen
                  </div>
                </div>
              </div>
            </div>
            <div
              v-if="!store.newQr"
              class="row"
            >
              <div>
                <app-no-data />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="bg-dark col-6">
        <div
          class="flex flex-column flex-center"
          style="height:100vh;"
        >
          <div class="col text-right q-mr-md">
            <q-img
              v-if="user"
              :src="path"
              width="300px"
              ratio="1"
              fit="scale-down"
            />
            <q-img
              v-if="!user"
              style="width: 300px;"
              :src="path"
              ratio="1"
              fit="scale-down"
            />
          </div>
          <div class="col q-mr-lg">
            <div
              class="text-weight-bold text-left text-white"
            >
              <div>
                <div
                  v-if="!user"
                  class="f-14"
                >
                  Silahkan <br> Scan barcode
                </div>
                <div
                  v-if="user"
                  class="f-16"
                >
                  {{ user.nama }}
                  <div
                    v-if="jadwal"
                    class="q-mt-md"
                  >
                    <div
                      v-if="jadwal.absen === 'masuk'"
                    >
                      <q-chip
                        color="info"
                        text-color="white"
                        class=""
                        square
                        size="xl"
                      >
                        Absen Masuk
                        <!-- <div class="f-24 text-center">
                        </div> -->
                      </q-chip>
                      <div class="f-22 q-mt-md">
                        Selamat Datang<br>
                      </div>
                      <span class="f-16">
                        Semoga pekerjaan hari ini lancar <br>
                        dan menjadi berkah untuk keluarga<br>
                      </span>
                      <span class="f-24">
                        SEMANGAT!!!
                      </span>
                    </div>
                    <div
                      v-if="jadwal.absen === 'pulang'"
                    >
                      <q-chip
                        color="negative"
                        text-color="white"
                        class=""
                        square
                        size="xl"
                      >
                        Absen Pulang
                        <!-- <div class="f-24 text-center">
                        </div> -->
                      </q-chip>
                      <br>
                      <div class="f-22 q-mt-md">
                        Selamat Beristirahat<br>
                      </div>
                      <span class="f-16">
                        Semoga lelah pekerjaan hari ini<br>
                        dicatat sebagai amal ibadah<br>

                      </span>
                      <span class="f-20">
                        Semoga selamat sampai ke rumah
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- </div>
      </div> -->
    </div>
  </q-page>
</template>
<script setup>
// import { ref } from 'vue'
import { useQrCodeStore } from 'src/stores/qrcode/qrcode'
import QRious from 'qrious'
import { qrcodeChannel } from 'src/modules/sockets'
import { notifErrVue } from 'src/modules/utils'
import { computed, onMounted, ref } from 'vue'
const store = useQrCodeStore()
const user = ref(null)
const jadwal = ref(null)
const absen = ref(null)
const path = computed(() => {
  const pla = user.value ? 'https://rsudmsaleh.probolinggokota.go.id/simpeg/foto/' + user.value.nip + '/' + user.value.foto : 'images/matsaleh.jpg'
  return pla
})
store.getQrCode().then(data => {
  if (data === 'has data') {
    generate()
  }
})
const generate = () => {
  if (store.newQr !== '') {
    if (store.newQr !== '\n') {
      // eslint-disable-next-line no-unused-vars
      const temp = new QRious({
        level: 'H',
        padding: 25,
        size: 300,
        element: document.getElementById('qrcode'),
        value: store.newQr,
        background: 'blue',
        backgroundAlpha: 0.1,
        foreground: 'black',
        foregroundAlpha: 0.8
      })
    } else {
      notifErrVue('input value cannot has anter')
    }
  } else {
    notifErrVue('No qr to generate')
  }
  console.log('gnerate qr', user.value)
}

qrcodeChannel.subscribed(() => {
  console.log('Chanel QRCODE Page Qr')
}).listen('.qr-baru', e => {
  console.log('string qr pageQr', e.message)
  const uid = localStorage.getItem('uid')
  if (e.message.data) {
    if (uid === e.message.data.ip) {
      if (e.message.data) {
        store.newQr = e.message.data.code
        jadwal.value = null
      // user.value = e.message.user
      }
      if (e.message.user) { user.value = e.message.user }
      generate()
      timer = 60
    }
  }
  if (uid === e.message.ip) {
    if (e.message.jadwal) {
      jadwal.value = e.message.jadwal
      absen.value = 'ada'
      // console.log(e.message.jadwal)
    }
    if (e.message.user) { user.value = e.message.user }
    if (e.message.message) {
      absen.value = 'tidak ada'
    // console.log(e.message.message)
    }
  }
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
<style lang="scss" scoped>
.apem{
    border-radius: 10px 10px 10px 10px;
    border: 7px solid $primary;
    }

    .flex-1{
      display: flex;
      flex: 1;
    }
</style>
