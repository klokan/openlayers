describe("ol.Projection", function() {

    it("constructs instances", function() {
        var p;
        
        p = new ol.Projection("foo");
        expect(p.code()).toBe("foo");
        
        p = new ol.Projection({code: "bar"});
        expect(p.code()).toBe("bar");
        
    });
    
    it("allows units to be set", function() {
        var p;
        
        p = new ol.Projection("foo");
        expect(p.units()).toBeUndefined();
        
        p = new ol.Projection({code: "foo", units: "m"});
        expect(p.units()).toBe("m");
        
    });
    
});
