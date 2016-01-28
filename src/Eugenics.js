var Config = require('Config');
var Utils = require('Utils');
var Enums = require('Enums');
var ROLE = Enums.ROLE;
var OPTIMAL = Config.OPTIMAL;
var BODY = Config.BODY;

function nextIndex(role) {
    return Math.ceil(((Date.now() / 10000) % 1) * 1000);
}

function attackIfRequired(creep) {
    var hostileCreep = creep.pos.findClosesByRange(FIND_HOSTILE_CREEPS);
    
}


function spawnIfRequired(role, numOptimal) {
    /*
    var spawn = Utils.findSpawn();
    if (spawn.energy < spawn.energyCapacity || spawn.spawning)
        return;
    */
    var creeps = Utils.getCreeps(role);
    var numExisting = Object.keys(creeps).length;
    if (typeof numOptimal === 'function')
        numOptimal = numOptimal();
    if (numExisting < numOptimal) {
        var name = role.substr(0, 2) + nextIndex(role);
        var res = Utils.findSpawn().createCreep(BODY[role], name, {role: role});
        //if (res < 0) {
        //    console.log('Trying to spawn ', role, ' >>> ', name,' but got error code ', res);
        //}
        if (res >= 0)
            console.log('Just built ', name);
    }
    return res;
}


function eugenicsTick() {
    spawnIfRequired(ROLE.WORKER, OPTIMAL[ROLE.WORKER]);
    // Dont build anything else unless all workers are present
    if(Object.keys(Utils.getCreeps(ROLE.WORKER)).length >= OPTIMAL[ROLE.WORKER]) {
        //spawnIfRequired(ROLE.COURIER, OPTIMAL[ROLE.COURIER]);
        spawnIfRequired(ROLE.BUILDER, OPTIMAL[ROLE.BUILDER]);
    }
}


module.exports = eugenicsTick;