/**
    @requires os/Base.js
    @requires os/Location.js
 */

ol.Map = ol.Class(ol.Base, /** @lends ol.Map# */ {
    
    defaults: {
        projection: "EPSG:900913",
        userProjection: "EPSG:4326"
    },
    
    /**
        @constructs ol.Map
        @arg config Object - Map configuration object
     */
    initialize: function(config) {
        ol.Base.prototype.initialize.call(this, config);
    },

    /**
        Get or set the map center.
        
        @arg {ol.Location} loc - If provided, the map will be centered at this
            location.
        @returns {ol.Location | ol.Map}  If no location is provided, the current
            map center will be returned.  If a location is provided, the map
            center will be set and this map instance will be returned.
     */
    center: function(loc) {
        if (arguments.length === 0) {
            return this.config.center.transform(this.userProjection());
        }
        if (!(loc instanceof ol.Location)) {
            loc = new ol.Location(loc);
        }
        if (!loc.projection()) {
            loc.projection(this.userProjection());
        }
        this.config.center = loc.transform(this.projection());
        return this;
    },

    /**
        Get or set the map zoom.
        
        @arg {Number} level - If provided, the map will be zoomed to this level.
        @returns {Number | ol.Map}  If no zoom level is provided, the current
            map zoom level will be returned.  If a level is provided, the map
            zoom level will be set and this map instance will be returned.
     */
    zoom: function(level) {
        if (arguments.length === 0) {
            return this.config.zoom;
        }
        this.config.zoom = level;
        return this;
    },
    
    /**
        Get or set the map projection.
        
        @arg {ol.Projection} proj - If provided, the map projection will be set
        @returns {ol.Projection | ol.Map}  If no projection is provided, the 
            current map projection will be returned.  If a projection is 
            provided, the map projection will be set and this map instance will 
            be returned.
     */
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
    
    /**
        Get or set the user projection.  The user projection is used to 
        transform coordinates when getting the map center or setting the center
        using a location without an explicitly set projection.
        
        @arg {ol.Projection} proj - If provided, the user projection will be set
        @returns {ol.Projection | ol.Map}  If no projection is provided, the 
            current user projection will be returned.  If a projection is 
            provided, the user projection will be set and this map instance will 
            be returned.
     */
    userProjection: function(proj) {
        if (arguments.length === 0) {
            if (!("userProjection" in this.config)) {
                this.userProjection(this.defaults.userProjection);
            }
            return this.config.userProjection;
        }
        if (!(proj instanceof ol.Projection)) {
            proj = new ol.Projection(proj);
        }
        this.config.userProjection = proj;
        return this;
    },
    
    /**
        Renders a view of the map to the given target.
        
        Checks through the preferredRenderers to find a suitable renderer for 
        the given environment.  Constructs a renderer and asks it to render the
        current layers.
        
        @arg {*} target - The type of target is renderer dependent.
        @returns {ol.Map} This map.
     */
    render: function(target) {
    },
    
    /**
        Update the view of the map.
        
        Calls ol.Renderer#draw with the current extent, resolution, and layers.
        
        @arg {Boolean} force - Force the renderer to fetch new data from the 
            layers.
        @returns {ol.Map} This map.
        @private
     */
    rerender: function(force) {
    }
    
});
