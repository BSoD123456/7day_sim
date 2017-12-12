
var db7 = (function() {
    var _chk_dev = function(sim, pos) {
        return (sim.get_dev_num(pos) - sim.get_num(null, pos)) > 0;
    };
    var _chk_tech = function(sim, val) {
        if(sim.get_num("地下研究所") > 0) {
            val -= 25;
        }
        //return sim.get_prop('tech') >= val;
        return sim.get_prop('tech') > val - 1; // for .5 round-up
    };
    var _buffed_force = function(sim, pos, val, errata = false) {
        // errata for a calc bug
        if(sim.get_num("区立工程大厦", pos) > 0 && !errata) {
            val += 1;
        }
        if(sim.get_num("市立工程大厦", pos) > 0) {
            val *= 1.5;
        }
        return val;
    };
    var _buffed_tech = function(sim, pos, val, errata = false) {
        // errata for a calc bug
        if(sim.get_num("区立研究所", pos) > 0 && !errata) {
            val += 1;
        }
        if(sim.get_num("市立研究所", pos) > 0) {
            val *= 1.5;
        }
        return val;
    };
    var _buffed_info = function(sim, pos, val, errata = false) {
        // errata for a calc bug
        if(sim.get_num("区立情报局", pos) > 0 && !errata) {
            val += 1;
        }
        if(sim.get_num("市立情报局", pos) > 0) {
            val *= 1.5;
        }
        return val;
    };

    return {
        position: [
            "中央庭",
            "高校学园",
            "东方古街",
            "中央城区",
            "研究所",
            "海湾侧城",
            "港湾区",
        ],
        construction: {
            force: {
                "工程厅": {
                    construct: 10,
                    condi: function(sim, cons, pos) {
                        return _chk_dev(sim, pos);
                    },
                    effect: function(phase, sim, cons, pos) {
                        if(phase == 0) {
                            sim.set_prop('force',  sim.get_prop('force') + 5, pos);
                        }
                    },
                },
                "大型工程厅": {
                    construct: 14,
                    condi: function(sim, cons, pos) {
                        return _chk_dev(sim, pos) && _chk_tech(sim, 35);
                    },
                    effect: function(phase, sim, cons, pos) {
                        if(phase == 0) {
                            sim.set_prop('force',  sim.get_prop('force') + 10, pos);
                        }
                    },
                },
                "区立工程大厦": {
                    construct: 14,
                    condi: function(sim, cons, pos) {
                        return _chk_dev(sim, pos) && _chk_tech(sim, 30) && sim.get_num(cons, pos) < 1
                            && (sim.get_num("工程厅", pos) + sim.get_num("大型工程厅", pos)) >= 4;
                    },
                    effect: function(phase, sim, cons, pos) {
                        if(phase == 0) {
                            sim.set_prop('force',  sim.get_prop('force') + 5 + sim.get_num(null, pos), pos);
                        }
                    },
                },
                "市立工程大厦": {
                    construct: 30,
                    condi: function(sim, cons, pos) {
                        return _chk_dev(sim, pos) && _chk_tech(sim, 60) && sim.get_num(cons) < 1;
                    },
                },
                "黑门监测站": {
                    construct: 22,
                    condi: function(sim, cons, pos) {
                        return _chk_dev(sim, pos) && _chk_tech(sim, 30) && sim.get_num(cons) < 1;
                    },
                },
            },
            tech: {
                "研究所": {
                },
                "大型研究所": {
                },
                "区立研究所": {
                },
                "市立研究所": {
                },
                "公共图书馆": {
                },
                "地下研究所": {
                    construct: 22,
                    condi: function(sim, cons, pos) {
                        return _chk_dev(sim, pos);
                    },
                },
            },
            info: {
                "情报局": {
                },
                "大型情报局": {
                },
                "区立情报局": {
                },
                "市立情报局": {
                },
                "情报中心": {
                },
            },
            spec: {
                "歌舞伎町": {
                    construct: 22,
                    condi: function(sim, cons, pos) {
                        return _chk_dev(sim, pos) && _chk_tech(sim, 30) && sim.get_num(cons, pos) < 1;
                    },
                },
                "购物中心": {
                    construct: 22,
                    condi: function(sim, cons, pos) {
                        return _chk_dev(sim, pos) && _chk_tech(sim, 30) && sim.get_num(cons, pos) < 1;
                    },
                },
                "地铁枢纽": {
                    construct: 10,
                    condi: function(sim, cons, pos) {
                        return _chk_dev(sim, pos) && _chk_tech(sim, 15) && sim.get_num(cons) < 4;
                    },
                },
                "规划所": {
                    construct: 10,
                    condi: function(sim, cons, pos) {
                        return _chk_dev(sim, pos) && _chk_tech(sim, 15) && sim.get_num(cons) < 4;
                    },
                },
                "起重机": {
                    construct: 10,
                    condi: function(sim, cons, pos) {
                        return _chk_dev(sim, pos) && _chk_tech(sim, 15) && sim.get_num(cons) < 4;
                    },
                },
                "急救中心": {
                    construct: 30,
                    condi: function(sim, cons, pos) {
                        return _chk_dev(sim, pos) && _chk_tech(sim, 80) && sim.get_num(cons) < 1;
                    },
                },
                "方舟": {
                    construct: 30,
                    condi: function(sim, cons, pos) {
                        return _chk_dev(sim, pos) && _chk_tech(sim, 50) && sim.get_num(cons) < 1;
                    },
                },
                "深海潜艇": {
                    construct: 20,
                    condi: function(sim, cons, pos) {
                        return _chk_dev(sim, pos) && _chk_tech(sim, 30);
                    },
                },
                "其他": {
                    construct: 0,
                    condi: function() {
                        return _chk_dev(sim, pos);
                    },
                },
            },
        },
        develop: [
            0, 0, 0, 0, 10, 14, 22, 30
        ],
        patrol: [
            10, 10, 10, 14, 14, 22, 22, 30, 30, 38, 38, 46
        ],
        battle: {
            "中央庭": [0, "高校学园"],
            "高校学园": [1, "东方古街", "中央城区"],
            "东方古街": [1, "研究所"],
            "中央城区": [1, "研究所"],
            "研究所": [2, "海湾侧城"],
            "海湾侧城": [1, "港湾区"],
            "港湾区": [1],
        },
    };
})();