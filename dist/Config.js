var Utils = require('Utils');

module.exports = {
    OPTIMAL: {
        WORKER  : 10,
        COURIER : 0,
        GUARD   : 2,
        BUILDER : function() {
            var numRepairSites = Utils.findAllRepairSitesInRoom().length;
            var numConstructionSites = Utils.findAllConstructionSitesInRoom().length;
            var factor = Math.ceil( numRepairSites + numConstructionSites) / 20;
            // Never more than x builders
            var maxBuilders = 2;
            return factor > maxBuilders ? maxBuilders : factor;
        }
    },
    
    BODY: {
        COURIER : [CARRY, CARRY,  CARRY, MOVE,  MOVE],
        WORKER  : [CARRY, MOVE,   WORK,  WORK],
        BUILDER : [MOVE,  MOVE,   WORK,  WORK, CARRY, CARRY],
        GUARD   : [MOVE,  ATTACK, ATTACK]
    }
};