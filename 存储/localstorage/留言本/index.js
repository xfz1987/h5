/**
 * Created by Administrator on 2015/8/13.
 */
window.onload = function(){
  loadRec("msg");
}
function saveRec(id){
  var textarea = document.getElementById(id);
  var data = textarea.value;
  var time = new Date();
  var d = time.toLocaleDateString();
  var t = time.toLocaleTimeString();
  var date = d + " " + t;
  localStorage.setItem(date,data);
  loadRec("msg");
  textarea.value = "";
}
function loadRec(id){
  var result = "<table border='1' bgcolor='#eee'>";
  for(var i=0;i<localStorage.length;i++){
    var key = localStorage.key(i);
    var value = localStorage.getItem(key);
    result += "<tr>" +
                 "<td>" + key + "</td><td style='background:yellow;'>" + value + "</td>" +
                 "<td>" +
                    "<button style='background:#29bb9c;' id='" + key + "'>DEL</button>" +
                "</td>" +
              "</tr>";
  }
  result += "</table>";
  document.getElementById(id).innerHTML = result;

  var table = document.querySelector("table");
  table.addEventListener("click",function(event){
    var target = event.target || event.srcElement;
    delRec(target.id);
  },true);
}

function clearRec(){
  localStorage.clear();
  loadRec("msg");
}
function delRec(key){
  localStorage.removeItem(key);
  loadRec("msg");
}
