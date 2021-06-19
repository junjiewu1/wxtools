/**
 * Created by Administrator on 2018/6/8 0008.
 */
//获取cookie、
export function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
      return (arr[2]);
    else
      return null;
  }
  
  //设置cookie,增加到vue实例方便全局调用
  /*
  * 键 c_name
  * 值 value
  * 时间 expiredays
  * */
  export function setCookie (c_name, value, expiredays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + expiredays);
    document.cookie = c_name + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString());
  };
  
  //删除cookie
  export function delCookie (name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = getCookie(name);
    if (cval != null)
      document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
  };
  

  // 时间戳转换
export function formatDate(date, fmt) {
  //1、获取年份
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  //2、获取
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  };
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + '';
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
    }
  }
  return fmt;
};

function padLeftZero (str) {
  return ('00' + str).substr(str.length);
};

//js获取当前时间的前n天/后n天
export function delyDate(curDate,delyDate){
	curDate = new Date(curDate);
	var preDate = new Date(curDate.getTime() - 24*60*60*1000*delyDate);
	var nextDate = new Date(curDate.getTime() + 24*60*60*1000*delyDate)
	if(delyDate > 0){ 
		var nextDate = new Date(curDate.getTime() + 24*60*60*1000*delyDate)
		return formatDate(nextDate, 'yyyy-MM-dd')
	}
	if(delyDate < 0){
		var preDate = new Date(curDate.getTime() - 24*60*60*1000*Math.abs(delyDate));
		return formatDate(preDate, 'yyyy-MM-dd')
	}
	if(delyDate == 0){
		return formatDate(curDate, 'yyyy-MM-dd')
	}
}

export function undelyDate(date1, date2){
	date1 = new Date(date1);
	date2 = new Date(date2);
	return parseInt((date1.getTime() - date2.getTime()) / (24*60*60*1000))
}

//字符串转时间戳
export function timeStamp(time){
	if(!time) return new Date().getTime();
	time = time.substring(0,19);    
	time = time.replace(/-/g,'/'); 
	return new Date(time).getTime();
}

//时间字符截取
export function timeSubstr(beginTime, endTime){
				if(beginTime.substr(0,10) == endTime.substr(0,10)){
					return endTime.substr(11)
				}else if(beginTime.substr(0,4) == endTime.substr(0,4)){
					return endTime.substr(5)
				}else{
					return endTime
				}
			}

//获取近七天、近一月.......的时间
 // intervalDates 距离多少天
 // bolPastTime ture往前 false往后
export function getDateRange(nowDate, intervalDates, bolPastTime){
	let onDelTime = 24*60*60*1000;
	if(bolPastTime){
		let rangeDate = new Date(nowDate.getTime() - intervalDates * onDelTime)
		return formatDate(rangeDate, 'yyyy-MM-dd')
	}else{
		let rangeDate = new Date(nowDate.getTime() + intervalDates * onDelTime)
		return formatDate(rangeDate, 'yyyy-MM-dd')
	}
}
  export function timeDistance(Distancetime){
	  var time = timeStamp(Distancetime)
	  var now = new Date().getTime()
	  var milliseconds = now - time
	  var timeSpanStr = ''
	  if (milliseconds <= 1000 * 60 * 1) { // 小于一分钟展示为刚刚
	      timeSpanStr = '刚刚'
	    } else if (milliseconds <= 1000 * 60 * 60) { // 大于一分钟小于一小时展示为分钟
	      timeSpanStr = Math.round((milliseconds / (1000 * 60))) + '分钟前'
	    } else if (milliseconds <= 1000 * 60 * 60 * 24) { // 大于一小时小于一天展示为小时
	      timeSpanStr = Math.round(milliseconds / (1000 * 60 * 60)) + '小时前'
	    } else if (milliseconds <= 1000 * 60 * 60 * 24 * 30) { // 大于一天小于十五天展示位天
	      timeSpanStr = Math.round(milliseconds / (1000 * 60 * 60 * 24)) + '天前'
	    } else if (milliseconds <= 1000 * 60 * 60 * 24 * 365) {
	      timeSpanStr = Distancetime.substr(5)
	    } else {
	      timeSpanStr = Distancetime
	    }
		return timeSpanStr
  }

// 方法定义 lat,lng   获取两个点之间的距离
export function GetDistance( lat1,  lng1,  lat2,  lng2){    var radLat1 = lat1*Math.PI / 180.0;    var radLat2 = lat2*Math.PI / 180.0;    var a = radLat1 - radLat2;    var  b = lng1*Math.PI / 180.0 - lng2*Math.PI / 180.0;    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a/2),2) +    Math.cos(radLat1)*Math.cos(radLat2)*Math.pow(Math.sin(b/2),2)));    s = s *6378.137 ;// EARTH_RADIUS;    s = Math.round(s * 10000) / 10;    return s;}

export function parseQueryString(url){
  var arr;
  var res = {};
  //#符号之后的值称为hash，都不会加到request请求中去
  url = url.split('#')[0];
  //获取queryString 第一个？号后面的全是查询字符串
  arr = url.split('?');
  arr.shift();
  var queryStr = arr.join('?');
  //查询字符串为空直接返回 避免出现这样的返回值{"":""}
  if (queryStr.trim().length == 0){
      return res;
  }

  //获取参数
  arr = queryStr.split('&');
  for (var i = 0; i <  arr.length; i++) {
      var itemArr = arr[i].split('=');
      //第一个=号之前的是name 后面的全是值
      var name = itemArr.shift();
      var value = itemArr.join('=');
      res[name] = value;
  }
  return res;
}
