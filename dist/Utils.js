var getCreeps = function getCreeps(optRole) {
  var result = [];
  for (var name in Game.creeps) {
    var creep = Game.creeps[name];
    if (optRole) {
        if (getRole(creep) === optRole) {
            result[name] = creep;
        }
    } else {
        result[name] = creep;
    }
  }
  return result;
}


function getRole(creep) {
    return creep.memory.role;
}


function getTask(creep) {
    return creep.memory.task;
}


function findEnergySource(creep) {
    return creep.room.find(FIND_SOURCES)[0];
}


function findSpawn(creep, ensureCapacity) {
    if (!creep)
        return Game.spawns.Spawn1;
    return creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
        filter: function(s) {
            if (s.structureType !== STRUCTURE_SPAWN)
                return false;
            if (ensureCapacity)
                return s.energy < s.energyCapacity;
            else
                return true;
        }
    });
}


function findRefillSource(creep) {
    var extension = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
        filter: function(s) {
            return s.structureType === STRUCTURE_EXTENSION && s.energy > 0;
        }
    });
    var spawn = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
        filter: function(s) {
            return s.structureType === STRUCTURE_SPAWN && s.energy > 0;
        }
    });
    var rangeToExtension = !!extension ? creep.pos.getRangeTo(extension) : Number.POSITIVE_INFINITY;
    var rangeToSpawn     = !!spawn ? creep.pos.getRangeTo(spawn) : Number.POSITIVE_INFINITY;
    var result = rangeToExtension > rangeToSpawn ? spawn : extension;
    return result;
}






function findEnergySink(creep) {
    target = findSpawn(creep, true);
        
    if (!target)
        target = closestNonControllerStructure = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
            filter: function(s) {
                var structureType = s.structureType;
                if (structureType !== STRUCTURE_EXTENSION && structureType !== STRUCTURE_POWER_SPAWN && structureType !== STRUCTURE_STORAGE)
                    return false;
                return s.energy < s.energyCapacity;
            }
        });
    if (!target) {
        target = creep.room.controller;
    }
    
    var rangeToTarget = creep.pos.getRangeTo(target);
    var creepRole = getRole(creep);
    var needyPeerInRange = creep.pos.findInRange(FIND_MY_CREEPS, rangeToTarget, {
        filter: function(c) {
            var role = getRole(c);
            if (role !== creepRole) {
                // Avoiding inter-role transfers for fear of circular transfer loops
                return (c.carry.energy < c.carryCapacity);
            }
            return false;
        }
    })[0];
    return needyPeerInRange || target;
}


function transferEnergy(creep, target) {
    creep.memory.task = 'TRANSFER_ENERGY';
    creep.memory.target = target;
    if (target.structureType === STRUCTURE_CONTROLLER) {
        if(creep.upgradeController(target) === ERR_NOT_IN_RANGE)
            creep.moveTo(target);
    } else {
        if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE)
            creep.moveTo(target);
    }
}


function filterForRepairSite(s) {
    // If object has owner then it should be me;
    if (s.hasOwnProperty('owner') ? s.owner.username === 'SpeedySan' : true) {
        // Object should be in need of repair
        return s.hits < s.hitsMax && s.structureType !== STRUCTURE_WALL && s.structureType !== STRUCTURE_RAMPART; //TEMP
    }
}


function findAllRepairSitesInRoom(room) {
    room = room || Game.rooms[Object.keys(Game.rooms)[0]];
    structures = room.find(FIND_STRUCTURES, {filter: filterForRepairSite});
    return structures;
}


function findRepairSite(creep, room) {
    if (creep) {
        return creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: filterForRepairSite
        });
    } else {
        findAllRepairSitesInRoom(room)[0];
    }
}


function findConstructionSite(creep) {
    return creep.pos.findClosestByRange(FIND_MY_CONSTRUCTION_SITES);
}


function findAllConstructionSitesInRoom(room) {
    room = room || Game.rooms[Object.keys(Game.rooms)[0]];
    return room.find(FIND_MY_CONSTRUCTION_SITES);
}


function findRepairSite(creep) {
    // ticksToDecay
    // must make sure that if the structure has an owner then that owner is me (dont want to be repairing hostile walls for instance)
    return creep.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: filterForRepairSite
    });
}


// should cause creep to move to center of room
function moveAside(creep) {
    //TODO    
}




module.exports = {
    getCreeps: getCreeps,
    getRole: getRole,
    getTask: getTask,
    findEnergySink: findEnergySink,
    transferEnergy: transferEnergy,
    findEnergySource: findEnergySource,
    findSpawn: findSpawn,
    findConstructionSite: findConstructionSite,
    findAllConstructionSitesInRoom: findAllConstructionSitesInRoom,
    findRepairSite: findRepairSite,
    findAllRepairSitesInRoom: findAllRepairSitesInRoom,
    findRefillSource: findRefillSource,
    moveAside: moveAside
};