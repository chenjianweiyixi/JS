var  cjsRequireRegExp = /[^.]\s*require\s*\(\s*["']([^'"\s]+)["']\s*\)/g;
var   commentRegExp = /(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/mg;
var callback = function (require) {
    require("water");
    return {
        color: "black",
        size: "unisize"
    }
};
callback.toString().replace(commentRegExp, '').replace(cjsRequireRegExp, function (match, dep) {
    console.dir(match);
    console.dir(dep);
    // deps.push(dep);
});


define("a", function(){});
require(["a"]), function () {
    
};




define("a",[],function() {
    console.error("Exe"); //只执行一次
    return "dd"
});
require(["a"], function (A) {
    console.dir("A:" + A); //A:dd
});

define("a",{});
require(["a"], function (A) {
    console.dir("A:" + A); //A:[object Object]
});