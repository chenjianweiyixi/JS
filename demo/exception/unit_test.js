console.trace(this);

try {
    throw "dd";
} catch (exception) {
    console.error(exception)
}

try {
    throw {a:"A"};
} catch (exception) {
    console.error(exception)
}

try {
    throw new Error("dfsf");
} catch (exception) {
    console.error(exception)
}


var foo = function(){
    throw new Error("dsf");
};
var goo = function(){
    foo();
};
var hoo = function(){
    goo();
};
//hoo();


//UnitTest:测试
var object = {
    foo: function(){
        throw new Error("TTT");
    },
    goo: function(){
        this.foo();
    },
    hoo: function(){
        this.goo();
    }
}
//object.hoo();


var wrapper = {
    object: {
        foo: function(){
            throw new Error("TTT");
        },
        goo: function(){
            this.foo();
        },
        hoo: function(){
            this.goo();
        }
    }
}
//wrapper.object.hoo();


var outer = {};
var object = {
    foo: function(){
        throw new Error("TTTI");
    },
    goo: function(){
        this.foo();
    },
    hoo: function(){
        this.goo();
    }
};

// outer.object = object;
// outer.object.hoo();

(function () {
    var outer = {};
    var object = {
        foo: function(){
            throw new Error("TTT03");
        },
        goo: function(){
            this.foo();
        },
        hoo: function(){
            this.goo();
        }
    };
    outer.object = object;
    debugger;
    outer.object.hoo();
})();

var namedFunction = function(){
    throw "GOO";
};
namedFunction();