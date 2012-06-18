/**
    @requires ol/layer/Layer.js
 */

ol.layer.XYZ = ol.Class(ol.layer.Layer, /** @lends ol.layer.XYZ# */ {
    
    defaults: {
        projection: "EPSG:900913",
        tileSize: 256
    },
    
    properties: ["template", "tileSize"],
    
    /** 
        @constant
        @type {RegExp}
     */
    _TEMPLATE_RX: /\{\s*([\w_])+\s*\}/g,

    /** 
        Used to hash URL param strings for multi-server selection.
        Set to the Golden Ratio per Knuth's recommendation.
        
        @constant
        @type {Number}
     */
    _URL_HASH_FACTOR: (Math.sqrt(5) - 1) / 2,
    
    /**
        @extends ol.layer.Layer
        @constructs ol.layer.XYZ
     */
    initialize: function(config) {
        ol.layer.Layer.prototype.initialize.call(this, config)
    },

    /**
        Implements the standard floating-point multiplicative
        hash function described by Knuth, and hashes the contents of the 
        given param string into a float between 0 and 1. This float is then
        scaled to the size of the provided urls array, and used to select
        a URL.
        
        @arg {String} string
        @arg {String[]} urls
        
        @retruns {String} An entry from the urls array, deterministically 
            selected based on the string.
     */
    selectUrl: function(string, urls) {
        var product = 1;
        for (var i=0, len=string.length; i<len; i++) { 
            product *= string.charCodeAt(i) * this._URL_HASH_FACTOR; 
            product -= Math.floor(product); 
        }
        return urls[Math.floor(product * urls.length)];
    },
    
    /**
        @arg {ol.Bounds} bounds
        
        @returns {String} A string with the layer's url and parameters and also 
            the passed-in bounds and appropriate tile size specified as
            parameters.
     */
    getURL: function(bounds) {
        var xyz = this.getXYZ(bounds);
        var url = this.template();
        if (ol.isArray(url)) {
            url = this.selectUrl('' + xyz.x + xyz.y + xyz.z, url);
        }
        return url.replace(this._TEMPLATE_RX, function(key) {
            if (!(key in xyz)) {
                throw new Error("Unrecognized url template variable: " + key);
            }
            return xyz[key];
        })
    },

    /**
        Calculates x, y and z for the given bounds.
        
        @arg {ol.Bounds} bounds
        
        @returns An object with x, y and z properties.
     */
    getXYZ: function(tileBounds) {
        var res = this.resolution();
        var extent = this.extent();
        var size = this.tileSize();
        var x = Math.round((tileBounds.minX() - extent.minX()) /
            (res * size));
        var y = Math.round((extent.maxY() - tileBounds.maxY()) /
            (res * size));
        var z = this.getServerZoom(res);

        if (this.wrapDateLine) {
            var limit = Math.pow(2, z);
            x = ((x % limit) + limit) % limit;
        }

        return {x: x, y: y, z: z};
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
