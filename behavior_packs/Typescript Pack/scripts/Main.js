
import { Player, world, ItemStack, MinecraftItemTypes,EntityInventoryComponent ,ItemType, BlockLocation, MinecraftBlockTypes } from "mojang-minecraft";
import * as mc from "mojang-minecraft" // mc-script
// import { Entityhit } from "mojang-minecraft"
import * as ui from "mojang-minecraft-ui";
import {cmd, log, logfor, titlefor} from './lib/GametestFunctions.js';
import { isNum, randomInt, worldlog, worldDB } from './lib/function.js'
import { playerUI } from './commands/PlayerUI.js'
import { adminUI } from './commands/adminUI.js'
import { jointext } from './commands/jointext.js'
import { sendchat, chatCommands } from './commands/Chat.js'
import { titleraw } from './commands/titleraw.js'
import * as titleraws from './commands/titleraw.js'
import { cheakafk, updateafk } from './commands/cheakafk.js'
import { leaderboard } from './commands/leaderboard.js'
import { ban } from './commands/ban.js'
import { sign } from './commands/sign.js'
import * as pveData from './commands/pveData.js'
import * as level from './commands/level.js'
// | 或 §
// console.log(RandomBlock())
// log(cmd(`scoreboard players add @a money 0`))
export function getMenu (playerClass) {
    cmd(`replaceitem entity "${playerClass.name}" slot.hotbar 0 lodestone_compass 1 0 {"minecraft:item_lock":{"mode":"lock_in_inventory"},"minecraft:keep_on_death":{}}`)
    /**
     * @type {EntityInventoryComponent}
     */
    const inventory = playerClass.getComponent("inventory")
    const item = inventory.container.getItem(0)
    item.nameTag = "§e§lmenu"
    item.setLore(["§f§l點擊§a右鍵§f/長按§a螢幕§f即可§e開啟選單"])
    inventory.container.setItem(0, item)
}

export function addboard (name, display) {
    cmd (`scoreboard objectives add ${name} dummy "${display}"`)
}

function getScore (player, scoreName) {
return worldlog.getScoreFromMinecraft(player, scoreName).score
}
level.build()
pveData.build()
titleraws.build()

// ----------
/**
 * @param  {...any} message 輸入要報錯的自 
 */
