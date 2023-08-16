import { Vec3 ,Node} from "cc";
import { ViewUtil } from "../../../../extensions/oops-plugin-framework/assets/core/utils/ViewUtil";
import { EffectSingleCase } from "../../../../extensions/oops-plugin-framework/assets/libs/animator-effect/EffectSingleCase";
import { ecs } from "../../../../extensions/oops-plugin-framework/assets/libs/ecs/ECS";
import { MonsterBllComp } from "./bll/MonsterBllComp";
import { MonsterModelComp } from "./model/MonsterModelComp";
import { MonsterViewComp } from "./view/MonsterViewComp";

/** Monster 模块 */
@ecs.register(`Monster`)
export class Monster extends ecs.Entity {
    /** ---------- 数据层 ---------- */
    MonsterModel!: MonsterModelComp;

    /** ---------- 业务层 ---------- */
    MonsterBll!: MonsterBllComp;

    /** ---------- 视图层 ---------- */
    MonsterView!: MonsterViewComp;

    bullet: Node = null!;
    /** 初始添加的数据层组件 */
    protected init() {
        // this.addComponents<ecs.Comp>();
        this.addComponents<ecs.Comp>(
            MonsterModelComp);
    }
    /** 加载角色显示对象（cc.Component在创建后，添加到ECS框架中，使实体上任何一个ECS组件都可以通过 ECS API 获取到视图层对象 */
    async load(parent: Node, pos: Vec3 = Vec3.ZERO) {
        var node = await ViewUtil.createPrefabNodeAsync("monster/monster_"+this.MonsterModel.id);
        var mv = node.getComponent(MonsterViewComp)!;
        this.add(mv);

        node.parent = parent;
        node.setPosition(pos);

    }
    /** 模块资源释放 */
    destroy() {
        // 注: 自定义释放逻辑，视图层实现 ecs.IComp 接口的 ecs 组件需要手动释放
        super.destroy();
    }
}

/** Monster 模块业务逻辑系统组件，如无业务逻辑处理可删除此对象 */
export class EcsMonsterSystem extends ecs.System {
    constructor() {
        super();

        // this.add(new ecs.ComblockSystem());
    }
}
