/*
 * @Author: dgflash
 * @Date: 2022-01-26 16:07:58
 * @LastEditors: dgflash
 * @LastEditTime: 2022-06-14 19:56:19
 */
/*
 * @Author: dgflash
 * @Date: 2021-09-01 15:19:04
 * @LastEditors: dgflash
 * @LastEditTime: 2022-01-25 10:05:40
 */

import { AnimatorStateLogic } from "../../../../../../extensions/oops-plugin-framework/assets/libs/animator/core/AnimatorStateLogic";

import { AnimationEventHandler } from "../../../role/view/animator/AnimationEventHandler";
import { Monster } from "../../Monster";

/** 受击状态逻辑 */
export class MonsterStateDead extends AnimatorStateLogic {
    private monster: Monster;
    private anim: AnimationEventHandler;

    public constructor(role: Monster, anim: AnimationEventHandler) {
        super();
        this.monster = role;
        this.anim = anim;
        this.anim.addFrameEvent("dead", this.onDead, this);
    }

    private onDead() {
        var onHitActionComplete = this.monster.MonsterView.animator.onHitActionComplete;
        onHitActionComplete && onHitActionComplete();
    }

    public onEntry() {

    }

    public onUpdate() {

    }

    public onExit() {

    }
}

