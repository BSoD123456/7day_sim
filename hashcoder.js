
var hashcoder = (function() {
    
    var COMP_HD = '!';
    
    return {
        encode: function(s) {
            var h = Base64.encode(s);
            var comp_s = String.fromCharCode.apply(null, pako.deflate(s));
            var comp_h = Base64.encode(comp_s);
            if(comp_h.length < h.length) {
                return COMP_HD + comp_h;
            } else {
                return h
            }
        },
        decode: function(h) {
            if(h[0] == COMP_HD) {
                var src_uarr = pako.inflate(Base64.decode(h.slice(1)));
                return new TextDecoder('utf-8').decode(src_uarr);
            } else {
                return Base64.decode(h);
            }
        },
    };
})();