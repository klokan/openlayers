/**
 * @requires ol/Base.js
 * @requires ol/Projection.js
 */

ol.Location = ol.Class(ol.Base, {

    defaults: {
        projection: "EPSG:4326"
    },
    
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
    },
    
    projection: function(proj) {
        if (arguments.length === 0) {
            if (!("projection" in this.config)) {
                this.projection(this.defaults.projection);
            }
            return this.config.projection;
        }
        if (!(proj instanceof ol.Projection)) {
            proj = new ol.Projection(proj);
        }
        this.config.projection = proj;
        return this;
    },
    
    transform: function(to) {
        if (!(to instanceof ol.Projection)) {
            to = new ol.Projection(to);
        }
        loc = ol.Location(ol.Projection.transform(
            {x: this.x(), y: this.y(), z: this.z()}, this.projection(), to
        ));
        return loc.projection(to.code());
    }
    
});
