// requirejs.config({
// 	baseUrl:'./../asset',
// 	paths:{
// 		act:'../act',
// 		lib:'./lib'
// 	}
// });

requirejs(['lib/matrix'],function(Matrix){
	var canvas = document.getElementById('canvas'),
         ctx = canvas.getContext('2d'),
       image = document.getElementById('timg'),
      matrix = null;
 	
 	function read(){
    ctx.drawImage(image,0,0,canvas.width,canvas.height);

    // 获取图像数据
    var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // 初始化图像矩阵
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

   	document.getElementById('grey').onclick = function(){
   		read();
   		var mtx = matrix.gray(matrix);
   		_transform(mtx);
   	};

   	document.getElementById('black').onclick = function(){
      read();
      var mtx = matrix.scaleDown(matrix);
      _transform(mtx);
   	};

   	document.getElementById('reverse').onclick = function(){
      read();
      var mtx = matrix.reverseColor(matrix);
      _transform(mtx);
   	};

   	document.getElementById('blur').onclick = function(){
      read();
      var mtx = matrix.unsharp(matrix,3);
      _transform(mtx);
   	};

   	// document.getElementById('mosaic').onclick = function(){

   	// };

});
