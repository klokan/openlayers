/* Copyright (c) 2006-2012 by OpenLayers Contributors (see authors.txt for 
 * full list of contributors). Published under the Clear BSD license.  
 * See http://svn.openlayers.org/trunk/openlayers/license.txt for the
 * full text of the license. */

/**
 * @requires OpenLayers/Layer/XYZ.js
 * @requires OpenLayers/Tile/UTFGrid.js
 */

/** 
 * Class: OpenLayers.Layer.UTFGrid
 * This Layer reads from UTFGrid tiled data sources.  Since UTFGrids are 
 * essentially JSON-based ASCII art with attached attributes, they are not 
 * visibly rendered.  In order to use them in the map, you must add a 
 * <OpenLayers.Control.UTFGrid> ontrol as well.
 *
 * Example:
 *
 * (start code)
 * var world_utfgrid = new OpenLayers.Layer.UTFGrid({
 *     url: "/tiles/world_utfgrid/${z}/${x}/${y}.json",
 *     utfgridResolution: 4,
 *     displayInLayerSwitcher: false
 * );
 * map.addLayer(world_utfgrid);
 * 
 * var control = new OpenLayers.Control.UTFGrid({
 *     layers: [world_utfgrid],
 *     handlerMode: 'move',
 *     callback: function(dataLookup) {
 *         // do something with returned data
 *     }
 * })
 * (end code)
 *
 * 
 * Inherits from:
 *  - <OpenLayers.Layer.XYZ>
 */
