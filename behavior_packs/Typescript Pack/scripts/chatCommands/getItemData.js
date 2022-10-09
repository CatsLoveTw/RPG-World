import { Player, world } from "mojang-minecraft";
import * as ui from "mojang-minecraft-ui";
import { cmd, GetWorldPlayersName, log, logfor } from '../lib/GametestFunctions.js'
import { getScore, isNum, randomInt, worldlog } from '../lib/function.js'

export const Des = {
    command: "getItemData", // 指令名稱 (string)
    des: "取得物品資訊", // 說明功能 (string)
    format: "-getItemData | -getItemData <物品所在格數(從0開始): 數字>", // 指令語法 (格式) (string)
    example: "-getItemData | -getItemData 0", // 舉例 (string)
    adminOnly: false, // 管理員限定 (boolean)
    warn: false // 警告 (string | false)
}
/**
 * @param {string} message
 * @param {Player} player
 */
export const runCommand = (message, player) => {
    if (!message.split(/ +/)[1]) {
        let inv = player.getComponent('inventory')
        let sele = player.selectedSlot
        let item = inv.container.getItem(sele)
        logfor(player.name, '§c§lNameTag §f- §b' + item.nameTag + ' §e§l物品id §f- §b' + item.id.replace("minecraft:", "") + ' §e§ldata值 §f- §b' + item.data + " §e§l數量§f - §b" + item.amount)
    } else {
        /**
         * @type {EntityInventoryComponent}
         */
        let inv = player.getComponent('inventory')
        let slot = message.split(/ +/)[1]
        if (!isNum(slot) || slot > inv.container.size) {
            return logfor(player.name, '§c§l無效的位置!')
        }
        let item = inv.container.getItem(Number(slot))
        logfor(player.name, '§c§lNameTag §f- §b' + item.nameTag + ' §e§l物品id §f- §b' + item.id.replace("minecraft:", "") + ' §e§ldata值 §f- §b' + item.data + " §e§l數量§f - §b" + item.amount)
    }
}