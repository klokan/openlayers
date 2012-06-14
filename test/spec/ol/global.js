var global = this;

describe("ol namespace", function() {
    
    it("has a reference to global", function() {
        
        expect(ol.global).toBe(global);
        
    });
    
    it("has an extend method for copying properties", function() {
        
        var to = {};
        var from = {foo: "bar", toString: function() {return this.foo}};
        
        var obj = ol.extend(to, from);
        
        expect(to.foo).toBe("bar");
        expect(to.toString()).toBe("bar");

    });
    
});
        