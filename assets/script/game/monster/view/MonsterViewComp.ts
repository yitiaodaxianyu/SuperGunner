import { _decorator, sp } from "cc";
import { ecs } from "../../../../../extensions/oops-plugin-framework/assets/libs/ecs/ECS";
import { CCComp } from "../../../../../extensions/oops-plugin-framework/assets/module/common/CCComp";
import { MonsterViewAnimator } from "./MonsterViewAnimator";
import { MonsterViewLoader } from "./MonsterViewLoader";
import { MonsterViewController } from "./MonsterViewController";
import { Monster } from "../Monster";

const { ccclass, property } = _decorator;

/** 视图层对象 */
@ccclass('MonsterView')
@ecs.register('MonsterView', false)
export class MonsterViewComp extends CCComp {
    @property({ type: sp.Skeleton, tooltip: '角色动画' })
    spine: sp.Skeleton = null!;
    // /** 角色动画资源管理 */
    loader: MonsterViewLoader = null!;
    /** 角色动画规则管理 */
    animator: MonsterViewAnimator = null!;
    // /** 角色控制器 */
    controller: MonsterViewController = null!;
    /** 视图层逻辑代码分离演示 */
    start() {
        // var entity = this.ent as ecs.Entity;         // ecs.Entity 可转为当前模块的具体实体对象
        // this.on(ModuleEvent.Cmd, this.onHandler, this);
        var monster = this.ent as Monster;

        this.loader = this.node.addComponent(MonsterViewLoader);
        this.node.emit("load", monster);

        this.animator = this.spine.getComponent(MonsterViewAnimator)!;
        this.animator.monster = monster;

        this.controller = this.node.addComponent(MonsterViewController);
        this.controller.monster = monster;
    }

    /** 全局消息逻辑处理 */
    // private onHandler(event: string, args: any) {
    //     switch (event) {
    //         case ModuleEvent.Cmd:
    //             break;
    //     }
    // }

    /** 视图对象通过 ecs.Entity.remove(ModuleViewComp) 删除组件是触发组件处理自定义释放逻辑 */
    reset() {
        this.node.destroy();
    }
}