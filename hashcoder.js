
var hashcoder = (function() {
    
    var COMP_HD = '!';
    
    return {
        encode: function(s) {
            var uarr = new TextEncoder().encode(s);
            var comp_uarr = pako.deflate(uarr);
            var r, src_uarr;
            if(comp_uarr.length < uarr.length) {
                r = COMP_HD;
                src_uarr = comp_uarr;
            } else {
                r = '';
                src_uarr = uarr;
            }
            //r += btoa(unescape(encodeURIComponent(new TextDecoder('utf-8').decode(src_uarr))));
            r += Base64.encode(new TextDecoder('utf-8').decode(src_uarr));
            return r;
        },
        decode: function(h) {
            if(h[0] == COMP_HD) {
                var src_uarr = new TextEncoder().encode(Base64.decode(h.slice(1)));
                src_uarr = pako.inflate(src_uarr);
                return new TextDecoder('utf-8').decode(src_uarr);
            } else {
                return Base64.decode(h);
            }
        },
    };
})();