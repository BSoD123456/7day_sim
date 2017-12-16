
var sim7 = (function() {
    
    function sim7(db, term, ctrl) {
        this.db = db;
        this.term = new lineio(term);
        this.elm_if = new elm_if(this);
        this.ctrl = new controller(ctrl, new ctrl_if(this));
        this.exec_line = ['l0', 'c0s0', 'm"' + encodeURIComponent('新的一周从这里开始') + '"'];
        this.exec_init = 2;
        this.prop_buf = {};
        this.setting_init('chara_num', 15);
        this.reset();
    }
    sim7.prototype.reset = function() {
        this.term.backto(0);
        this.run(this.exec_init);
        this.ctrl.request();
    };
    sim7.prototype.push_init = function(cmd) {
        this.exec_line.splice(this.exec_init, 0, cmd);
        this.exec_init ++;
    };
    sim7.prototype.setting_init = function(prop, val) {
        var text = encodeURIComponent(prop + ',' + val);
        this.push_init('s"' + text +'"');
    };
    sim7.prototype.save = function() {
        var txt_exec = this.exec_line.join(',');
        var hash = hashcoder.encode(this.exec_init + ':' + txt_exec);
        return '#' + hash;
    };
    sim7.prototype.load = function(hash) {
        var txt = hashcoder.decode(hash.slice(1));
        var txt_arr = txt.split(':');
        this.exec_init = parseInt(txt_arr[0]);
        this.exec_line = txt_arr[1].split(',');
        this.reset();
    };
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
    sim7.prototype.get_cons_list = function(pos) {
        if(!(pos in this.prop_buf) || !('cons_num' in this.prop_buf[pos])) return [];
        var r = [];
        for(var c in this.prop_buf[pos]['cons_num']) {
            if(c == 'dev') continue;
            if(this._get_num_in_pos_by_cons(c, pos) > 0) {
                r.push(c);
            }
        }
        return r;
    };
    sim7.prototype.inc_num = function(cons, pos, step = 1) {
        if(!(pos in this.prop_buf)) {
            this.prop_buf[pos] = {};
        }
        if(!('cons_num' in this.prop_buf[pos])) {
            this.prop_buf[pos]['cons_num'] = {};
        }
        if(!(cons in this.prop_buf[pos]['cons_num'])) {
            this.prop_buf[pos]['cons_num'][cons] = 0;
        }
        this.prop_buf[pos]['cons_num'][cons] += step;
    };
    sim7.prototype.inc_dev_num = function(pos, step = 1) {
        this.inc_num('dev', pos, step);
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
            if(stat == 'idle' || stat == 'request') {
                var ostat = stat;
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
                } else if(c == 'l') {
                    ec.emit('act', 'clear');
                    stat = 'aft_act';
                } else if(c == 'w') {
                    ec.emit('act', 'wast');
                    stat = 'done';
                } else if(c == 'm') {
                    ec.emit('act', 'comment');
                    stat = 'done';
                } else if(c == 's') {
                    ec.emit('act', 'setting');
                    stat = 'done';
                } else if(c == 'r') {
                    stat = 'request';
                } else {
                    return ec.err();
                }
                if(ostat == 'request') {
                    ec.append('act', '_req', '');
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
                    ec.emit('cons_db', _obj[obj]);
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
    sim7.prototype.check = function(cmd) {
        var rprt = this.exec('r'+cmd);
        return rprt.act == 'request';
    };
    sim7.prototype.emit = function(cmd, silence = false) {
        this.exec_line.push(cmd);
        var cidx = this.exec_line.length - 1
        var rprt = this.exec(cmd, cidx);
        if(!silence) {
            this.log(rprt, cidx);
        }
        return rprt;
    };
    sim7.prototype.run = function(init = 0, fin = null) {
        this.prop_buf = {};
        if(fin === null || fin > this.exec_line.length) {
            fin = this.exec_line.length;
        }
        for(var i = 0; i < fin; i++) {
            var rprt = this.exec(this.exec_line[i], i);
            if(i >= init) {
                this.log(rprt, i);
            }
        }
    };
    sim7.prototype.backto = function(rprt, cidx) {
        this.run(cidx, cidx);
        this.exec_line = this.exec_line.slice(0, cidx);
        this.ctrl.request();
    };
    sim7.prototype.log = function(rprt, cidx = null) {
        if(cidx === null) {
            cidx = this.term.lineno;
        }
        var self = this;
        var elm = this.elm_if.makelog(rprt);
        var b2b = elm.find('span.backto_button');
        var b2here = function(lineno, relm, elm) {
            self.backto(rprt, cidx);
        };
        this.term.bindbackto(b2b, b2here);
        this.term.writeline(elm);
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
        this.pool = {};
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
    exec_cmd.prototype.noerr = function() {
        return !('err' in this.pool);
    };
    exec_cmd.prototype.exec_err = function() {
        return {
            act: 'err',
        };
    };
    
    exec_cmd.prototype._chk_pos_clear = function(pos) {
        var r = this.sim.get_prop('clear', pos);
        if(!r) this.err();
        return r;
    };
    exec_cmd.prototype._chk_pos_battle = function(pos) {
        if(this.sim.get_prop('clear', pos)) {
            this.err();
            return false;
        }
        var p = this.sim.get_prop('battle_pos', 'global');
        if(!p) {
            var s = this.sim.get_prop('clear_score', pos);
            var d = this.sim.db.battle[pos];
            if(!d) {
                this.err()
                return false;
            };
            if(s < d[0]) {
                this.err();
                return false;
            }
        } else if(p != pos) {
            this.err();
            return false;
        }
        return true;
    };
    exec_cmd.prototype._clear_pos = function(pos) {
        var d = this.sim.db.battle[pos];
        if(!d) {
            this.err()
            return;
        };
        for(var i = 1; i < d.length; i++) {
            var s = this.sim.get_prop('clear_score', d[i]);
            this.sim.set_prop('clear_score', s + 1, d[i]);
        }
        this.sim.set_prop('battle_pos', 0, 'global');
        this.sim.set_prop('clear', true, pos);
        while(this.sim.get_dev_num(pos) < 4) {
            this.sim.inc_dev_num(pos);
        }
    };
    exec_cmd.prototype._battle_pos = function(pos) {
        this.sim.set_prop('battle_pos', pos, 'global');
    };
    exec_cmd.prototype._pass_time = function() {
        var t = this.sim.time();
        this.sim.set_prop('time', t + 1, 'global');
        var ap = this.sim.act_point();
        if(ap == 24) {
            this.sim.set_prop('patrol_idx', 0, 'global');
        }
    };
    exec_cmd.prototype._add_effect = function(effect, phase, pos) {
        var pn = 'phase_stack_' + phase
        var stck = this.sim.get_prop(pn, pos);
        if(!stck) {
            stck = [];
            this.sim.set_prop(pn, stck, pos);
        }
        stck.push(effect);
    };
    exec_cmd.prototype._exec_effect = function(phase, pos) {
        var pn = 'phase_stack_' + phase
        var stck = this.sim.get_prop(pn, pos);
        if(!stck) return;
        for(var i = stck.length - 1; i >= 0; i--) {
            if(stck[i]) {
                var r = stck[i](phase);
                if(!r) stck.splice(i, 1);
            }
        }
    };
    
    exec_cmd.prototype.get_db_cost = function(prop, val) {
        return this.sim.db.method.get_cost(this.sim, prop, val);
    };
    exec_cmd.prototype.exec_patrol = function() {
        var pos = this.get('pos');
        this._chk_pos_clear(pos);
        var pi = this.sim.get_prop('patrol_idx', 'global');
        var pc = this.sim.db.patrol[pi];
        if(!pc) this.err();
        if(this.noerr()) {
            pc = this.get_db_cost('patrol', pc);
            this.sim.set_prop('patrol_idx', pi + 1, 'global');
            this._pass_time();
        }
        return {
            act: this.get('act'),
            pos: pos,
            cost: pc,
        };
    };
    exec_cmd.prototype.exec_patrol_req = function() {
        var pos = this.get('pos');
        this._chk_pos_clear(pos);
        var pi = this.sim.get_prop('patrol_idx', 'global');
        var pc = this.sim.db.patrol[pi];
        if(!pc) this.err();
        return {
            act: 'request',
            req: this.get('act'),
        };
    };
    exec_cmd.prototype.exec_develop = function() {
        var pos = this.get('pos');
        this._chk_pos_clear(pos);
        var di = this.sim.get_dev_num(pos);
        var dc = this.sim.db.develop[di];
        if(di >= 8) this.err();
        if(this.noerr()) {
            dc = this.get_db_cost('develop', dc);
            this.sim.inc_dev_num(pos);
            this._pass_time();
        }
        return {
            act: this.get('act'),
            pos: pos,
            cost: dc,
            idx: di,
        };
    };
    exec_cmd.prototype.exec_develop_req = function() {
        var pos = this.get('pos');
        this._chk_pos_clear(pos);
        var di = this.sim.get_dev_num(pos);
        if(di >= 8) this.err();
        return {
            act: 'request',
            req: this.get('act'),
        };
    };
    exec_cmd.prototype.exec_battle = function() {
        var pos = this.get('pos');
        this._chk_pos_battle(pos);
        var bi = this.sim.get_prop('battle_idx', pos);
        if(bi >= 6) this.err();
        if(this.noerr()) {
            this._battle_pos(pos);
            if(bi == 5) {
                this._clear_pos(pos);
            } else {
                this.sim.set_prop('battle_idx', bi + 1, pos);
            }
            this._pass_time();
        }
        return {
            act: this.get('act'),
            pos: pos,
            idx: bi,
        };
    };
    exec_cmd.prototype.exec_battle_req = function() {
        var pos = this.get('pos');
        this._chk_pos_battle(pos);
        var bi = this.sim.get_prop('battle_idx', pos);
        if(bi >= 6) this.err();
        return {
            act: 'request',
            req: this.get('act'),
        };
    };
    exec_cmd.prototype.exec_clear = function() {
        var pos = this.get('pos');
        var clr = this.sim.get_prop('clear', pos)
        if(clr) this.err();
        if(this.noerr()) {
            this._clear_pos(pos);
        }
        return {
            act: this.get('act'),
            pos: pos,
        };
    };
    exec_cmd.prototype.exec_clear_req = function() {
        var pos = this.get('pos');
        var clr = this.sim.get_prop('clear', pos)
        if(clr) this.err();
        return {
            act: 'request',
            req: this.get('act'),
        };
    };
    exec_cmd.prototype.exec_construction = function() {
        var pos = this.get('pos');
        var cons = this.get('cons');
        var cons_db = this.get('cons_db');
        var cost = cons_db.construct;
        this._chk_pos_clear(pos);
        var condi = cons_db.condi(this.sim, cons, pos);
        if(!condi) this.err();
        if(this.noerr()) {
            cost = this.get_db_cost('construct', cost);
            var this_effect = function(){};
            if('effect' in cons_db) {
                this_effect = cons_db.effect.bind(null, this.sim, cons, pos);
            }
            this._exec_effect('last1_global', 'global');
            this._add_effect(this_effect, 'last1_global', 'global');
            this._exec_effect('last1_local', pos);
            this._add_effect(this_effect, 'last1_local', pos);
            
            this_effect('default');
            this.sim.inc_num(cons, pos);
            
            this._add_effect(this_effect, 'after1_local', pos);
            this._exec_effect('after1_local', pos);
            this._add_effect(this_effect, 'after1_global', 'global');
            this._exec_effect('after1_global', 'global');
            
            this._add_effect(this_effect, 'after2_local', pos);
            this._exec_effect('after2_local', pos);
            this._add_effect(this_effect, 'after2_global', 'global');
            this._exec_effect('after2_global', 'global');
            
            this._exec_effect('last2_local', pos);
            this._add_effect(this_effect, 'last2_local', pos);
            this._exec_effect('last2_global', 'global');
            this._add_effect(this_effect, 'last2_global', 'global');
            
            if(!this_effect('freeze_time')) {
                this._pass_time();
            }
        }
        return {
            act: this.get('act'),
            pos: pos,
            cons: cons,
            cost: cost,
        };
    };
    exec_cmd.prototype.exec_construction_req = function() {
        var pos = this.get('pos');
        var cons = this.get('cons');
        var cons_db = this.get('cons_db');
        var cost = cons_db.construct;
        this._chk_pos_clear(pos);
        var condi = cons_db.condi(this.sim, cons, pos);
        if(!condi) this.err();
        return {
            act: 'request',
            req: this.get('act'),
        };
    };
    exec_cmd.prototype.exec_wast = function() {
        this._pass_time();
        return {
            act: this.get('act'),
        };
    };
    exec_cmd.prototype.exec_wast_req = function() {
        return {
            act: 'request',
            req: this.get('act'),
        };
    };
    exec_cmd.prototype.exec_comment = function() {
        var cmt = this.get('cmt');
        return {
            act: this.get('act'),
            cmt: decodeURIComponent(cmt),
        };
    };
    exec_cmd.prototype.exec_comment_req = function() {
        var cmt = this.get('cmt');
        return {
            act: 'request',
            req: this.get('act'),
        };
    };
    exec_cmd.prototype.exec_setting = function() {
        var setting = this.get('cmt');
        setting = decodeURIComponent(setting).split(',');
        if(setting.length != 2) this.err();
        var prop, val;
        if(this.noerr()) {
            prop = setting[0];
            val = setting[1];
            if(!isNaN(val)) {
                val = parseFloat(val);
            }
            this.sim.set_prop(prop, val, 'global');
        }
        return {
            act: this.get('act'),
            prop: prop,
            val: val,
        };
    };
    exec_cmd.prototype.exec_setting_req = function() {
        var setting = this.get('cmt');
        setting = decodeURIComponent(setting).split(',');
        if(setting.length != 2) this.err();
        return {
            act: 'request',
            req: this.get('act'),
        };
    };
    
    function elm_if(sim) {
        this.sim = sim;
    }
    elm_if.prototype.get_db_prop = function(prop, pos = null) {
        return this.sim.db.method.get_prop(this.sim, prop, pos);
    };
    elm_if.prototype._makelog_prop = function(prop, val) {
        var elm = $('<div>')
            .addClass('prop_log')
            .append(
                $('<span>').text(prop))
            .append(
                $('<span>').text(Math.ceil(val)));
        return elm
    };
    elm_if.prototype._makelog_time = function() {
        var day = this.sim.day();
        var ap = this.sim.act_point();
        var elm = $('<div>')
            .addClass('time_log')
            .append(
                $('<span>').text("第" + day + "天")
                    .addClass('time_log_day'))
            .append(
                $('<span>').text("行动点 " + ap + '/24')
                    .addClass('time_log_ap'))
            .append(
                $('<span>').text("回到此时")
                    .addClass('backto_button')
                    .attr('time', this.sim.time()))
            .append(
                $('<span>').text("区域")
                    .addClass('pos_button'))
            .append(
                $('<span>').text("属性")
                    .addClass('prop_button'));
        return elm
    };
    elm_if.prototype._makelog_glb = function() {
        var elm = $('<div>').addClass('glb_log');
        var force = this.get_db_prop('force');
        var tech = this.get_db_prop('tech');
        var info = this.get_db_prop('info');
        elm.append(this._makelog_prop("幻力", force))
            .append(this._makelog_prop("科技", tech))
            .append(this._makelog_prop("情报", info));
        return elm;
    };
    elm_if.prototype._makelog_pos_item = function(pos) {
        var cons_list = this.sim.get_cons_list(pos);
        if(cons_list.length <= 0) return null;
        var elm = $('<div>').addClass('pos_item_log');
        var force = this.get_db_prop('force', pos);
        var tech = this.get_db_prop('tech', pos);
        var info = this.get_db_prop('info', pos);
        var prop_elm = $('<div>')
            .append(this._makelog_prop("幻力", force))
            .append(this._makelog_prop("科技", tech))
            .append(this._makelog_prop("情报", info));
        var cons_elm = $('<div>').append(this._makelog_prop("总共", this.sim.get_dev_num(pos)));
        for(var i = 0; i < cons_list.length; i++) {
            var cons = cons_list[i];
            cons_elm.append(this._makelog_prop(cons, this.sim.get_num(cons, pos)));
        }
        elm.append($('<div>').text(pos))
            .append(prop_elm)
            .append(cons_elm);
        return elm;
    };
    elm_if.prototype._makelog_pos = function() {
        var elm = $('<div>').addClass('pos_log');
        for(var i = 0; i < this.sim.db.position.length; i++) {
            var pos = this.sim.db.position[i];
            var itm_elm = this._makelog_pos_item(pos);
            if(itm_elm) {
                elm.append(itm_elm);
            }
        }
        return elm;
    };
    elm_if.prototype._makelog_exec = function(rprt) {
        var elm = this['_makelog_exec_' + rprt.act](rprt);
        elm.addClass('exec_log');
        return elm
    };
    elm_if.prototype._exec_elm = function(name) {
        return $('<div>').addClass('exec_log').append($('<span>').addClass('exec_log_act').text(name));
    };
    elm_if.prototype._makelog_exec_comment = function(rprt) {
        var elm = this._exec_elm("备注:")
        elm.append($('<span>').text(rprt.cmt));
        return elm;
    };
    elm_if.prototype._makelog_exec_patrol = function(rprt) {
        var elm = this._exec_elm("巡查:")
        elm.append($('<span>').text(rprt.pos))
            .append($('<span>').text("需要" + rprt.cost + "点巡查力"));
        return elm;
    };
    elm_if.prototype._makelog_exec_develop = function(rprt) {
        var elm = this._exec_elm("开发:")
        elm.append($('<span>').text(rprt.pos))
            .append($('<span>').text("达到了" + (rprt.idx + 1) + "个空位"))
            .append($('<span>').text("需要" + rprt.cost + "点研发力"));
        return elm;
    };
    elm_if.prototype._makelog_exec_battle = function(rprt) {
        var elm = this._exec_elm("战斗:")
        elm.append($('<span>').text(rprt.pos))
            .append($('<span>').text("完成了(" + (rprt.idx + 1) + "/6)场"));
        return elm;
    };
    elm_if.prototype._makelog_exec_construction = function(rprt) {
        var elm = this._exec_elm("建设:")
        elm.append($('<span>').text(rprt.pos))
            .append($('<span>').text("建成" + rprt.cons))
            .append($('<span>').text("需要" + rprt.cost + "点建设力"));
        return elm;
    };
    elm_if.prototype._makelog_exec_clear = function(rprt) {
        var elm = this._exec_elm("强制解锁:")
        elm.append($('<span>').text(rprt.pos));
        return elm;
    };
    elm_if.prototype._makelog_exec_wast = function(rprt) {
        var elm = this._exec_elm("发呆中");
        return elm;
    };
    elm_if.prototype._makelog_exec_setting = function(rprt) {
        var elm = this._exec_elm("设置调整:")
        elm.append($('<span>').text(rprt.cmt));
        return elm;
    };
    elm_if.prototype._makelog_exec_err = function(rprt) {
        var elm = this._exec_elm("有什么位置出错了！");
        return elm;
    };
    elm_if.prototype.makelog = function(rprt) {
        var elm = $('<div>').addClass('main_log');
        var time_elm = this._makelog_time();
        var glb_elm = this._makelog_glb();
        var pos_elm = this._makelog_pos();
        var exec_elm = this._makelog_exec(rprt)
        elm.append(exec_elm)
            .append(time_elm)
            .append(glb_elm)
            .append(pos_elm);
        if(this.sim.act_point() == 24) {
            elm.addClass('day_start');
        }
        elm.addClass('act_' + rprt.act);
        if(glb_elm.css('display') == 'none') console.log('hey');
        elm.find('.prop_button').on('click', function() {
            if(glb_elm.css('display') == 'none') {
                glb_elm.removeClass('fold_hide');
                glb_elm.addClass('fold_apear');
            } else {
                glb_elm.addClass('fold_hide');
                glb_elm.removeClass('fold_apear');
            }
        });
        pos_elm.addClass('fold_hide');
        elm.find('.pos_button').on('click', function() {
            if(pos_elm.css('display') == 'none') {
                pos_elm.removeClass('fold_hide');
                pos_elm.addClass('fold_apear');
            } else {
                pos_elm.addClass('fold_hide');
                pos_elm.removeClass('fold_apear');
            }
        });
        return elm
    };
    
    function ctrl_if(sim) {
        this.sim = sim;
    }
    ctrl_if.prototype.cmdfunc = function(cmd) {
        var self = this;
        if(!this.sim.check(cmd)) return null;
        return function() {
            self.sim.emit(cmd);
            return 'idle';
        };
    };
    ctrl_if.prototype.spanelm = function() {
        return $('<span>').addClass('controller_req');
    };
    ctrl_if.prototype.settingelm = function(name, prop) {
        var self = this;
        var text_elm = $('<input type="text">')
        var button_elem = $('<span>').addClass('controller_req').text("确定");
        var _func = function() {
            var val = text_elm.val();
            if(!val) return 'setting';
            self.sim.setting_init(prop, val);
            self.sim.reset();
            return 'idle';
        }
        return {
            elem: $('<span>').append($('<span>').text(name)).append(text_elm).append(button_elem),
            info: prop,
            next: _func,
        };
    };
    ctrl_if.prototype.req = function(ctrl, stat) {
        var self = this;
        var r = [];
        if(stat == 'idle') {
            for(var i = 0; i < this.sim.db.position.length; i++) {
                var pos = this.sim.db.position[i];
                if(this.sim.check('p'+i) || this.sim.check('b'+i)) {
                    r.push({
                        elem: this.spanelm().text(pos),
                        info: i,
                        next: 'in_pos',
                    });
                }
            }
            var _func = this.cmdfunc('w');
            if(_func) r.push({
                elem: this.spanelm().text("空闲"),
                info: 'wast',
                next: _func,
            });
            r.push({
                elem: this.spanelm().text("备注"),
                info: 'comment',
                next: 'comment',
            });
            r.push({
                elem: this.spanelm().text("设置"),
                info: 'setting',
                next: 'setting',
            });
            r.push({
                elem: this.spanelm().text("保存"),
                info: 'save',
                next: 'save',
            });
        } else if(stat == 'in_pos') {
            var pos_num = ctrl.context(0);
            var _func = this.cmdfunc('p' + pos_num);
            if(_func) r.push({
                elem: this.spanelm().text("巡查"),
                info: 'patrol',
                next:  _func,
            });
            r.push({
                elem: this.spanelm().text("建设"),
                info: 'construction',
                next: 'construct',
            });
            var _func = this.cmdfunc('d' + pos_num);
            if(_func) r.push({
                elem: this.spanelm().text("开发"),
                info: 'develop',
                next: _func,
            });
            var _func = this.cmdfunc('b' + pos_num);
            if(_func) r.push({
                elem: this.spanelm().text("战斗"),
                info: 'battle',
                next: _func,
            });
            var _func = this.cmdfunc('l' + pos_num);
            if(_func) r.push({
                elem: this.spanelm().text("强制解锁"),
                info: 'clear',
                next: _func,
            });
        } else if(stat == 'construct') {
            r.push({
                elem: this.spanelm().text("幻力"),
                info: ['force', 'f'],
                next: 'construct2',
            });
            r.push({
                elem: this.spanelm().text("科技"),
                info: ['tech', 't'],
                next: 'construct2',
            });
            r.push({
                elem: this.spanelm().text("情报"),
                info: ['info', 'i'],
                next: 'construct2',
            });
            r.push({
                elem: this.spanelm().text("特别"),
                info: ['spec', 's'],
                next: 'construct2',
            });
        } else if(stat == 'construct2') {
            var pos_num = ctrl.context(2);
            var cons_type_info = ctrl.context(0);
            var cons_type = cons_type_info[0];
            var cons_type_cmd = cons_type_info[1];
            var cons_list = Object.keys(this.sim.db.construction[cons_type])
            for(var i = 0; i < cons_list.length; i++) {
                var cons = cons_list[i];
                var _func = this.cmdfunc('c' + pos_num + cons_type_cmd + i);
                if(_func) r.push({
                    elem: this.spanelm().text(cons),
                    info: i,
                    next: _func,
                });
            }
        } else if(stat == 'comment') {
            var text_elm = $('<input type="text">')
            var button_elem = $('<span>').addClass('controller_req').text("确定");
            var _func = function() {
                var text = encodeURIComponent(text_elm.val());
                if(!text) return 'comment';
                self.sim.emit('m"' + text +'"');
                return 'idle';
            }
            r.push({
                elem: $('<span>').append(text_elm).append(button_elem),
                info: 'text',
                next: _func,
            });
        } else if(stat == 'setting') {
            r.push(this.settingelm("神器使数量", 'chara_num'));
        } else if(stat == 'save') {
            var hashcode = this.sim.save();
            var link_elm = $('<div>').append($('<a>').text('保存链接').attr('href', hashcode));
            r.push({
                elem: link_elm,
                info: 'save',
                next: 'save',
            });
        }
        return r;
    };
    
    return sim7;
})();
