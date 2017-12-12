var db7 = {
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
                    return true;
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
                    return sim.get_prop('tech') >= 35;
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
                    return sim.get_prop('tech') >= 30 && sim.get_num(cons, pos) < 1
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
                    return sim.get_prop('tech') >= 60 && sim.get_num(cons) < 1;
                },
            },
            "黑门监测站": {
                construct: 22,
                condi: function(sim, cons, pos) {
                    return sim.get_prop('tech') >= 30 && sim.get_num(cons) < 1;
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
                    return true;
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
                    return sim.get_prop('tech') >= 30 && sim.get_num(cons, pos) < 1;
                },
            },
            "购物中心": {
                construct: 22,
                condi: function(sim, cons, pos) {
                    return sim.get_prop('tech') >= 30 && sim.get_num(cons, pos) < 1;
                },
            },
            "地铁枢纽": {
                construct: 10,
                condi: function(sim, cons, pos) {
                    return sim.get_prop('tech') >= 15 && sim.get_num(cons) < 4;
                },
            },
            "规划所": {
                construct: 10,
                condi: function(sim, cons, pos) {
                    return sim.get_prop('tech') >= 15 && sim.get_num(cons) < 4;
                },
            },
            "起重机": {
                construct: 10,
                condi: function(sim, cons, pos) {
                    return sim.get_prop('tech') >= 15 && sim.get_num(cons) < 4;
                },
            },
            "急救中心": {
                construct: 30,
                condi: function(sim, cons, pos) {
                    return sim.get_prop('tech') >= 80 && sim.get_num(cons) < 1;
                },
            },
            "方舟": {
                construct: 30,
                condi: function(sim, cons, pos) {
                    return sim.get_prop('tech') >= 50 && sim.get_num(cons) < 1;
                },
            },
            "深海潜艇": {
                construct: 20,
                condi: function(sim, cons, pos) {
                    return sim.get_prop('tech') >= 30;
                },
            },
            "其他": {
                construct: 0,
                condi: function() {
                    return true;
                },
            },
        },
    },
    develop: [
        10, 14, 22, 30
    ],
    patrol: [
        10, 10, 10, 14, 14, 22, 22, 30, 30, 38, 38, 46
    ],
}