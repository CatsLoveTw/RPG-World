import { world } from "mojang-minecraft";
import * as ui from "mojang-minecraft-ui";
import {cmd, GetWorldPlayersName, log, logfor} from '../lib/GametestFunctions.js'
import { isNum, randomInt } from '../lib/function.js'
import { tpa } from './tpa.js'

// | 或 §

// var updates = [
//     'Beta 0.1 : 開始製作',
//     'Beta 0.2 : 新增UI系統',
//     'Beta 0.5 : 新增加入通知',
//     'Beta 0.6 : 新增自訂義指令',
//     'Beta 0.8 : 新增聊天訊息修改',
//     'Beta 1.0 : 更改訊息內容',
//     'Beta 1.3 : 新增廣播',
//     'Beta 1.5 : 將管理員廣播內容顯示於actionbar',
//     'Beta 2.0 : 新增掛機偵測',
//     'Beta 2.5 : 新增排行榜',
//     'Beta 2.6 : 修復部分bug (顯示問題等)',
//     'Beta 3.0 : 修復Bug 更改內容 新增可開關式功能',
//     'Beta 3.2 : 新增轉帳功能',
//     'Beta 3.5 : 新增等級功能',
//     'Beta 3.75 : 修復部分bug',
//     'Beta 4.0 : 新增銀行系統',
//     'Beta 4.15 : 修復銀行系統偵測物品Bug',
//     'Beta 4.2 : 移除測試時的顯示訊息',
//     'Beta 4.5 : 新增設定自己的稱號系統',
//     'Beta 5.0 : 修改顯示等級&商店功能',
//     'Beta 5.3 : 新增鐵匠商店 (iron_ui) & 礦物商店 (mine_ui)',
//     'Beta 5.3 repair : 修復某些稱號顯示問題',
//     'Beta 5.5 : 簡易外掛系統',
//     'Beta 6.0 : 新增抽獎系統',
//     'Beta 6.0 repair : 更改抽獎機率&修復玩家選單無法抽獎的問題',
//     'Beta 6.5 : 新增夜錠商店系統',
//     'Beta 7.0 : 新增商品(夜錠商店)',
//     'Beta 7.0 Repair : 抽獎機刷錢問題修復&挖掘加速粒子效果隱藏&修改外掛處決方式',
//     'Beta 7.1 : 新增現在時間功能',
//     'Beta 7.2 : 移除管理員在排行榜的排名',
//     'Beta 8.0 : 將相容性轉為生存伺服器&新增領地系統(未完成)',
//     'Beta 8.05 : 領地系統玩家',
//     'Beta 8.5 : 新增領地系統'
// ]
// export function update () {
//     var colorupdate = []
//     var getversion = updates[updates.length-1].split(':')[0]
//     for (let i in updates) {
//         colorupdate.push(`§g§l${updates[i].split(":")[0]}\n§b§l${updates[i].split(':')[1]}`)
//     }
    
//     return {"version": getversion, "update": colorupdate}
// }

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