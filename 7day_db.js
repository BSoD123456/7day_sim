
var db7 = (function() {
    var _get_prop = function(sim, prop, pos = null) {
        var r = sim.get_prop('base_' + prop, pos);
        r += sim.get_prop('extra1_' + prop, pos);
        r += sim.get_prop('extra2_' + prop, pos);
        return r;
    };
    var _get_cost = function(sim, prop, val) {
        var r = sim.get_prop('base_' + prop, 'global');
        r = val - r;
        if(r < 0) r = 0;
        return r;
    };
    var _chk_dev = function(sim, pos) {
        return (sim.get_dev_num(pos) - sim.get_num(null, pos)) > 0;
    };
    var _chk_tech = function(sim, val) {
        if(sim.get_num("地下研究所") > 0) {
            val -= 25;
        }
        return _get_prop(sim, 'tech') > val - 1; // for .5 round-up
    };
    var _chara_num = function(sim) {
        var num = sim.get_prop('chara_num', 'global');
        if(num > 30) num = 30;
        return num;
    };

    return {
        method: {
            get_prop: _get_prop,
            get_cost: _get_cost,
        },
        position: [
            "中央庭",
            "高校学园",
            "东方古街",
            "中央城区",
            "研究所",
            "海湾侧城",
            "旧城区",
            "港湾区",
        ],
        construction: {
            force: {
                "工程厅": {
                    construct: 10,
                    condi: function(sim, cons, pos) {
                        return _chk_dev(sim, pos);
                    },
                    effect: function(sim, cons, pos, phase) {
                        if(phase == 'default') {
                            sim.set_prop('base_force',  sim.get_prop('base_force', pos) + 5, pos);
                        }
                    },
                },
                "大型工程厅": {
                    construct: 14,
                    condi: function(sim, cons, pos) {
                        return _chk_dev(sim, pos) && _chk_tech(sim, 35);
                    },
                    effect: function(sim, cons, pos, phase) {
                        if(phase == 'default') {
                            sim.set_prop('base_force',  sim.get_prop('base_force', pos) + 10, pos);
                        }
                    },
                },
                "区立工程大厦": {
                    construct: 14,
                    condi: function(sim, cons, pos) {
                        return _chk_dev(sim, pos) && _chk_tech(sim, 30) && sim.get_num(cons, pos) < 1
                            && (sim.get_num("工程厅", pos) + sim.get_num("大型工程厅", pos)) >= 4;
                    },
                    effect: function(sim, cons, pos, phase) {
                        if(phase == 'default') {
                            sim.set_prop('base_force',  sim.get_prop('base_force', pos) + 5, pos);
                            sim.set_prop('extra1_force',  0, pos);
                        } else if(phase == 'after1_local') {
                            sim.set_prop('extra1_force',
                                sim.get_prop('extra1_force', pos)
                                + sim.get_num('工程厅', pos)
                                + sim.get_num('大型工程厅', pos)
                                + sim.get_num('区立工程大厦', pos)
                                + sim.get_num('市立工程大厦', pos),
                                //+ sim.get_num('黑门监测站', pos), // a calc bug in game
                                pos);
                            return true;
                        }
                    },
                },
                "市立工程大厦": {
                    construct: 30,
                    condi: function(sim, cons, pos) {
                        return _chk_dev(sim, pos) && _chk_tech(sim, 60) && sim.get_num(cons) < 1;
                    },
                    effect: function(sim, cons, pos, phase) {
                        if(phase == 'default') {
                            sim.set_prop('base_force',  sim.get_prop('base_force', pos) + 15, pos);
                            sim.set_prop('extra2_force',  0, pos);
                        } else if(phase == 'after1_local') {
                            sim.set_prop('extra2_force',
                                (sim.get_prop('extra1_force', pos) + sim.get_prop('base_force', pos)) * 0.5,
                                pos);
                            return true;
                        }
                    },
                },
                "黑门监测站": {
                    construct: 22,
                    condi: function(sim, cons, pos) {
                        return _chk_dev(sim, pos) && _chk_tech(sim, 30) && sim.get_num(cons) < 1;
                    },
                    effect: function(sim, cons, pos, phase) {
                        if(phase == 'default') {
                            sim.set_prop('base_force',
                            sim.get_prop('base_force', pos)
                            + _chara_num(this.sim),
                            pos);
                        }
                    },
                },
            },
            tech: {
                "研究所": {
                    construct: 10,
                    condi: function(sim, cons, pos) {
                        return _chk_dev(sim, pos);
                    },
                    effect: function(sim, cons, pos, phase) {
                        if(phase == 'default') {
                            sim.set_prop('base_tech',  sim.get_prop('base_tech', pos) + 5, pos);
                        }
                    },
                },
                "大型研究所": {
                    construct: 14,
                    condi: function(sim, cons, pos) {
                        return _chk_dev(sim, pos) && _chk_tech(sim, 35);
                    },
                    effect: function(sim, cons, pos, phase) {
                        if(phase == 'default') {
                            sim.set_prop('base_tech',  sim.get_prop('base_tech', pos) + 10, pos);
                        }
                    },
                },
                "区立研究所": {
                    construct: 14,
                    condi: function(sim, cons, pos) {
                        return _chk_dev(sim, pos) && _chk_tech(sim, 30) && sim.get_num(cons, pos) < 1
                            && (sim.get_num("研究所", pos) + sim.get_num("大型研究所", pos)) >= 4;
                    },
                    effect: function(sim, cons, pos, phase) {
                        if(phase == 'default') {
                            sim.set_prop('base_tech',  sim.get_prop('base_tech', pos) + 5, pos);
                            sim.set_prop('extra1_tech',  0, pos);
                        } else if(phase == 'after1_local') {
                            sim.set_prop('extra1_tech',
                                sim.get_prop('extra1_tech', pos)
                                + sim.get_num('研究所', pos)
                                + sim.get_num('大型研究所', pos)
                                + sim.get_num('区立研究所', pos)
                                + sim.get_num('市立研究所', pos),
                                //+ sim.get_num('公共图书馆', pos), // a calc bug in game
                                pos);
                            return true;
                        }
                    },
                },
                "市立研究所": {
                    construct: 30,
                    condi: function(sim, cons, pos) {
                        return _chk_dev(sim, pos) && _chk_tech(sim, 60) && sim.get_num(cons) < 1;
                    },
                    effect: function(sim, cons, pos, phase) {
                        if(phase == 'default') {
                            sim.set_prop('base_tech',  sim.get_prop('base_tech', pos) + 15, pos);
                            sim.set_prop('extra2_tech',  0, pos);
                        } else if(phase == 'after1_local') {
                            sim.set_prop('extra2_tech',
                                (sim.get_prop('extra1_tech', pos) + sim.get_prop('base_tech', pos)) * 0.5,
                                pos);
                            return true;
                        }
                    },
                },
                "公共图书馆": {
                    construct: 22,
                    condi: function(sim, cons, pos) {
                        return _chk_dev(sim, pos) && _chk_tech(sim, 30) && sim.get_num(cons) < 1;
                    },
                    effect: function(sim, cons, pos, phase) {
                        if(phase == 'default') {
                            sim.set_prop('base_tech',
                            sim.get_prop('base_tech', pos)
                            + _chara_num(this.sim),
                            pos);
                        }
                    },
                },
                "地下研究所": {
                    construct: 22,
                    condi: function(sim, cons, pos) {
                        return _chk_dev(sim, pos);
                    },
                    effect: function(sim, cons, pos, phase) {
                        if(phase == 'last2_global') {
                            sim.inc_num(cons, pos, -1);
                        }
                    },
                },
            },
            info: {
                "情报局": {
                    construct: 10,
                    condi: function(sim, cons, pos) {
                        return _chk_dev(sim, pos);
                    },
                    effect: function(sim, cons, pos, phase) {
                        if(phase == 'default') {
                            sim.set_prop('base_info',  sim.get_prop('base_info', pos) + 5, pos);
                        }
                    },
                },
                "大型情报局": {
                    construct: 14,
                    condi: function(sim, cons, pos) {
                        return _chk_dev(sim, pos) && _chk_tech(sim, 35);
                    },
                    effect: function(sim, cons, pos, phase) {
                        if(phase == 'default') {
                            sim.set_prop('base_info',  sim.get_prop('base_info', pos) + 10, pos);
                        }
                    },
                },
                "区立情报局": {
                    construct: 14,
                    condi: function(sim, cons, pos) {
                        return _chk_dev(sim, pos) && _chk_tech(sim, 30) && sim.get_num(cons, pos) < 1
                            && (sim.get_num("情报局", pos) + sim.get_num("大型情报局", pos)) >= 4;
                    },
                    effect: function(sim, cons, pos, phase) {
                        if(phase == 'default') {
                            sim.set_prop('base_info',  sim.get_prop('base_info', pos) + 5, pos);
                            sim.set_prop('extra1_info',  0, pos);
                        } else if(phase == 'after1_local') {
                            sim.set_prop('extra1_info',
                                sim.get_prop('extra1_info', pos)
                                + sim.get_num('情报局', pos)
                                + sim.get_num('大型情报局', pos)
                                + sim.get_num('区立情报局', pos)
                                + sim.get_num('市立情报局', pos),
                                //+ sim.get_num('情报中心', pos), // a calc bug in game
                                pos);
                            return true;
                        }
                    },
                },
                "市立情报局": {
                    construct: 30,
                    condi: function(sim, cons, pos) {
                        return _chk_dev(sim, pos) && _chk_tech(sim, 60) && sim.get_num(cons) < 1;
                    },
                    effect: function(sim, cons, pos, phase) {
                        if(phase == 'default') {
                            sim.set_prop('base_info',  sim.get_prop('base_info', pos) + 15, pos);
                            sim.set_prop('extra2_info',  0, pos);
                        } else if(phase == 'after1_local') {
                            sim.set_prop('extra2_info',
                                (sim.get_prop('extra1_info', pos) + sim.get_prop('base_info', pos)) * 0.5,
                                pos);
                            return true;
                        }
                    },
                },
                "情报中心": {
                    construct: 22,
                    condi: function(sim, cons, pos) {
                        return _chk_dev(sim, pos) && _chk_tech(sim, 30) && sim.get_num(cons) < 1;
                    },
                    effect: function(sim, cons, pos, phase) {
                        if(phase == 'default') {
                            sim.set_prop('base_info',
                            sim.get_prop('base_info', pos)
                            + _chara_num(this.sim),
                            pos);
                        }
                    },
                },
            },
            spec: {
                "中央庭基地": {
                    construct: 0,
                    condi: function(sim, cons, pos) {
                        return _chk_dev(sim, pos) && sim.get_num(cons) < 1;
                    },
                    effect: function(sim, cons, pos, phase) {
                        if(phase == 'default') {
                            sim.set_prop('base_force',  sim.get_prop('base_force', pos) + 5, pos);
                            sim.set_prop('base_tech',  sim.get_prop('base_tech', pos) + 5, pos);
                            sim.set_prop('base_info',  sim.get_prop('base_info', pos) + 5, pos);
                        } else if(phase == 'freeze_time') {
                            return true;
                        }
                    },
                },
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
                    effect: function(sim, cons, pos, phase) {
                        if(phase == 'default') {
                            sim.set_prop('base_patrol',  sim.get_prop('base_patrol', 'global') + 3, 'global');
                        }
                    },
                },
                "规划所": {
                    construct: 10,
                    condi: function(sim, cons, pos) {
                        return _chk_dev(sim, pos) && _chk_tech(sim, 15) && sim.get_num(cons) < 4;
                    },
                    effect: function(sim, cons, pos, phase) {
                        if(phase == 'default') {
                            sim.set_prop('base_develop',  sim.get_prop('base_develop', 'global') + 3, 'global');
                        }
                    },
                },
                "起重机": {
                    construct: 10,
                    condi: function(sim, cons, pos) {
                        return _chk_dev(sim, pos) && _chk_tech(sim, 15) && sim.get_num(cons) < 4;
                    },
                    effect: function(sim, cons, pos, phase) {
                        if(phase == 'default') {
                            sim.set_prop('base_construct',  sim.get_prop('base_construct', 'global') + 3, 'global');
                        }
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
                    effect: function(sim, cons, pos, phase) {
                        if(phase == 'default') {
                            sim.set_prop('base_force',  sim.get_prop('base_force', pos) + 5, pos);
                            sim.set_prop('base_tech',  sim.get_prop('base_tech', pos) + 5, pos);
                        }
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
                    condi: function(sim, cons, pos) {
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
            "海湾侧城": [1, "旧城区"],
            "旧城区": [1, "港湾区"],
            "港湾区": [1],
        },
    };
})();