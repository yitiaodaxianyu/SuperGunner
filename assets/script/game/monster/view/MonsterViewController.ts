/*
 * @Author: dgflash
 * @Date: 2021-11-18 17:42:59
 * @LastEditors: dgflash
 * @LastEditTime: 2022-06-14 17:57:33
 */

import { Component, EventTouch, Node, UITransform, v3, _decorator, Vec2, RigidBody2D, log, Vec3 } from "cc";
import { oops } from "../../../../../extensions/oops-plugin-framework/assets/core/Oops";
import { Monster } from "../Monster";
import { BTreeNode, BehaviorTree, Decorator, Selector, Task } from "../../../../../extensions/oops-plugin-framework/assets/libs/behavior-tree";
import { smc } from "../../common/ecs/SingletonModuleComp";
import { MonsterAnimatorType } from "../model/MonsterEnum";
import { EffectSingleCase } from "../../../../../extensions/oops-plugin-framework/assets/libs/animator-effect/EffectSingleCase";
import { Timer } from "../../../../../extensions/oops-plugin-framework/assets/core/common/timer/Timer";
import { MonsterBullet } from "../../bullet/MonsterBullet";


const { ccclass, property } = _decorator;

/** 角色资源加载 */
@ccclass('MonsterViewController')
export class MonsterViewController extends Component {
    /** 角色对象 */
    monster: Monster = null!;
    //行为树

    private bt: BehaviorTree = null!;
    moveSpeed = 3;

    private timer: Timer = new Timer(1);

    private canAttack: boolean = false;
    onLoad() {
        var btns: Array<BTreeNode> = [];
        btns.push(new IsSeeEnemy(new MonsterMoveStopTask()));
        btns.push(new MonsterMoveTask());


        this.bt = new BehaviorTree(new Selector(btns));
        this.timer.step = this.monster.MonsterModel.monsterData.attackSpeed;
        this.timer.reset();
    }

    protected update(dt: number): void {

        this.bt.setObject(this)
        this.bt.run();
        if (this.monster.MonsterView.animator.curStateName == MonsterAnimatorType.Attack) {
            this.canAttack = this.timer.update(dt);
        }else{
            this.timer.reset();
            this.canAttack=true;
        }
       

    }

    //攻击
    attack() {
        if (smc.account.AccountModel.role.RoleView) {
            //攻击必须面朝
            const moveVec = smc.account.AccountModel.role.RoleView.node.getPosition().x - this.monster.MonsterView.node.getPosition().x;

            if (moveVec > 0) {
                this.monster.MonsterView.animator.left();
            } else {
                this.monster.MonsterView.animator.right();
            }

            this.monster.MonsterView.animator.setTrigger(MonsterAnimatorType.Attack);
            if (this.canAttack && this.monster.MonsterModel.isAllAniLoad == true) {
              
                let node = EffectSingleCase.instance.show("monsterBullet/monsterBullet_1", this.monster.bullet);
                node.active = true;
                if (this.monster.MonsterView.animator.chaoxiang == 0) {
                    node.setPosition(new Vec3(this.monster.MonsterView.node.getPosition().x + 100, this.monster.MonsterView.node.getPosition().y + 73 + Math.random() * 15, 0));
                    node.getComponent(RigidBody2D).linearVelocity = new Vec2(moveVec/120, Math.abs(moveVec)/30);
                    

                } else {
                    node.setPosition(new Vec3(this.monster.MonsterView.node.getPosition().x - 100, this.monster.MonsterView.node.getPosition().y + 73 + Math.random() * 15, 0));
                    node.getComponent(RigidBody2D).linearVelocity = new Vec2(moveVec/120, Math.abs(moveVec)/30);

                }
            }
        }




    }
    /**
  * 移动
  */
    move() {
        if (smc.account.AccountModel.role.RoleView) {
            if (this.monster.MonsterView.animator.curStateName != MonsterAnimatorType.Walk) {
                this.monster.MonsterView.animator.setTrigger(MonsterAnimatorType.Walk);
            }


            const moveVec = smc.account.AccountModel.role.RoleView.node.getPosition().x - this.monster.MonsterView.node.getPosition().x;
            //const force = new Vec2(moveVec.x, moveVec.y);
            let force
            if (moveVec > 0) {
                force = new Vec2(this.moveSpeed, 0);
            } else {
                force = new Vec2(-this.moveSpeed, 0);
            }

            this.monster.MonsterView.node.getComponent(RigidBody2D).linearVelocity = force;
            //this.role.RoleView.node.getComponent(RigidBody2D).applyForceToCenter(force, true);
            if (moveVec > 0)
                this.monster.MonsterView.animator.left();
            else
                this.monster.MonsterView.animator.right();
        }


    }
    onDestroy() {

    }
}
//移动
class MonsterMoveTask extends Task {
    run(obj?: MonsterViewController): void {
        if (obj) {
            // obj.role_pos++;
            // console.log(`角色当前移动了【${obj.role_pos}】步`);
            obj.move();

        }
        this.success();
    }


}
/** 装饰器是条件语句只能附加在其他节点上并且定义所附加的节点是否执行，这里验证比如敌人位置与之相等后，表示条件验证成功,继续执行后续任务，失败结束行为树的处理流程
 * 验证是否在攻击距离内
 */
class IsSeeEnemy extends Decorator {
    run(blackboard: MonsterViewController) {
        // if (blackboard.role_pos >= blackboard.enemy_pos) {
        //     super.run(blackboard);
        //     this.success();         // 调用此方法，代表此节点表达验证逻辑为true的结果，可以执行后续节点
        // }
        // else {
        //     this.fail();            // 调用此方法，代表此节点表达验证逻辑为false的结果，不能执行后续节点
        // }
        //
        //怪和自己距离小于攻击距离

        if (smc.account.AccountModel.role.RoleView && blackboard.monster.MonsterView && blackboard.monster.MonsterModel.monsterData.attackDistance >= Math.abs(smc.account.AccountModel.role.RoleView.node.getPosition().x - blackboard.monster.MonsterView.node.getPosition().x)) {
            super.run(blackboard);
            this.success();
        } else {
            this.fail();
        }
    }
}

/** 玩家自己停止动作逻辑，这类逻辑一般只会成本，属于确定的流程 
 * 攻击
*/
class MonsterMoveStopTask extends Task {
    run(blackboard: MonsterViewController): void {
        // console.log(`角色当前停止移动`);
        // blackboard.role_pos=0;
        blackboard.attack();
        this.success();
    }
}