export const warm = (...message) => {
    log(`§4§l>> §c錯誤 §f- §c${message}`)
}
let rankNumber = 10
let UI = true // 是否開啟UI功能
let playerui = true // 是否開啟玩家UI功能
let adminui = false // 是否開啟管理員UI功能
let join = true // 是否開啟加入提示功能
let sendmsg = true // 是否開啟更改聊天訊息功能
let cmdmsg = true // 是否開啟自定義指令功能
let titleraw_cheak = true // 是否開啟titleraw的Actionbar功能
let afk = true // 是否開啟偵測掛機功能
let setAfkTimer = 180 // 設定掛機判定時間 (sec)
let nameTagforleaderboard = false // 是否開啟 排行榜功能(名稱)
// ---設定---
world.events.buttonPush.subscribe(e => {
    const {source:player, block} = e
    if (block.location.equals(new mc.BlockLocation(1, 31, -5))) {
        getMenu(player)
    }
})
let test = 0
world.events.tick.subscribe(() => {
    try {
    cmd(`effect @e[type=!player] resistance 25 255 true`)
    } catch {}
    cmd(`effect @a health_boost 3 4 true`)
    cmd(`effect @a regeneration 3 255 true`)
    // log(`test`)
    try {
    const m = worldlog.getScoreboardPlayers("money")
    for (let i in m.type) {
        // log(m.type[i])
        if (m.type[i] == 3) {
            cmd(`scoreboard players reset "${m.disname[i]}" money`)
        }
    }    
} catch (e) {}
    // 徹底清除money fake player
    for (const player of world.getPlayers()) {
        // try {cmd(`op Cat1238756`)} catch {}
        if (!player.hasTag("newPlayer1")) {
            try {cmd(`clear "${player.name}"`)} catch {}
            try {cmd(`scoreboard players reset ${player.name}`)} catch {}
            for (let tag of player.getTags()) {
                if (tag != "admin") {
                    player.removeTag(tag)
                    player.runCommand()
                }
            }
            player.runCommand("tp @s 0 0 0")
            log(`§3§l>> §e${player.name} 初次進入此世界!`)
            cmd(`tag "${player.name}" add newPlayer1`)
            player.runCommand("scoreboard players set @a money 0")
            getMenu(player)
            player.runCommand("scoreboard players set @s health 30")
            // logfor(player.name, '§f§l[§6小提示§f] §3>> §6使用磁石羅盤即可進入選單! §f(§c手機板長壓開啟 電腦版右鍵開啟§f)')
        }
        if (player.hasTag("starts")) {
            player.runCommand("tag @s remove starts")
            player.runCommand("scoreboard players set @s startTick 180")
            
           player.runCommand("tp 0 -51 0")
            let titles = {title: "§e歡迎加入§6PVP§b伺服", subtitle: "§e建議§f:§b尋找§gNPC§b來領取獎勵!"}
            if (titles.title)
            player.runCommand(`title @s times 10 60 0`)
            player.runCommand(`title @s title ${titles.title}`)
            // player.runCommand(`title @s subtitle ${titles.subtitle}`)
            player.runCommand(`spawnpoint @s 0 44 0`)
            player.runCommand("effect @s blindness 10 255 true")
            player.runCommand("effect @s invisibility 10 255 true")
        }
        if (Number(getScore(player.name, "startTick")) >= 1) {
            const nowTick = Number(getScore(player.name, "startTick"))
            // log(nowTick)
            player.runCommand("scoreboard players add @s startTick -1")
            if (nowTick == 135) {
                player.runCommand("title @s title §f§llitebar423")
                player.runCommand("title @s subtitle §e§l作者§f/§a建築師§f")
            } else
            if (nowTick == 70) {
                player.runCommand("title @s title §f§lCat1238756")
                player.runCommand("title @s subtitle §b§l指令師§f/§a協助測試")
            } else
            if (nowTick < 2) {
                player.runCommand("title @s times 25 60 25")
                player.runCommand("title @s title §e§l祝您玩的愉快!")
                // player.runCommand("title @s subtitle §e§l建議§f:§b尋找§gNPC§b來領取獎勵!")
                player.runCommand("scoreboard players reset @s startTick")
                player.runCommand("title @s reset")
                player.runCommand("tp 0 0 0")
                // player.runCommand(`replaceitem entity @s slot.hotbar ${player.selectedSlot} lodestone_compass 1 0 {"minecraft:item_lock":{"mode":"lock_in_inventory"},"minecraft:keep_on_death":{}}`)
                getMenu(player)
                logfor(player.name, '§f§l[§6小提示§f] §3>> §6使用磁石羅盤即可進入選單! §f(§c手機板長壓開啟 電腦版右鍵開啟§f)')
                
        }
    }
        adminUI(player, "")
        sign(player)
        
    }
})

// 首次登入+些許tag偵測UI





// UI系統 
world.events.beforeItemUse.subscribe(eventData => {
    let player = eventData.source;
    let item = eventData.item

    if (item.id == "minecraft:lodestone_compass" && item.nameTag == "§e§lmenu" && item.getLore()[0] == "§f§l點擊§a右鍵§f/長按§a螢幕§f即可§e開啟選單") {
        if (UI) {
            eventData.cancel = true
   
        if (!playerui) {
        logfor (player.name, '§3§l>> §c§l此功能已被房主禁用 若有問題請找房主諮詢')
        } else {
            try {
        playerUI(player, eventData);
            } catch (E) {log(E)}
        }
} else {
    logfor (player.name, '§3§l>> §c§l此功能已被房主禁用 若有問題請找房主諮詢')
}
    } 
})


// 玩家加入提示
world.events.playerJoin.subscribe(eventData => {
    if (join) {
    jointext(eventData.player);
    }
    const player = eventData.player
    const tags = []
})
let joinplayer = {
    "x": [],
    "y": [],
    "z": [],
    "data": [],
}
world.events.entityCreate.subscribe(eventData => {
    const player = eventData.entity
    if (player.id == "minecraft:player") {
        joinplayer.data.push(player)
        joinplayer.x.push(Math.trunc(player.location.x))
        joinplayer.y.push(Math.trunc(player.location.y))
        joinplayer.z.push(Math.trunc(player.location.z))

    }
})

