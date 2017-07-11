//当前Worker用于完成计数的累加功能
var sum = 0;
function addNum(){	
	//当前文件是worker，可以直接调用postMessage()
	postMessage(++sum);	

	setTimeout(addNum,1000);
}
addNum();