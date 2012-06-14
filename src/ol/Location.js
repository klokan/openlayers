/**
 * @requires os/Base.js
 */

ol.Location = ol.Class(ol.Base, {
    initialize: function(config) {
        if (ol.isArray(config)) {
            config = {
                x: config[0], y: config[1], z: config[2]
            }
        }
        ol.Base.prototype.initialize.call(this, config);
    },
    x: function(x) {
        if (arguments.length === 0) {
            return this.config.x;
        }
        this.config.x = x;
        this[0] = x;
        return this;
    },
    y: function(y) {
        if (arguments.length === 0) {
            return this.config.y;
        }
        this.config.y = y;
        this[1] = y;
        return this;
    },
    z: function(z) {
        if (arguments.length === 0) {
            return this.config.z;
        }
        this.config.z = z;
        this[2] = z;
        return this;
    }
});
