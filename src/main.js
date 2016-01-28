var JobScheduler = require('JobScheduler');
var Eugenics = require('Eugenics');


function gameTick() {
    Eugenics();
    JobScheduler.jobAssignmentsTick();
}


module.exports.loop = gameTick();
