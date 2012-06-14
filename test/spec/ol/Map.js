describe("ol.Map", function() {
    
    it("should be easy to make a map", function() {
        var map;
        
        // old school
        map = new ol.Map();
        expect(map instanceof ol.Map).toBe(true);
        
        // new school
        map = ol.Map();
        expect(map instanceof ol.Map).toBe(true);
        
    });

    it("should be easy to set the map center", function() {
        var map, center;

        // two step
        map = new ol.Map();
        map.center([-110, 45]);
        
        center = map.center();
        expect(center[0]).toBe(-110);
        expect(center[1]).toBe(45);
        expect(center instanceof ol.Location).toBe(true);
        
        // one step
        map = new ol.Map({center: [-111, 46]});

        center = map.center();
        expect(center[0]).toBe(-111);
        expect(center[1]).toBe(46);
        expect(center instanceof ol.Location).toBe(true);
        
        // more verbose
        map = new ol.Map({
            center: new ol.Location({x: -112, y: 47})
        });
        
        center = map.center();
        expect(center[0]).toBe(-112);
        expect(center[1]).toBe(47);
        expect(center instanceof ol.Location).toBe(true);
        
    });
    
    it("should be easy to set center and zoom", function() {
        var map, center, zoom;
        
        // chained
        map = new ol.Map().center([1, 2]).zoom(3);

        center = map.center();
        zoom = map.zoom();
        expect(center[0]).toBe(1);
        expect(center[1]).toBe(2);
        expect(zoom).toBe(3);
        
        // all at once
        map = new ol.Map({
            center: [4, 5],
            zoom: 6
        });

        center = map.center();
        zoom = map.zoom();
        expect(center[0]).toBe(4);
        expect(center[1]).toBe(5);
        expect(zoom).toBe(6);
        
    });
    
    it("should be obvious when you mess up", function() {
        var map;
        
        // misspelling
        expect(function() {
            map = new ol.Map({
                centre: [1, 2]
            });
        }).toThrow(new Error("Unsupported config property: centre"));

    });
    
    it("should be easy to destroy a map", function() {
        
        var map = new ol.Map();
        map.center([1, 2]);
        
        map.destroy();

        expect(map.config).toBeUndefined();

        expect(function() {
            map.center([3, 4]);
        }).toThrow();
        
    });
    
});
