/*
 * @Author: dgflash
 * @Date: 2021-12-29 11:33:59
 * @LastEditors: dgflash
 * @LastEditTime: 2022-06-14 19:56:45
 */
import { sp, _decorator, log, Vec3, Node } from "cc";
import AnimatorSpine from "../../../../../extensions/oops-plugin-framework/assets/libs/animator/AnimatorSpine";
import { AnimatorStateLogic } from "../../../../../extensions/oops-plugin-framework/assets/libs/animator/core/AnimatorStateLogic";
import { RoleAnimatorType } from "../model/RoleEnum";
import { Role } from "../Role";
import { AnimationEventHandler } from "./animator/AnimationEventHandler";
import { RoleStateAttack } from "./animator/RoleStateAttack";
import { RoleStateDead } from "./animator/RoleStateDead";
import { RoleStateHit } from "./animator/RoleStateHit";
import { Vec3Util } from "../../../../../extensions/oops-plugin-framework/assets/core/utils/Vec3Util";

const { ccclass, property, requireComponent, disallowMultiple } = _decorator;

/** 
 * 角色SPINE动画控制
 * 
 * 实现功能
 * 1、控制动作变化
 * 2、控制武器变化
 * 3、控制脸的朝向
 */
@ccclass("RoleViewAnimator")
@disallowMultiple
@requireComponent(sp.Skeleton)
export class RoleViewAnimator extends AnimatorSpine {

    @property({ type: sp.Skeleton, tooltip: '角色上身' })
    spineBody: sp.Skeleton = null!;





    @property({ type: sp.Skeleton, tooltip: '角色披风' })
    spinePifeng: sp.Skeleton = null!;

    /** 攻击行为完成 */
    onAttackComplete: Function = null!;
    /** 受击动作完成 */
    onHitActionComplete: Function = null!;
    /** 角色对象 */
    role: Role = null!;



    //朝向
    public chaoxiang: number = 0;


    start() {
        super.start();

        // 动画状态机
        let anim = new AnimationEventHandler();
        let asl: Map<string, AnimatorStateLogic> = new Map();
        asl.set(RoleAnimatorType.Attack, new RoleStateAttack(this.role, anim));
        asl.set(RoleAnimatorType.Hurt, new RoleStateHit(this.role, anim));
        asl.set(RoleAnimatorType.Dead, new RoleStateDead(this.role, anim));
        this.initArgs(asl, anim);
    }
    //运动方向
    private _direction: number = 0;
    private set direction(n: number) {

        if (n != this._direction) {
            this._direction = n;
            this.onStateChange(this._ac.curState, this._ac.curState);
        }

    }
    private get direction(): number {
        return this._direction;
    }

   
    /** 面象朝左 */
    left(direction: number) {
        if (direction > 0) {
            this.direction = 1;
        } else {
            this.direction = 0;
        }

        if (this.chaoxiang == 1) {
            this.chaoxiang = 0;
            this.node.parent!.setScale(1, 1, 1);
            this.onStateChange(this._ac.curState, this._ac.curState);
        }

    }

    /** 面象朝右 */
    right(direction: number) {
        if (direction > 0) {
            this.direction = 1;
        } else {
            this.direction = 0;
        }
        if (this.chaoxiang == 0) {
            this.chaoxiang = 1;
            this.node.parent!.setScale(-1, 1, 1);
            this.onStateChange(this._ac.curState, this._ac.curState);
        }

    }

    /** 当前动作换职业动画 */
    refresh() {
        // 状态机状态值未变时，不会触发状态变化事件，所以这里直接触发状态变化事件来触发后续流程
        this.onStateChange(this._ac.curState, this._ac.curState);
    }
 
    //改变枪的旋转角度
    public changeDir(dir:number):void{
      
        let L_Arm=this.spineBody.findBone("L_UpArm");
        let R_Arm=this.spineBody.findBone("R_UpArm");
        if (this.chaoxiang == 1) {
            L_Arm.data.rotation = 330-dir;
            R_Arm.data.rotation = -15-dir;
           
        }else{
            L_Arm.data.rotation = 330-(180-dir);
            R_Arm.data.rotation = -15-(180-dir);
        }
        if(dir==0||dir==180){
            let chest=this.spineBody.findBone("head");
            chest.data.rotation = -27.16;
        }else{
            let chest=this.spineBody.findBone("head");
            chest.data.rotation = -27.16+30;
        }
       
    }
    //攻击状态改变
    public changeAttackMode(): void {

        if (this.role.RoleView.animator.curStateName == RoleAnimatorType.Walk) {
            if (this.role.RoleView.controller.monsterDirection == 0) {
                this.spineBody.setAnimation(0, "move", true);
                this.spinePifeng.setAnimation(0, "move", true);
                this.spineBody.timeScale = 1;
                this.spinePifeng.timeScale = 1;
                let chest=this.spineBody.findBone("head");
                chest.data.rotation = -27.16;
            } else {
                var temp1 = this.spineBody.setAnimation(0, "atk2", true);
                var temp2 = this.spinePifeng.setAnimation(0, "atk2", true);
                this.spineBody.timeScale = temp1.animationEnd / this.role.RoleModel.attackSpeed;
                this.spinePifeng.timeScale = temp2.animationEnd / this.role.RoleModel.attackSpeed;

            }
        } else {
            if (this.role.RoleView.controller.monsterDirection == 0) {
                this.spineBody.setAnimation(0, "idle", true);
                this.spinePifeng.setAnimation(0, "idle", true);
                let chest=this.spineBody.findBone("head");
                chest.data.rotation = -27.16;
                this.spineBody.timeScale = 1;
                this.spinePifeng.timeScale = 1;
            } else {
                var temp1 = this.spineBody.setAnimation(0, "atk2", true);
                var temp2 = this.spinePifeng.setAnimation(0, "atk2", true);
                this.spineBody.timeScale = temp1.animationEnd / this.role.RoleModel.attackSpeed;
                this.spinePifeng.timeScale = temp2.animationEnd / this.role.RoleModel.attackSpeed;
            }
        }




    }
    /**
     * 播放动画
     * @override
     * @param animName 动画名
     * @param loop 是否循环播放
     */
    protected playAnimation(animName: string, loop: boolean) {

        if (animName) {

            if (animName == "Idle") {
                this._spine.setAnimation(0, "idle", loop);


            } else if (animName == "Walk") {

                if (this.chaoxiang == this.direction) {
                    this._spine.setAnimation(0, "move2", loop);
                } else {
                    this._spine.setAnimation(0, "move", loop);
                }

            }
            this.changeAttackMode();
            // tack.trackTime=tack.animationEnd;
            // this._spine.timeScale=-1;



            // if (temp != null) {
            //     if (animName == RoleAnimatorType.Attack) {
            //         //攻击是动画速度和攻击速度同步
            //         this._spine.timeScale = temp.animationEnd / this.role.RoleModel.attackSpeed;
            //     } else {
            //         this._spine.timeScale = 1;
            //     }
            // }
        }
        else {
            this._spine.clearTrack(0);
        }
    }

   
}