/* Copyright (c) 2006-2012 by OpenLayers Contributors (see authors.txt for 
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

/**
 * @requires ol/global.js
 * @requires ol/Base.js
 */

/**
 * Namespace: ol.Projection
 * Methods for coordinate transforms between coordinate systems.  By default,
 *     OpenLayers ships with the ability to transform coordinates between
 *     geographic (EPSG:4326) and web or spherical mercator (EPSG:900913 et al.)
 *     coordinate reference systems.  See the <transform> method for details
 *     on usage.
 *
 * Additional transforms may be added by using the <proj4js at http://proj4js.org/>
 *     library.  If the proj4js library is included, the <transform> method 
 *     will work between any two coordinate reference systems with proj4js 
 *     definitions.
 *
 * If the proj4js library is not included, or if you wish to allow transforms
 *     between arbitrary coordinate reference systems, use the <addTransform>
 *     method to register a custom transform method.
 */
ol.Projection = ol.Class(ol.Base, {

    /**
     * Property: proj
     * {Object} Proj4js.Proj instance.
     */
    proj: null,
    
    /**
     * Property: projCode
     * {String}
     */
    projCode: null,
    
    /**
     * Property: titleRegEx
     * {RegExp} regular expression to strip the title from a proj4js definition
     */
    titleRegEx: /\+title=[^\+]*/,

    /**
     * Constructor: ol.Projection
     * This class offers several methods for interacting with a wrapped 
     *     pro4js projection object. 
     *
     * Configuration properties:
     * code - {String} A string identifying the Well Known Identifier for
     *    the projection.
     * options - {Object} An optional object to set additional properties
     *     on the projection.
     *
     * Returns:
     * {<ol.Projection>} A projection object.
     */
    initialize: function(config) {
        if (typeof config === "string") {
            config = {code: config};
        }
        ol.Base.prototype.initialize.call(this, config);
        if ("Proj4js" in ol.global) {
            this.proj = new Proj4js.Proj(projCode);
        }
    },
    
    /**
     * APIMethod: code
     * Get the string SRS code.
     *
     * Returns:
     * {String} The SRS code.
     */
    code: function() {
        return this.proj ? this.proj.srsCode : this.config.code;
    },
   
    /**
     * APIMethod: units
     * Get the units string for the projection -- returns null if 
     *     proj4js is not available.
     *
     * Returns:
     * {String} The units abbreviation.
     */
    units: function() {
        return this.proj ? this.proj.units : this.config.units;
    },

    /**
     * Method: toString
     * Convert projection to string (code wrapper).
     *
     * Returns:
     * {String} The projection code.
     */
    toString: function() {
        return this.code();
    },

    /**
     * Method: equals
     * Test equality of two projection instances.  Determines equality based
     *     soley on the projection code.
     *
     * Returns:
     * {Boolean} The two projections are equivalent.
     */
    equals: function(projection) {
        var p = projection, equals = false;
        if (p) {
            if (!(p instanceof ol.Projection)) {
                p = new ol.Projection(p);
            }
            if (("Proj4js" in ol.global) && this.proj.defData && p.proj.defData) {
                equals = this.proj.defData.replace(this.titleRegEx, "") ==
                    p.proj.defData.replace(this.titleRegEx, "");
            } else if (p.code) {
                var source = this.code(), target = p.code();
                equals = source == target ||
                    !!ol.Projection.transforms[source] &&
                    ol.Projection.transforms[source][target] ===
                        ol.Projection.nullTransform;
            }
        }
        return equals;   
    },

    /* Method: destroy
     * Destroy projection object.
     */
    destroy: function() {
        delete this.proj;
        delete this.projCode;
    },
    
    CLASS_NAME: "ol.Projection" 
});     

/**
 * Property: transforms
 * {Object} Transforms is an object, with from properties, each of which may
 * have a to property. This allows you to define projections without 
 * requiring support for proj4js to be included.
 *
 * This object has keys which correspond to a 'source' projection object.  The
 * keys should be strings, corresponding to the projection.code() value.
 * Each source projection object should have a set of destination projection
 * keys included in the object. 
 * 
 * Each value in the destination object should be a transformation function,
 * where the function is expected to be passed an object with a .x and a .y
 * property.  The function should return the object, with the .x and .y
 * transformed according to the transformation function.
 *
 * Note - Properties on this object should not be set directly.  To add a
 *     transform method to this object, use the <addTransform> method.  For an
 *     example of usage, see the OpenLayers.Layer.SphericalMercator file.
 */
ol.Projection.transforms = {};

/**
 * APIProperty: defaults
 * {Object} Defaults for the SRS codes known to OpenLayers (currently
 * EPSG:4326, CRS:84, urn:ogc:def:crs:EPSG:6.6:4326, EPSG:900913, EPSG:3857,
 * EPSG:102113 and EPSG:102100). Keys are the SRS code, values are units,
 * maxExtent (the validity extent for the SRS) and yx (true if this SRS is
 * known to have a reverse axis order).
 */
