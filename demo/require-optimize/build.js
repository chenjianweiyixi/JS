

var rJs = require("./lib/r");
var baseDir = "./";
var baseSrcDir   = baseDir + "src/";
var baseBuildDir = baseDir + "build/";
//压缩优化项配置
var optConfig = {
	appDir  : baseSrcDir   + "app01",
	dir     : baseBuildDir + "app01",
	optimize: "uglify",
	baseUrl : "modules/"
	// mainConfigFile: baseSrcDir + "MAMC/www/modules/common/main.js",
	// optimizeCss : "standard",
	// stubModules: ["text"],
	// findNestedDependencies: true,
	// removeCombined : true,
	// modules: [
		// {
			// name : "common/main"
		// },
		// {
			// name : "account/main", exclude:["commonClass/commonTools", "commonClass/dateTools", "PTRScroll"]
		// },
		// {
			// name : "accountQuery/main", exclude:["commonClass/commonTools", "commonClass/dateTools", "PTRScroll"]
		// },
		// {
			// name : "tradeRecords/main", exclude:["commonClass/commonTools", "commonClass/dateTools", "PTRScroll"]
		// }
	// ]
};
rJs.optimize(optConfig, function(){
    console.log("代码混淆压缩成功!");
});
