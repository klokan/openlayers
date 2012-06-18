/**
    @requires ol/Base.js
 */

ol.Tile = ol.Class(ol.Base, /** @lends ol.Tile# */ {
    
    properties: ["size", "url", "image"],

    defaults: {
        size: 256
    },
    
    archetypes: {},
    
    /**
        @extends ol.Base
        @constructs ol.Tile
     */
    initialize: function(config) {
        ol.Base.prototype.initialize.call(this, config);
        var img = this.getArchetype(this.size()).cloneNode(false);
        this.image(img);
    },
    
    getArchetype: function(size) {
        if (!("size" in this.archetypes)) {
            this.archetypes[size] = this.createArchetype(size);
        }
        return this.archetypes[size];
    },
    
    createArchetype: function(size) {
        var img = document.createElement("image");
        img.className = "olTile";
        img.style.height = img.style.width = size + "px";
        img.src = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";
        return img;
    }
    
});