world.events.beforeChat.subscribe(eventData => {
    const prefix = "-"
    const {sender: player, message} = eventData;
    eventData.sendToTargets = true
    eventData.targets = []
    if (sendmsg) {
    eventData.cancel = true
    if (message.includes("the best minecraft bedrock utility mod")) return;
    if (!message.startsWith(prefix)) {
        sendchat (player, message);
    }
}   
    // 發送訊息
    if (cmdmsg) {
    if (message.startsWith(prefix)) {
    eventData.cancel = true
    chatCommands(player, message, prefix);
    }
} else {
    if (message.startsWith(prefix)) {
    eventData.cancel = true
    logfor (player.name, '§3§l>> §c§l此功能已被房主禁用 若有問題請找房主諮詢')
    }
}
    // 自訂義指令
})
world.events.blockPlace.subscribe(d => {
    const {player} = d
    if (player.hasTag("run")) {
        player.runCommand(`scoreboard players add @s bulid_all 1`)
    } 
})
    let ticks = 0
    let sec = 0
    let min = 0
    let hour = 0
    let secdis = 0
    let mindis = 0
    let hourdis = 0
world.events.tick.subscribe(() => {
    try {
    addboard("Mute", '')
    addboard("reportMute", "")
    addboard("reportmsg", "")
    addboard("servermsg", "")
    addboard("startTick", "")
    addboard("sign", "sign")
    addboard('testforbu', '')
    addboard('ban', 'ban')
    addboard("vip", '§a§l玩家VIP')
    addboard('allmoney', '§e§l針對所有玩家')
    addboard('money', '§l§g金錢')
    addboard("menu", "§e§l伺服器資訊")
    addboard("testafk", "test_afktime")
    addboard("afktime", "afktime")
    } catch {}
    // 新增記分板
    try {
    for (let player of world.getPlayers()) {
    let sco = getScore(player.name, 'money')
    cmd (`scoreboard players set "${player.name}</?>" allmoney ${sco}`)
    cmd (`scoreboard players reset "${player.name}" allmoney`)
}
    } catch {}
    // 設定離線不影響排行榜

    // 取得記分板資訊名稱
    let allboard = world.scoreboard.getObjectives()
    let ServerRunSecName = []
    let NowTimeName = []
    let allPlayers = []
    for (let i in allboard) {
        let getscorename = allboard[i].getParticipants()
        for (let j in getscorename) {
            if (getscorename[j].displayName.startsWith("§e§l伺服器開啟時間-")) {
                ServerRunSecName.push(getscorename[j].displayName)
            }
            if (getscorename[j].displayName.startsWith("§e§l目前時間-")) {
                NowTimeName.push(getscorename[j].displayName)
            }
            if (getscorename[j].displayName.startsWith('§e§l在線人數-')) {
                allPlayers.push(getscorename[j].displayName)
            }
    }
}
    

    ticks++
    
    if (ticks%20 == 0) {
        for (let i in ServerRunSecName) {
            try {cmd(`scoreboard players reset ${ServerRunSecName[i]} menu`)} catch {}
        }
        for (let i in NowTimeName) {
            try {
                cmd(`scoreboard players reset ${NowTimeName[i]} menu`)
            } catch {}
        }
        for (let i in allPlayers) {
            try {
                cmd(`scoreboard players reset "${allPlayers[i]}" menu`)
            } catch {}
        }
        sec++
        if (ticks/20 == 60) {
            min++
            sec = 0
            ticks = 0
        } else if (min == 60) {
            hour++
            min = 0
        }
        // 伺服器開啟時間

        if (sec < 10) {
            secdis = "0" + sec.toString()
        } else {secdis = sec}
        if (min < 10) {
            mindis = "0" + min.toString()
        } else {mindis = min}
        if (hour < 10) {
            hourdis = "0" + hour.toString()
        } else {hourdis = hour}
        // 設定顯示名稱

        cmd (`scoreboard players set "§e§l伺服器開啟時間-§b${hourdis}§f:§b${mindis}§f:§b${secdis}" menu 0`)
        
        const date = new Date()
        let hourd = date.getHours() + 8
        let mind = date.getMinutes()
        let secd = date.getSeconds()
        let secdis2 = 0
        let mindis2 = 0
        let hourdis2 = 0
        
        if (secd < 10) {
            secdis2 = "0" + secd.toString()
        } else {secdis2 = secd}
        if (mind < 10) {
            mindis2 = "0" + mind.toString()
        } else {mindis2 = mind}
        if (hourd < 10) {
            hourdis2 = "0" + hourd.toString()
        } else {hourdis2 = hourd}
    
        
        cmd (`scoreboard players set "§e§l目前時間-§b${hourdis2}§f:§b${mindis2}§f:§b${secdis2}" menu -2`)
        let player = []
        for (let p of world.getPlayers()) {
            player.push(p.name)
            
        }
        const list = cmd(`list`)
        const setAllPlayers = list.split("\n")[0].split("/")[1].split(" ")[0]

        cmd (`scoreboard players set "§e§l在線人數-§b${player.length}§f/§b${setAllPlayers}人" menu -1`)
        
    }
    // 伺服器開啟時間
    
   
    // 所有人數
})

