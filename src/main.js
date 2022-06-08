import sum from './js/sum'
import { mul } from './js/test'
import './css/iconfont.css'
import './css/main.scss'

// eslint-disable-next-line no-unused-vars
import WebpackLogo from './image/icon.png'

console.log(sum(1, 2, 3, 4))
console.log(sum(1, 2, 3, 4, 5))
console.log(mul(1, 8))

if (module.hot) {
  // 判斷是否支持熱模塊替換功能
  module.hot.accept('./js/sum')
  module.hot.accept('./js/test')
}
