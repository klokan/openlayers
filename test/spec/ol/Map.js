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
        expect(center[0].toFixed(3)).toBe("-110.000");
        expect(center[1].toFixed(3)).toBe("45.000");
        expect(center instanceof ol.Location).toBe(true);
        
        // one step
        map = new ol.Map({center: [-111, 46]});

        center = map.center();
        expect(center[0].toFixed(3)).toBe("-111.000");
        expect(center[1].toFixed(3)).toBe("46.000");
        expect(center instanceof ol.Location).toBe(true);
        
        // more verbose
        map = new ol.Map({
            center: new ol.Location({x: -112, y: 47})
        });
        
        center = map.center();
        expect(center[0].toFixed(3)).toBe("-112.000");
        expect(center[1].toFixed(3)).toBe("47.000");
        expect(center instanceof ol.Location).toBe(true);
        
    });
    
    it("allows flexible setting of center and zoom", function() {
        var map, center, zoom;
        
        // chained
        map = new ol.Map().center([1, 2]).zoom(3);

        center = map.center();
        zoom = map.zoom();
        expect(center[0].toFixed(3)).toBe("1.000");
        expect(center[1].toFixed(3)).toBe("2.000");
        expect(zoom).toBe(3);
        
        // all at once
        map = new ol.Map({
            center: [4, 5],
            zoom: 6
        });

        center = map.center();
        zoom = map.zoom();
        expect(center[0].toFixed(3)).toBe("4.000");
        expect(center[1].toFixed(3)).toBe("5.000");
        expect(zoom).toBe(6);
        
    });
    
    it("has a default projection", function() {
        
        var map = new ol.Map();
        var proj = map.projection();
        
        expect(proj instanceof ol.Projection).toBe(true);
        expect(proj.code()).toBe("EPSG:900913");
        
    });

    it("allows projection to be set", function() {
        var proj;
        
        // at construction
        var map = new ol.Map({projection: "EPSG:4326"});
        proj = map.projection();
        
        expect(proj instanceof ol.Projection).toBe(true);
        expect(proj.code()).toBe("EPSG:4326");
        
        // after construction
        map.projection("EPSG:900913");
        proj = map.projection();
        
        expect(proj instanceof ol.Projection).toBe(true);
        expect(proj.code()).toBe("EPSG:900913");
        
    });
    
    it("allows a user projection to be set", function() {
        var proj;

        var map = new ol.Map();
        proj = map.userProjection();
        
        expect(proj instanceof ol.Projection).toBe(true);
        expect(proj.code()).toBe("EPSG:4326");
        
        map.center([10, 20]);
        
        map.userProjection("EPSG:900913");
        var center = map.center();
        expect(center.x().toFixed(3)).toBe("1113194.908");
        expect(center.y().toFixed(3)).toBe("2273030.927");
        
    });
    
    it("provides feedback when you mess up", function() {
        var map;
        
        // misspelling
        expect(function() {
            map = new ol.Map({
                centre: [1, 2]
            });
        }).toThrow(new Error("Unsupported config property: centre"));

    });
    
    it("is destroyable", function() {
        
        var map = new ol.Map();
        map.center([1, 2]);
        
        map.destroy();

        expect(map.config).toBeUndefined();

        expect(function() {
            map.center([3, 4]);
        }).toThrow();
        
    });
    
});
