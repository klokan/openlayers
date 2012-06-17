/**
    @requires ol/Base.js
    @requires ol/Projection.js
 */

ol.Location = ol.Class(ol.Base, {
    
    properties: ["x", "y", "z"],

    initialize: function(config) {
        if (ol.isArray(config)) {
            config = {
                x: config[0], y: config[1], z: config[2]
            };
        }
        ol.Base.prototype.initialize.call(this, config);
    },

    projection: function(proj) {
        if (arguments.length === 0) {
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
        var loc = ol.Location(ol.Projection.transform(
            {x: this.x(), y: this.y(), z: this.z()}, this.projection(), to
        ));
        return loc.projection(to.code());
    }
    
});
