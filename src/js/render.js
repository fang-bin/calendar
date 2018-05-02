const template = require('./artTemplate.js');
template.defaults.imports.dayFormat = function(date) {
  var day = date.split('-')[2];
  return day[0] === '0' ? day.replace('0', '') : day;
}
Date.prototype.Format = function(fmt) { 
  var o = {
    "M+": this.getMonth() + 1, //月份 
    "d+": this.getDate(), //日 
    "h+": this.getHours(), //小时 
    "m+": this.getMinutes(), //分 
    "s+": this.getSeconds(), //秒 
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
    "S": this.getMilliseconds() //毫秒 
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}
module.exports = {
  data: null,   //初始化data数据
  // 渲染函数
  htmlRender (data,dom,el) {
    let htmlDom = dom.html();
    let render = template.compile(htmlDom);
    let html = render(data);
    el.html(html);
  },
  //生成日历数据函数
  compileCalendar (){
    let calendar = {};
    calendar.list = [];
    calendar.today = new Date(+CFG.currentTime).Format('yyyy-MM-dd');
    calendar.list = this.getDateList(CFG.calendarStatus);
    return calendar;
  },
  //生成日历结构函数
  getDateList (calendarStatus){
    let currentTime = CFG.currentTime;
    let oneDay = 86400000,    //一天的毫秒数
      list = [];
    if(!calendarStatus) {
      for(var i = 1; i < 5; i++) {   //默认显示14天 ，即两行
        list[4 - i] = (new Date(currentTime - oneDay * i).Format('yyyy-MM-dd'));
      }
      for(var j = 0; j < 10; j++) {
        list.push(new Date(parseInt(currentTime) + oneDay * j).Format('yyyy-MM-dd'));
      }
    } else {
      for(var i = 1; i < 26; i++) {   //显示全部
        list[25 - i] = (new Date(currentTime - oneDay * i).Format('yyyy-MM-dd'));
      }
      for(var j = 0; j < 10; j++) {
        list.push(new Date(parseInt(currentTime) + oneDay * j).Format('yyyy-MM-dd'));
      }
    }
    return list;
  },
  //初始化日历自带的一些方法
  events(el){
    const that = this;
    $('.signin-calendar').on('click', '.showCalendarBtn', function(){
      console.log('aaa');
      CFG.calendarStatus = !CFG.calendarStatus;
      that.data.calendar = that.compileCalendar();
      that.data.calendarStatus = CFG.calendarStatus;
      that.htmlRender(that.data, $('#calendarDom'), el);
    });
  },
  // 渲染日历
  renderCalendar: function (el, callback) {
    this.data = {
      calendar : this.compileCalendar(),
      calendarStatus: CFG.calendarStatus,
      monthResignedMap: {"2018-04-29":true,},
      monthSignedMap: {"2018-04-28":true,},
    };
    // console.log(Object.prototype.toString.call(data.calendar.list));
    // data.exposure = {
    //   signRuleBtn: CFG.exposureList.signinRuleBtn,
    //   doSignBtn: CFG.exposureList.doSignBtn
    // };
    this.htmlRender(this.data, $('#calendarDom'), el);
    this.events(el);
    callback && callback();
    // self.doExposure();
  },

}