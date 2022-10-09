import { world, Player } from "mojang-minecraft";
import * as ui from "mojang-minecraft-ui";
import {cmd, GetWorldPlayersName, log, logfor} from '../lib/GametestFunctions.js'
import { tpa } from './tpa.js'
import { leaderboard } from "./leaderboard.js";
import { worldlog, isNum, getScore } from '../lib/function.js'
import { ChatTags } from "./chatTags.js";
import { server } from './serverMenu.js'
import { reportMenu } from "./report.js";
/**
 * 
 * @param {Player} player 
 * @param {*} eventData 
 */
export function playerUI (player, eventData) {
    let fm = new ui.ActionFormData();
    fm.title ('§a§l玩家選單')
    let buttonName = ['伺服器資訊', '回報問題', '管理員選單']
    for (let name of buttonName) {
        fm.button('§e§l' + name)
    }
    fm.show(player).then((result) => {
        if (result.selection === 0) {
            server(player)
        } 
        if (result.selection === 1) {
            reportMenu(player)
        }
        if (result.selection === buttonName.length - 1) {
            if (player.hasTag("admin")) {
            player.addTag("admins")
            } else {
                return logfor (player.name, "§3§l>> §c您沒有權限使用此功能!")
            }
        }
    })
}