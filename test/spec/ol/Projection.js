describe("ol.Projection", function() {

    it("constructs instances", function() {
        var p;
        
        p = new ol.Projection("foo");
        expect(p.code()).toBe("foo");
        
        p = new ol.Projection({code: "bar"});
        expect(p.code()).toBe("bar");
        
    });
    
});
