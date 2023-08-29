import { ecs } from "../../../../../extensions/oops-plugin-framework/assets/libs/ecs/ECS";
import { VM } from "../../../../../extensions/oops-plugin-framework/assets/libs/model-view/ViewModel";
import { TableMonsterConfig } from "../../common/table/TableMonsterConfig";
import { MonsterData } from "./MonsterData";

/** 数据层对象 */
@ecs.register('MonsterModel')
export class MonsterModelComp extends ecs.Comp {

    /** 角色编号 */
    private _id: number = -1;

    private table: TableMonsterConfig = new TableMonsterConfig();

    private _name: string = "";
    /** 昵称 */
    get name(): string {
        return this._name;
    }
    set name(value: string) {
        this._name = value;
        this.vm.name = value;
    }

     /** 昵称 */
    get id(): number {
        return this._id;
    }
    set id(value: number) {
        //读取json配置
        this.table.init(value);
        this._id = value;
       
    }

    monsterData:MonsterData=new MonsterData();
    /** 动画名资源 */
    anim: string = "Monster_06";
    
    //是否所有子弹资源加载完毕
    isAllAniLoad:boolean=false;
    /** 提供 MVVM 组件使用的数据 */
    private vm: any = {};

    /** 显示数据添加到 MVVM 框架中监视 */
    vmAdd() {
        VM.add(this.vm, "MonsterModelComp");
    }

    /** 显示数据从 MVVM 框架中移除 */
    vmRemove() {
        VM.remove("MonsterModelComp");
    }

    /** 数据层组件移除时，重置所有数据为默认值 */
    reset() {
        for (var key in this.vm) {
            delete this.vm[key];
        }
    }
}