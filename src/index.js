import './style/a.less';
import './style/calendar.less';
import './js/zepto.js';


// import renderHtml from './js/render.js'
// renderHtml.renderCalendar($('#calendar'), function (){
//   console.log('渲染完成了');
// });

import {Calendar} from './js/render.js';
let calendar = new Calendar();


if (module.hot) {
    // 实现热更新
    module.hot.accept();
}