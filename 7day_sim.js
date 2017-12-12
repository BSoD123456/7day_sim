
var sim7 = (function() {
    function sim7(db) {
        this.db = db;
        this.exec_line = [];
        this.comments = {};
        this.prop_buf = {};
	}
    sim7.prototype.time = function() {
        return this.exec_line.length;
    };
    sim7.prototype.day = function() {
        return 7 - Math.floor(this.time() / 12);
    };
    sim7.prototype.act_point = function() {
        return 24 - (this.time() % 12) * 2;
    };
    sim7.prototype._get_num_in_pos_by_cons = function(cons, pos) {
        return this.prop_buf[pos]['cons_num'][cons];
    };
    sim7.prototype._get_num_in_pos = function(cons = null, pos) {
        if(cons === null) {
            var r = 0;
            for(var c in this.prop_buf[pos]['cons_num']) {
                if(c == 'dev') continue;
                r += this._get_num_in_pos_by_cons(c, pos);
            }
            return r;
        } else {
            return this._get_num_in_pos_by_cons(cons, pos)
        }
    };
    sim7.prototype.get_num = function(cons = null, pos = null) {
        if(pos === null) {
            var r = 0;
            for(var p in this.prop_buf) {
                r += this._get_num_in_pos(cons, pos);
            }
            return r;
        } else {
            return this._get_num_in_pos(cons, pos);
        }
    };
    sim7.prototype.get_dev_num = function(pos = null) {
        return this.get_num('dev', pos);
    };
    sim7.prototype.inc_num = function(cons, pos) {
        if(!(pos in this.prop_buf)) {
            this.prop_buf[pos] = {};
        }
        if(!('cons_num' in this.prop_buf[pos])) {
            this.prop_buf[pos]['cons_num'] = {};
        }
        if(!(cons in this.prop_buf[pos]['cons_num'])) {
            this.prop_buf[pos]['cons_num'][cons] = 0;
        }
        this.prop_buf[pos]['cons_num'][cons] ++;
    };
    sim7.prototype.inc_dev_num = function(pos) {
        this.inc_num('dev', pos);
    };
    sim7.prototype._get_prop_in_pos = function(prop, pos) {
        return this.prop_buf[pos][prop];
    };
    sim7.prototype.get_prop = function(prop, pos = null) {
        if(pos === null) {
            var r = 0;
            for(var p in this.prop_buf) {
                r += this._get_prop_in_pos(prop, p);
            }
            return r;
        } else {
            return this._get_prop_in_pos(prop, pos)
        }
    };
    sim7.prototype.set_prop = function(prop, val, pos) {
        if(!(pos in this.prop_buf)) {
            this.prop_buf[pos] = {};
        }
        this.prop_buf[pos][prop] = val;
    };
    sim7.prototype.emit = function(cmd) {
    };
    sim7.prototype.exec = function(cmd) {
    };
    sim7.prototype.run = function() {
        this.prop_buf = {};
        for(var i = 0; i < this.exec_line.length; i++) {
            this.exec(this.exec_line[i]);
        }
    };
    sim7.prototype.backto = function(time) {
    };
    sim7.prototype.makelog = function() {
    };
    return sim7;
})();
