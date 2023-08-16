import { _decorator, Component, EventTouch, instantiate, log, Node, Prefab, RigidBody2D, v3, Vec2, Vec3 } from 'cc';
import { oops } from '../../../../../extensions/oops-plugin-framework/assets/core/Oops';
import { UIID } from '../../common/config/GameUIConfig';
import { GameEvent } from '../../common/config/GameEvent';
import { ecs } from '../../../../../extensions/oops-plugin-framework/assets/libs/ecs/ECS';
import { Account } from '../../account/Account';
import { Role } from '../../role/Role';
import { smc } from '../../common/ecs/SingletonModuleComp';
import { instance, JoystickDataType, SpeedType } from '../joystick/Joystick';
import { RoleAnimatorType } from '../../role/model/RoleEnum';
import { MonsterManager } from '../../monster/MonsterManager';
const { ccclass, property } = _decorator;

@ccclass('GameView')
export class GameView extends Component {
    @property({ type: Node })
    body: Node = null!;
    //玩家层级
    @property({ type: Node })
    player: Node = null!;
    //怪物层级
    @property({ type: Node })
    monster: Node = null!;


    @property({ type: Prefab })
    box: Prefab = null!;

    //子弹层级
    @property({ type: Node })
    bullet: Node = null!;


    private boxNum: number = 0;


    start() {
        //oops.message.dispatchEvent(GameEvent.GameServerConnected)
        var data = {
            id: 1,
            name: "Oops",
            power: 10,
            agile: 10,
            physical: 10,
            lv: 1,
            jobId: 1
        }
        this.createRole(data);

    }
    /** 创建角色对象（自定义逻辑） */
    private createRole(data: any) {
        var role = ecs.getEntity<Role>(Role);

        // 角色数据
        role.RoleModel.id = data.id;
        role.RoleModel.name = data.name;

        // 角色初始战斗属性
        role.RoleModelBase.power = data.power;
        role.RoleModelBase.agile = data.agile;
        role.RoleModelBase.physical = data.physical;

        // 角色等级数据
        role.upgrade(data.lv);

        // 角色职业数据
        role.RoleModelJob.id = data.jobId;


        role.bullet = this.bullet;

        // 角色动画显示对象
        role.load(this.player, v3(0, -100, 0));

        smc.account.AccountModel.role = role;
        MonsterManager.instance.createMonsterById(1,this.player,this.bullet);
        MonsterManager.instance.createMonsterById(1,this.player,this.bullet);
        


    }
    update(deltaTime: number) {

        if (smc.account.AccountModel.role.RoleView) {
            this.body.setPosition(new Vec3(-smc.account.AccountModel.role.RoleView.node.getPosition().x, -smc.account.AccountModel.role.RoleView.node.getPosition().y - 300, 0));
        }

    }
    protected onDestroy(): void {
        
    }

    onAttack(): void {
        smc.account.AccountModel.role.attack();
    }
    onToRoom(): void {

        oops.gui.open(UIID.Room);


        oops.gui.remove(UIID.Game);
    }
}


