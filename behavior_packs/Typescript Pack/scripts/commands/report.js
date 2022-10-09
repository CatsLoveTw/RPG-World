import * as mc from "mojang-minecraft";
import * as ui from "mojang-minecraft-ui";
import { isNum, worldlog } from "../lib/function.js";
import {cmd, GetWorldPlayersName, log, logfor} from '../lib/GametestFunctions.js'
/*
  通用回復:
    收到後回覆:
        親愛的玩家，您好:\n感謝您的問題提供，目前已收到您的反饋!，官方仍在調查 / 修復中\n請保持關注內容以獲得最新資訊!\nBy:Cat1238756
    被檢舉者檢查後沒有問題:
        親愛的玩家，您好:\n感謝您維護該伺服器環境，經過官方調查\n被檢舉人沒有符合您所敘述的行為\n若被檢舉人行為還有任何異常或任何不滿\n歡迎繼續說明您的問題!\nBy:Cat1238756
    Bug檢查後沒有問題 / 沒有發現問題:
        親愛的玩家，您好:\n感謝您的問題提供，經過官方調查，未發現有您所敘述的Bug\n若還有遇到相同問題或任何不滿\n歡迎繼續說明您的問題!\nBy:Cat1238756
    Bug修復成功:
        親愛的玩家，您好:\n感謝您的問題提供，您所敘數的問題目前已經修復完畢!\n若還有遇到相同問題或其它問題\n歡迎繼續說明您的問題!\nBy:Cat1238756
    被檢舉者受到制裁:
        親愛的玩家，您好:\n感謝您維護該伺服器環境，您所敘數的玩家已經受到對應的懲罰!\n若發現其他玩家有任何問題\n歡迎繼續說明您的問題!\nBy:Cat1238756

 */
/**
 * @param {mc.Player} player
 * @returns {void}
 */
