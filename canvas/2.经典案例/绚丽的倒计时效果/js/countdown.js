var WINDOW_WIDTH,WINDOW_HEIGHT,R,MARGIN_TOP,MARGIN_LEFT;
var timer = null;
var END_TIME = new Date();
END_TIME.setTime(END_TIME.getTime() + 3600*1000);

var curShowTimeSeconds = 0;
var balls = [];
const colors = ["#33B5E5","#0099CC","#AA66CC","#9933CC","#99CC00","#669900","#FFBB33","#FF8800","#FF4444","#CC0000"];

window.onload = function(){
    WINDOW_WIDTH = document.body.clientWidth;
    WINDOW_HEIGHT = document.body.clientHeight;
    MARGIN_LEFT = Math.round(WINDOW_WIDTH/10);
    MARGIN_TOP = Math.round(WINDOW_HEIGHT/5);
    R = Math.round(WINDOW_WIDTH*4/5/108)-1;
    var canvas = document.getElementById('canvas');
    if(canvas.getContext('2d')){
        var ctx = canvas.getContext('2d');
        canvas.width = WINDOW_WIDTH;
        canvas.height = WINDOW_HEIGHT;

        curShowTimeSeconds = getCurTimeSeconds();
        timer = setInterval(function(){
             render(ctx);
             update();
        },50);
    }

    function update(){
        var nextTimeSeconds = getCurTimeSeconds(),
            nextHours = parseInt(nextTimeSeconds/3600),
            nextMinutes = parseInt((nextTimeSeconds - nextHours*3600)/60),
            nextSeconds = nextTimeSeconds%60;

        var curHours = parseInt(curShowTimeSeconds/3600),
            curMinutes = parseInt((curShowTimeSeconds - curHours*3600)/60),
            curSeconds = curShowTimeSeconds%60;

        if(nextSeconds !== curSeconds){
            curShowTimeSeconds = nextTimeSeconds;

            if(parseInt(curHours/10) != parseInt(nextHours/10) ){
                addBalls(MARGIN_LEFT + 0 , MARGIN_TOP , parseInt(curHours/10) );
            }
            if(parseInt(curHours%10) != parseInt(nextHours%10) ){
                addBalls( MARGIN_LEFT + 15*(R+1) , MARGIN_TOP , parseInt(curHours/10) );
            }

            if(parseInt(curMinutes/10) != parseInt(nextMinutes/10) ){
                addBalls( MARGIN_LEFT + 39*(R+1) , MARGIN_TOP , parseInt(curMinutes/10) );
            }
            if(parseInt(curMinutes%10) != parseInt(nextMinutes%10) ){
                addBalls( MARGIN_LEFT + 54*(R+1) , MARGIN_TOP , parseInt(curMinutes%10) );
            }

            if(parseInt(curSeconds/10) != parseInt(nextSeconds/10) ){
                addBalls( MARGIN_LEFT + 78*(R+1) , MARGIN_TOP , parseInt(curSeconds/10) );
            }
            if(parseInt(curSeconds%10) != parseInt(nextSeconds%10) ){
                addBalls( MARGIN_LEFT + 93*(R+1) , MARGIN_TOP , parseInt(nextSeconds%10) );
            }

        }

        updateBalls();

    }

    function updateBalls(){
        for(var i=0,len=balls.length;i<len;i++){
            balls[i].x += balls[i].vx;
            balls[i].y += balls[i].vy;
            balls[i].vy += balls[i].g;
            if(balls[i].y >= WINDOW_HEIGHT - R){
                balls[i].y = WINDOW_HEIGHT - R;
                balls[i].vy = -balls[i].vy*0.5;
            }
        }

        //把超出画布的小球弄出去
        balls = balls.filter(function(item) {
            return (item.x+R > 0) && (item.x-R < WINDOW_WIDTH);
        });

        //保持计算机性能，最多出现300个小球
        balls = balls.length < 300 ? balls : balls.slice(0,301);
    }

    function addBalls(x,y,num ){
        for(var i=0,len=digit[num].length;i<len;i++){
            for(var j=0,len2=digit[num][i].length;j<len2;j++){
                if(digit[num][i][j] === 1){
                    var aBall = {
                        x:x+j*2*(R+1)+(R+1),
                        y:y+i*2*(R+1)+(R+1),
                        g:1.5+Math.random(),
                        vx:Math.pow(-1,Math.ceil(Math.random()*1000)) * 4,//-4或4
                        vy:-5,
                        color:colors[Math.floor(Math.random()*colors.length)]
                    }
                    balls.push(aBall)
                }
            }
        }
    }

    function getCurTimeSeconds(){
        var curTime = new Date();
        var ret = END_TIME.getTime() - curTime.getTime();//ms
        ret = Math.round(ret/1000);//s
        if(ret<0){
            clearInterval(timer);
            timer = null;
            return 0;
        }
        return ret;
    }

    function render(ctx){
        ctx.clearRect(0,0,WINDOW_WIDTH,WINDOW_HEIGHT);

        var hours = parseInt(curShowTimeSeconds/3600),
            minutes = parseInt((curShowTimeSeconds - hours*3600)/60),
            seconds = curShowTimeSeconds%60;

        /*
         * 绘制时钟
         * MARGIN_LEFT,MARGIN_TOP
         * 让时钟在画布中的初始位置
         */
        //绘制十位数
        renderDigit(MARGIN_LEFT,MARGIN_TOP,parseInt(hours/10),ctx);
        //绘制个位数 7*10的数组矩阵
        //x = MARGIN_LEFT + 2*7*(R+1),但是了十位与个位数字留有一点距离如下
        renderDigit(MARGIN_LEFT+15*(R+1),MARGIN_TOP,parseInt(hours%10),ctx);
        //绘制 : 前面已经有连个数字了，所以要在之前的基础上 + 15*(R+1)
        renderDigit(MARGIN_LEFT+30*(R+1),MARGIN_TOP,10,ctx);
        /*
         * 绘制分钟
         */
        //由于前面的 : 为4*10的矩阵，在之前的基础上 + (2*4+1)*(R+1)
        renderDigit(MARGIN_LEFT+39*(R+1),MARGIN_TOP,parseInt(minutes/10),ctx);
        renderDigit(MARGIN_LEFT+54*(R+1),MARGIN_TOP,parseInt(minutes%10),ctx);
        renderDigit(MARGIN_LEFT+69*(R+1),MARGIN_TOP,10,ctx);//54+15
        /*
         * 绘制秒钟
         */
        renderDigit(MARGIN_LEFT+78*(R+1),MARGIN_TOP,parseInt(seconds/10),ctx);//69 + 2*4+1
        renderDigit(MARGIN_LEFT+93*(R+1),MARGIN_TOP,parseInt(seconds%10),ctx);//78+15

        for(var i=0,len=balls.length;i<len;i++){
            ctx.fillStyle=balls[i].color;
            ctx.beginPath();
            ctx.arc(balls[i].x,balls[i].y,R,0,2*Math.PI);
            ctx.closePath();
            ctx.fill();
        }
    }

    // 第(i,j)个圆的圆心位置
    // centerX: x+j*2*(r+1)+r+1
    // centerY: y+i*2*(r+1)+r+1
    function renderDigit(x,y,num,ctx){
        ctx.fillStyle = 'rgb(0,102,153)';
        for(var i=0,len=digit[num].length;i<len;i++){//行数
            for(var j=0,len2=digit[num][i].length;j<len2;j++){//列数
                if(digit[num][i][j] === 1){
                    ctx.beginPath();
                    //R+1是为了给每个圆之间保留间隔
                    ctx.arc(x+j*2*(R+1)+R+1,y+i*2*(R+1)+R+1,R,0,2*Math.PI);
                    ctx.closePath();
                    ctx.fill();
                }
            }
        }
    }
}