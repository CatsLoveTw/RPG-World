import { world } from "mojang-minecraft";
import * as ui from "mojang-minecraft-ui";
import {cmd, GetWorldPlayersName, log, logfor} from '../lib/GametestFunctions.js'
import { isNum, randomInt } from '../lib/function.js'
import { tpa } from './tpa.js'

// | 或 §

export const updateMenu = (player) => {
    let Update = {
        "V0.1": ["大廳完成80%%", "新增血量 | 傷害系統"],
        "V0.2": ["修復攻擊系統BUG"],
        "V0.3": ["新增火球技能", "新增魔法攻擊", "新增怪物血量調整功能"],
        "V0.4": ["新增等級系統"],
        "V0.45": ["修改火球技能判定問題", "修復更新資訊無法查看之問題"]
    } // "版本號": [更新內容] ex: "V1.0": ["早安", "你好"] 顯示: V1.0 1.早安 2.你好
    let lateUpdate = ["副本完成", "大廳完成", "新增技能組"] // 預計更新內容
    let text = []
    let lateText = []
    let vis = []
    let c = 0 
    const fullShow = 6
    for (let i in Update) {
        vis.push(i)
    }
    for (let i in Update) {
        let test = []
        let a = []
        c++
        if (vis.length - (c - 1) <= fullShow) { // 只顯示fullShow個更新
        for (let j in Update[i]) {
            test.push(Update[i][j])
            a.push(`§f§l${test.length}.§6${Update[i][j]}`)
        }    
        text.push(`§e§l${i} §f>>\n§e${a.join("\n")}`)
    }
    }
    for (let i in lateUpdate) {
        lateText.push(`§f§l${Number(i) + 1}.§b${lateUpdate[i]}`)
    }
    if (lateText.length === 0) {
        lateText.push("§f§l沒有預計更新")
    }
    let fm = new ui.ActionFormData();
    fm.title('§e§l更新資訊')
    fm.body(text.join("\n\n") + "\n\n\n§e§l預計更新內容:\n" + lateText.join("\n"))
    fm.button('§a§l關閉')
    fm.show(player)
}