import { world } from "@minecraft/server";
import * as mc from "@minecraft/server"
import * as ui from "@minecraft/server-ui";
import {cmd, log, logfor, logforTarget} from '../lib/GametestFunctions.js'
import { getScore, isNum, randomInt, worldDB, worldlog } from '../lib/function.js'
import { warm } from "../Main.js";
import { titleraw } from "./titleraw.js";
/**
 * @param {mc.Player} playerClass
 */
export const getSkill = (playerClass) => {
    /**
     * @type {mc.EntityInventoryComponent}
     */
    const INV = playerClass.getComponent("inventory");
    let item = INV.container.getItem(playerClass.selectedSlot)
    if (!item) {
        return false;
    }
    let text = item.getLore()[1].split(" ")[2]
    let textSub = text.split("§")
    let text2 = textSub[textSub.length - 1].slice(1)
    switch (text2) {
        case "小火球":
            return "fireball"
        default:
            return false
    }
}
export const getDamage = (playerClass, damage) => {
    if (!damage) {
        damage = 1
    }
    try {
        let item = playerClass.getComponent("inventory").container.getItem(playerClass.selectedSlot)
        if (item.typeId == "minecraft:bow" || item.typeId == "minecraft:crossbow") {
            damage = Math.trunc(damage)
        }
            if (item.getLore()[0].includes("- §e")) {
                damage = Number(item.getLore()[0].split("- §e")[1])
            }
        } catch {damage = 1}
        return damage
}

export const getMagicDamage = (playerClass, slot) => {
    let item
    if (!slot) {
        item = playerClass.getComponent("inventory").container.getItem(playerClass.selectedSlot)
    } else {
        item = playerClass.getComponent("inventory").container.getItem(slot)
    }
    if (!item.getLore()[1] || !item.getLore()[1].split(" ")[5]) {
        return 0
    }
    /**
     * @type {string}
     */
    let skill = item.getLore()[1]
    let damage = skill.split(" ")[5]
    return damage.replace("§c", "")
}

