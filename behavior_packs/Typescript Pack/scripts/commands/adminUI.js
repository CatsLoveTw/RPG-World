import { world } from "mojang-minecraft";
import * as mc from "mojang-minecraft"
import * as ui from "mojang-minecraft-ui";
import {cmd, GetWorldPlayersName, log, logfor} from '../lib/GametestFunctions.js'
import { getScore, isNum, randomInt } from '../lib/function.js'
import { worldlog } from '../lib/function.js'
import { tpa } from './tpa.js'
import { SettingMenu } from "./pveData.js"

import { changeMaxLevel } from './level.js'
import * as report from './report.js'

// | 或 §
/**
 * 
 * @param {mc.Player} player 
 * @param {*} eventData 
 */
function adminUI (player, eventData) {
    if (player.hasTag("admins")) {
        player.removeTag("admins")
        let fm = new ui.ActionFormData();
        let randomcolor = [
            '§a§l',
            '§b§l',
            '§6§l',
            '§5§l',
            '§f§l',
            '§e§l',
            '§g§l',
            '§3§l'
        ]
        fm.title ('§a§l管理員選單')
        fm.body ('§c§l使用前提醒!!!\n§c§l因本選單為管理員選單,因此部分的字沒有加上顏色,較陽春\n§c§l各位管理員還請多多包涵與諒解><\n§e創作選單等功能§f/§e指令師§f:§aCat1238756\n§f(§6Catmeowmeowmeow§f)\n§g地圖作者§f:§a小黑 §f(00qq00§f)')
        let buttonName = ['設定武器', '黑名單', '停用玩家回報', '禁言', '更改伺服器公告', "查看玩家回報", "等級限制修改"]
        for (let name of buttonName) {
            fm.button(randomcolor[randomInt(7, false)] + name)
        }
        fm.show(player).then((result) => {
            if (result.selection === 0) {
                SettingMenu(player)
            }
            if (result.selection === 1) {
                let bans = worldlog.getScoreboardPlayers("ban")
                let banPlayer = []
                for (let ban of bans.disname) {
                    let okban = ban.replace('/', '')
                    banPlayer.push(okban)
                }
                let fm = new ui.ActionFormData();
                fm.title('§e§l黑名單')
                fm.button('§a§l新增黑名單')
                fm.button('§c§l移除黑名單')
                fm.button('§b§l查看黑名單')
                
                fm.show(player).then(res => {
                    if (res.selection === 0) {

                        let fm = new ui.ActionFormData();
                        fm.title('§a§l選擇類型')
                        fm.button('§e§l線上玩家')
                        fm.button('§e§l手動輸入')
                        fm.show(player).then(res => {
                        if (res.selection === 0) {
                        let playerData = []
                        let playerName = []
                        let fm = new ui.ActionFormData();
                        fm.title('§e§l黑名單新增系統 §f- §b§l選擇在線玩家');
                        for (let play of world.getPlayers()) {
                            if (play.name != player.name && !banPlayer.includes(play.name)) {
                                playerData.push(play)
                                playerName.push(`§a${play.name}`)
                                fm.button(`§a${play.name}`)
                            }
                        }
                        if (playerData.length == 0) {
                            return logfor(player.name, '§3§l>> §c沒有玩家可以新增!');
                        }
                        fm.show(player).then(res => {
                            if (res.isCanceled || !res) {return;}
                            let selePlayer = playerData[res.selection]

                            cmd(`scoreboard players set "${selePlayer.name}/" ban 0`)
                            cmd(`tag "${selePlayer.name}" add hack`)
                        })
                    } else if (res.selection === 1) {
                        let fm = new ui.ModalFormData();
                        fm.title('§e§l黑名單新增系統 §f- §a手動輸入')
                        fm.textField('§e§l輸入該玩家名稱', '§a§l名稱')
                        fm.show(player).then(res => {
                            if (!res || res.isCanceled) {return;}
                            let playerName = res.formValues[0]
                            try {
                                cmd(`scoreboard players set "${playerName}/" ban 0`)
                                logfor(player.name, '§3§l>> §a黑名單新增成功!')
                            } catch (error) {logfor(player.name, error)}
                        })
                    }
                    })
                    } else if (res.selection === 1) {
                        if (banPlayer.length == 0) {
                            return logfor(player.name, '§3§l>> §c沒有玩家可以刪除!');
                        }
                        let fm = new ui.ActionFormData();
                        fm.title('§c§l移除黑名單')
                        for (let i in banPlayer) {
                            fm.button(`§a${banPlayer[i]}`)
                        }
                    
                        fm.show(player).then(res => {
                            if (!res || res.isCanceled) {return;}
                            let selePlayer = banPlayer[res.selection]

                            cmd(`scoreboard players reset "${selePlayer}/" ban`)
                            logfor(player.name, '§3§l>> §a移除成功')
                        })
                    } else if (res.selection === 2) {
                        if (banPlayer.length == 0) {
                        return logfor(player.name, `§f§l------§e黑名單玩家§f------\n§c無`)
                        }
                        let disBanPlayer = banPlayer.toString().replace(',', '\n')
                        logfor(player.name, `§f§l------§e黑名單玩家§f------\n§a${disBanPlayer}`)
                    }
                })
            } else if (result.selection === 2) {
                let bans = worldlog.getScoreboardPlayers("reportMute")
                let banPlayer = []
                for (let ban of bans.disname) {
                    let okban = ban.replace('/', '')
                    banPlayer.push(okban)
                }
                let fm = new ui.ActionFormData();
                fm.title('§e§l停用回報功能')
                fm.button('§a§l新增黑名單')
                fm.button('§c§l移除黑名單')
                fm.button('§b§l查看黑名單')
                
                fm.show(player).then(res => {
                    if (res.selection === 0) {

                        let fm = new ui.ActionFormData();
                        fm.title('§a§l選擇類型')
                        fm.button('§e§l線上玩家')
                        fm.button('§e§l手動輸入')
                        fm.show(player).then(res => {
                        if (res.selection === 0) {
                        let playerData = []
                        let playerName = []
                        let fm = new ui.ActionFormData();
                        fm.title('§e§l黑名單新增系統 §f- §b§l選擇在線玩家');
                        for (let play of world.getPlayers()) {
                            if (play.name != player.name && !banPlayer.includes(play.name)) {
                                playerData.push(play)
                                playerName.push(`§a${play.name}`)
                                fm.button(`§a${play.name}`)
                            }
                        }
                        if (playerData.length == 0) {
                            return logfor(player.name, '§3§l>> §c沒有玩家可以新增!');
                        }
                        fm.show(player).then(res => {
                            if (res.isCanceled || !res) {return;}
                            let selePlayer = playerData[res.selection]

                            cmd(`scoreboard players set "${selePlayer.name}/" reportMute 0`)
                        })
                    } else if (res.selection === 1) {
                        let fm = new ui.ModalFormData();
                        fm.title('§e§l黑名單新增系統 §f- §a手動輸入')
                        fm.textField('§e§l輸入該玩家名稱', '§a§l名稱')
                        fm.show(player).then(res => {
                            if (!res || res.isCanceled) {return;}
                            let playerName = res.formValues[0]
                            try {
                                cmd(`scoreboard players set "${playerName}/" reportMute 0`)
                                logfor(player.name, '§3§l>> §a黑名單新增成功!')
                            } catch (error) {logfor(player.name, error)}
                        })
                    }
                    })
                    } else if (res.selection === 1) {
                        if (banPlayer.length == 0) {
                            return logfor(player.name, '§3§l>> §c沒有玩家可以刪除!');
                        }
                        let fm = new ui.ActionFormData();
                        fm.title('§c§l移除黑名單')
                        for (let i in banPlayer) {
                            fm.button(`§a${banPlayer[i]}`)
                        }
                    
                        fm.show(player).then(res => {
                            if (!res || res.isCanceled) {return;}
                            let selePlayer = banPlayer[res.selection]

                            cmd(`scoreboard players reset "${selePlayer}/" reportMute`)
                            logfor(player.name, '§3§l>> §a移除成功')
                        })
                    } else if (res.selection === 2) {
                        if (banPlayer.length == 0) {
                        return logfor(player.name, `§f§l------§e黑名單玩家§f------\n§c無`)
                        }
                        let disBanPlayer = banPlayer.toString().replace(',', '\n')
                        logfor(player.name, `§f§l------§e黑名單玩家§f------\n§a${disBanPlayer}`)
                    }
                }) 
            } else if (result.selection === 3) {
                let bans = worldlog.getScoreboardPlayers("Mute")
                let banPlayer = []
                for (let ban of bans.disname) {
                    let okban = ban.replace('/', '')
                    banPlayer.push(okban)
                }
                let fm = new ui.ActionFormData();
                fm.title('§e§l禁言功能')
                fm.button('§a§l新增黑名單')
                fm.button('§c§l移除黑名單')
                fm.button('§b§l查看黑名單')
                
                fm.show(player).then(res => {
                    if (res.selection === 0) {

                        let fm = new ui.ActionFormData();
                        fm.title('§a§l選擇類型')
                        fm.button('§e§l線上玩家')
                        fm.button('§e§l手動輸入')
                        fm.show(player).then(res => {
                        if (res.selection === 0) {
                        let playerData = []
                        let playerName = []
                        let fm = new ui.ActionFormData();
                        fm.title('§e§l黑名單新增系統 §f- §b§l選擇在線玩家');
                        for (let play of world.getPlayers()) {
                            if (play.name != player.name && !banPlayer.includes(play.name)) {
                                playerData.push(play)
                                playerName.push(`§a${play.name}`)
                                fm.button(`§a${play.name}`)
                            }
                        }
                        if (playerData.length == 0) {
                            return logfor(player.name, '§3§l>> §c沒有玩家可以新增!');
                        }
                        fm.show(player).then(res => {
                            if (res.isCanceled || !res) {return;}
                            let selePlayer = playerData[res.selection]

                            cmd(`scoreboard players set "${selePlayer.name}/" Mute 0`)
                        })
                    } else if (res.selection === 1) {
                        let fm = new ui.ModalFormData();
                        fm.title('§e§l黑名單新增系統 §f- §a手動輸入')
                        fm.textField('§e§l輸入該玩家名稱', '§a§l名稱')
                        fm.show(player).then(res => {
                            if (!res || res.isCanceled) {return;}
                            let playerName = res.formValues[0]
                            try {
                                cmd(`scoreboard players set "${playerName}/" Mute 0`)
                                logfor(player.name, '§3§l>> §a黑名單新增成功!')
                            } catch (error) {logfor(player.name, error)}
                        })
                    }
                    })
                    } else if (res.selection === 1) {
                        if (banPlayer.length == 0) {
                            return logfor(player.name, '§3§l>> §c沒有玩家可以刪除!');
                        }
                        let fm = new ui.ActionFormData();
                        fm.title('§c§l移除黑名單')
                        for (let i in banPlayer) {
                            fm.button(`§a${banPlayer[i]}`)
                        }
                    
                        fm.show(player).then(res => {
                            if (!res || res.isCanceled) {return;}
                            let selePlayer = banPlayer[res.selection]

                            cmd(`scoreboard players reset "${selePlayer}/" Mute`)
                            logfor(player.name, '§3§l>> §a移除成功')
                        })
                    } else if (res.selection === 2) {
                        if (banPlayer.length == 0) {
                        return logfor(player.name, `§f§l------§e黑名單玩家§f------\n§c無`)
                        }
                        let disBanPlayer = banPlayer.toString().replace(',', '\n')
                        logfor(player.name, `§f§l------§e黑名單玩家§f------\n§a${disBanPlayer}`)
                    }
                }) 
            } else if (result.selection === 4) {
                let msg
                try {
                    msg = worldlog.getScoreboardPlayers("servermsg").disname[0].split(",,,")[2]
                } catch {}
                let fm = new ui.ModalFormData();
                fm.title('§e§l設定伺服器公告')
                if (!msg) {
                    fm.textField("§b§l公告內容", "text")
                } else {
                    fm.textField("§b§l公告內容", "text", msg)
                }
                fm.show(player).then(res => {
                    if (!res || res.isCanceled) {return;}
                    let msg = res.formValues[0]
                    if (!msg == "") {
                        try {
                            let get = worldlog.getScoreboardPlayers("servermsg").disname
                            for (let i in get) {
                                cmd(`scoreboard players reset "${get[i]}" servermsg`)
                            }
                        } catch {}
                        let date = new Date()
                        let sec = date.getSeconds()
                        let min = date.getMinutes()
                        let hour = date.getHours() + 8
                        let today = date.getDate()
                        let month = date.getMonth() + 1
                        let year = date.getFullYear()
                        if (sec < 10) {
                            sec = "0" + sec
                        }
                        if (min < 10) {
                            min = "0" + min
                        }
                        if (hour < 10) {
                            hour = "0" + hour
                        }
                        cmd(`scoreboard players set "§6§l${year}§f/§6${month}§f/§6${today} §b${hour}§f:§b${min}§f:§b${sec},,,${player.name},,,${msg}" servermsg 0`)
                        logfor(player.name, '§3§l>> §a設定成功!')
                    }
                })
            } else if (result.selection === 5) {
                report.admin(player)
            } else if (result.selection === 6) {
                let menu = new ui.ModalFormData();
                let nowMaxLevel = worldlog.getPlayerLevel(player).maxlevel
                menu.title("§e§l等級限制修改")
                menu.textField("§a§l輸入等級上限", "number", nowMaxLevel.toString())
                menu.show(player).then(res => {
                    let maxLevel = res.formValues[0]
                    changeMaxLevel(maxLevel)
                })
            }
         })
    } else {
        // logfor (player.name, "§3>> §c§l你不是管理員!")
    }
}

export { adminUI }