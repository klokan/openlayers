// base object constructor
ol.Base = ol.Class(Object, {
    initialize: function(config) {
        this.config = config = ol.extend({}, config);
        var name, member;
        for (name in config) {
            member = this[name];
            if (typeof member === "function") {
                member.call(this, config[name]);
            } else {
                throw new Error("Unsupported config property: " + name);
            }
        }
    },
    destroy: function() {
        for (var prop in this) {
            delete this[prop];
        }
    }
});
