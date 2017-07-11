var canvas = document.querySelector("canvas");
if(canvas.getContext){
	var ctx = canvas.getContext("2d");	
}

var game = {
	bgReady:false,
	heroReady:false,
    masterReady:false,
    bgImage:null,
    heroImage:null,
    masterImage:null,
	start:new Date(0),
	then:new Date(0),
	last:0,
	masterTasks:[new Master()],//初始有一个怪物
	timer:null,
    keysDown:[],
	imageLoad:function(){
		game.bgImage = new Image();
		game.bgImage.src = "images/bg.png";
		game.bgImage.onload = function(){
			 game.bgReady = true;
		}		
		/*32 x 32*/
		game.heroImage = new Image();
		game.heroImage.src = "images/hero.png";
		game.heroImage.onload = function(){
			game.heroReady = true;
		}
		/*30 x 32*/
		game.masterImage = new Image();
		game.masterImage.src = "images/master.png";
		game.masterImage.onload = function(){
			game.masterReady = true;
		}
	},
	/*定义原型,因为只有一个英雄*/
	hero:{
		speed:256,
		//初始位置在画布的中央
		x:canvas.width/2,
		y:canvas.height/2	
	},
    
	startGame:function(){
		game.imageLoad();
		game.then = Date.now();
		game.start = game.then;
		
		game.timer = setInterval(function(){
			var now = Date.now();
			game.move((now-game.then)/1000);
			//每次间隔时间根本不是1ms，比1ms要大得多
			for(var i=0,len=game.masterTasks.length;i<len;game.masterTasks[i].move((now-game.then)/1000),i++);
			game.draw();
			game.check();
			game.then = now;
		},1);
	},
	
	move:function(modifier){
		if(37 in game.keysDown){
			game.hero.x -= game.hero.speed * modifier;
		}
		if(38 in game.keysDown){
			game.hero.y -= game.hero.speed * modifier;
		}
		if(39 in game.keysDown){
			game.hero.x += game.hero.speed * modifier;
		}
		if(40 in game.keysDown){
			game.hero.y += game.hero.speed * modifier;
		}

        game.hero.x = game.hero.x + 32 >= canvas.width ? canvas.width - 32 :
			          game.hero.x <= 0 ? 0:
			          game.hero.x;
		game.hero.y = game.hero.y + 32 >= canvas.height ? canvas.height - 32 :
			          game.hero.y <= 0 ? 0 :
			          game.hero.y;
	},
	
	draw:function(){
		if(game.bgReady){
			ctx.drawImage(game.bgImage, 0 ,0);
		}
		if(game.heroReady){
			ctx.drawImage(game.heroImage,game.hero.x,game.hero.y);
		}
		if(game.masterReady) {
			for(var i=0,len=game.masterTasks.length;i<len;ctx.drawImage(game.masterImage,game.masterTasks[i].x, game.masterTasks[i].y),i++);
		}

		ctx.fillStyle = "rgb(250, 250, 250)";
		ctx.font = "24px Helvetica";
		ctx.textAlign = "left";
		ctx.textBaseline = "top";

		game.last = Date.now() - game.start;

		ctx.fillText(game.last/1000,32,canvas.height-64);
	},

	check:function(){
		if (game.masterTasks.length != Math.floor(game.last / 5000)+1){//如果时间经过5秒就增加一个怪兽实例
			game.masterTasks.push(new Master());
		}

		for(var i=0,len=game.masterTasks.length;i<len;i++){
			if((game.masterTasks[i].x -32) <= game.hero.x && game.hero.x <= (game.masterTasks[i].x + 30)
				&& (game.masterTasks[i].y -32) <= game.hero.y && game.hero.y <= (game.masterTasks[i].y + 32)) {
                end = Date.now();
				var continueTime = (end - game.start)/1000;
				var message = continueTime>=50?"是真爷们!":"是娘们!";
				document.getElementById("myH").innerHTML = input + "，你坚持了" + continueTime + "秒【" + message +"】";
				localStorage.setItem("$:" + input,continueTime);
                game.end();
			}
		}
    },

	end:function(){
		if(game.bgReady){
			ctx.drawImage(game.bgImage,0,0); //留住背景
		}
		clearInterval(game.timer);
		game.timer = null;
		game.showResult();
		return;	
	},
	
	showResult:function(){
		//显示英雄榜
		for(var i=0,arr=[],key,value,len=localStorage.length;i<len;i++){
			key = localStorage.key(i);
			value = localStorage.getItem(key);
			if(key.indexOf("$:") == 0){
				arr.push(key+"="+value);
			}
		}
			
		/*value从高到低排序*/
		var array =  arr.sort(function(a,b){
			          return parseInt(b.substring(b.indexOf("=")+1))-parseInt(a.substring(a.indexOf("=")+1));	
		});
			
		array = array.length<=5?array:array.slice(0,5); 
		
		var myTable = "<table border='1'><tr><th>姓名</th><th>秒数</th></tr>";
		for(var i=0,len=array.length;i<len;i++){
			myTable += "<tr><td>"+array[i].substring(array[i].indexOf(":")+1,array[i].indexOf("="))+"</td>"+
						"<td>"+array[i].substring(array[i].indexOf("=")+1)+"</td></tr>";
		}
		myTable += "</table>";

		document.getElementById("result").innerHTML = myTable;
	}
};

/**
   1.怪物每隔五秒会增加一个
   2.怪物需要有撞墙返回的性质。
   3.怪物的速度比英雄略慢，为100像素/秒。默认坐标在画布当中
	 随机。怪物以45度移动。
     xDirection,yDirection合起来表示
	 左上、左下、右上、右下4个方向。
*/
function Master(){
	this.x = Math.random()*canvas.width;
	this.y = Math.random()*canvas.height;
	this.speed = 100;
	this.xDirection = 1;//1表示向右 -1表示向左
	this.yDirection = 1;//1表示向下 -1表示向上
	//modifier表示两次刷新的时间间隔，可以计算出经过时间间隔后怪物的坐标。
	this.move = function(modifier){
		this.x += this.xDirection * this.speed * modifier;
		this.y += this.yDirection * this.speed * modifier;
		if(this.x + 30 >= canvas.width){//碰撞返回
			this.x = canvas.width -30;
			this.xDirection = -1;
		}else if(this.x <= 0){
			this.x = 0;
			this.xDirection = 1;	
		}

		if(this.y + 32 >= canvas.height){
			this.y = canvas.height - 32;
			this.yDirection = -1;		
		}else if(this.y<=0){
			this.y = 0;
			this.yDirection = 1;	
		}
	};
}

addEventListener("keydown", function (e) {   
	game.keysDown[e.keyCode] = true;//如果有"keydown"这个动作，即摁下某键，就会存进keysDown数组   
}, false);   
addEventListener("keyup", function (e) {   
	delete game.keysDown[e.keyCode];   
},false); 
	