OpenLayers.Layer.UTFGrid = OpenLayers.Class(OpenLayers.Layer.XYZ, {
    
    /**
     * APIProperty: isBaseLayer
     * Default is true, as this is designed to be a base tile source. 
     */
    isBaseLayer: false,
    
    /**
     * APIProperty: projection
     * {<OpenLayers.Projection>}
     * Source projection for the UTFGrids.  Default is "EPSG:900913".
     */
    projection: new OpenLayers.Projection("EPSG:900913"),

    /**
     * Property: useJSONP
     * {Boolean}
     * Should we use a JSONP script approach instead of a standard AJAX call?
     *
     * Set to true for using utfgrids from another server. 
     * Avoids same-domain policy restrictions. 
     * Note that this only works if the server accepts 
     * the callback GET parameter and dynamically 
     * wraps the returned json in a function call.
     * 
     * Default is false
     */
    useJSONP: false,
    
    /**
     * APIProperty: highlightStyle
     * {<OpenLayers.Symbolizer>}
     */
    highlightStyle: null,
    
    /**
     * APIProperty: url
     * {String}
     * URL tempate for UTFGrid tiles.  Include x, y, and z parameters.
     * E.g. "/tiles/${z}/${x}/${y}.json"
     */

    /**
     * APIProperty: utfgridResolution
     * {Number}
     * Ratio of the pixel width to the width of a UTFGrid data point.  If an 
     *     entry in the grid represents a 4x4 block of pixels, the 
     *     utfgridResolution would be 4.  Default is 2 (specified in 
     *     <OpenLayers.Tile.UTFGrid>).
     */

    /**
     * Property: tileClass
     * {<OpenLayers.Tile>} The tile class to use for this layer.
     *     Defaults is <OpenLayers.Tile.UTFGrid>.
     */
    tileClass: OpenLayers.Tile.UTFGrid,

    /**
     * Property: highlightedFeatures
     * {Array}
     * List of identifiers for currently highlighted features.
     */
    highlightedFeatures: null,
    
    /**
     * Constructor: OpenLayers.Layer.UTFGrid
     * Create a new UTFGrid layer.
     *
     * Parameters:
     * config - {Object} Configuration properties for the layer.
     *
     * Required configuration properties:
     * url - {String} The url template for UTFGrid tiles.  See the <url> property.
     */
    initialize: function(options) {
        OpenLayers.Layer.Grid.prototype.initialize.apply(
            this, [options.name, options.url, {}, options]
        );
        this.tileOptions = OpenLayers.Util.extend({
            utfgridResolution: this.utfgridResolution
        }, this.tileOptions);

        if (this.highlightStyle) {
            this.setHighlightStyle(this.highlightStyle);
            // optional canvas for highlighting features
            this.highlightCanvas = document.createElement("canvas");
            this.highlightCanvas.style.position = "absolute";
            this.div.appendChild(this.highlightCanvas);        
            this.highlightContext = this.highlightCanvas.getContext("2d");
            this.highlightedFeatures = [];
        }
    },
    
    /**
     * APIMethod: clone
     * Create a clone of this layer
     *
     * Parameters:
     * obj - {Object} Only used by a subclass of this layer.
     * 
     * Returns:
     * {<OpenLayers.Layer.UTFGrid>} An exact clone of this OpenLayers.Layer.UTFGrid
     */
    clone: function (obj) {
        if (obj == null) {
            obj = new OpenLayers.Layer.UTFGrid(this.getOptions());
        }

        // get all additions from superclasses
        obj = OpenLayers.Layer.Grid.prototype.clone.apply(this, [obj]);

        return obj;
    },    

    /**
     * Method: moveTo
     * Override to provide an <afterMoveTo> method.
     */
    moveTo: function() {
        OpenLayers.Layer.Grid.prototype.moveTo.apply(this, arguments);
        window.setTimeout(OpenLayers.Function.bind(this.afterMoveTo, this), 0);
    },
    
    /**
     * Method: afterMoveTo
     * Called after the <moveTo> sequence has finished.
     */
    afterMoveTo: function() {
        if (this.map && this.highlightStyle) {
            this.updateHighlight();
        }
    },
    
    /**
     * APIMethod: setHighlightStyle
     * Update the style for highlighted features.
     * 
     * Parameters:
     * symbolizer - {<OpenLayers.Symbolizer>}
     */
    setHighlightStyle: function(symbolizer) {
        var fill;
        var fo = symbolizer.fillOpacity;
        var opacity;
        if (fo >= 0 && fo <= 1) {
            opacity = 255 * fo | 0;
        } else {
            opacity = 255;
        }
        var fc = symbolizer.fillColor;
        if (fc) {
            fill = [
                parseInt(fc.substr(1, 2), 16),
                parseInt(fc.substr(3, 2), 16),
                parseInt(fc.substr(5, 2), 16),
                opacity
            ];
        } else {
            fill = [0, 0, 0, opacity];
        }
        this.highlightStyle = {fill: fill};
    },
    
    /**
     * APIMethod: highlightFeatures
     * Highlight features based on their identifiers.
     *
     * Parameters:
     * ids - {Array} List of feature identifers.
     * keepExisting - {Boolean} Keep any existing features highlighted.  Default
     *     is false.
     */
    highlightFeatures: function(ids, keepExisting) {
        if (!keepExisting) {
            this.highlightedFeatures.length = 0;
        }
        this.highlightedFeatures = this.highlightedFeatures.concat(ids);
        this.updateHighlight();
    },
    
    /**
     * Method: updateHighlight
     * Called when highlighting needs an update.
     *
     * TODO: rework this monstrosity
     */
    updateHighlight: function() {
        var map = this.map;
        var size = map.getSize();
        var cols = size.w;
        var rows = size.h;
        var style = map.layerContainerDiv.style;
        var canvas = this.highlightCanvas;
        canvas.width = cols;
        canvas.height = rows;
        canvas.style.top = (-parseInt(style.top)) + "px";
        canvas.style.left = (-parseInt(style.left)) + "px";
        canvas.style.width = cols + "px";
        canvas.style.height = rows + "px";
        if (this.highlightStyle && this.highlightedFeatures.length > 0) {
            var fill = this.highlightStyle.fill;
            var bounds = map.getExtent();
            var imageData = this.highlightContext.createImageData(cols, rows);
            var data = imageData.data;
            var tiles = this.grid;
            var j, jj, i, ii, tileRow, tile, tileBounds, originPx, grid, utfResolution, 
                gridX, gridY, gridH, gridW, gridRow,
                tilePixelX, tilePixelY,
                mapPixelX, mapPixelY, featureId, offset;
            for (j=0, jj=tiles.length; j<jj; ++j) {
                tileRow = tiles[j];
                for (i=0, ii=tileRow.length; i<ii; ++i) {
                    tile = tileRow[i];
                    tileBounds = tile.bounds;
                    originPx = map.getPixelFromLonLat({
                        lon: tileBounds.left, lat: tileBounds.top
                    });
                    if (tile.json && tileBounds.intersectsBounds(bounds)) {
                        grid = tile.json.grid;
                        gridH = grid.length;
                        utfResolution = tile.utfgridResolution;
                        for (gridY=0; gridY<gridH; ++gridY) {
                            tilePixelY = gridY * utfResolution;
                            mapPixelY = originPx.y + tilePixelY;
                            if (mapPixelY >= 0 && mapPixelY < rows) {
                                gridRow = grid[gridY];
                                gridW = gridRow.length;
                                for (gridX=0; gridX<gridW; ++gridX) {
                                    tilePixelX = gridX * utfResolution;
                                    mapPixelX = originPx.x + tilePixelX;
                                    if (mapPixelX >= 0 && mapPixelX < cols) {
                                        featureId = tile.getFeatureId(tilePixelX, tilePixelY);
                                        if (~this.highlightedFeatures.indexOf(featureId)) {
                                            for (var rx=0; rx<utfResolution; ++rx) {
                                                for (var ry=0; ry<utfResolution; ++ry) {
                                                    offset = 4 * ((mapPixelY + ry) * cols + (mapPixelX + rx));
                                                    data[offset + 0] = fill[0];
                                                    data[offset + 1] = fill[1];
                                                    data[offset + 2] = fill[2];
                                                    data[offset + 3] = fill[3];
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            this.highlightContext.putImageData(imageData, 0, 0);
        }
    },

    /**
     * APIProperty: getFeatureInfo
     * Get details about a feature associated with a map location.  The object
     *     returned will have id and data properties.  If the given location
     *     doesn't correspond to a feature, null will be returned.
     *
     * Parameters:
     * location - {<OpenLayers.LonLat>} map location
     *
     * Returns:
     * {Object} Object representing the feature id and UTFGrid data 
     *     corresponding to the given map location.  Returns null if the given
     *     location doesn't hit a feature.
     */
    getFeatureInfo: function(location) {
        var info = null;
        var tileInfo = this.getTileData(location);
        if (tileInfo.tile) {
            info = tileInfo.tile.getFeatureInfo(tileInfo.i, tileInfo.j);
        }
        return info;
    },

    /**
     * APIMethod: getFeatureId
     * Get the identifier for the feature associated with a map location.
     *
     * Parameters:
     * location - {<OpenLayers.LonLat>} map location
     *
     * Returns:
     * {String} The feature identifier corresponding to the given map location.
     *     Returns null if the location doesn't hit a feature.
     */
    getFeatureId: function(location) {
        var id = null;
        var info = this.getTileData(location);
        if (info.tile) {
            id = info.tile.getFeatureId(info.i, info.j);
        }
        return id;
    },

    CLASS_NAME: "OpenLayers.Layer.UTFGrid"
});