export const build = () => {
    function skill () {
        function skillCDs () {
            let CDs = {
                "fireballCD": ["小火球CD", {name: "§6小火球", skillID: "fireball"}]
            }
            for (let i in CDs) {
                try {
                    cmd(`scoreboard objectives add "${i}" dummy "${CDs[i][0]}"`)
                } catch {}
            }
            world.events.tick.subscribe(() => {
                for (let i in CDs) {
                    for (let player of world.getPlayers()) {
                        try {
                        player.runCommand(`scoreboard players remove @s[scores={${i}=2..}] ${i} 1`)
                        let score = Number(worldlog.getEntityScore(player, i))
                        if (score%2 == 0 && getSkill(player) === CDs[i][1].skillID) {
                            player.addTag(`news:${CDs[i][1].name} 技能冷卻剩餘 §b${(score - 1) / 20} §6秒`)
                        }
                        if (score == 1) {
                            // logfor(player.name, `§6§l>> §a您的技能 §b${CDs[i].replace(/CD/g, "")} §a已冷卻完畢`)
                            player.addTag(`news:§a您的技能 ${CDs[i][1].name} §a已冷卻完畢!`)
                            player.runCommand(`scoreboard players reset @s ${i}`)
                        }
                    } catch (e) {}
                    }
                }
                
            })
        }  
        function fireball() {
            world.events.beforeItemUse.subscribe(d => {
                // try {
                const { cancel, source: player, item } = d
                if (item.getLore()[1].includes("§b§l技能§f - §6小火球")) {
                    let times = Number(worldlog.getEntityScore(player, "fireballCD"))
                    if (times > 0) {
                        return logfor(player.name, `§4§l>> §6小火球 §c正在冷卻中 §f(§7剩餘 §6${(times / 20)} §7秒§f)`)
                    }
                    d.cancel = true
                    player.runCommand("scoreboard players set @s fireballCD 61")
                    let { x, y, z } = player.location
                    let entity = world.getDimension("overworld").spawnEntity("minecraft:boat", new mc.Location(x, y, z))
                    entity.nameTag = `a ${x} ${y + 100} ${z} ${player.name} ${getMagicDamage(player)}`
                    entity.runCommand(`tp "${player.name}"`)
                    entity.runCommand("tp ~~100~")
                    entity.setRotation(player.rotation.x, player.rotation.y)
                }
                // } catch (e) {warm(e)}
            })
            /**
             * @type {{entity: mc.Entity[], tick: number[], repeat: number[], player: mc.Player[]}}
             */
            let ds = { entity: [], tick: [], repeat: [], player: [] }
            world.events.tick.subscribe(() => {
                for (let i in ds.entity) {
                    ds.tick[i]++
                    if (ds.tick[i] - 1 == 1) {
                        try {
                            ds.entity[i].runCommand("tp ~~0.45~ true")
                        } catch { }
                        if (ds.repeat[i] < 2) {
                            ds.tick[i] = 0
                            ds.repeat[i]++
                            try {
                                let before = ds.entity[i].rotation
                                ds.entity[i].setRotation(ds.player[i].rotation.x, ds.player[i].rotation.y)
                                try {
                                    ds.entity[i].runCommand("tp ^^^1.12 true") //-0.55
                                } catch { }
                                ds.entity[i].setRotation(before.x, before.y)
                            } catch { }
                        } else {
                            ds.entity.splice(i, 1)
                            ds.tick.splice(i, 1)
                            ds.repeat.splice(i, 1)
                            ds.player.splice(i, 1)
                        }
                    }
                }
                for (let entity of world.getDimension("overworld").getEntities()) {
                    if (entity.id == "minecraft:boat") {
                        if (entity.nameTag.startsWith("a")) {
                            let loc = entity.nameTag.split(" ")
                            let BeforeLocation = { x: Number(loc[1]), y: Number(loc[2]), z: Number(loc[3]) }
                            let afterLocation = { x: entity.location.x, y: entity.location.y, z: entity.location.z }
                            let sLocation =
                            {
                                x: Math.max(BeforeLocation.x, afterLocation.x) - Math.min(BeforeLocation.x, afterLocation.x),
                                y: Math.max(BeforeLocation.y, afterLocation.y) - Math.min(BeforeLocation.y, afterLocation.y),
                                z: Math.max(BeforeLocation.z, afterLocation.z) - Math.min(BeforeLocation.z, afterLocation.z)
                            }
                            let bl = world.getDimension("overworld").getBlock(new mc.BlockLocation(Math.trunc(afterLocation.x), Math.trunc(afterLocation.y - 99.5), Math.trunc(afterLocation.z)))
                            // let enQ = new mc.EntityQueryOptions()
                            let locs = new mc.Location(afterLocation.x, afterLocation.y - 99, afterLocation.z)
                            // let en
                            // try {
                            //     let a = world.getDimension("overworld").getEntitiesAtBlockLocation(locs)
                            //     for (let b of a) {
                            //         if (b.id == "minecraft:player") {
                            //             en = false
                            //         } else {
                            //             en = a
                            //         }
                            //     }
                            // } catch {en = false}
                            let en = []
                            for (let entity of world.getDimension("overworld").getEntities()) {
                                if (entity.id != "minecraft:player" && entity.id != "minecraft:item") {
                                    if (entity.location.isNear(locs, 2)) {
                                        en.push(entity)
                                    }
                                }
                            }

                            if (sLocation.x > 20 || sLocation.z > 20 || sLocation.y > 20 || bl.typeId != "minecraft:air" || en.length >= 1) {
                                if (en.length >= 1) {
                                    for (let e of en) {
                                        try {
                                            let player = loc[4]
                                            // let c = mc.EntityQueryOption
                                            // c.name = player
                                            let playerClass
                                            for (let p of world.getPlayers()) {
                                                if (p.name == player) {
                                                    playerClass = p
                                                }
                                            }
                                            let damage = loc[5]
                                            let beEntityHealth = worldlog.getEntityScore(e, "health")
                                            ds.entity.push(e)
                                            ds.player.push(playerClass)
                                            ds.tick.push(0)
                                            ds.repeat.push(0)
                                            e.runCommand(`scoreboard players remove @s health ${damage}`)
                                            allH.health.push(e.getComponent("health"))
                                            allH.tick.push(0)
                                            allH.p.push(e)
                                            allH.de.push(playerClass)
                                            cmd(`title "${player}" times 10 20 0`)
                                            cmd(`title "${player}" title §e§l`)
                                            cmd(`title "${player}" subtitle §c§l造成 §6${damage} §c傷害`)
                                            cmd(`title "${player}" reset`)
                                            e.runCommand("damage @s 0")
                                            if (e.nameTag.indexOf('\n') != -1) {
                                                e.nameTag = `${e.nameTag.split("\n§c§l血量")[0]}\n§c§l血量 §f- §6${Number(beEntityHealth) - (damage)} §c❤`
                                            } else {
                                                e.nameTag = `§c§l血量 §f- §6${Number(beEntityHealth) - (damage)} §c❤`
                                            }
                                        } catch (e) { warm(e) }
                                    }
                                }
                                entity.runCommand("particle minecraft:large_explosion ~~-99~")
                                entity.kill()

                            } else {
                                // log(entity.id)
                                entity.runCommand("particle minecraft:basic_flame_particle ~~-99~")
                                entity.runCommand("tp ^^^1")
                            }
                        }
                    }
                }
            })
        }
        skillCDs()
        fireball()
    }
    




    skill()
    let datas = {
        name: [],
        d: []
    }
    world.events.buttonPush.subscribe(d => {
        const {source:player, block} = d
        if (block.location.equals(new mc.BlockLocation(0, 1, -14))) {
            if (Number(worldlog.getEntityScore(player, "health")) == 0) {
                player.runCommand(`scoreboard players set @s health 30`)
                logfor (player.name, "§g§l>> §a修復成功!")
            } else {
                logfor(player.name, `§3§l>> §c偵測到你的血量大於0 §f(§6${worldlog.getEntityScore(player, "health")}§f) §c因此無法修復!`)
            }
        }
    })
    const scoreboard = {
        "health": "血量",
        "allHealth": "總血量",
    } // "name: displayName"
    for (let i in scoreboard) {
        try {
            cmd(`scoreboard objectives add "${i}" dummy "${scoreboard[i]}"`)
        } catch {}
    }
    world.events.entityCreate.subscribe(d => {
        const {entity} = d
        /**
         * @type {mc.EntityHealthComponent}
         */
        const health = entity.getComponent('health')
        entity.runCommand(`scoreboard players set @s health ${health.current}`)
        entity.runCommand(`scoreboard players set @s allHealth ${health.current}`)
        if (entity.id != "minecraft:player") {
            entity.nameTag = `§c§l血量 §f- §6${health.current} §c❤`
        }
    })
    // world.events.playerJoin.subscribe(d => {
    //     datas.name.push(d.player.name);
    //     datas.d.push([])
    // }) 
    world.events.tick.subscribe(() => {
        for (let entity of world.getPlayers()) {
            if (datas.name.indexOf(entity.name) == -1) {
                datas.name.push(entity.name);
                datas.d.push([])
            }
            cmd(`scoreboard players set "${entity.name}" test 0`)
            let run = true
            let i = 0
            while (run) {
                i++
                if (i > 10) {
                    run = false
                }
                let block = world.getDimension("overworld").getBlock(new mc.BlockLocation(Math.trunc(entity.location.x), Math.trunc(entity.location.y - i), Math.trunc(entity.location.z)))
                // log(block.typeId)
                if (block.typeId != "minecraft:air") {
                    run = false
                }
            }
            datas.d[datas.name.indexOf(entity.name)].push(i)
            if (datas.d[datas.name.indexOf(entity.name)].length > 10) {
                datas.d[datas.name.indexOf(entity.name)].shift()
            }
        }
        for (let entity of world.getDimension("overworld").getEntities()) {
            let hea = worldlog.getEntityScore(entity, "health")
            if (Number(hea) <= 0 && entity.id != "minecraft:player" && entity.id != "minecraft:boat" && entity.id != "minecraft:item" && entity.id != "minecraft:arrow" && entity.id != "minecraft:splash_potion") {
                entity.kill()
            }
        }
    })
    world.events.entityHurt.subscribe(d => {
        let {hurtEntity: beEntity, damagingEntity: entity, damage} = d
        let run = true
        try {
            let items = entity.getComponent("inventory").container.getItem(entity.selectedSlot)
            if (items.getLore()[2] == "§a§l可使用修改生物功能") {
                if (beEntity.id == 'minecraft:player') {
                    return logfor (entity.name, "§3§l>> §c無法修改玩家!")
                }
                logforTarget ("@a[tag=admin]", `§3§l>> §e${entity.name} §g正在修改 §e${beEntity.id}!`)
                /**
                * @type {mc.ItemStack}
                */
                
                run = false
                let fm = new ui.ModalFormData()
                fm.title("§e§l設定怪物")
                fm.textField(`§b§l生物ID §f- §6${beEntity.id}\n§6§l生物血量 §f- §6${worldlog.getEntityScore(beEntity, "health")}\n§b設定名稱 §f(§c若為空則定義為沒有名稱§f)`, "string | number | boolean")
                fm.textField("§6§l設定血量 §f(§c若沒有則為1§f)", "number")
                
                fm.show(entity).then(res => {
                    if (!res || res.isCanceled) {return;}
                    let name = false
                    let health = 1
                    if (res.formValues[0] != "") {
                        name = res.formValues[0]
                    }
                    if (res.formValues[1] != "") {
                        health = res.formValues[1]
                    }
                    if (name) {
                        beEntity.nameTag = `${name}\n§c§l血量 §f- §6${health} §c❤`
                    } else {
                        beEntity.nameTag = `§c§l血量 §f- §6${health} §c❤`
                    }
                    beEntity.runCommand(`scoreboard players set @s health ${health}`)
                    beEntity.runCommand(`scoreboard players set @s allHealth ${health}`)
                    logfor(entity.name, "§g§l>> §a設定成功!")
                })
            }
        } catch {}
        if (run) {
        if (entity.id != "minecraft:player") {
            beEntity.runCommand(`scoreboard players remove @s health ${Math.round(damage)}`)
            beEntity.runCommand("title @s times 10 20 0")
            beEntity.runCommand("title @s title §e§l" )
            beEntity.runCommand(`title @s subtitle §b§l受到 §6${Math.round(damage)} §b傷害`)
            beEntity.runCommand("title @s reset")
            allH.health.push(beEntity.getComponent("health"))
            allH.tick.push(0)
            allH.p.push(beEntity)
            allH.de.push(entity)
            return;
        }
        try {
        // let PlayerLocation = new mc.BlockLocation(Math.trunc(entity.location.x), Math.trunc(entity.location.y), Math.trunc(entity.location.z))
        let add = 1
        damage = 1
        if (entity.id == "minecraft:player") {
            try {
            let item = entity.getComponent("inventory").container.getItem(entity.selectedSlot)
            if (item.typeId == "minecraft:bow" || item.typeId == "minecraft:crossbow") {
                damage = Math.trunc(damage)
            }
                if (item.getLore()[0].includes("- §e")) {
                    damage = Number(item.getLore()[0].split("- §e")[1])
                }
            } catch {damage = 1}
        }   
        if (datas.d[datas.name.indexOf(entity.name)][datas.d[datas.name.indexOf(entity.name)].length-5] >= 2) {
            add = 1.25
            entity.runCommand("title @s times 10 20 0")
            entity.runCommand("title @s title §e§l")
            entity.runCommand(`title @s subtitle §c§l爆擊 §6${Math.round(damage * add)} §c傷害`)
            entity.runCommand("title @s reset")
        } else {
            entity.runCommand("title @s times 10 20 0")
            entity.runCommand("title @s title §e§l" )
            entity.runCommand(`title @s subtitle §c§l造成 §6${Math.round(damage * add)} §c傷害`)
            entity.runCommand("title @s reset")
        }
        let beEntityHealth = Number(worldlog.getEntityScore(beEntity, "health"))
        damage = Math.trunc(damage)
            
            if (beEntityHealth - damage == 1) {
                beEntity.getComponent("health").resetToMinValue()
            }
            damage = Math.round(damage * add) 
            beEntity.runCommand(`scoreboard players set @s health ${beEntityHealth - (damage)}`)
            
            allH.health.push(beEntity.getComponent("health"))
            allH.tick.push(0)
            allH.p.push(beEntity)
            allH.de.push(entity)
        const health = entity.getComponent('health')
        if (beEntity.id != "minecraft:player" ) {
        if (beEntityHealth - damage > 0) {
            if (beEntity.nameTag.indexOf('\n') != -1) {
                beEntity.nameTag = `${beEntity.nameTag.split("\n§c§l血量")[0]}\n§c§l血量 §f- §6${Number(beEntityHealth) - (damage)} §c❤`
            } else {
                beEntity.nameTag = `§c§l血量 §f- §6${Number(beEntityHealth) - (damage)} §c❤`
            }
        } else {
            beEntity.nameTag = `§c§l血量 §f- §60 §c❤`
        }
    }
        } catch {}
    }
        
    })
    /**
     * @type {{tick: number[], health: mc.EntityHealthComponent[], p: mc.Player[], de: mc.Player[]}}
     */
     let allH = {tick: [], health: [], p: [], de: []}
    world.events.tick.subscribe(() => {
        for (let i in allH.health) {
            allH.tick[i]++
            if (allH.tick[i] - 1 >= 2) {
                if (Number(worldlog.getEntityScore(allH.p[i], "health")) <= 0) {
                    let allHealth = worldlog.getEntityScore(allH.p[i], "allHealth")
                    let xp = Math.round((Number(allHealth) / 20) ** 1.25)
                    if (xp == 0) {
                        xp = 1
                    }
                    allH.de[i].runCommand(`scoreboard players add @s xp ${xp}`)
                    allH.health[i].resetToMinValue()
                } else {
                    allH.health[i].resetToDefaultValue()
                }
                if (allH.p[i].id == "minecraft:player" && Number(worldlog.getEntityScore(allH.p[i], "health") <= 0)) {
                    allH.p[i].runCommand('scoreboard players set @s health 30')
                }
                allH.de.splice(allH.de.indexOf(allH.de[i]), 1)
                allH.tick.splice(allH.tick.indexOf(allH.tick[i]), 1)
                allH.health.splice(allH.health.indexOf(allH.health[i]), 1)
                allH.p.splice(allH.p.indexOf(allH.p[i]), 1)
            }
        }
    })

}

