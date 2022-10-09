import { world, EntityInventoryComponent, MinecraftBlockTypes, BlockLocation } from "mojang-minecraft";
import * as ui from "mojang-minecraft-ui";
import {cmd, GetWorldPlayersName, log, logfor} from '../lib/GametestFunctions.js'
import { getScore, isNum, randomInt, worldlog } from '../lib/function.js'
import { leaderboard } from './leaderboard.js'
import { warm } from "../Main.js";
import { index } from "../chatCommands/index.js"

// | 或 §

function sendchat (player, message) {
    // let chattag = []
    // let date = new Date()
    // let hour = date.getHours()
    // let min = date.getMinutes()
    // let sec = date.getSeconds()
    // if (sec < 10) {
    //     sec = '0' + sec
    // } else {
    //     sec = sec
    // }
    // if (min < 10) {
    //     min = '0' + min
    // } else {
    //     min = min
    // }
    // hour = Number(hour) + 8
    // if (hour < 10) {
    //     hour = '0' + hour
    // } 
    // let time = `§7§e${hour}§f:§e${min}§f:§e${sec}§7`
    // // let vip = Number(getScore(player.name, 'vip'))
    // for (let tag of player.getTags()) {
    //     if (tag.includes("succ:chatTag:")) {
    //         chattag.push(tag.replace("succ:chatTag:", ""))
    //     }
    // }
    // let playerdis = player.dimension.id

    // let dis
    // if (playerdis == "minecraft:overworld") {
    //     dis = `§a§l主世界§b-§e${time}`
    // } else if (playerdis == "minecraft:nether") {
    //     dis = `§c§l地獄§b-§e${time}`
    // } else if (playerdis == "minecraft:the_end") {
    //     dis = `§e§l終界§b-§e${time}`
    // }

    // if (chattag.length == 0) {
        if (!worldlog.getScoreFromMinecraft(`${player.name}/`, "Mute")) {
            if (player.hasTag("admin")) {
                log(`§f[§c管理員§f] §6${player.name} §7: §a${message}`)
            } else {
                log(`§8${player.name} §7: §7${message}`)
            }
        } else {
            logfor (player.name, "§c§l因特殊原因 管理員關閉了您的發言權力\n若有任何問題，請詢問管理員。")
        }
    // } else {
    //     if (player.hasTag("admin")) {
    //         log (`§7§l|${dis}§7| §f§l[${chattag.join('§f] §f[')}§f] §6§l${player.name} §3>> §f${message}`)
    //     } else {
    //         log (`§7§l|${dis}§7| §f§l[${chattag.join('§f] §f[')}§f] §7§l${player.name} §3>> §f${message}`)
    //     }
    // }
}
    

function chatCommands (player, message, prefix) {
    if (message.startsWith(prefix)) {
    let command = message
    .trim() // 去除兩邊空格
    .slice(prefix.length) // 刪除前綴
    .split(/ +/)[0] // 取得指令
    .toLowerCase(); // 小寫
    for (let a of index) {
        if (a.Des.command.toLowerCase() == command) {
            if (a.Des.adminOnly) {
                if (player.hasTag("admin")) {
                    a.runCommand(message, player)
                } else {
                    logfor (player.name, "§3§l>> §c您沒有權限使用此指令!")
                }
            } else {
                a.runCommand(message, player)
            }
        }
    }
    
    switch (command) {
        case 'help':
            if (!message.split(/ +/)[1]) {
            const helpmsg = ["-help : 查看指令"]
            for (let a of index) {
                let warring = ""
                let only = ""
                if (a.Des.warn) {
                    warring = a.Des.warn
                }
                if (a.Des.adminOnly) {
                    only = " §l§f(§c僅限管理員§f)"
                }
                helpmsg.push(`-${a.Des.command} : ${a.Des.des}${only}`)
            }
            let res3 = []
            for (let i in helpmsg) {
                let res1 = `${helpmsg[i]}`.split(':')
                let res2 = `§a§l${res1[0]}§f:§e${res1[1]}`
                res3.push(res2)
            }
            res3 = `${res3}`.replace(/,/g, '\n')
            logfor (player.name, res3)
        } else {
            const helpcmdmsg = {
                "help": {msg: "§e§l查看指令內容", text: "§f§l-help | -help <指令: 字串>", ex: "-help | -help getDimension"},
            }
            for (let a of index) {
                let text = `${a.Des.command}`
                helpcmdmsg[text] = {msg: a.Des.des, text: a.Des.format.replace("|", "§7|§f"), ex: a.Des.example.replace("|", "§7|§f"), warn: a.Des.warn, adminOnly: a.Des.adminOnly}
            }
            
            let textcmd = message.trim().toLowerCase().split(/ +/)[1]
            for (const help in helpcmdmsg) {
                if (textcmd == help.toLowerCase()) {
                    let warring = ""
                    let adminOnly = ""
                    if (helpcmdmsg[help].warn) {
                        warring = `\n§c§l警告 §f: ${helpcmdmsg[help].warn}`
                    }
                    if (helpcmdmsg[help].adminOnly) {
                        adminOnly = " §l§f(§c僅限管理員§f)"
                    }
                    return logfor (player.name, `§f§l指令 : §a§l-§e${help}\n§b介紹§f : §g${helpcmdmsg[help].msg}${adminOnly}\n§a語法 §f: §l${helpcmdmsg[help].text}\n§e範例 §f: ${helpcmdmsg[help].ex} ${warring}`)
                }
            }
            logfor(player.name, '§3§l>> §c§l該指令不存在!')
        } 
            break;
    } 
    }
}

export { sendchat, chatCommands } 