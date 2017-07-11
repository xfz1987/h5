// requirejs.config({
// 	baseUrl:'./../asset',
// 	paths:{
// 		act:'../act',
// 		lib:'./lib',
// 		jquery:'./lib/jquery.min'
// 	}
// });

requirejs(['jquery','lib/matrix'],function($,Matrix){
	//图片上传
  $('.g-photo .upPhoto').on('change',function(){
    var _this = $(this);
    if (this.value){
        if (!RegExp('\.(' + ['if', 'jpeg', 'jpg', 'bmp', 'png'].join('|') + ')$', 'i').test(this.value.toLowerCase())){
          return alert("上传的图片格式不正确，请重新选择");
        }
        var reader = new FileReader();
        reader.readAsDataURL(this.files[0]);    
        reader.onload = function(e){ 
            _this.before($('<img src="' + this.result + '"><div class="upmark"><i>X</i></div>'));    
        }
        _this.val('');
    }
  });

  //删除图片
  $('.g-photo').on('click','.upmark i',function(){
      var mark = $(this).parent();
      mark.nextAll('canvas').remove().end().remove();
  });

  //中值去燥
  $('.fuck').on('click',function(){
    processImage($('.g-photo img')[0]);
  });

  var canvas = null,ctx = null,matrix = null;
  function processImage(image){
    read(image);
    var mtx = matrix.medianFilter(matrix);
    _transform(mtx);
    $(canvas).show();
    $(image).remove();
  }

  function read(image){
    canvas = $('<canvas></canvas>').appendTo('.g-photo').hide().css({position:'absolute',top:0,left:0})[0];
    canvas.width = $('.g-photo').width();
    canvas.height = $('.g-photo').height();
    ctx = canvas.getContext('2d');
    ctx.drawImage(image,0,0,canvas.width,canvas.height);
    //获取图像数据
    var imageData = ctx.getImageData(0,0,canvas.width,canvas.height);
    //初始化图像矩阵
    matrix = new Matrix(canvas.height, canvas.width, imageData.data);
    imageData = null;
  }

  //将RGB数据转化为图像数据
  function _transform(matrix){
    var width = matrix.col,
      height = matrix.row,
      _imageData = ctx.createImageData(width, height);
      _imageData.data.set(matrix.data);
      ctx.putImageData(_imageData,0,0,0,0,canvas.width,canvas.height);
  }

});
