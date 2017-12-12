
var sim7 = (function() {
    
    function sim7(db) {
        this.db = db;
        this.exec_line = [];
        this.comments = {};
        this.prop_buf = {};
	}
    sim7.prototype._get_num_in_pos_by_cons = function(cons, pos) {
        if(!('cons_num' in this.prop_buf[pos] && cons in this.prop_buf[pos]['cons_num'])) return 0;
        return this.prop_buf[pos]['cons_num'][cons];
    };
    sim7.prototype._get_num_in_pos = function(cons = null, pos) {
        if(!(pos in this.prop_buf)) return 0;
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
                if(p == 'global') continue;
                r += this._get_num_in_pos(cons, p);
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
        if(!(pos in this.prop_buf && prop in this.prop_buf[pos])) return 0;
        return this.prop_buf[pos][prop];
    };
    sim7.prototype.get_prop = function(prop, pos = null) {
        if(pos === null) {
            var r = 0;
            for(var p in this.prop_buf) {
                if(p == 'global') continue;
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
    sim7.prototype._rdc = function(hndl, cmd, cnt = 1) {
        if(!('idx' in hndl)) hndl['idx'] = 0;
        var ridx = 0;
        var r = '';
        while(ridx < cnt) {
            if(hndl['idx'] >= cmd.length) break;
            r += cmd[hndl['idx']++];
            ridx ++;
        }
        return r;
    };
    sim7.prototype._lac = function(hndl, cmd, cnt = 1) {
        if(!('idx' in hndl)) hndl['idx'] = 0;
        var ridx = 0;
        var cidx = hndl['idx'];
        var r = '';
        while(ridx < cnt) {
            if(cidx >= cmd.length) break;
            r += cmd[cidx++];
            ridx ++;
        }
        return r;
    };
    sim7.prototype._rdc_digit = function(hndl, cmd) {
        var c = ''
        while(this._lac(hndl, cmd) && this._lac(hndl, cmd) >= '0' && this._lac(hndl, cmd) <= '9') {
            c += this._rdc(hndl, cmd);
        }
        c = parseInt(c);
        return c
    };
    sim7.prototype.exec = function(cmd) {
        var ec = new exec_cmd(this);
        var hndl = {};
        var c;
        var stat = 'idle';
        while(c = this._lac(hndl, cmd)) {
            if(c == '"') {
                c = this._rdc(hndl, cmd);
                var cmt = ''
                while((c = this._rdc(hndl, cmd)) != '"') {
                    if(!c) return ec.err();
                    cmt += c;
                }
                ec.append('cmt', cmt, '');
                continue;
            }
            if(stat == 'idle') {
                c = this._rdc(hndl, cmd);
                if(c == 'p') {
                    ec.emit('act', 'patrol');
                    stat = 'aft_act';
                } else if(c == 'c') {
                    ec.emit('act', 'construction');
                    stat = 'aft_cons';
                } else if(c == 'd') {
                    ec.emit('act', 'develop');
                    stat = 'aft_act';
                } else if(c == 'b') {
                    ec.emit('act', 'battle');
                    stat = 'aft_act';
                } else if(c == 'w') {
                    ec.emit('act', 'wast');
                    stat = 'done';
                } else {
                    return ec.err();
                }
            } else if(stat == 'aft_act' || stat == 'aft_cons') {
                c = this._rdc_digit(hndl, cmd);
                if(!isNaN(c)) {
                    var pos = this.db.position[c];
                    if(!pos) return ec.err();
                    ec.emit('pos', pos);
                }
                if(stat == 'aft_cons') {
                    stat = 'aft_cons_pos';
                } else {
                    stat = 'done';
                }
            } else if(stat == 'aft_cons_pos') {
                c = this._rdc(hndl, cmd);
                var _obj;
                if(c == 'f') {
                    _obj = this.db.construction.force;
                } else if(c == 't') {
                    _obj = this.db.construction.tech;
                } else if(c == 'i') {
                    _obj = this.db.construction.info;
                } else if(c == 's') {
                    _obj = this.db.construction.spec;
                }
                c = this._rdc_digit(hndl, cmd);
                if(_obj && !isNaN(c)) {
                    var obj = Object.keys(_obj)[c];
                    if(!obj) return ec.err();
                    ec.emit('cons', obj);
                    stat = 'done';
                }
            } else {
                return ec.err();
            }
        }
        if(stat != 'done') {
            return ec.err();
        }
        return ec.exec('act');
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
    
    sim7.prototype.time = function() {
        return this.get_prop('time', 'global');
    };
    sim7.prototype.day = function() {
        return 7 - Math.floor(this.time() / 12);
    };
    sim7.prototype.act_point = function() {
        return 24 - (this.time() % 12) * 2;
    };
    
    function exec_cmd(sim) {
        this.sim = sim;
        this.pool = {}
    }
    exec_cmd.prototype.emit = function(prop, val) {
        this.pool[prop] = val;
    };
    exec_cmd.prototype.append = function(prop, val, init) {
        if(!(prop in this.pool)) this.pool[prop] = init;
        this.pool[prop] += val;
    };
    exec_cmd.prototype.get = function(prop) {
        if(!(prop in this.pool)) {
            this.err();
            return null;
        }
        return this.pool[prop];
    };
    exec_cmd.prototype.exec = function(prop) {
        if(prop != 'err' && 'err' in this.pool) return this.exec('err');
        var fn = 'exec_' + this.pool[prop];
        var r = this[fn].apply(this, arguments);
        if(prop != 'err' && 'err' in this.pool) return this.exec('err');
        return r;
    };
    exec_cmd.prototype.err = function(err = 'err') {
        this.emit('err', err);
        return this.exec('err');
    };
    exec_cmd.prototype.exec_err = function() {
        return 'err';
    };
    
    
    exec_cmd.prototype._chk_pos = function(prop, pos) {
        var r = this.sim.get_prop(prop, pos);
        if(!r) this.err();
        return !!r;
    };
    exec_cmd.prototype._pass_time = function() {
        var t = this.sim.time();
        this.sim.set_prop('time', t + 1, 'global');
        var ap = this.sim.act_point();
        if(ap == 0) {
            
        }
    };
    exec_cmd.prototype.exec_patrol = function() {
        this._chk_pos('clear', this.get('pos'));
        return this;
    };
    
    return sim7;
})();
