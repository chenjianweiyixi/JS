
var http = require('http');
var RESPONSE_STATE = {
  S_200 : 200,
  S_404 : 404
};
var port = 999;
var address = 'localhost';
var CHAR_ENCODING = "utf8";
var mainRequestHandle = function (request, response) {
  
  var postData = '';
  var index = 0;
  //request对象添加事件监听  
  //新数据块到达
  request.addListener("data", function (data) {
  	console.log("第" + (index++) + "个数据块 ：" + data + "\n");
  	postData += data;
  });
  
  //接收完所有的数据
  request.addListener("end", function () {
   console.log("接受完所有数据块 ：" + postData);
  });

  //response.writeHead(RESPONSE_STATE.S_200, {'Content-Type': 'text/plain'});
 // response.end('Hello World\n');
}
http.createServer(mainRequestHandle).listen(port, address);
console.log('Server running at : ' + address + ":" + port);




//文件管理
var fileSystem = require("fs");

var reg =/   ((/[-\+~%/\.\w]+)?/?([&?][-\+=&;%@\.\w]+)? /g


function IsURL(str_url){     
    var strRegex = "^([hH][tT]{2}[pP][sS]?://)?"      //http,https协议                      
                    + "((\d{1,3}/.){3}\d{1,3}|(((\w|[!~*'()-])+/.)+[A-Za-z]{2,4}))" //IP或域名                
                    + "(:\d+)?" //端口     
                    + "((/?)|()?"  //目标路径
					+  (/?()*)?    //参数
					+  (#[\w]*)?//hash
                    + "(/[0-9a-zA-Z_!~*'().;?:@&=+$,%#-]+)+/?)$";     
    var re=new RegExp(strRegex);     
    return re.test(str_url);    

	
	/(([A-Za-z]{3,9})://)?([-;:&=\+\$,\w]+@{1})?(([-A-Za-z0-9]+\.)+[A-Za-z]{2,3})(:\d+)?((/[-\+~%/\.\w]+)?/?([&?][-\+=&;%@\.\w]+)?(#[\w]+)?)?/g

