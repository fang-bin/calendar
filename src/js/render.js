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
/*module.exports = {
  data: null,   //初始化data数据   同时保存信息
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
    if (!CFG.calendarStatus){
      this.calendarLess = calendar.list;
    }else{
      this.calendarMore = calendar.list;
    }
    return calendar;
  },
  //生成日历结构函数
  getDateList (calendarStatus){
    let currentTime = CFG.currentTime;
    let oneDay = 86400000,    //一天的毫秒数
      list = [];
    // if(!calendarStatus) {
    //   for(var i = 1; i < 5; i++) {   //默认显示14天 ，即两行
    //     list[4 - i] = (new Date(currentTime - oneDay * i).Format('yyyy-MM-dd'));
    //   }
    //   for(var j = 0; j < 10; j++) {
    //     list.push(new Date(parseInt(currentTime) + oneDay * j).Format('yyyy-MM-dd'));
    //   }
    // } else {
    //   for(var i = 1; i < 26; i++) {   //显示全部
    //     list[25 - i] = (new Date(currentTime - oneDay * i).Format('yyyy-MM-dd'));
    //   }
    //   for(var j = 0; j < 10; j++) {
    //     list.push(new Date(parseInt(currentTime) + oneDay * j).Format('yyyy-MM-dd'));
    //   }
    // }
    
    //所有日历信息
    for (var i = 1; i < 26; i++) {   //显示全部
      list[25 - i] = (new Date(currentTime - oneDay * i).Format('yyyy-MM-dd'));
    }
    for (var j = 0; j < 10; j++) {
      list.push(new Date(parseInt(currentTime) + oneDay * j).Format('yyyy-MM-dd'));
    }
    return list;
  },
  //初始化日历自带的一些方法
  events(){
    const that = this;
    $('.signin-calendar').on('click', '.showCalendarBtn', function(){
      CFG.calendarStatus = !CFG.calendarStatus;
      //that.data.calendar = that.compileCalendar();
      that.data.calendarStatus = CFG.calendarStatus;
      //that.htmlRender(that.data, $('#calendarDom'), el);
      $('.showCalendarBtn').toggleClass('showAllCalendar');
      $('.signin-calendar-wrap').toggleClass('more');
    });
  },
  // 渲染日历
  renderCalendar (el, callback) {
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
    this.events();
    callback && callback();
    // self.doExposure();
  },

}*/

export class Calendar {
  constructor(options){
    this.default = {
      el: $('#calendar'),     //日历结构要渲染的父级dom
      callback: null,    //渲染结束的回调函数
      canResign: false,    //是否可以签到
    };
    this.params = Object.assign({},this.default, options);
    this.data = null;
    this.resignTime = '';
    this.init();
  }
  //初始化
  init(){
    this.renderCalendar();
    this.events();
  }
  // 绑定默认事件
  events(){
    const that = this;
    // 绑定日历切换按钮事件
    $('.signin-calendar').on('click', '.showCalendarBtn', function () {
      CFG.calendarStatus = !CFG.calendarStatus;
      that.data.calendarStatus = CFG.calendarStatus;
      $('.showCalendarBtn').toggleClass('showAllCalendar');
      $('.signin-calendar-wrap').toggleClass('more');
    });
    // 绑定补签事件
    if (this.params.canResign){
      that.params.el.on('click', '.unchecked', function (){
        that.renderResignModal();
        that.resignTime = $(this).data("datatime");
      });
      $('body').on("click", ".resign_cancel,.resign_close", function () {
        $('.resign-in-modal').addClass('hidden');
      });
      $('body').on("click", "#doResign", function () {
        //补签中弹层
        let temData = {
          resign_tip: "补签中",
          resign_icon: true,
          resigning_alert: true
        };

        //渲染"补签中"弹窗
        $('.resign-in-modal').remove();
        that.htmlRender(temData, $('#resignModal'), $('body'), true);

        // 执行补签代码
        that.doResign();
      });
      
    }
  }
  //渲染日历
  renderCalendar() {
    this.data = {
      calendar: this.compileCalendar(),
      calendarStatus: CFG.calendarStatus,
      monthResignedMap: { "2018-04-29": true, },
      monthSignedMap: { "2018-04-28": true, },
      canResign: this.params.canResign
    };
    this.htmlRender(this.data, $('#calendarDom'), this.params.el);
    this.params.callback && this.params.callback();
  }
  // 渲染函数
  htmlRender(data, dom, el, bol) {
    let htmlDom = dom.html();
    let render = template.compile(htmlDom);
    let html = render(data);
    bol ? el.append(html) : el.html(html);
  }
  //生成日历数据函数
  compileCalendar() {
    let calendar = {};
    calendar.list = [];
    calendar.today = new Date(+CFG.currentTime).Format('yyyy-MM-dd');
    calendar.list = this.getDateList(CFG.calendarStatus);
    return calendar;
  }
  //生成日历结构函数
  getDateList(calendarStatus) {
    let currentTime = CFG.currentTime;
    let oneDay = 86400000,    //一天的毫秒数
      list = [];
    //所有日历信息
    for (var i = 1; i < 26; i++) {   //显示全部
      list[25 - i] = (new Date(currentTime - oneDay * i).Format('yyyy-MM-dd'));
    }
    for (var j = 0; j < 10; j++) {
      list.push(new Date(parseInt(currentTime) + oneDay * j).Format('yyyy-MM-dd'));
    }
    return list;
  }
  // 渲染补签弹层
  renderResignModal(){
    let temData = {
      exposures: [CFG.exposureList.doResignBtn, CFG.exposureList.doResignCancelBtn],
      resign_title: "确认补签？",
      resign_tip: "补签将消耗10积分",
      resign_cancel: "取消",
      resign_yes: "确定",
      resign_icon: false,
      resigning_alert: false
    };
    $('.resign-in-modal').remove();
    this.htmlRender(temData, $('#resignModal'), $('body'), true);
  }
  // 补签操作
  doResign(){
    /*this.reSignPublic({
      timeout: 5000,
      signDate: new Date(this.resignTime),
      successCallback: reSignSuccess,
      failCallback: reSignFail
    });
    // 补签成功
    function reSignSuccess(res) {
      //补签成功，查询补签结果
      CFG.resignAddCount = res.data.activityCount;
      CFG.resignAddCredits = res.data.credits;
      self.getResignResult(res.data.logId, 'status', resignDate);
    }

    // 补签失败
    function reSignFail(res) {
      var data = {
        resign_fail: true,
        resign_tip: res.message
      };
      self.renderResingModal(data);
      setTimeout(function () {
        $resignInDialog.addClass('hidden');
      }, 2500);
    }*/
  }
}
