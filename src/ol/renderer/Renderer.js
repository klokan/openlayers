/** @namespace ol.renderer */

ol.renderer.Renderer = ol.Class(ol.Base, /** @lends ol.renderer.Renderer# **/ {
    
    /**
        Construct a new renderer.
        
        @extends ol.Base
        @constructs ol.renderer.Renderer
        @param {Object} config - Initial properties for the renderer
        @param {*} config.target - Target for rendered view
     */
    initialize: function(config) {
    },
    
    /**
        Render a view of the provided layers to the target.
        
        @param {Object} config - Configuration properties
        @param {Array.<ol.Layer>} layers - List of layers to render.
        @param {ol.Bounds} bounds - Bounds for rendered views.
        @param {Number} resolution - Output resolution (map units per pixel).
        @param {Boolean} force - Force layers to update data.
        @returns ol.Renderer - This renderer
     */
    draw: function(layers, bounds, resolution, force) {
    },
    
    /**
        Determine if this renderer is supported in the current environment.
        
        @returns {Boolean} This renderer is supported.
     */
    isSupported: function() {
    }
    
});
