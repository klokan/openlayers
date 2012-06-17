/**
    @requires ol/Base.js
    @requires ol/Projection.js
 */

ol.Bounds = ol.Class(ol.Base, /** @lends ol.Bounds# */ {
    
    properties: ["minX", "minY", "maxX", "maxY"],

    /**
        Create a new bounds instance.
        
        @extends ol.Base
        @constructs ol.Bounds
        @arg {Object} config - Configuration properties.
        @arg {Number} config.minX - Minimum x-coordinate
        @arg {Number} config.minY - Minimum y-coordinate
        @arg {Number} config.maxX - Maximum x-coordinate
        @arg {Number} config.maxX - Maximum y-coordinate
        @arg {ol.Projection} config.projection - Bounds projection
     */
    initialize: function(config) {
        if (ol.isArray(config)) {
            config = {
                minX: config[0], minY: config[1], 
                maxX: config[2], maxY: config[3],
                projection: config[4]
            };
        }
        ol.Base.prototype.initialize.call(this, config);
    },

    /**
        Get or set the bounds projection.
        
        @arg {ol.Projection} proj - If provided, the bounds projection will be 
            set
        @returns {ol.Projection | ol.Bounds}  If no projection is provided, the 
            current bounds projection will be returned.  If a projection is 
            provided, the bounds projection will be set and this bounds instance
            will be returned.
     */
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
    
    /**
        Create a new bounds that is this bounds transformed to another 
        projection.
        
        @arg {ol.Projection} to - The destination projection
        @returns {ol.Projection} A new bounds with transformed coordinates.
     */
    transform: function(to) {
        if (!(to instanceof ol.Projection)) {
            to = new ol.Projection(to);
        }
        var transform = ol.Projection.transform,
            config = this.config,
            minX = config.minX,
            maxX = config.minX,
            minY = config.minY,
            maxY = config.maxY,
            proj = config.projection,
            ll = transform({x: minX, y: minY}, proj, to),
            lr = transform({x: maxX, y: minY}, proj, to),
            ur = transform({x: maxX, y: maxY}, proj, to),
            ul = transform({x: minX, y: maxY}, proj, to);
        return new ol.Bounds({
            minX: Math.min(ll.x, ul.x),
            maxX: Math.max(lr.x, ur.x),
            minY: Math.min(ll.y, lr.y),
            maxY: Math.max(ul.y, ur.y),
            projection: to.code()
        });
    }
    
});
