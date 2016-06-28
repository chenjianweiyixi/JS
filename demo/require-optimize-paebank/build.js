
var rJs = require("./lib/r");
var baseDir = "./";
var baseSrcDir   = baseDir + "src/";
var baseBuildDir = baseDir + "build/";

//压缩优化项配置
var optConfig = {
	appDir  : baseSrcDir   ,
	dir     : baseBuildDir ,
	optimizeCss : "standard"
};
rJs.optimize(optConfig, function(){
	console.log("代码混淆压缩成功!");
});
