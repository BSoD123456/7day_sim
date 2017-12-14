
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
            .addClass('lineio_item')
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

var controller = (function() {
	function controller(ctrl_elm, conf) {
        this.ctrl_elm = ctrl_elm;
        this.conf = conf;
        this.info_elm = $('<div>').addClass('controller_info');
        this.hndl_elm = $('<div>').addClass('controller_hndl');
        this.info_stack = [];
        this.stat = 'idle';
        this.stat_wrapper = {
            'idle': 0,
        };
        this.ctrl_elm.append(this.info_elm).append(this.hndl_elm);
        this.request();
	}
    controller.prototype.request = function() {
        var req = this.conf.req(this, this.stat);
        this.hndl_elm.empty();
        for(var i = 0; i < req.length; i ++) {
            var itm = req[i];
            itm.elem.off();
            itm.elem.on('click', this.choose.bind(this, itm));
            itm.elem.removeClass('controller_info_item');
            itm.elem.addClass('controller_hndl_item');
            this.hndl_elm.append(itm.elem);
        }
    };
    controller.prototype.context = function(n) {
        return this.info_stack[this.info_stack.length - 1 - n];
    };
    controller.prototype.go_stat = function(stat) {
        if(stat in this.stat_wrapper) {
            //this.info_stack = this.info_stack.slice(0, this.stat_wrapper[stat]);
            var stck_wp = this.stat_wrapper[stat];
            if(stck_wp > this.info_stack.length) {
                this.stat_wrapper[stat] = this.info_stack.length;
            }
            while(stck_wp < this.info_stack.length) {
                this.info_elm.children().last().remove();
                this.info_stack.pop();
            }
            this.stat = stat;
        } else {
            this.stat_wrapper[stat] = this.info_stack.length;
            this.stat = stat;
        }
        this.request();
    };
    controller.prototype.choose = function(itm) {
        itm.elem.off();
        itm.elem.on('click', this.go_stat.bind(this, this.stat));
        itm.elem.removeClass('controller_hndl_item');
        itm.elem.addClass('controller_info_item');
        this.info_elm.append(itm.elem);
        this.info_stack.push(itm.info);
        if(itm.func) {
            itm.func();
        }
        this.go_stat(itm.next);
    };
    return controller;
})();
