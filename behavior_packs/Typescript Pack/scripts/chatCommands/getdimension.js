import { Player, world } from "@minecraft/server";
import * as ui from "@minecraft/server-ui";
import { cmd, log, logfor } from '../lib/GametestFunctions.js'
import { getScore, isNum, randomInt, worldlog } from '../lib/function.js'

export const Des = {
    command: "getDimension", // 指令名稱 (string)
    des: "查看所在緯度", // 說明功能 (string)
    format: "-getDimension", // 指令語法 (格式) (string)
    example: "-getDimension", // 舉例 (string)
    adminOnly: false, // 管理員限定 (boolean)
    warn: false // 警告 (string | false)
}
/**
 * @param {string} message
 * @param {Player} player
 */
export const runCommand = (message, player) => {
    logfor (player.name, `§g§l您的緯度§f:§a${player.dimension.id}`)
}