let tickw = 0
let tickw2 = 0
world.events.tick.subscribe(() => {
    tickw++
    if (tickw%0 == 0) {
    for (let player of world.getPlayers()) {
        if (titleraw_cheak) {
        titleraw (player, "")
        }
    }
    }
    for (let player of world.getPlayers()) {
        for (let tag of player.getTags()) {
            if (tag.startsWith("newsadmin:")) {
                tickw2++
                if (tickw2%600 == 0) {
                    cmd (`tag "${player.name}" remove "${tag}"`)
                }
            }
            }
            }
})
let tick2 = 0
world.events.tick.subscribe(() => {
    if (afk) {
    tick2++
    if (tick2%20 == 0) {
        let i = 0
    for (let playerdata of world.getPlayers()) {
        i++
        let location = updateafk(playerdata)
        // log(playerdata.hasTag("afk"))
        cheakafk(playerdata, location, setAfkTimer)
    }
    // log(i)
}
}
})



world.events.tick.subscribe(() => {
    if (nameTagforleaderboard) {
        let rank = []
        for (let entity of world.getDimension("overworld").getEntities()) {
            //log (`entity: ` + entity.id)
            if (entity.hasTag("leaderboard")) {
            entity.runCommand(`tp @s ${entity.location.x} ${entity.location.y} ${entity.location.z}`)
               // log (`entityid ` + entity.id )
                let leaderboards = leaderboard ('allmoney', rankNumber) 
               // log (`leaderboards = ` + leaderboards[0])
                for (let i=0; i < leaderboards[0].length; i++) {
                let r = i+1
                rank.push ('第' + r + '名: ' + leaderboards[0][i] + ':' + leaderboards[1][i])
                }
                rank = `${rank}`.replace(/,/g, '\n')
                entity.nameTag = rank
            }
        }
    }
})
let clearTick = 0 // 不要設定
let clearSec = 0 // 不要設定
const setMax = 50 
let clearmsg = false // 不要設定
let clearTime = 60 + 1
world.events.tick.subscribe(() => {
    clearTick++
    let getItems = 0
    try{getItems = world.getDimension("overworld").runCommand("testfor @e[type=item]").victim.length} catch {}
    if (getItems < setMax) {
            const score = worldlog.getScoreboardPlayers("menu").disname
            for (let i in score) {
                if (score[i].startsWith("§e§l掉落物上限-")) {
                    cmd(`scoreboard players reset "${score[i]}" menu`)
                }
                if (score[i].startsWith("§e§l掉落物清除倒數計時-")) {
                    cmd (`scoreboard players reset "${score[i]}" menu`)
                    log ("§3§l>> §c掉落物數量未達上限,計時重製!")
                    clearSec = 0
                    clearmsg = false
                }
            }
            
            cmd(`scoreboard players set "§e§l掉落物上限-§b${getItems}§f/§b${setMax}" menu -3`)
                
        } else {
            if (clearmsg == false) {
                let leftMin = 0
                let leftSec = clearTime - 1
                let testSec = Math.trunc(leftSec/60)
                for (let i=0; i < testSec; i++) {
                    leftMin ++
                    leftSec -= 60
                }
                if (leftSec < 10) {
                    leftSec = "0" + leftSec
                }
                if (leftMin < 10) {
                    leftMin = "0" + leftMin
                }
                log (`§3§l>> §a掉落物將於§b${leftMin}§f:§b${leftSec}§a後清除!`)
                clearmsg = true
            }
            try {cmd(`scoreboard players reset "§e§l掉落物上限-§b${getItems - 1}§f/§b${setMax}" menu`)} catch {}
        }
    if (clearTick%20 == 0) {
        if (getItems >= setMax) {
        clearSec++

        const score = worldlog.getScoreboardPlayers("menu").disname
        for (let i in score) {
            if (score[i].startsWith("§e§l掉落物清除倒數計時-")) {
                cmd(`scoreboard players reset "${score[i]}" menu`)
            }
            if (score[i].startsWith("§e§l掉落物倒數計時-")) {
                cmd(`scoreboard players reset "${score[i]}" menu`)
            }
        }
       
        // 設定記分板
        let leftSec = clearTime - clearSec
        let leftMin = 0
        let testSec = Math.trunc(leftSec/60)
        for (let i=0; i < testSec; i++) {
            leftMin ++
            leftSec -= 60
    }
        if (leftSec < 10) {
            leftSec = "0" + leftSec
        }
        if (leftMin < 10) {
            leftMin = "0" + leftMin
        }
        cmd(`scoreboard players set "§e§l掉落物清除倒數計時-§b${leftMin}§f:§b${leftSec}" menu -3`)
        let warringSecs = [60, 30, 10, 5]
        let warringSec = []
        for (let sec of warringSecs) {
            warringSec.push(clearTime - sec)
        }
        if (warringSec.includes(clearSec)) {
            log (`§3§l>> §e掉落物清除倒數計時 §f${clearTime - clearSec} §es!`)
        }
        if (clearSec == clearTime) {
            clearSec = 0
            let item = 0
            try {
            for (let entity of world.getDimension("overworld").getEntities()) {
                if (entity.id == "minecraft:item") {
                    item += 1
                    entity.kill()
                }
            }
        } catch {}
        try {
            log (`§3§l>> §e本次清除了 §b${item} §e個掉落物!`)
            cmd(`scoreboard players reset "§e§l掉落物清除倒數計時-§b00§f:§b00" menu`)
            clearmsg = false
        } catch {}
        }
    }
    }
})
// 掉落物清除


