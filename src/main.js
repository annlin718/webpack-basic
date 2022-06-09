import './css/iconfont.css'
import './css/main.scss'

// eslint-disable-next-line no-unused-vars
// import WebpackLogo from './image/icon.png'

document.getElementById('btnAdd').onclick = () => {
  import('./js/count').then((res) => {
    console.log(res.add(1, 2))
  }).catch((err) => {
    console.log('文件加載失敗...', err)
  })
}

if (module.hot) {
  // 判斷是否支持熱模塊替換功能
  module.hot.accept('./js/sum')
  module.hot.accept('./js/test')
}
