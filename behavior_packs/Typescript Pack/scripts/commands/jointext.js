import { world } from "@minecraft/server";
import * as ui from "@minecraft/server-ui";
import {cmd, log, logfor} from '../lib/GametestFunctions.js'
import { isNum, randomInt } from '../lib/function.js'

// | 或 §

export function jointext (player) {
    if (player.hasTag("admin")) {
        log (`§3§l>> §6§l${player.name} §e§l加入了伺服器!`)
    } else {
        log (`§3§l>> §g§l${player.name} §e§l加入了伺服器!`)
    }

}