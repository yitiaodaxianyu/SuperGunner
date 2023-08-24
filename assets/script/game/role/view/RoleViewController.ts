/*
 * @Author: dgflash
 * @Date: 2021-11-18 17:42:59
 * @LastEditors: dgflash
 * @LastEditTime: 2022-06-14 17:57:33
 */

import { Component, EventTouch, Node, UITransform, v3, _decorator, RigidBody2D, Vec2, Vec3, log } from "cc";
import { oops } from "../../../../../extensions/oops-plugin-framework/assets/core/Oops";
import { Role } from "../Role";
import { smc } from "../../common/ecs/SingletonModuleComp";
import { JoystickDataType, SpeedType, instance } from "../../game/joystick/Joystick";
import { RoleAnimatorType } from "../model/RoleEnum";
import { Timer } from "../../../../../extensions/oops-plugin-framework/assets/core/common/timer/Timer";
import { Monster } from "../../monster/Monster";
import { MonsterManager } from "../../monster/MonsterManager";
import { EffectSingleCase } from "../../../../../extensions/oops-plugin-framework/assets/libs/animator-effect/EffectSingleCase";
import { Bullet } from "../../bullet/Bullet";

const { ccclass, property } = _decorator;

/** 角色资源加载 */
@ccclass('RoleViewController')
export class RoleViewController extends Component {
    /** 角色对象 */
    role: Role = null!;

    moveDir: Vec3 = new Vec3(0, 1, 0);
    speedType: SpeedType = SpeedType.STOP;
    moveSpeed = 0;

    stopSpeed = 0;
    normalSpeed = 5;
    fastSpeed = 10;
    private timer: Timer = new Timer(1);

   
    onLoad() {
        //oops.gui.game.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        //this.timer.step=this.role.RoleModel.attackSpeed;
        instance.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        instance.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        instance.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }
    protected update(dt: number): void {


        if (this.speedType !== SpeedType.STOP) {
            this.move();
        }
        let monstemp: Monster = MonsterManager.instance.getMonstersForCenterPos(500);
        if (monstemp != null && this.role != null) {

            this.attack(monstemp, dt);

        } else {
            this.monsterDirection = 0;
        }

    }

    private _monsterDirection: number = 0;//最近怪物朝向，0表示没有，1表示右边，-1表示左边

    public  set monsterDirection(n:number){
        if(n!=this._monsterDirection){
            this._monsterDirection=n;
            this.role.RoleView.animator.changeAttackMode();

        }
       
    }
    public get monsterDirection():number{
        return this._monsterDirection;
    }
    /** 攻击 */
    attack(monster: Monster, dt: number) {

     
        if (this.role.RoleModel.isAllAniLoad == true && this.timer.update(dt)) {
          
            if (monster.MonsterView.node.position.x - this.role.RoleView.node.position.x > 0) {
                this.monsterDirection = 1;
            } else {
                this.monsterDirection = -1;
            }
            if (this.role.RoleView.animator.curStateName != RoleAnimatorType.Walk){
                if (this.monsterDirection == 1) {
                    this.role.RoleView.animator.left(0);
                } else if (this.monsterDirection == -1) {
                    this.role.RoleView.animator.right(0);
                }
            }
            let node = EffectSingleCase.instance.show("bullet/bullet_1", this.role.bullet);
            node.active = true;
            if (this.role.RoleView.animator.chaoxiang == 0) {
                node.setPosition(new Vec3(this.role.RoleView.node.getPosition().x + 100, this.role.RoleView.node.getPosition().y + 73, 0));
                node.getComponent(Bullet).setData(30, 0);
            } else {
                node.setPosition(new Vec3(this.role.RoleView.node.getPosition().x - 100, this.role.RoleView.node.getPosition().y + 73, 0));
                node.getComponent(Bullet).setData(30, 180);
            }
            
           
        }


    }
    onTouchStart() {

    }

    onTouchMove(event: EventTouch, data: JoystickDataType) {
        this.speedType = data.speedType;
        this.moveDir = data.moveVec;

        this.onSetMoveSpeed(this.speedType);
    }

    onTouchEnd(event: EventTouch, data: JoystickDataType) {
        this.speedType = data.speedType;

        this.onSetMoveSpeed(this.speedType);
        this.role.RoleView.node.getComponent(RigidBody2D).linearVelocity = new Vec2(0, 0);
    }
    /**
* set moveSpeed by SpeedType
* @param speedType
*/
    onSetMoveSpeed(speedType: SpeedType) {
        switch (speedType) {
            case SpeedType.STOP:
                this.moveSpeed = this.stopSpeed;
                this.role.RoleView.animator.setTrigger(RoleAnimatorType.StopWalk);

                break;
            case SpeedType.NORMAL:
                this.moveSpeed = this.normalSpeed;
                if (this.role.RoleView.animator.curStateName != RoleAnimatorType.Walk) {
                    this.role.RoleView.animator.setTrigger(RoleAnimatorType.Walk);
                }

                break;
            case SpeedType.FAST:
                this.moveSpeed = this.fastSpeed;
                if (this.role.RoleView.animator.curStateName != RoleAnimatorType.Walk) {
                    this.role.RoleView.animator.setTrigger(RoleAnimatorType.Walk);
                }

                break;
            default:
                break;
        }
    }
    /**
   * 移动
   */
    move() {
        const moveVec = this.moveDir.clone().multiplyScalar(this.moveSpeed);
        //const force = new Vec2(moveVec.x, moveVec.y);
        const force = new Vec2(moveVec.x, 0);
        this.role.RoleView.node.getComponent(RigidBody2D).linearVelocity = force;
        //this.role.RoleView.node.getComponent(RigidBody2D).applyForceToCenter(force, true);

        if (this.monsterDirection == 1) {
            this.role.RoleView.animator.left(moveVec.x);
        } else if (this.monsterDirection == -1) {
            this.role.RoleView.animator.right(moveVec.x);
        } else {
            if (moveVec.x > 0)
                this.role.RoleView.animator.left(moveVec.x);
            else
                this.role.RoleView.animator.right(moveVec.x);
        }


    }
    onDestroy() {
        instance.off(Node.EventType.TOUCH_START, this.onTouchStart, this);
        instance.off(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        instance.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }
}