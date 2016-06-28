(function(global) {

    var Workspace = Backbone.Router.extend({
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

    global.history.back = function () {
        console.info(location.href);
        alert(location.href);
        // debugger;
    };

    var wRouter = global.router = new Workspace();

    Backbone.history.start();
    location.hash = "help"

    for(var i = 0; i < 10; i++ ) {
        wRouter.navigate("search/" + new Date().getTime(), {trigger: true});
    }

})(this);