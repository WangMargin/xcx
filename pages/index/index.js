//index.js
//获取应用实例
//download by http://www.srcfans.com
var app = getApp()
Page({
  data: {
    circleList: [], //圆点数组
    awardList: [], //奖品数组
    colorCircleFirst: '#FFDF2F', //圆点颜色1
    colorCircleSecond: '#FE4D32', //圆点颜色2
    colorAwardDefault: '#F5F0FC', //奖品默认颜色
    colorAwardSelect: '#ffe400', //奖品选中颜色
    indexSelect: 0, //被选中的奖品index
    isRunning: false, //是否正在抽奖
    imageAward: [
      '../../images/1.jpg',
      '../../images/2.jpg',
      '../../images/3.jpg',
      '../../images/4.jpg',
      '../../images/5.jpg',
      '../../images/6.jpg',
      '../../images/7.jpg',
      '../../images/8.jpg',
    ], //奖品图片数组
    times: '100', //转盘转动的速度
  },

  onLoad: function() {
    var _this = this;
    //圆点设置
    var leftCircle = 7.5;
    var topCircle = 7.5;
    var circleList = [];
    for (var i = 0; i < 24; i++) {
      if (i == 0) {
        topCircle = 15;
        leftCircle = 15;
      } else if (i < 6) {
        topCircle = 7.5;
        leftCircle = leftCircle + 102.5;
      } else if (i == 6) {
        topCircle = 15
        leftCircle = 620;
      } else if (i < 12) {
        topCircle = topCircle + 94;
        leftCircle = 620;
      } else if (i == 12) {
        topCircle = 565;
        leftCircle = 620;
      } else if (i < 18) {
        topCircle = 570;
        leftCircle = leftCircle - 102.5;
      } else if (i == 18) {
        topCircle = 565;
        leftCircle = 15;
      } else if (i < 24) {
        topCircle = topCircle - 94;
        leftCircle = 7.5;
      } else {
        return
      }
      circleList.push({
        topCircle: topCircle,
        leftCircle: leftCircle
      });
    }
    this.setData({
      circleList: circleList
    })
    //圆点闪烁
    setInterval(function() {
      if (_this.data.colorCircleFirst == '#FFDF2F') {
        _this.setData({
          colorCircleFirst: '#FE4D32',
          colorCircleSecond: '#FFDF2F',
        })
      } else {
        _this.setData({
          colorCircleFirst: '#FFDF2F',
          colorCircleSecond: '#FE4D32',
        })
      }
    }, 500)
    //奖品item设置
    var awardList = [];
    //间距,怎么顺眼怎么设置吧.
    var topAward = 25;
    var leftAward = 25;
    for (var j = 0; j < 8; j++) {
      if (j == 0) {
        topAward = 25;
        leftAward = 25;
      } else if (j < 3) {
        topAward = topAward;
        //166.6666是宽.15是间距.下同
        leftAward = leftAward + 166.6666 + 15;
      } else if (j < 5) {
        leftAward = leftAward;
        //150是高,15是间距,下同
        topAward = topAward + 150 + 15;
      } else if (j < 7) {
        leftAward = leftAward - 166.6666 - 15;
        topAward = topAward;
      } else if (j < 8) {
        leftAward = leftAward;
        topAward = topAward - 150 - 15;
      }
      var imageAward = this.data.imageAward[j];
      awardList.push({
        topAward: topAward,
        leftAward: leftAward,
        imageAward: imageAward
      });
    }
    this.setData({
      awardList: awardList
    })
  },
  //开始游戏
  startGame: function() {
    if (this.data.isRunning) return
    this.setData({
      isRunning: true,
    })
    var _this = this;
    //声明一个数组存八个点概率
    var ProArray = [0.1, 0.1, 0.1, 0.1, 0.3, 0.1, 0.1, 0.1];
    //随机数
    var ranNumber = Math.random() * 1000000;

    var jieguo = ranNumber / 1000000;
    console.log(jieguo);
    var result = [];
    var rep = [];
    var indexSelect = 0;
    //比较大小
    for (var i = 0; i < ProArray.length; i++) {
      if (jieguo < ProArray[i]) {
        result.push(ProArray[i]);
        rep.push(i);
      }
    }
    if (result.length == 0) {
      var maxres = ProArray[0];
      for (var i = 0; i < ProArray.length; i++) {
        if (maxres < ProArray[i]) maxres = ProArray[i];
      }
      for (var i = 0; i < ProArray.length; i++) {
        if (maxres == ProArray[i]) indexSelect = i;
      }
    } else {
      var maxres = result[0];
      for (var i = 0; i < result.length; i++) {
        if (maxres > result[i]) maxres = result[i];
      }
      for (var i = 0; i < result.length; i++) {
        if (maxres == result[i]) indexSelect = i;
      }
      for (var i = 0; i < rep.length; i++) {
        if (indexSelect == i) indexSelect = rep[i];
      }
    }
    console.log(indexSelect);
    var i = 0;
    var timer = setInterval(function() {
      indexSelect++;
      //简单粗暴用y=30*x+200函数做的处理.可根据自己的需求改变转盘速度
      i += 30;
      if (i > 1000) {
        //去除循环
        clearInterval(timer)

        setTimeout(function() {
          //获奖提示
          wx.showModal({
            title: '恭喜您',
            content: '获得了第' + (_this.data.indexSelect + 1) + "个优惠券",
            showCancel: false, //去掉取消按钮
            success: function(res) {
              if (res.confirm) {
                _this.setData({
                  isRunning: false
                })
              }
            }
          })
        }, 500)

      }
      indexSelect = indexSelect % 8;
      _this.setData({
        indexSelect: indexSelect
      })
    }, (_this.data.times * 1 + i))
  }
})