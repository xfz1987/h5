//监听HTML发来的信息
addEventListener("message",function(e){
	switch(e.data){
		case "refresh":
			Math.random()<=0.3 ? postMessage(1) : postMessage(0);
			break;
		case "buy":
			Math.random()<=0.3 ? postMessage(3) : postMessage(4);
			break;
	}
},false);