export function reportMenu (player) {
    let fm = new ui.ActionFormData();
    fm.title ('§a§l回報問題')
    let buttonName = ['回報漏洞', '檢舉玩家', '查看回報/檢舉']
    let waring = ""
        if (worldlog.getScoreFromMinecraft(`${player.name}/`, "reportMute").score == 0) {
            buttonName = ["§c回報漏洞", "§c檢舉玩家", "查看回報/檢舉"]
            waring = "§c§l因特殊原因 管理員關閉了您的回報權力\n若有任何問題，請詢問管理員。"
        }
    for (let name of buttonName) {
        fm.button('§e§l' + name)
    }
    fm.body(waring)
    fm.show(player).then((result) => {
        // reportmsg
        const date = new Date()
        let year = date.getFullYear()
        let month = date.getMonth() + 1
        let day = date.getDate()
        let hour = date.getHours() + 8
        let min = date.getMinutes()
        let sec = date.getSeconds()
        if (hour < 10) {
            hour = "0" + hour
        }
        if (min < 10) {
            min = "0" + min
        }
        if (sec < 10) {
            sec = "0" + sec
        }

        if (result.selection === 0) {
            if (!worldlog.getScoreFromMinecraft(`${player.name}/`, "reportMute")) {
            let fm = new ui.ModalFormData();
            fm.title ('§a§l回報漏洞')
            fm.textField("§e§l回報漏洞", '§e§l請簡單陳述您的問題 §f(§b>10字§f)')
            fm.show(player).then((res) => {
                if (!res || res.isCanceled) {return;}
                /**
                 * @type {string}
                 */
                let text = res.formValues[0]
                text = text.trim()
                if (text == "" || text.length < 10 || isNum(text)) {
                    return logfor(player.name, '§3§l>> §c回報失敗 無效內容!');
                }
                cmd(`scoreboard players set "bug:::§6${year}§f/§6${month}§f/§6${day}§f:::§b${hour}§f:§b${min}§f:§b${sec}:::${player.name}:::${text}" reportmsg 0`)
                logfor(player.name, '§3§l>> §a回報成功')
                for (let p of mc.world.getPlayers()) {
                    if (p.hasTag("admin")) {
                        logfor (p.name, `§3§l>> §a有一條新的BUG回報 §f- ${text} §7(§b${player.name}§7)`)
                    }
                }
            })
            } else {
                logfor (player.name, waring)
            }
    }
        if (result.selection === 1) {
            if (!worldlog.getScoreFromMinecraft(`${player.name}/`, "reportMute")) {
            let players = []
            let playerName = []
            for (let pla of mc.world.getPlayers()) {
                if (player != pla) {
                    players.push(pla)
                    playerName.push(pla.name)
                }
            }
            if (playerName.length == 0) {
                return logfor(player.name, '§3§l>> §c沒有玩家可以檢舉')
            }
            let fm = new ui.ModalFormData();
            fm.title ('§a§l檢舉玩家')
            fm.dropdown("§e§l檢舉玩家", playerName)
            fm.textField("§e§l檢舉玩家", '§e§l請簡單陳述外掛內容 方便管理員觀察 §f(§b>5字§f)')
            fm.show(player).then((res) => {
                if (!res || res.isCanceled) {return;}
                /**
                 * @type {number}
                 */
                let sele = res.formValues[0]
                /**
                 * @type {string}
                 */
                let text = res.formValues[1]
                text = text.trim()
                if (text == "" || text.length < 5 || isNum(text)) {
                    return logfor(player.name, '§3§l>> §c檢舉失敗 無效內容!');
                }
                cmd(`scoreboard players set "player:::${playerName[sele]}:::§6${year}§f/§6${month}§f/§6${day}§f:::§b${hour}§f:§b${min}§f:§b${sec}:::${player.name}:::${text}" reportmsg 0`)
                logfor(player.name, '§3§l>> §a檢舉成功')
                for (let p of mc.world.getPlayers()) {
                    if (p.hasTag("admin")) {
                        logfor (p.name, `§3§l>> §a有一條新的檢舉 §f- ${text} §7(§b${player.name} §f-> §b${playerName[sele]}§7)`)
                    }
                }
            })
            } else {
                logfor (player.name, waring)
            }
            } else if (result.selection === 2) {
                let fm = new ui.ActionFormData();
                let allText = worldlog.getScoreboardPlayers("reportmsg").disname
                let displayText = []
                for (let text of allText) {
                    let texts
                    if (text.split(':::')[3] == player.name || text.split(':::')[4] == player.name) {
                        if (text.split(":::")[0] == "bug") {
                            let t = text.split(":::")
                            let obj = t[0]
                            let date = t[1]
                            let time = t[2]
                            let player = t[3]
                            let msg = t[4]
                            msg = msg.replace(/\\n/g, "\n")
                            let objDis = `§7§l[§cbug回報§7] §f- ${date} ${time}`
                            if (t[5] == "true") {
                                objDis = `§7§l[§a回報修復完畢§7] §f- ${t[6]}`
                            }
                            if (obj == "bug") {
                                fm.button(`${objDis}\n§e§l回報者§f: §a${player}`)
                            }
                            texts = `§e§l內容§f:\n${msg}\n\n§e§l回報者§f: §a${player} \n${date} ${time}`
                            if (t[5] == "true") {
                                texts = `§e§l內容§f:\n${msg}\n\n§e§l回報者§f: §a${player} \n${date} ${time}\n\n§b解決後回復訊息§f:\n${t[6]}`
                            }
                            if (t[7] == "true") {
                                texts = `§e§l內容§f:\n${msg}\n\n§e§l回報者§f: §a${player} \n${date} ${time}\n\n§b回復訊息§f:\n${t[8]}`
                            }
                        } else {
                            let t = text.split(":::")
                            let obj = t[0]
                            let name = t[1]
                            let date = t[2]
                            let time = t[3]
                            let player = t[4]
                            let msg = t[5]
                            msg = msg.replace(/\\n/g, "\n")
                            let objDis = `§7§l[§c檢舉回報§7] §f- ${date} ${time}`
                            if (t[6] == "true") {
                                objDis = `§7§l[§a檢舉回報處理完畢§7] §f- ${t[7]}`
                            }
                            fm.button(`${objDis}\n§e§l檢舉者§f: §a${player} §f- §a${name}`)
                            texts = `§e§l內容§f:\n${msg}\n\n§e§l檢舉者§f: §a${player} §f-- \n§b被檢舉者§f: §a${name}\n${date} ${time}`
                            if (t[6] == "true") {
                                texts = `§e§l內容§f:\n${msg}\n\n§e§l回報者§f: §a${player} §f-- \n§b被檢舉者§f: §a${name}\n${date} ${time}\n\n§b解決後回復訊息§f:\n${t[7]}`
                            }
                            if (t[8] == "true") {
                                texts = `§e§l內容§f:\n${msg}\n\n§e§l回報者§f: §a${player} §f-- \n§b被檢舉者§f: §a${name}\n${date} ${time}\n\n§b回復訊息§f:\n${t[9]}`
                            }
                        }
                    }
                    displayText.push(texts)
                }
                if (displayText.length == 0) {
                    return logfor(player.name, '§3§l>> §c沒有回報!')
                }
                fm.show(player).then(res => {
                    if (!res || res.isCanceled) {return;}
                    let sele = res.selection
                    let msg = displayText[sele]
                    msg = msg.replace(/\\n/g, "\n")
                    let score = allText[sele]
                    let fm = new ui.ActionFormData();
                    fm.title('§e§l回報內容')
                    fm.body(msg)
                    fm.button("§c§l關閉")
                    fm.show(player)
                })
        }
    })
}
/**
 * 
 * @param {mc.Player} player 
 */
