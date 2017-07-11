    var canvasWidth = 800,canvasHeight = 600;
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    var radius = 50;
    var clipRegion;
    var isShowEnd = false;
    var isHidEnd = true;

    var image = new Image();
    image.src = 'pp.jpg';
    image.onload = function(e){
        init();
    };

    function init(){
        clipRegion = {x:Math.random()*(canvas.width-2*radius)+radius,y:Math.random()*(canvas.height-2*radius)+radius,r:radius};
        draw(image,clipRegion);
    }

    function draw(image,clipRegion){
        ctx.clearRect(0,0,canvas.width,canvas.height);
        ctx.save();
        setClipingRegion(clipRegion);
        ctx.drawImage(image,0,0,canvas.width,canvas.height);
        ctx.restore();
    }

    function setClipingRegion(clipRegion){
        ctx.beginPath();
        ctx.arc(clipRegion.x,clipRegion.y,clipRegion.r,0,Math.PI*2);
        ctx.clip();
    }

    var timer1;
    function show(){
        if(!isShowEnd){
            isHidEnd = false;
            timer1 = setInterval(
                function(){
                    clipRegion.r += 20;
                    draw(image,clipRegion);
                    if(clipRegion.r >= 2*Math.max(canvas.width,canvas.height)){
                        clearInterval(timer1);
                        timer = null;
                        isShowEnd = true;
                    }
            },30);
        }
    }

    var timer2;
    function reset(){
        if(!isHidEnd){
            console.log(22);
            clearInterval(timer1);
            timer1 = null;
            isShowEnd = true;
            timer2 = setInterval(
                function(){
                    clipRegion.r -= 20;
                    draw(image,clipRegion);
                    if(clipRegion.r <= radius){
                        clearInterval(timer2);
                        timer2 = null;
                        isHidEnd = true;
                    }
            },30);

        }


        //init();
    }