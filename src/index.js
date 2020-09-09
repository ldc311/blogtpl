//import $ from 'jquery'
//webpack使用jquery另外的方法 https://www.cnblogs.com/wyxxj/p/7381050.html
//需要安装open-iconic https://www.cnblogs.com/ZaraNet/p/10255965.html
//import 'open-iconic/font/css/open-iconic-bootstrap.scss';

import 'bootstrap';
import './scss/app.scss'


// console.log($("title"));
// $("title").html('title by jquery');
// console.log($("title"));

var filename = document.URL;
var pos = filename.lastIndexOf("/");
if(pos > -1){
    filename = filename.substr(pos +1);
}
filename = filename.split(".")[0];
filename=filename.toLowerCase(); 
document.getElementById("link"+filename).classList.add("active");