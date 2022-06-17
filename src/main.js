import './css/iconfont.css'
import './css/main.scss'

if ('serviceWorker' in navigator) {
  // 註冊PWA離線瀏覽
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').then(registration => {
      console.log('SW registered: ', registration)
    }).catch(registrationError => {
      console.log('SW registration failed: ', registrationError)
    })
  })
}

// eslint-disable-next-line no-unused-vars
// import WebpackLogo from './image/icon.png'

document.getElementById('btnAdd').onclick = () => {
  // webpackChunkName 替chunk單獨打包的檔案命名
  import(/* webpackChunkName:"count" */'./js/count').then((res) => {
    console.log(res.add(8, 2))
  }).catch((err) => {
    console.log('文件加載失敗...', err)
  })
}
