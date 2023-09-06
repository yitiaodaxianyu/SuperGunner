import { _decorator, BoxCollider2D, Collider2D, Component, Contact2DType, EventTouch, instantiate, IPhysics2DContact, log, Node, PhysicsSystem2D, Prefab, RigidBody2D, v3, Vec2, Vec3 } from 'cc';
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

    //第一背景
    @property({ type: Node })
    bg0: Node = null!;

    //第二背景
    @property({ type: Node })
    bg1: Node = null!;

    //地面
    @property({ type: Node })
    wall: Node = null!;


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

        // if (PhysicsSystem2D.instance) {
        //     PhysicsSystem2D.instance.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        //     PhysicsSystem2D.instance.on(Contact2DType.END_CONTACT, this.onEndContact, this);

        // }

    }
    // onBeginContact (selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
    //     // 只在两个碰撞体开始接触时被调用一次
    //     console.log('onBeginContact'+selfCollider.tag+"  "+otherCollider.tag);
    // }
    // onEndContact (selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
    //     // 只在两个碰撞体结束接触时被调用一次
    //     console.log('onEndContact');
    // }
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



        role.bullet = this.bullet;


        // 角色动画显示对象
        role.load(this.player, v3(0, -150, 0));

        smc.account.AccountModel.role = role;
        //MonsterManager.instance.createMonsterById(1,this.player,this.bullet,v3(300, -150, 0));
        MonsterManager.instance.createMonsterById(2, this.player, this.bullet, v3(300, 200, 0));
       




    }
    update(deltaTime: number) {

        if (smc.account.AccountModel.role.RoleView) {
            this.body.setPosition(new Vec3(-smc.account.AccountModel.role.RoleView.node.getPosition().x, 0, 0));
            //log(smc.account.AccountModel.role.RoleView.node.getPosition().x);
            if (Math.abs(this.bg1.getPosition().x - smc.account.AccountModel.role.RoleView.node.getPosition().x) > 1705) {
                if (this.bg1.getPosition().x - smc.account.AccountModel.role.RoleView.node.getPosition().x > 0) {
                    this.bg1.setPosition(new Vec3(this.bg0.getPosition().x - 1705, this.bg0.getPosition().y, 0));
                } else {
                    this.bg1.setPosition(new Vec3(this.bg0.getPosition().x + 1705, this.bg0.getPosition().y, 0));
                }
            }

            if (Math.abs(this.bg0.getPosition().x - smc.account.AccountModel.role.RoleView.node.getPosition().x) > 1705) {
                if (this.bg0.getPosition().x - smc.account.AccountModel.role.RoleView.node.getPosition().x > 0) {
                    this.bg0.setPosition(new Vec3(this.bg1.getPosition().x - 1705, this.bg1.getPosition().y, 0));
                } else {
                    this.bg0.setPosition(new Vec3(this.bg1.getPosition().x + 1705, this.bg1.getPosition().y, 0));
                }
            }
           
        }

    }
    protected onDestroy(): void {

    }


    onToRoom(): void {

        oops.gui.open(UIID.Room);


        oops.gui.remove(UIID.Game);
    }
}


