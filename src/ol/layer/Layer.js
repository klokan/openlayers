/**
    @requires ol/Base.js
    @requires ol/Bounds.js
 */

/** @namespace ol.layer **/
ol.layer = {};

ol.layer.Layer = ol.Class(ol.Base, /** @lends ol.layer.Layer# */ {
    
    /**
        @extends ol.Base
        @constructs ol.layer.Layer
     */
    initialize: function(config) {
        ol.Base.prototype.initialize.call(this, config);
    },
    
    /**
        Get or set the layer extent.
        
        @arg {ol.Bounds} bounds - If provided, the layer bounds will be set
        @returns {ol.Bounds | ol.layer.Layer}  If no bounds is provided, 
            the layer bounds will be returned.  If a bounds is provided, 
            the layer bounds will be set and this layer instance will be 
            returned.
     */
    extent: function(bounds) {
        if (arguments.length === 0) {
            if (!("extent" in this.config)) {
                var proj = this.projection();
                if (proj) {
                    var code = proj.code();
                    var defs = ol.Projection.defaults[code];
                    if (defs.extent) {
                        this.extent(defs.extent.slice().concat([code]));
                    }
                }
            }
            return this.config.extent;
        }
        if (!(bounds instanceof ol.Bounds)) {
            bounds = new ol.Bounds(bounds);
        }
        this.config.extent = bounds;
        return this;
    },
    
    /**
        Get or set the layer projection.
        
        @arg {ol.Projection} proj - If provided, the layer projection will be 
            set
        @returns {ol.Projection | ol.layer.Layer}  If no projection is provided, 
            the layer projection will be returned.  If a projection is provided, 
            the layer projection will be set and this layer instance will be 
            returned.
     */
    projection: function(proj) {
        if (arguments.length === 0) {
            if (!("projection" in this.config) && this.defaults && "projection" in this.defaults) {
                this.projection(this.defaults.projection);
            }
            return this.config.projection;
        }
        if (this.config.projection) {
            throw new Error("Layer projection can only be set once");
        }
        if (!(proj instanceof ol.Projection)) {
            proj = new ol.Projection(proj);
        }
        this.config.projection = proj;
        return this;
    },

    /**
        Get data for the given bounds.
        
        @arg {Object} config - Configuration properties
        @arg {ol.Bounds} config.bounds
        @arg {Number} config.resolution
        @arg {Boolean} config.force
     */
    getData: function(config) {
    }
    
    
});
