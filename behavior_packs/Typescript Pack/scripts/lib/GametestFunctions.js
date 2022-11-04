import * as mc from "@minecraft/server";

const cmd = function(command) {
    return mc.world.getDimension("overworld").runCommand(command).statusMessage
};
  
const logfor = function(playername,message) {
    let okay_message = message.toString().replaceAll('\"',"''").replaceAll('\\',"/")
    mc.world.getDimension("overworld").runCommand(`tellraw "${playername}" {"rawtext":[{"text":"${okay_message}"}]}`)
};
const logforTarget = function(Target,message) {
    let okay_message = message.toString().replaceAll('\"',"''").replaceAll('\\',"/")
    mc.world.getDimension("overworld").runCommand(`tellraw ${Target} {"rawtext":[{"text":"${okay_message}"}]}`)
}

const titlefor = function(playername,message) {
    let okay_message = message
    mc.world.getDimension("overworld").runCommand(`titleraw "${playername}" actionbar {"rawtext":[{"text":"${okay_message}"}]}`)
}

const titlelog = function(message) {
    let okay_message = message
    mc.world.getDimension("overworld").runCommand(`titleraw @a actionbar {"rawtext":[{"text":"${okay_message}"}]}`)
}

const log = function(message) {
    let okay_message = message.toString().replaceAll('\"',"''").replaceAll('\\',"/")
    mc.world.getDimension("overworld").runCommand(`tellraw @a {"rawtext":[{"text":"${okay_message}"}]}`).statusMessage
}


export {cmd, logfor, logforTarget, log, titlefor, titlelog}