import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

// const host = '192.168.101.79'
// const host = '192.168.150.103'
const host = 'xenter.my.id'

window.Pusher = Pusher

window.Echo = new Echo({
  broadcaster: 'pusher',
  key: 'simrs_key_harry141312',
  cluster: 'mt1',
  wsHost: host,
  encrypted: false,
  wssPort: 6002,
  wsPort: 6002,
  disableStats: true,
  forceTLS: false, // default true
  enabledTransports: ['ws', 'wss']
})

const channel = window.Echo.channel('public.playground.1')
const qrcodeChannel = window.Echo.channel('qrcode')

// const socket = () => {
//   let msg = null
//   channel.subscribed(() => {
//     console.log('subscribed!!!')
//   }).listen('.playground', (e) => {
//     msg = e
//   })

//   return msg
// }

export { channel, qrcodeChannel }
