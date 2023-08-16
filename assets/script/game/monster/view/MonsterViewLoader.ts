/*
 * @Author: dgflash
 * @Date: 2021-11-18 17:42:59
 * @LastEditors: dgflash
 * @LastEditTime: 2022-08-11 15:04:39
 */

import { Component, sp, _decorator, log } from "cc";
import { oops } from "../../../../../extensions/oops-plugin-framework/assets/core/Oops";
import { Monster } from "../Monster";



const { ccclass, property } = _decorator;

/** 角色资源加载 */
@ccclass('MonsterViewLoader')
export class MonsterViewLoader extends Component {
    spine: sp.Skeleton = null!;

    private monster: Monster;

    onLoad() {
        this.node.on("load", this.onEmitLoad, this);
    }

    private onEmitLoad(monster: Monster) {
        this.spine = monster.MonsterView.spine;
        this.monster = monster;
        this.load(monster.MonsterModel.anim);
    }

    private load(name: string) {
        this.node.active = false;

        var path = "spine/monster/" + name;
        oops.res.load(path, sp.SkeletonData, (err: Error | null, sd: sp.SkeletonData) => {
            if (err) {
                console.error(`动画名为【${path}】的角色资源不存在`);
                return;
            }
            log("加载成功");
            this.spine.skeletonData = sd;
            this.spine.skeletonData.addRef();
            this.spine.setSkin("Side2");
            this.node.active = true;
            this.monster.MonsterView.animator.refresh();
        });
    }

    onDestroy() {
        if (this.spine.skeletonData) this.spine.skeletonData.decRef();
    }
}