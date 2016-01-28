var Config = require('Config');
var Utils = require('Utils');
var Enums = require('Enums');
var WorkerScheduler = require('WorkerScheduler');
var BuilderScheduler = require('BuilderScheduler');

var ROLE = Enums.ROLE;
var TASK = Enums.TASK;

function scheduleGuard() {}

var SchedulerMap = {
    WORKER: WorkerScheduler.schedule,
    BUILDER: BuilderScheduler.schedule
};


var PausedMap = {
    BUILDER: false
};


function repairCreepIfRequired(creep) {
    /* assume slowest creep, plus 15 buffer in case creep needs to wait at spawn */
    // TODO: should we look for extensions before spawns?
    shouldGoToSpawn = (creep.memory.task === TASK.RENEWING && creep.ticksToLive < 800) || (creep.ticksToLive < 70);
    if (shouldGoToSpawn) {
        var closestSpawn = Utils.findSpawn(creep);
        creep.memory.task = TASK.RENEWING;
        creep.memory.target = closestSpawn;
        creep.say('R');
        if (closestSpawn.renewCreep(creep) === ERR_NOT_IN_RANGE)
            creep.moveTo(closestSpawn);
    } else {
        if (creep.memory.task === TASK.RENEWING) {
            creep.memory.task = TASK.IDLE;
            creep.memory.target = null;
            creep.say('I');
        }
    }
}



function jobAssignmentsTick() {
    for (var creepName in Game.creeps) {
        var creep = Game.creeps[creepName];
        if (!creep) {
            console.log('Odd. No creep found for name: ', creepName);
            continue;
        }
        repairCreepIfRequired(creep);
        if (creep.memory.task === TASK.RENEWING) {
            // Let renewing creeps renew until done
            continue;
        }
        
        var role = Utils.getRole(creep);
        if (PausedMap[role]) {
            console.log(role, ' is paused.');
            Utils.moveAside(creep);
            return;
        }
            
        var func = SchedulerMap[role];
        if (typeof func === 'function') {
            func(creep);
        } else {
            console.log('Cant schedule creep with role: ', role);
        }// end else
    }// end for
}// end function jobAssignment


module.exports =  {
    scheduleGuard: scheduleGuard,
    jobAssignmentsTick: jobAssignmentsTick
};
