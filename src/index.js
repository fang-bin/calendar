import './style/a.less';
import './style/calendar.less';
import './js/zepto.js';
// import {htmlRender} from './js/render.js';
import renderHtml from './js/render.js'


// renderHtml.htmlRender(data, $('#test'), $('#content'));
renderHtml.renderCalendar($('#calendar'), function (){
  console.log('渲染完成了');
});

if (module.hot) {
    // 实现热更新
    module.hot.accept();
}