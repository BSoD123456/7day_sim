
var lineio = (function() {
	function lineio(term_elm) {
        this.term_elm = term_elm;
        this.lineno = 0;
	}
	lineio.prototype.writeline = function(elm) {
        this.term_elm.append(this.makeline(elm));
        return this.lineno++;
    };
    lineio.prototype.makeline = function(elm) {
        var line_elm = $('<div>')
            .attr('lineno', this.lineno)
            .append(elm);
        return line_elm;
    };
    lineio.prototype.removelast = function() {
        var elm = this.term_elm.children().last();
        elm.remove();
        this.lineno--;
        return elm;
    };
    lineio.prototype.backto = function(lineno) {
        var rme;
        while(lineno < this.lineno) {
            rme = this.removelast();
        }
        return rme;
    };
    lineio.prototype.bindbackto = function(elm, func = null, lineno = null) {
        var self = this;
        if(lineno === null) {
            lineno = this.lineno;
        }
        elm.on('click', function(){
            var e = $(this)
            var rme = self.backto(lineno);
            if(func !== null) {
                func(lineno, rme, e);
            }
        });
        return elm;
    };
    return lineio;
})();
