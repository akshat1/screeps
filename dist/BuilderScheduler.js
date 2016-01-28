var Config = require('Config');
var Utils = require('Utils');
var Enums = require('Enums');
var ROLE = Enums.ROLE;
var TASK = Enums.TASK;


function build(creep) {
    creep.memory.task = TASK.BUILDING;
    //creep.say('B');
    var target = Utils.findConstructionSite(creep);
    var opName = 'build';
    if (!target) {
        target = Utils.findRepairSite(creep);
        opName = 'repair';
    }
    if (target) {
        if(creep[opName](target) === ERR_NOT_IN_RANGE)
            creep.moveTo(target);
    } else {
        creep.moveTo(Game.flags['BuildersHall']);
    }
}


function charge(creep) {
    //creep.say('C');
    creep.memory.task = TASK.CHARGING;
    creep.memory.target = null;
    var source = Utils.findRefillSource(creep);
    if (source) {
        if(source.transferEnergy(creep) === ERR_NOT_IN_RANGE)
            creep.moveTo(source);
    } else {
        console.log('We have no energy sources');
    }
}


function scheduleBuilder(creep) {
    var task = Utils.getTask(creep);
    if (!task || task === TASK.IDLE)
        task = TASK.BUILDING;
        
    if (task === TASK.BUILDING) {
        if (creep.carry.energy === 0)
            charge(creep);
        else
            build(creep);
    } else if (task === TASK.CHARGING) {
        if (creep.carry.energy < creep.carryCapacity)
            charge(creep);
        else
            build(creep);
    } else {
        console.log('What is this builder doing? ', task);
    }
}




module.exports = {
    schedule: scheduleBuilder
};