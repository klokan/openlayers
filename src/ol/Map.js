/**
 * @requires os/Base.js
 * @requires os/Location.js
 */

ol.Map = ol.Class(ol.Base, {
    
    defaults: {
        projection: "EPSG:900913",
        userProjection: "EPSG:4326"
    },
    
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

    zoom: function(level) {
        if (arguments.length === 0) {
            return this.config.zoom;
        }
        this.config.zoom = level;
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
    }

});