ol.Projection.defaults = {
    "EPSG:4326": {
        units: "degrees",
        maxExtent: [-180, -90, 180, 90],
        yx: true
    },
    "CRS:84": {
        units: "degrees",
        maxExtent: [-180, -90, 180, 90]
    },
    "EPSG:900913": {
        units: "m",
        maxExtent: [-20037508.34, -20037508.34, 20037508.34, 20037508.34]
    }
};

/**
 * APIMethod: addTransform
 * Set a custom transform method between two projections.  Use this method in
 *     cases where the proj4js lib is not available or where custom projections
 *     need to be handled.
 *
 * Parameters:
 * from - {String} The code for the source projection
 * to - {String} the code for the destination projection
 * method - {Function} A function that takes a point as an argument and
 *     transforms that point from the source to the destination projection
 *     in place.  The original point should be modified.
 */
ol.Projection.addTransform = function(from, to, method) {
    if (method === ol.Projection.nullTransform) {
        var defaults = ol.Projection.defaults[from];
        if (defaults && !ol.Projection.defaults[to]) {
            ol.Projection.defaults[to] = defaults;
        }
    }
    if(!ol.Projection.transforms[from]) {
        ol.Projection.transforms[from] = {};
    }
    ol.Projection.transforms[from][to] = method;
};

/**
 * APIMethod: transform
 * Transform a point coordinate from one projection to another.  Note that
 *     the input point is transformed in place.
 * 
 * Parameters:
 * point - {<OpenLayers.Geometry.Point> | Object} An object with x and y
 *     properties representing coordinates in those dimensions.
 * source - {ol.Projection} Source map coordinate system
 * dest - {ol.Projection} Destination map coordinate system
 *
 * Returns:
 * point - {object} A transformed coordinate.  The original point is modified.
 */
ol.Projection.transform = function(point, source, dest) {
    if (source && dest) {
        if (!(source instanceof ol.Projection)) {
            source = new ol.Projection(source);
        }
        if (!(dest instanceof ol.Projection)) {
            dest = new ol.Projection(dest);
        }
        if (source.proj && dest.proj) {
            point = Proj4js.transform(source.proj, dest.proj, point);
        } else {
            var sourceCode = source.code();
            var destCode = dest.code();
            var transforms = ol.Projection.transforms;
            if (transforms[sourceCode] && transforms[sourceCode][destCode]) {
                transforms[sourceCode][destCode](point);
            }
        }
    }
    return point;
};

/**
 * APIFunction: nullTransform
 * A null transformation - useful for defining projection aliases when
 * proj4js is not available:
 *
 * (code)
 * ol.Projection.addTransform("EPSG:3857", "EPSG:900913",
 *     ol.Projection.nullTransform);
 * ol.Projection.addTransform("EPSG:900913", "EPSG:3857",
 *     ol.Projection.nullTransform);
 * (end)
 */
ol.Projection.nullTransform = function(point) {
    return point;
};

/**
 * Note: Transforms for web mercator <-> geographic
 * OpenLayers recognizes EPSG:3857, EPSG:900913, EPSG:102113 and EPSG:102100.
 * OpenLayers originally started referring to EPSG:900913 as web mercator.
 * The EPSG has declared EPSG:3857 to be web mercator.
 * ArcGIS 10 recognizes the EPSG:3857, EPSG:102113, and EPSG:102100 as
 * equivalent.  See http://blogs.esri.com/Dev/blogs/arcgisserver/archive/2009/11/20/ArcGIS-Online-moving-to-Google-_2F00_-Bing-tiling-scheme_3A00_-What-does-this-mean-for-you_3F00_.aspx#12084.
 * For geographic, OpenLayers recognizes EPSG:4326, CRS:84 and
 * urn:ogc:def:crs:EPSG:6.6:4326. OpenLayers also knows about the reverse axis
 * order for EPSG:4326. 
 */
(function() {

    var pole = 20037508.34;

    function inverseMercator(xy) {
        xy.x = 180 * xy.x / pole;
        xy.y = 180 / Math.PI * (2 * Math.atan(Math.exp((xy.y / pole) * Math.PI)) - Math.PI / 2);
        return xy;
    }

    function forwardMercator(xy) {
        xy.x = xy.x * pole / 180;
        xy.y = Math.log(Math.tan((90 + xy.y) * Math.PI / 360)) / Math.PI * pole;
        return xy;
    }

    function map(base, codes) {
        var add = ol.Projection.addTransform;
        var same = ol.Projection.nullTransform;
        var i, len, code, other, j;
        for (i=0, len=codes.length; i<len; ++i) {
            code = codes[i];
            add(base, code, forwardMercator);
            add(code, base, inverseMercator);
            for (j=i+1; j<len; ++j) {
                other = codes[j];
                add(code, other, same);
                add(other, code, same);
            }
        }
    }
    
    // list of equivalent codes for web mercator
    var mercator = ["EPSG:900913", "EPSG:3857", "EPSG:102113", "EPSG:102100"],
        geographic = ["CRS:84", "urn:ogc:def:crs:EPSG:6.6:4326", "EPSG:4326"],
        i;
    for (i=mercator.length-1; i>=0; --i) {
        map(mercator[i], geographic);
    }
    for (i=geographic.length-1; i>=0; --i) {
        map(geographic[i], mercator);
    }

})();