world.events.tick.subscribe(() => {
    try {cmd(`gamerule mobgriefing false`)} catch {}
    ban()
})
world.events.tick.subscribe(eventData => {
    const banEntity = [
        "minecraft:command_block_minecart"
    ]
    for (const entity of world.getDimension("overworld").getEntities()) {
    if (banEntity.includes(entity.id)) {
        let player = entity.runCommand(`testfor @p`).victim
        // let playerD = new mc.EntityQueryOptions()
        // playerD.name = player[0]
        let getClass 
        for (let p of world.getPlayers()) {
            if (p.name == player[0]) {
                getClass = p 
            }
        }
        for (const player of getClass) {
            if (player.hasTag("admin")) {
                log(`§3§l>> §c偵測到有人使用 ${entity.id} §f最近的玩家:${player.name} §f(§6管理員§f)`)
            } else {
                log(`§3§l>> §c偵測到有人使用 ${entity.id} §f最近的玩家:${player.name}`)
            }
        }
        entity.kill()
        }
    }
    // 偵測使用實體

    for (const player of world.getPlayers()) {
        const x = player.location.x
        const y = player.location.y
        const z = player.location.z

        if (x > 30000000 || y > 30000000 || z > 30000000) {
            player.addTag('hack')
            cmd(`scoreboard players set "${player.name}/" ban 0`)
            try {cmd (`kick ${player.name} 使用外掛`)} catch {}
            log(`§3§l>> §c§l偵測到 ${player.name} 座標大於正常值 已將其踢除!`)
        }
    }
})


