/**
 * @requires os/Base.js
 * @requires os/Location.js
 */

ol.Map = ol.Class(ol.Base, {
    center: function(loc) {
        if (arguments.length === 0) {
            return this.config.center;
        }
        if (!(loc instanceof ol.Location)) {
            loc = new ol.Location(loc);
        }
        this.config.center = loc;
        return this;
    },
    zoom: function(level) {
        if (arguments.length === 0) {
            return this.config.zoom;
        }
        this.config.zoom = level;
        return this;
    }
});
