import { world } from "mojang-minecraft";
import * as ui from "mojang-minecraft-ui";
import {cmd, log, logfor} from '../lib/GametestFunctions.js'
import { getScore, isNum, randomInt, worldlog } from '../lib/function.js'
import { tpa } from './tpa.js'

// | 或 §

// playerdiamond
export function ban () {
    const banitem = [
        "minecraft:command_block_minecart",
        "minecraft:moving_block",
        "minecraft:bee_nest",
        "minecraft:beehive",
        "minecraft:crossbow"
    ]
    const warringItem = [
        
    ]
    const warringItemName = [
        "蜂巢",
        "蜂箱"
    ]
    for (const player of world.getPlayers()) {
    const plainv = player.getComponent('inventory')
    let hackitem = []
    let hack = false
    try {
        for (let i=0; i < 36; i++) {
            try {
                for (let item of banitem) {
                    if (warringItem.includes(plainv.container.getItem(i).id) && !player.hasTag("admin")) {
                        log(`§3§l>> §c偵測到 §f${player.name} §c的背包擁有 §f${plainv.container.getItem(i).id} §c已清除!`)
                        player.runCommand(`clear @s ${plainv.container.getItem(i).id}`)
                        for (let name of warringItemName) {
                            try {
                                cmd(`kill @e[name="${name}",type=item]`)
                                log (`§3§l>> §c已清除 §f${name} §c掉落物!`)
                            } catch {

                            }
                        }
                    }
                    if (plainv.container.getItem(i).id == item && !player.hasTag("admin")) {
                        hackitem.push(plainv.container.getItem(i).id)
                        hack = true
                 }
            }
            } catch {}
        }
    } catch {}

    
    if (hack) {
        try {cmd (`tag "${player.name}" add hack`)} catch {}
        cmd(`scoreboard players set "${player.name}/" ban 0`)
        try {cmd (`kick "${player.name}" "§e§l外掛 ban永久"`)} catch {}
        cmd (`clear "${player.name}"`)
        log (`§3§l>> §e系統偵測到 ${player.name} 拿取 ${hackitem} 已清除`)
    }

        if (worldlog.getScoreFromMinecraft(`${player.name}/`, 'ban')) {
            if (!player.hasTag("hack")) {
                player.addTag("hack")
            } else {
            log(`§3§l>> §b系統偵測到 ${player.name} 擁有外掛/黑名單紀錄 已被踢除`)
            try {cmd (`kick "${player.name}" "§e§l外掛 ban永久"`)} catch {}
        }
    }
    if (!worldlog.getScoreFromMinecraft(`${player.name}/`, 'ban')) {
        if (player.hasTag('hack')) {
            player.removeTag(`hack`)
            log(`§3§l>> §c偵測到 §f${player.name} §c的黑名單已被移除!`)
        }
    }
}


}