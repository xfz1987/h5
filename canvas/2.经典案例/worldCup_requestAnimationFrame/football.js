(function () {
    window.requestAnimFrame = (function () {
        return window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.oRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                function (callback) {
                    window.setTimeout(callback, 1000 / 60)
                }
    })();

    var football;

    var Ball = function(options){
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.image = new Image();
        this.width = options.width;
        this.height = options.height;
        this.x = options.left;
        this.y = options.top;
        this.vyAdjust = -13;
        this.vxAdjust = 0.25;
        this.g = 0.4;
        this.vy = 0.8;
        this.vx = 4;
        this.image;
        this.bounceFactor = options.factor;
        this.end = false;
        this.degree = 0;
    };

    Ball.prototype = {
        init : function(){
            var me = this;
            this.image.src = 'football.png';
            this.image.onload = function(){
                me.loop();
            };
            football = this;
            return this;
        },
        draw : function(){
            this.ctx.save();
            this.rotate();
            this.ctx.drawImage(this.image,0,0,100,100,this.x,this.y,this.width,this.height);
            this.ctx.restore();
            if(this.vx > 0){
                this.degree += this.vx;
            }
        },
        clearCanvas : function(){
          this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
        },
        loop : function(){
            football.update();
            football.end || requestAnimFrame(football.loop);
        },
        update : function(){
            football.clearCanvas();
            football.move();
            football.draw();
        },
        hit : function(){
            this.vy = this.vyAdjust;
        },
        move : function(){
            this.y += this.vy;
            this.vy += this.g;

            if(this.vx > 0){
                this.x += this.vx;
            }

            if((this.y + this.height) > this.canvas.height){
                this.hit();
                this.vyAdjust *= this.bounceFactor;
                this.vx -= this.vxAdjust;
            }

            if(this.vx < -0.1){
                this.end = true;
            }
        },
        rotate : function(){
            //canvas的旋转中心是左上角，不不是中心点，所以需要先做平移处理
            this.ctx.translate(this.x+this.width/2,this.y+this.height/2);
            this.ctx.rotate(Math.PI/180 * this.degree);
            //旋转完后，需要复位，否则下面move就乱了
            this.ctx.translate(-this.x-this.width/2,-this.y-this.height/2);
        }
    };

    window.Ball = new Ball({
        width:100,
        height:100,
        left:0,
        top:0,
        factor: 0.65
    }).init();

})();


