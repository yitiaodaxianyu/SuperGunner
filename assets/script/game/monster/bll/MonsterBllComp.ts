import { ecs } from "../../../../../extensions/oops-plugin-framework/assets/libs/ecs/ECS";

/** 业务层对象 */
@ecs.register('MonsterBll')
export class MonsterBllComp extends ecs.Comp {
    /** 业务层组件移除时，重置所有数据为默认值 */
    reset() {
        
    }
}

/** 业务层业务逻辑处理对象 */
export class MonsterBllCompSystem extends ecs.ComblockSystem implements ecs.IEntityEnterSystem {
    filter(): ecs.IMatcher {
        return ecs.allOf(MonsterBllComp);
    }

    entityEnter(e: ecs.Entity): void {
        // 注：自定义业务逻辑


        e.remove(MonsterBllComp);
    }
}