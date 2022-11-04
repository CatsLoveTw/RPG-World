import { Player, world, BlockLocation } from "@minecraft/server";
import * as ui from "@minecraft/server-ui";
import { cmd, log, logfor } from '../lib/GametestFunctions.js'
import { getScore, isNum, randomInt, worldlog } from '../lib/function.js'
import { warm } from "../Main.js";

export const Des = {
    command: "getBlocks", // 指令名稱 (string)
    des: "查看範圍內的方塊", // 說明功能 (string)
    format: "-getBlocks <(從)x,y,z,(到)x,y,z>", // 指令語法 (格式) (string)
    example: "-getBlocks 0,0,0,1,1,1", // 舉例 (string)
    adminOnly: true, // 管理員限定 (boolean)
    warn: "§c§l容易造成Minecraft崩潰 正在盡力修復中..." // 警告 (string | false)
}
/**
 * @param {string} message
 * @param {Player} player
 */
export const runCommand = (message, player) => {
    let p = message.split(/ +/)[1].split(",")
            let pos = {x: p[0], y: p[1], z: p[2], x2: p[3], y2: p[4], z2: p[5]}
            let cpos = {
                Maxx: Math.max(pos.x, pos.x2),
                Minx: Math.min(pos.x, pos.x2),

                Maxy: Math.max(pos.y, pos.y2),
                Miny: Math.min(pos.y, pos.y2),

                Maxz: Math.max(pos.z, pos.z2),
                Minz: Math.min(pos.z, pos.z2)
            }
            let i = 0
            let text = []
            for (let x=cpos.Minx; x < cpos.Maxx; x++) {
                for (let y=cpos.Miny; y < cpos.Maxy; y++) {
                    for (let z=cpos.Minz; z < cpos.Maxz; z++) {
                        try {
                            let loc = new BlockLocation(x, y, z)
                            let block = world.getDimension("overworld").getBlock(loc)
                            if (block.typeId != 'minecraft:air') {
                                text.push(`§b§l找到方塊 §e${block.typeId.replace("minecraft:", "")} §7(§6${x} ${y} ${z}§7)\n`)
                                i++
                            }
                        } catch (e) {warm(e)}
                    }
                }
            }
            let fm = new ui.ActionFormData();
            fm.title("§b§l結果")
            fm.body(`§a§l最終結果 §7(§a共找到 §b${i} §a個方塊§7)\n${text.join("")}`)
            fm.button("close")
            fm.show(player)
}