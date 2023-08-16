/*
 * @Author: dgflash
 * @Date: 2021-09-01 15:19:04
 * @LastEditors: dgflash
 * @LastEditTime: 2022-06-14 19:56:14
 */
import { AnimatorStateLogic } from "../../../../../../extensions/oops-plugin-framework/assets/libs/animator/core/AnimatorStateLogic";
import { AnimationEventHandler } from "../../../role/view/animator/AnimationEventHandler";
import { Monster } from "../../Monster";


/** 攻击状态逻辑 */
export class MonsterStateAttack extends AnimatorStateLogic {
    private monster: Monster;
    private anim: AnimationEventHandler;

    public constructor(role: Monster, anim: AnimationEventHandler) {
        super();
        this.monster = role;
        this.anim = anim;
        this.anim.addFrameEvent("attack", this.onAttack, this);
    }

    private onAttack() {
        var onAttackComplete = this.monster.MonsterView.animator.onAttackComplete;
        onAttackComplete && onAttackComplete();
    }

    public onEntry() {

    }

    public onUpdate() {

    }

    public onExit() {

    }
}