export const admin = (player) => {
    let fm = new ui.ActionFormData();
                /**
                 * @type {string[]}
                 */
                let allText = worldlog.getScoreboardPlayers("reportmsg").disname
                let displayText = []
                let objs = []
                let players = []
                for (let text of allText) {
                    let texts
                    if (text.split(":::")[0] == "bug") {
                        let t = text.split(":::")
                        let obj = t[0]
                        objs.push(obj)
                        players.push("undefined")
                        let date = t[1]
                        let time = t[2]
                        let player = t[3]
                        let msg = t[4]
                        msg = msg.replace(/\\n/g, "\n")
                        let objDis = `§7§l[§cbug回報§7] §f- ${date} ${time}`
                        if (t[5] == "true") {
                            objDis = `§7§l[§a回報修復完畢§7] §f- ${t[6]}`
                        }
                        if (obj == "bug") {
                            fm.button(`${objDis}\n§e§l回報者§f: §a${player}`)
                        }
                        texts = `§e§l內容§f:\n${msg}\n\n§e§l回報者§f: §a${player} \n${date} ${time}`
                        if (t[5] == "true") {
                            texts = `§e§l內容§f:\n${msg}\n\n§e§l回報者§f: §a${player} \n${date} ${time}\n\n§b解決後回復訊息§f:\n${t[6]}`
                        }
                        if (t[7] == "true") {
                            texts = `§e§l內容§f:\n${msg}\n\n§e§l回報者§f: §a${player} \n${date} ${time}\n\n§b回復訊息§f:\n${t[8]}`
                        }
                    } else {
                        let t = text.split(":::")
                        let obj = t[0]
                        objs.push(obj)
                        players.push(t[1])
                        let name = t[1]
                        let date = t[2]
                        let time = t[3]
                        let player = t[4]
                        let msg = t[5]
                        msg = msg.replace(/\\n/g, "\n")
                        let objDis = `§7§l[§c檢舉回報§7] §f- ${date} ${time}`
                        if (t[6] == "true") {
                            objDis = `§7§l[§a檢舉回報處理完畢§7] §f- ${t[7]}`
                        }
                        fm.button(`${objDis}\n§e§l檢舉者§f: §a${player} §f- §a${name}`)
                        texts = `§e§l內容§f:\n${msg}\n\n§e§l檢舉者§f: §a${player} §f-- \n§b被檢舉者§f: §a${name}\n${date} ${time}`
                        if (t[6] == "true") {
                            texts = `§e§l內容§f:\n${msg}\n\n§e§l回報者§f: §a${player} §f-- \n§b被檢舉者§f: §a${name}\n${date} ${time}\n\n§b解決後回復訊息§f:\n${t[7]}`
                        }
                        if (t[8] == "true") {
                            texts = `§e§l內容§f:\n${msg}\n\n§e§l回報者§f: §a${player} §f-- \n§b被檢舉者§f: §a${name}\n${date} ${time}\n\n§b回復訊息§f:\n${t[9]}`
                        }
                    }
                    displayText.push(texts)
                }
                
                fm.show(player).then((res) => {
                    if (!res || res.isCanceled) {return;}
                    let sele = res.selection
                    let msg = displayText[sele]
                    msg = msg.replace(/\\n/g, "\n")
                    let score = allText[sele]
                    let fm = new ui.ActionFormData();
                    fm.title('§e§l回報內容')
                    fm.body(msg)
                    fm.button("§a§l修復完畢")
                    fm.button("§b§l輸入回復訊息")
                    fm.button("§c§l刪除回報")
                    if (objs[sele] != "bug") {
                        fm.button('§a§l封鎖該玩家')
                    }
                    
                    fm.button("§c§l關閉")
                    fm.show(player).then(res => {
                        if (res.selection === 0) {
                            if (allText[sele].split(":::")[5] == "true" || score.split(":::")[6] == "true") {
                                logfor (player.name, '§3§l>> §a已經修復完畢!')
                            } else {
                                let fm = new ui.ModalFormData();
                                fm.title('§e§l修復回報')
                                fm.textField("§b§l輸入回報內容", "text")
                                fm.show(player).then(res => {
                                    if (!res || res.isCanceled) {return;}
                                    let di = score
                                    cmd(`scoreboard players reset "${di}" reportmsg`)
                                    cmd(`scoreboard players set "${di.split(":::false")[0]}:::true:::${res.formValues[0]}" reportmsg 0`)
                                    logfor(player.name, '§3§l>> §a輸入完畢!')
                                })
                            }
                        } else if (res.selection === 1) {
                            if (score.split(":::")[5] == "true" || score.split(":::")[6] == "true") {
                                return logfor (player.name, '§3§l>> §a已經修復完畢!')
                            }
                            let fm = new ui.ModalFormData();
                            fm.title("§b§l輸入回復訊息")
                            fm.textField("§b§l輸入回復訊息", "text")
                            fm.show(player).then(res => {
                                if (!res || res.isCanceled) {return;}
                                let di = score
                                cmd(`scoreboard players reset "${di}" reportmsg`)
                                cmd(`scoreboard players set "${di.split(":::false")[0]}:::false:::test:::true:::${res.formValues[0]}" reportmsg 0`)
                                logfor(player.name, '§3§l>> §a輸入完畢!')
                            })
                        } else if (res.selection === 2) {
                            cmd(`scoreboard players reset "${score}" reportmsg`)
                            logfor(player.name, '§3§l>> §a刪除成功!')
                        } else if (res.selection === 3) {
                            if (objs[sele] != "bug") {
                                cmd(`scoreboard players set "${players[sele]}/" ban 0`)
                                logfor (player.name, '§3§l>> §a封鎖成功!')
                            } else {
                                admin(player)
                            }
                        } else if (res.selection === 4) {
                            if (objs[sele] != "bug") {
                                admin(player)
                            }
                        }
                    })
                })
}