requirejs.config({
  baseUrl:'/sgmj/static/asset',
  paths:{
    act:'../act',
    lib:'./lib',
    jquery:'./lib/jquery.min',
    jqueryweui:'./lib/jquery-weui.min',
    domReady:'./lib/require-domReady',
    vwcheck:'./lib/vwcheck',
    imageResizer:'./lib/imageResizer'
  },
  shim:{
    jqueryweui:{deps:['jquery']}
  }
});


requirejs(['jquery','jqueryweui','domReady!','vwcheck','imageResizer'],function($,weui,dr,vw,Resizer){

  //提交
    var REQUEST_DATA = {};
    // var _ctiy='',_workArea = [],_verfiyCode = '';
   var _orderCode = '1425301518214786';

   //初始请求数据
    $.ajax({
      type : "POST",         
      dataType : "json",
      url : "/sgmj/app/evaluate",
      data: {orderCode: _orderCode},
      success : function(data) {
        initData(data);
      },
      error : function(XMLHttpRequest, textStatus, errorThrown) {
        console.log(errorThrown);
      }
    }); 

    //页面数据初始化
    function initData(data){
     //填充个人信息
     var _personHtml = '';
     _personHtml = '<dt><img src="'+data.headImg+'" alt=""></dt><dd><p>'+data.name+'</p><span>工号：'+data.workerCode+'</span></dd>';
     _personHtml && $('.personal'). append($(_personHtml));
     //填充完成订单数
     var _orderHtml = '';
     _orderHtml = '<li><p>'+data.orderNum+'</p><span>完成订单数</span></li><li><p>'+data.evaluateNum+'</p><span>获得评价次数</span></li><li><p>'+data.overallScore+'</p><span>综合评价得分</span></li>';
     _orderHtml && $('.person_data'). append($(_orderHtml));
     //填充订单详情
     var _detailHtml = '';
     _detailHtml = '<p>订单编号：<span>'+data.orderCode+'</span></p><p>订单厂商：<span>'+data.firmName+'</span></p><p>上门时间：<span>'+data.installTime+'</span></p>';
     _detailHtml && $('.zdetail'). append($(_detailHtml));
     //填充印象
      var _effectHtml = '';
      for(var i = 0,labels = data.label,len = labels.length;i<len;i++){
        _effectHtml += '<li label-code="' + labels[i].labelCode + '">' + labels[i].labelName + '</li>';
      }
     _effectHtml && $('.effect_choose'). prepend($(_effectHtml));

     REQUEST_DATA.orderCode = data.orderCode;
     REQUEST_DATA.workerCodes = data.workerCodes;
     REQUEST_DATA.workerNames = data.workerNames;
     REQUEST_DATA.dispathCode = data.dispathCode;

    }

  /*评价*/
  $('.xing_appraise  i').click(function(){
    $(this).closest('ul').find('i').removeClass('cur');
    $(this).addClass('cur').prev('i').addClass('cur').end().parent('li').prevAll('li').children('i').addClass('cur');
    var score = $(this).parents('li').index() + 1;
    if($(this).index() == 0){
      $(this).closest('div').find('b').text(score - 0.5)
    }else{
      $(this).closest('div').find('b').text(score)
    }
  })

  /*印象选择*/
  $('.effect_choose').on('click','li',function(){
     if($(this).hasClass('cur')){
        $(this).removeClass('cur')
      }else{
        $(this).addClass('cur')
      }
  })
  //计数器
  function counter(){
    var n=0;
    return function(){return ++n};
  }

  var fous = counter();
  /*印象添加*/
  $(".effect_choose p").click(function(){
    $.prompt({
        title: '',
        text: '',
        input: '请输入对他的印象',
        empty: false, // 是否允许为空
        onOK: function (input) {
          var effect = $('#weui-prompt-input').val();
          if(effect === '请输入对他的印象') return false;
          if(fous() > 3){
            $.toptip('最多可新增三个印象', 'warning');
            return;
          }
            
          $('.effect_choose p').before('<li class="cur">'+effect+'</li>');
          
          
          
        },
        onCancel: function () {
          //点击取消
        }
      });
  });

    //拍照
    var num=0,imgArr = [];
    $('.photo input,.addimg input').change(function(e){
        if(num > 4){
          $.toptip('最多可上传5张图片', 'warning');
          return false;
        }
        var _this = $(this),
            files = e.currentTarget.files,
            reader= [];
        for(var i = 0,len = files.length;i < len;i++){
          (function(i){
            reader[i] = new FileReader();
            reader[i].readAsDataURL(files[i]);
            reader[i].onload=function(){
                //大于200KB才压缩
                if(parseInt(files[i].size/1024,10) >= 100){
                  Resizer().compress(this.result,function(_data){
                    $('.takephoto b').after('<span><img src="' + _data + '"/></span>');
                    imgArr.push(_data.substr(_data.indexOf('/')+1));
                    num++;
                  });
                }else{
                  $('.takephoto b').after('<span><img src="' + this.result + '"/></span>');
                  imgArr.push(this.result.substr(this.result.indexOf('/')+1));
                  num++;
                }
            };
          })(i);
        }
    });

    //提交
    $('.appraise .admit').click(function(){
      var _canNext = true;
      $('.xing_appraise b').each(function() {
        if($(this). text() === '0'){
          $.toptip('请填写全部评价项', 'warning');
          _canNext = false;
          return false;
        }
      });
      if(!_canNext) return;

      REQUEST_DATA.serviceAttitude = $('#service').text();
      REQUEST_DATA.installEffect = $('#speed').text();
      REQUEST_DATA.installHygiene = $('#effect').text();
      REQUEST_DATA.installSpeed = $('#hygiene').text();

      var _effect = [];
      $('.effect_choose li.cur').each(function(index, el) {
        _effect.push($(this).text());
      });
      REQUEST_DATA.evaluateLabels = _effect.join(',');
      REQUEST_DATA.comment = $('.comment').val();
      //提交数据
      $.ajax({
        type : "POST",         
        dataType : "json",
        url : "/sgmj/app/saveEvaluate",
        data: "evaluate="+JSON.stringify(REQUEST_DATA)+"&picture="+JSON.stringify({evaluateImg:imgArr.join(',')}),
        beforeSend : function(XMLHttpRequest){       
          $.showLoading();
        },
        success : function(data){
            if(data.status === 'success'){
              console.log(imgArr);
            // location.replace('/sgmj/appraise_finished.jsp');
          }else{
            $.hideLoading();
          }
        },
        error : function(XMLHttpRequest, textStatus, errorThrown) {
          $.hideLoading();
          $.toptip('系统错误，请稍后重试', 'error');
        }
      });

      


   });


});