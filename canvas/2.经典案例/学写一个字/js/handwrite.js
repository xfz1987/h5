;(function($){
    var Handwrite = function($el){
        this.el = $el[0];
        this.ctx = this.el.getContext('2d');
        this.canvasWidth = Math.min(800,$(window).width()-20);
        //this.canvasHeight = Math.min(800,$(window).height()-20);
        this.canvasHeight = this.canvasWidth;
        this.strokeColor = 'black';
        this.isMouseDown = false;
        this.lastLoc = {x:0,y:0};//上一次鼠标挪动的位置
        this.lastTimeStmp = 0;//上一次时间戳
        this.lastLineWidth = -1;//上一次的线宽
        this.el.width = this.canvasWidth;
        this.el.height = this.canvasHeight;
        this._drawGrid();
        this._initEvent($el);
    };
    Handwrite.prototype = {
        /*画面板及米字格*/
        _drawGrid : function(){
            this.ctx.save();

            //画一个矩形框
            this.ctx.strokeStyle = 'red';
            this.ctx.beginPath();
            this.ctx.moveTo(3, 3);
            this.ctx.lineTo(this.canvasWidth - 3,3);
            this.ctx.lineTo(this.canvasWidth - 3,this.canvasHeight - 3);
            this.ctx.lineTo(3,this.canvasHeight - 3);
            this.ctx.closePath();
            this.ctx.lineWidth = 6;
            this.ctx.stroke();

            //画一个米字格
            this.ctx.beginPath();
            this.ctx.setLineDash([5, 5]); //参数：第一个是虚线的长度，第二个是两虚线段的间隔长度
            this.ctx.moveTo(0,0);
            this.ctx.lineTo(this.canvasWidth,this.canvasHeight);
            this.ctx.moveTo(this.canvasWidth,0);
            this.ctx.lineTo(0,this.canvasHeight);
            this.ctx.moveTo(this.canvasWidth/2,0);
            this.ctx.lineTo(this.canvasWidth/2,this.canvasHeight);
            this.ctx.moveTo(0,this.canvasHeight/2);
            this.ctx.lineTo(this.canvasWidth,this.canvasHeight/2);
            this.ctx.lineWidth = 1;
            this.ctx.stroke();

            this.ctx.restore();
        },
        /*将鼠标位置转换成在canvas中的位置*/
        _windowToCanvas : function(x,y){
            var canBox = this.el.getBoundingClientRect() || this.el.getClientRect();
            return {
                x : Math.round(x - canBox.left),
                y : Math.round(y - canBox.top)
            };
        },
        /*计算两点之间的直线距离: (x*x+ y*y)开平方 */
        _calcDistance : function(loc1,loc2){
            return Math.sqrt((loc1.x - loc2.x)*(loc1.x - loc2.x) + (loc1.y - loc2.y)*(loc1.y - loc2.y));
        },
        /**
         * 计算笔画的粗细
         * 停留时间越长，笔画越粗
         * @param  {[type]} t 时间
         * @param  {[type]} s 距离
         */
        _calcLineWidth : function(t,s){
            var v = s/t;
            var res;
            var line = this.lastLineWidth || -1;
            if(v<0.1){
                res = 30;//最粗为30
            }else if(v>10){
                res = 1;//最细为1
            }else{
                //         1     v      30
                // res ------    |    -------
                //     v    |---------|
                //         0.1        10
                res = 30 - (v-0.1)/(10-0.1) * (30-5);
            }

            if(line === -1){//第一次
                return res;
            }else{//不至于前后变化太大
                return (line*2/3 + res/3);
            }
        },

        _draw : function(curLoc,lineWidth){
            this.ctx.beginPath();
            this.ctx.moveTo(this.lastLoc.x,this.lastLoc.y);
            this.ctx.lineTo(curLoc.x,curLoc.y);
            this.ctx.strokeStyle = this.strokeColor;
            this.ctx.lineWidth = lineWidth;
            this.ctx.lineCap = 'round';//解决毛边问题
            this.ctx.lineJoin = 'round';//效果更佳平滑
            this.ctx.stroke();
        },
        _beginStroke : function(x,y){
            this.isMouseDown = true;
            this.lastLoc = this._windowToCanvas(x,y);
            this.lastTimeStmp = new Date().getTime();
        },
        _endStroke : function(){
            this.isMouseDown = false;
        },
        _moveStroke : function(ex,ey){
            var curLoc = this._windowToCanvas(ex,ey);
            var curTimeStmp = new Date().getTime();
            /*通过两点距离和时间实现笔画的粗细*/
            var s = this._calcDistance(curLoc,this.lastLoc);
            var t = curTimeStmp - this.lastTimeStmp;
            var lineWidth = this._calcLineWidth(t,s);

            this._draw(curLoc,lineWidth);

            this.lastLoc = curLoc;
            this.lastTimeStmp = curTimeStmp;
            this.lastLineWidth = lineWidth;
        },
        _initEvent : function($el){
            var me = this;
            /*pc*/
            $el.on('mousedown',function(e){
                e.preventDefault();
                me._beginStroke(e.clientX,e.clientY);
            });
            $el.on('mouseup',function(e){
                e.preventDefault();
                me._endStroke();
            });
            $el.on('mouseout',function(e){
                e.preventDefault();
                me._endStroke();
            });
            $el.on('mousemove',function(e){
                e.preventDefault();
                if(me.isMouseDown){
                    me._moveStroke(e.clientX,e.clientY);
                }
            });

            /*mobile*/
            // $el[0].addEventListener('touchstart',function(e){
            //    var touch = e.touches[0];//不需要多点触控
            //    me._beginStroke(touch.pageX,touch.pageY);
            // });

            $el.on('touchstart',function(e){
                e.preventDefault();
                var touch = e.originalEvent.targetTouches[0];//不需要多点触控
                me._beginStroke(touch.pageX,touch.pageY);
            });
            $el.on('touchend',function(e){
                e.preventDefault();
                me._endStroke();
            });
            $el.on('touchmove',function(e){
                e.preventDefault();
                if(me.isMouseDown){
                    var touch = e.originalEvent.targetTouches[0];
                    me._moveStroke(touch.pageX,touch.pageY);
                }
            });
        },
        clear : function(){
            this.ctx.clearRect(0,0,this.canvasWidth,this.canvasHeight);
            this._drawGrid();
        },
        selColor : function(color){
            this.strokeColor = color;
        }
    };
    Handwrite.init = function($el){
        var me = this;
        return new Handwrite($el);
    };

    window['Handwrite'] = Handwrite;

})(jQuery,window);