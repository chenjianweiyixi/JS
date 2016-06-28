
var fs = require("fs");
var basePath = ".";

 // fs.rmdirSync("b");
 // return 
 
// fs.unlinkSync('a/a.js', function (err) {
	// console.log(err);
// });
// return;


//相对路径的根路劲是Node运行时所在的路径 , 例：D:\Workspace\Aptana_Studio_3_Workspace\JavaScript_Utils\com\icm>
// var files = fs.readdirSync('./');
// var files = fs.readdirSync(basePath + '/temp');
 // fs.rmdirSync("./temp");
// var files = fs.readdirSync('./temp');
// console.log(files);
// 
// files.forEach(function(file){
	// console.log("文件[" + file + "] 是" + ( fs.lstatSync("temp/" + file).isDirectory() ? "径路" : "文件"));
	 // // fs.unlinkSync("temp"); 
	 // fs.rmdirSync("./temp");
// });


//


//删除文件或文件夹
function rmFile (file, callback) {
	var fs = require("fs");
	if( fs.existsSync(file) ) {
		if( fs.lstatSync(file).isFile()) {
			fs.unlinkSync(file);  //删除文件
			callback && callback();
		} else {
			/*
				删除文件夹的方式：
				（1）调用系统命令
				（2）使用NodeJS API
			*/
			
			 /**
			//调用系统命令删除文件夹
			var exec = require('child_process').exec;			
			exec('rd /s/q ' +file ,function(err,out) { 
			 if (err) {
			 	callback && callback(err);
			 	console.log("删除文件夹【" + file + "】 报错 ： " + err);
			 	return;
			 } 
			  console.log("成功删除文件夹【" + file + "】 !"); 			
			});
			return;
		   **/
			
			//调用NodeJS API采用递归方式删除文件夹
			var rmdirsSync = (function(){
			    function unshiftDirs(dir,dirArr){
			            dirArr.unshift(dir);//收集目录,后放的index靠前
			            var files = fs.readdirSync(dir);
			            files.forEach(function(fileEl){
			            	var tempPath = dir + "/" + fileEl;
			            	if(fs.statSync(tempPath).isDirectory()){
			            		unshiftDirs(tempPath, dirArr);
			            	} else {
			            		fs.unlinkSync(tempPath); ////删除文件
			            	}
			            });
			    }
			    return function(dir, onSucc, onErr){
			        callback = err || function(){};
			        var dirArr = [];	 
			        try{
			            unshiftDirs(dir,dirArr);
			            console.log("所有文件夹路径： " + dirArr);
			            //一次性删除所有收集到的目录
			            dirArr.forEach(function(dir) {
			                fs.rmdirSync(dir);  //删除目录
			            });
			            onSucc && onSucc();
			        }catch(e){
			        	//如果文件或目录本来就不存在，fs.statSync会报错，不过我们还是当成没有异常发生
			            // e.code === "ENOENT" ? callback() : callback(e);
			            onErr && onErr(e);
			        }
			    };
			})();
			
			rmdirsSync(file, callback);
		}
	}
		
}


rmFile("a", function (err) {
	if(err) {
		console.log("删除操作报错！");
		console.log(err);
		return;
	}
	console.log("删除操作成功！");
});




