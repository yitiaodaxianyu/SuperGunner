import { Node, Vec3, _decorator, v3 } from 'cc';
import { ecs } from '../../../../extensions/oops-plugin-framework/assets/libs/ecs/ECS';
import { Monster } from './Monster';
import { Vec3Util } from '../../../../extensions/oops-plugin-framework/assets/core/utils/Vec3Util';
import { smc } from '../common/ecs/SingletonModuleComp';
const { ccclass, property } = _decorator;

@ccclass('MonsterManager')
export class MonsterManager {
    private static _instance: MonsterManager;

    private allMonster: Array<Monster> = [];
    static get instance(): MonsterManager {
        if (this._instance == null) {
            this._instance = new MonsterManager();
        }
        return this._instance;
    }
    /**
     * 根据怪物id创建一个敌人
     * @param id 怪物id
     * @param pos 生成位置

     * @returns 
     */
    public createMonsterById(id: number, parent: Node, bullet: Node): void {
        var monster = ecs.getEntity<Monster>(Monster);
        // 角色数据
        monster.MonsterModel.id = id;



        // 角色等级属性绑定到界面上显示

        monster.bullet = bullet;

        // 角色动画显示对象
        monster.load(parent, v3(0, 0, 0));
        this.allMonster.push(monster);

    }
    /**
     * 获取攻击范围内的距离最近的敌人
     * @param id 怪物id
     * @param pos 生成位置

     * @returns 
     */
    public getMonstersForCenterPos(distance: number): Monster {

        var monstemp: Monster = null;
        var tempDis: number = 999999;
        for (var i: number = 0; i < this.allMonster.length; i++) {
            var tempMonster: Monster = this.allMonster[i];
            var disTemp=Vec3Util.distance(tempMonster.MonsterView.node.position,smc.account.AccountModel.role.RoleView.node.position);
            if(disTemp<distance&&disTemp<tempDis){
                tempDis=disTemp;
                monstemp=tempMonster;
            }
        }

        return monstemp;
    }

   
}


