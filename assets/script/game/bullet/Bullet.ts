import { _decorator, Collider2D, Component, Contact2DType, IPhysics2DContact, log, Node, RigidBody2D, v3, Vec2, Vec3 } from 'cc';
import { oops } from '../../../../extensions/oops-plugin-framework/assets/core/Oops';
import { EffectEvent } from '../../../../extensions/oops-plugin-framework/assets/libs/animator-effect/EffectEvent';
import { ColliderTag } from '../game/view/GameEnum';
import { MoveTo } from '../../../../extensions/oops-plugin-framework/assets/libs/animator-move/MoveTo';
import { Vec3Util } from '../../../../extensions/oops-plugin-framework/assets/core/utils/Vec3Util';
const { ccclass, property } = _decorator;

@ccclass('Bullet')
export class Bullet extends Component {


    move_speed: number = 0;//移速
    move_direction: number = 0;//角度

    rigidbody2d: RigidBody2D;//刚体



    private maxDuration: number = 2;



    start() {
        this.rigidbody2d = this.getComponent(RigidBody2D);

        let collider = this.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);



        }
    }
    public setData(move_speed: number, move_direction: number): void {
        this.node.eulerAngles = new Vec3(0, 0, move_direction);
        this.move_speed = move_speed;
        this.move_direction = move_direction;
        this.scheduleOnce(this.onRecovery.bind(this), this.maxDuration);
        
     

    }
    protected onDestroy(): void {
        let collider = this.getComponent(Collider2D);
        if (collider) {
            collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }
    update(deltaTime: number) {

        let xx = this.move_speed * deltaTime * Math.cos(this.move_direction * Math.PI / 180);
        let yy = this.move_speed * deltaTime * Math.sin(this.move_direction * Math.PI / 180);

        this.node.position = new Vec3(this.node.position.x + xx, this.node.position.y + yy, 0);



    }
    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        // 只在两个碰撞体开始接触时被调用一次
        if (otherCollider.tag == ColliderTag.Monster) {
            this.node.active = false;
            this.unscheduleAllCallbacks();

            this.scheduleOnce(this.onRecovery.bind(this), 0.5);//极速回收会导致碰撞检测有问题，延迟回收
        }

    }


    private onRecovery() {
        this.unscheduleAllCallbacks();

        if (this.node.parent) oops.message.dispatchEvent(EffectEvent.Put, this.node);
    }
}


