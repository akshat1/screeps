var Config = require('Config');
var Utils = require('Utils');
var Enums = require('Enums');
var ROLE = Enums.ROLE;
var TASK = Enums.TASK;


function harvestEnergy(creep) {
    var target = Utils.findEnergySource(creep);
    if (!target) {
        return;
    }
    /*
    if (creep.memory.task === TASK.HARVEST_ENERGY)
        creep.say('H*');
    else
        creep.say('H');
    */
        
    creep.memory.task = TASK.HARVEST_ENERGY;
    creep.memory.target = target;
    if (creep.harvest(target) === ERR_NOT_IN_RANGE) {
        creep.moveTo(target);
    }
}


function disposeEnergy(creep) {
    Utils.transferEnergy(creep, Utils.findEnergySink(creep));
}


function scheduleWorker(creep) {
    if (!creep.memory.task || creep.memory.task === TASK.IDLE) {
        creep.memory.task = TASK.HARVEST_ENERGY;
    }
    
    if(creep.memory.task === TASK.HARVEST_ENERGY) {
        if (creep.carry.energy < creep.carryCapacity)
            harvestEnergy(creep);
        else
            disposeEnergy(creep);
    } else if (creep.memory.task === TASK.TRANSFER_ENERGY){
        if (creep.carry.energy === 0)
            harvestEnergy(creep);
        else
            disposeEnergy(creep);
    }
}




module.exports = {
    schedule: scheduleWorker
};
