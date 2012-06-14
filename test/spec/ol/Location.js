describe("ol.Location", function() {
    
    it("allows flexible construction", function() {
        var loc;

        // nowhere
        loc = new ol.Location();
        expect(loc instanceof ol.Location).toBe(true);
        
        // obj config
        loc = new ol.Location({x: 10, y: 20});
        
        expect(loc.x()).toBe(10);
        expect(loc.y()).toBe(20);
        
        // array config
        loc = new ol.Location([30, 40]);

        expect(loc.x()).toBe(30);
        expect(loc.y()).toBe(40);
        
    });

    it("accounts for the third dimension", function() {
        var loc;
        
        // obj config
        loc = new ol.Location({x: 10, y: 20, z: 30});
        
        expect(loc.z()).toBe(30);
        
        // array config
        loc = new ol.Location([40, 50, 60]);
        
        expect(loc.z()).toBe(60);

    });
    
    it("allows bracket notation for coordinate access", function() {

        var loc = new ol.Location({x: 1.2, y: 2.3, z: 3.4});
        
        expect(loc[0]).toBe(1.2);
        expect(loc[1]).toBe(2.3);
        expect(loc[2]).toBe(3.4);

    });
    
    it("is mutable", function() {
        
        var loc = new ol.Location();
        
        loc.x(10).y(20).z(30);
        
        expect(loc.x()).toBe(10);
        expect(loc.y()).toBe(20);
        expect(loc.z()).toBe(30);

        loc.x(1).y(2).z(3);
        
        expect(loc.x()).toBe(1);
        expect(loc.y()).toBe(2);
        expect(loc.z()).toBe(3);

    });
    
    it("is destroyable", function() {
        
        var loc = new ol.Location([1, 2]);
        loc.destroy();

        expect(loc.config).toBeUndefined();

        expect(function() {
            loc.x();
        }).toThrow();
        
    });
    
});