/**
 * 
 * @param {mc.Player} player 
 */
export const SettingMenu = (player) => {
    let menu = new ui.ActionFormData()
    menu.title("§b§l設定區域")
    menu.button("§a§l調整/設定武器")

    menu.show(player).then(res => {
        if (res.selection === 0) {
            function setItem() {
                try {
                let fm = new ui.ModalFormData();
                fm.title("設定武器")
                fm.textField("§e§l請輸入要設定的物品位置 §f(§b0-8§f)", "數字", "0")
                fm.show(player).then(res => {
                    if (!res || res.isCanceled) { return; }
                    if (Number(res.formValues[0]) > 8 || !isNum(res.formValues[0])) {
                        return logfor(player.name, "§3§l>> §c錯誤!")
                    }
                    /**
                    * @type {mc.EntityInventoryComponent}
                    */
                    let INV = player.getComponent("inventory");
                    let seleSlot = Number(res.formValues[0])
                    /**
                     * 玩家選擇的物品
                     */
                    let Item = INV.container.getItem(seleSlot)
                    if (!Item) {
                        logfor (player.name, "§4§l>> §c該物品欄內沒有物品，請稍後再試！")
                    }
                    let name = "§e§l沒有名稱!"
                    if (Item.nameTag) {
                        name = Item.nameTag
                    }
                    let id = Item.typeId
                    let damage = 1
                    try {
                        if (Item.getLore()[0].includes("§c§l傷害 §f- ")) {
                            damage = Number(Item.getLore()[0].split("- §e")[1])
                        }
                    } catch { }
                    let a = ["□", "□", "□", "□", "□", "□", "□", "□", "□"]
                    let b = ["1", "2", "3", "4", "5", "6", "7", "8", "9"]
                    a.splice(Number(res.formValues[0]), 1, "§a■§e")
                    b.splice(Number(res.formValues[0]), 1, `§a${b[Number(res.formValues[0])]}§e`)
                    
                    let fm = new ui.MessageFormData();
                    fm.title("§g§l設定武器 - 格子確認")
                    let waring = ""
                    if (Item.getLore().length > 0 && !Item.getLore()[0].startsWith("§c§l傷害 §f-")) {
                        waring = `§4§l***§c警告§4***\n§c該武器擁有特殊標籤\n修改後可能會失去原有功能!\n§c確認修改?\n\n\n\n\n`
                    }
                    fm.body(`${waring}§b§l你所選的格子\n§e${b.join(" §f|§e ")}\n§e${a.join(" §f|§e ")}\n§a名稱 §f- §a${name}\n§aID §f- §a${id}\n§a傷害 §f- §a${damage}`)
                    fm.button1("§a§l確認")
                    fm.button2("§c§l取消")
                    fm.show(player).then(res => {
                        if (res.selection === 1) {
                            try {
                                let aS = ["§c無", "§6小火球"]
                                let aFind = 0
                                if (Item.getLore()[1]) {
                                    let skill = Item.getLore()[1].split(" ")[2]
                                    aFind = aS.indexOf(skill)
                                }
                                let setMob = false
                                if (Item.getLore()[2] == "§a§l可使用修改生物功能") {
                                    setMob = true
                                }
                                let magicDamage = getMagicDamage(player, Number(seleSlot))
                                let fm = new ui.ModalFormData();
                                fm.title('設定武器')
                                fm.textField(`${waring}§e§l物品資訊\n§a名稱 §f- §a${name}\n§aID §f- §a${id}\n§a傷害 §f- §a${damage}\n\n§e請輸入名稱`, "名稱", name)
                                fm.textField(`§c§l輸入傷害`, `數字`, damage.toString())
                                fm.toggle("§e§l開啟修改生物功能", setMob)
                                fm.dropdown("§a§l選擇技能", aS, aFind)
                                fm.textField("§e§l輸入技能傷害 §f(§c若沒有技能則無效§f)", "number", magicDamage.toString())
                                fm.show(player).then(res => {
                                    if (!res || res.isCanceled) {return;}
                                    if (!isNum(res.formValues[1])) {
                                        return logfor(player.name, "§3§l>> §c錯誤!")
                                    }
                                    let namea = res.formValues[0]
                                    let damage = Number(res.formValues[1])
                                    let magicDamage = Number(res.formValues[4])
                                    let a = "§c無"
                                    if (namea == '') {
                                        namea = name
                                    }
                                    if (damage == "") {
                                        damage = 0
                                    }
                                    if (res.formValues[3] > 0) {
                                        a = aS[res.formValues[3]]
                                        a = `${a} §c§l傷害§f - §c${magicDamage}`
                                    }

                                    let lore = [`§c§l傷害 §f- §e${damage}`, `§b§l技能§f - ${a}`]
                                    Item.nameTag = namea
                                    if (res.formValues[2]) {
                                        lore.push("§a§l可使用修改生物功能")
                                    }
                                    Item.setLore(lore)
                                    INV.container.setItem(seleSlot, Item)
                                    logfor(player.name, "§3§l>> §a設定完成!")
                                })
                            } catch (e) { logfor(player.name, `§3§l>> §c預期外的錯誤§f:§e${e}`) }
                        } else {
                            setItem()
                        }
                    })
                })
            } catch (e) {warm(e)}
        }
            try {
            setItem()
            } catch (e) {warm(e)}
        } else if (res.selection === 1) {
                        
        }
    })
}