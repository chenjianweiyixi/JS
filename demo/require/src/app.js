define("user",function(){ return {}});
define("temp",function(){ return {}});

require(['user', "water", "require", "two", "temp", "app"], function (user,water, cmdRequire) {
    require(["one"]);
    var A = {
        m : function () {
            var two = "two"
            require([two]);
        }
    };
    var B = {
        m : function () {
            require("three");
        }
    };

    return {app:"APP"}
});

