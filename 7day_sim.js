
var sim7 = (function() {
    function sim7(db) {
        this.db = db;
        this.exec_line = [];
        this.position_info = {};
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
    sim7.prototype.get_num = function(cons = null, pos = null) {
        
    };
    sim7.prototype.get_prop = function(prop, pos = null) {
        
    };
    sim7.prototype.set_prop = function(prop, val, pos) {
        
    };
    sim7.prototype.exec = function(cmd) {
    };
    sim7.prototype.backto = function(time) {
    };
    sim7.prototype.makelog = function() {
    };
    return sim7;
})();
