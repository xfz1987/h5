//base64数据图片压缩
//参数 maxWidth:300 默认300 最大宽度300,高自动(宽大于高)
	var Resizer = function(maxWidth){
		if(this instanceof Resizer){
			this.maxWidth = maxWidth || 300;
		}else{
			return new Resizer(maxWidth);
		}
	};

	Resizer.prototype.doit = function(data,callback){
		_this = this;
		var img = new Image();
		img.src = data;
		img.onload = function(){
			var w = img.width,h = img.height,_w,_h;
			if(w > h){
				_w = _this.maxWidth;
				_h = h * _w / w;
			}else{
				_h = _this.maxWidth;
				_w = _h * w / h;
			}
			var canvas = document.createElement('canvas'),
			    ctx = canvas.getContext('2d');
			canvas.width = _w;
			canvas.height = _h;
			ctx.drawImage(img,0,0,_w,_h);
			callback(canvas.toDataURL('image/png'));
		}
	}

