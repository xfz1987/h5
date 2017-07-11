/**
 * 绘制矩形
 */
function drawRect(ctx,x,y,width,height,borderWidth,borderColor,fillColor){
    // ctx.beginPath();
    // ctx.moveTo(x,y);
    // ctx.lineTo(x+width,y);
    // ctx.lineTo(x+width,y+height);
    // ctx.lineTo(x,y+height);
    // ctx.closePath();

    ctx.lineWidth = borderWidth;
    ctx.fillStyle = fillColor;
    ctx.strokeStyle = borderColor;

    // ctx.fill();
    // ctx.stroke();

    ctx.fillRect(x,y,width,height);
    ctx.strokeRect(x,y,width,height);
}

/**
 * 绘制圆角矩形
 */
function fillRoundRect(ctx,x,y,width,height,radius,fillColor){
    if(2*radius>width || 2*radius>height) return;

    ctx.save();
    ctx.translate(x,y);
    pathRoundRect(ctx,width,height,radius);
    ctx.fillStyle = fillColor || 'black';
    ctx.fill();
    ctx.restore();
}
function strokeRoundRect(ctx,x,y,width,height,radius,lineWidth,strokeColor){
    if(2*radius>width || 2*radius>height) return;

    ctx.save();
    ctx.translate(x,y);
    pathRoundRect(ctx,width,height,radius);
    ctx.lineWidth = lineWidth || 1;
    ctx.strokeStyle = strokeColor || 'black';
    ctx.stroke();
    ctx.restore();
}


/**
 * 绘制五角星
 * @param  {[type]} ctx
 * @param  {[type]} x           小圆圆心位置
 * @param  {[type]} y           小圆圆心位置
 * @param  {[type]} r           小圆半径
 * @param  {[type]} R           大圆半径
 * @param  {[type]} rotate      旋转角度
 * @param  {[type]} lineJoinStyle 设置两条线连接点的形状
 * @param  {[type]} borderWidth [description]
 */
function drawStar(ctx,x,y,r,R,rotate,borderWidth,borderColor,fillColor,lineJoinStyle){
    ctx.beginPath();
    for(var i=0;i<5;i++){
        ctx.lineTo(Math.cos((18+i*72 -rotate)/180*Math.PI)*R + x,Math.sin((18+i*72 -rotate)/180*Math.PI)*R + y);
        ctx.lineTo(Math.cos((54+i*72 -rotate)/180*Math.PI)*r + x,Math.sin((54+i*72 -rotate)/180*Math.PI)*r + y);
    }
    ctx.closePath();

    ctx.fillStyle = fillColor;
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = borderWidth;
    ctx.lineJoin = lineJoinStyle;

    ctx.fill();
    ctx.stroke();
}