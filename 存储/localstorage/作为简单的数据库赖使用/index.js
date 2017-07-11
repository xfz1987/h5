/**
 * Created by Administrator on 2015/8/13.
 */
function save(){
  var data = new Object;
  data.name = document.getElementById("name").value;
  data.email = document.getElementById("email").value;
  data.tel = document.getElementById("tel").value;
  data.memo = document.getElementById("memo").value;
  var str = JSON.stringify(data);
  localStorage.setItem(data.name,str);
  alert("success!")
}

function search(id){
  var search = document.getElementById("search").value;
  var str = localStorage.getItem(search);
  console.log(str);
  if(str != null){
    var data = JSON.parse(str);
    var result = "姓名:" + data.name + "<br/>";
    result += "Emali:" + data.email + "<br/>";
    result += "电话:" + data.tel + "<br/>";
    result += "备注:" + data.memo + "<br/>";
    var target = document.getElementById("msg");
    target.innerHTML = result;
  }
}
