(function(global) {


    //Static Register routes
    var Router1 = Backbone.Router.extend({
        routes: {
            "help":                 "help",    // #help
            "search/:query":        "search",  // #search/kiwis
            "search/:query/p:page": "search"   // #search/kiwis/p7
        },

        help: function() {
            console.error("help");
        },

        search: function(query, page) {
            console.error("search");
        }

    });


    var wRouter = global.router = new Router1();
    Backbone.history.start();
    wRouter.navigate("search/" + new Date().getTime(), {trigger: true});


    //Dynamic Register routes
    var Router2 = Backbone.Router.extend({
    });
    var r2 = new Router2();
    var fn1 = function(){console.info("F1")}
    var fn2 = function(){console.info("F2")}
    var fn3 = function(){console.info("F3")}
    r2.route("f1", "Func1", fn1);
    r2.route("f2", "Func2", fn2);
    r2.route("f3", "Func3", fn3);
    r2.navigate("help/troubleshooting", {trigger: true});

})(this);