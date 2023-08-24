/*
 * @Author: dgflash
 * @Date: 2021-12-29 11:33:59
 * @LastEditors: dgflash
 * @LastEditTime: 2022-06-14 19:56:45
 */
import { sp, _decorator, log } from "cc";
import AnimatorSpine from "../../../../../extensions/oops-plugin-framework/assets/libs/animator/AnimatorSpine";
import { AnimatorStateLogic } from "../../../../../extensions/oops-plugin-framework/assets/libs/animator/core/AnimatorStateLogic";
import { Monster } from "../Monster";
import { AnimationEventHandler } from "../../role/view/animator/AnimationEventHandler";
import { MonsterAnimatorType } from "../model/MonsterEnum";
import { MonsterStateAttack } from "./animator/MonsterStateAttack";
import { MonsterStateDead } from "./animator/MonsterStateDead";
import { MonsterStateHit } from "./animator/MonsterStateHit";


const { ccclass, property, requireComponent, disallowMultiple } = _decorator;

/** 
 * 角色SPINE动画控制
 * 
 * 实现功能
 * 1、控制动作变化
 * 2、控制武器变化
 * 3、控制脸的朝向
 */
@ccclass("MonsterViewAnimator")
@disallowMultiple
@requireComponent(sp.Skeleton)
export class MonsterViewAnimator extends AnimatorSpine {
    /** 攻击行为完成 */
    onAttackComplete: Function = null!;
    /** 受击动作完成 */
    onHitActionComplete: Function = null!;
    /** 角色对象 */
    monster: Monster = null!;



    //朝向
    public chaoxiang: number = 0;

    start() {
        super.start();

        // 动画状态机
        let anim = new AnimationEventHandler();
        let asl: Map<string, AnimatorStateLogic> = new Map();
        asl.set(MonsterAnimatorType.Attack, new MonsterStateAttack(this.monster, anim));
        asl.set(MonsterAnimatorType.Hurt, new MonsterStateHit(this.monster, anim));
        asl.set(MonsterAnimatorType.Dead, new MonsterStateDead(this.monster, anim));
        this.initArgs(asl, anim);
    }

    /** 面象朝左 */
    left() {
        if (this.chaoxiang == 1) {
            this.chaoxiang = 0;
            this.node.parent!.setScale(1, 1, 1);
        }

    }

    /** 面象朝右 */
    right() {
        if (this.chaoxiang == 0) {
            this.chaoxiang = 1;
            this.node.parent!.setScale(-1, 1, 1);
        }

    }

    /** 当前动作换职业动画 */
    refresh() {
        // 状态机状态值未变时，不会触发状态变化事件，所以这里直接触发状态变化事件来触发后续流程
        this.onStateChange(this._ac.curState, this._ac.curState);
    }

    /**
     * 播放动画
     * @override
     * @param animName 动画名
     * @param loop 是否循环播放
     */
    protected playAnimation(animName: string, loop: boolean) {
        if (animName) {

            var name = "Side_" + animName;

            var temp = this._spine.setAnimation(0, name, loop);
            if (temp != null) {
                if (animName == MonsterAnimatorType.Attack) {
                    //攻击是动画速度和攻击速度同步
                    this._spine.timeScale = temp.animationEnd / this.monster.MonsterModel.monsterData.attackSpeed;
                } else {
                    this._spine.timeScale = 1;
                }
            }

        }
        else {
            this._spine.clearTrack(0);
        }
    }


}