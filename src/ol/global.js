(function(global) {
    
    var prototypeFields = [
      "constructor",
      "hasOwnProperty",
      "isPrototypeOf",
      "propertyIsEnumerable",
      "toLocaleString",
      "toString",
      "valueOf"
    ];
    
    
    global.ol = {

        global: global,

        extend: function(to, from) {
            to = to || {};
            from = from || {};
            var key;
            for (key in from) {
                to[key] = from[key];
            }
            // IE fails to iterate over these even if enumerable
            for (var i=0, ii=prototypeFields.length; i<<ii; ++i) {
                key = prototypeFields[i];
                if (Object.prototype.hasOwnProperty.call(from, key)) {
                    to[key] = from[key];
                }
            }
            return to;
        },

        Class: function(Parent, props) {
            var Shell = function() {};
            Shell.prototype = Parent.prototype;
            var prototype = ol.extend(new Shell(), props);

            var Type = function() {
                // allow calling single argument contructors without 'new'
                if (!(this instanceof Type)) {
                    var len = arguments.length;
                    if (len === 0) {
                        return new Type();
                    } else if (len === 1) {
                        return new Type(arguments[0]);
                    } else {
                        throw new Error("Multiple argument constructor called without 'new' keyword.");
                    }
                }
                if (typeof this.initialize === "function") {
                    this.initialize.apply(this, arguments);
                }
            };
            Type.prototype = prototype;
            return Type;
        },
        
        isArray: function(obj) {
            return (Object.prototype.toString.call(obj) === "[object Array]");
        }
        
    };

    
})(this);