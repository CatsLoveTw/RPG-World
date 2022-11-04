import { world } from "@minecraft/server";
import * as ui from "@minecraft/server-ui";
import {cmd, log, logfor} from '../lib/GametestFunctions.js'
import { getScore, isNum, randomInt } from '../lib/function.js'
import { worldlog } from '../lib/function.js'

import { changeMaxLevel } from './level.js'

// | 或 §

export function ChatTags (player) {
    let chatTags = []
    let succTags = []
    let succlist = []
    let notTags = false
    for (let tag of player.getTags()) {
        if (tag.startsWith('chatTag:')) {
            chatTags.push(tag)
        }
        if (tag.startsWith('succ:chatTag:')) {
            succTags.push(tag)
        }
    }
    if (chatTags.length == 0) {
        // succlist.push('§c§l無稱號可使用!')
        notTags = true
    } else {
    if (succTags.length == 1) {
        // log (`test succ ${succTags} sp:${succTags[0].split(":")[2]}`)
        succlist.push(`§a§l正在使用\n§6稱號:${succTags[0].replace('succ:chatTag:', '')}`)
    }
    // log (`test2`)
    for (let i of chatTags) {
            // log (`${chatTag[i].split(':')[1]} succ ${succTags[0].split(':')[2]}`)
    succlist.push(`§b§l可使用\n§e稱號:${i.replace('chatTag:', '')}`)
    
    // succlist.push(`§b§l可使用\n§e稱號:${chatTags[i].split(':')[1]}`)
}
}   
// log (`succlist ${succlist} succTags ${succTags} chatTags ${chatTags} notTags ${notTags}`)
    if (notTags) {
        logfor(player.name, '§3§l>> §c您沒有稱號!')
    } else {
    let fm = new ui.ModalFormData();
    fm.title('§b§l選擇稱號')
    fm.dropdown('§e§l選擇稱號', succlist)
    // fm.toggle('§c§l移除使用中的稱號', false)
    
    fm.show(player).then((res) => {
        let number = res.formValues[0]
        let cheakTag = false
        if (cheakTag == false) {
        if (number == 0 && succlist[number].startsWith("§a§l正在使用")) {
            logfor(player.name, '§3§l>> §c請勿選擇正在使用的稱號!')
        } else {
        try {
            cmd(`tag "${player.name}" remove "${succTags}"`)
            // cmd(`tag "${player.name}" add "chatTag:${succTags[0].split(":")[2]}"`)
            } catch {}
            cmd(`tag "${player.name}" add "succ:chatTag:${succlist[number].replace('§b§l可使用\n§e稱號:', '').replace('chatTag:', '')}"`)
            logfor(player.name, `§3§l>> §a稱號使用成功! §f(§e設定為 §b${succlist[number].replace('§b§l可使用\n§e稱號:', '').replace('chatTag:', '')}§f)`)
        }
        } else {
            try {
                cmd(`tag "${player.name}" remove "${succTags}"`)
                // cmd(`tag "${player.name}" add "chatTag:${succTags[0].split(":")[2]}"`)
                logfor(player.name, '§3§l>> §a移除成功!')
            } catch (error) {logfor(player.name, '§3§l>> §c無法移除 請確認您是否擁有正在使用的稱號!')}
        }
    })
}
}