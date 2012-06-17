/**
    @requires os/global.js
 */

ol.Base = ol.Class(Object, /** @lends ol.Base# */ {
    
    /**
        @constructs ol.Base
     */
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
    
    /**
        Deletes all properties of this object.
     */
    destroy: function() {
        for (var prop in this) {
            delete this[prop];
        }
    }
});
