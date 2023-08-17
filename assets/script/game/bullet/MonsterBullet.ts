import { _decorator, Collider2D, Component, Contact2DType, IPhysics2DContact, Node } from 'cc';
import { oops } from '../../../../extensions/oops-plugin-framework/assets/core/Oops';
import { EffectEvent } from '../../../../extensions/oops-plugin-framework/assets/libs/animator-effect/EffectEvent';
import { ColliderTag } from '../game/view/GameEnum';
const { ccclass, property } = _decorator;

@ccclass('MonsterBullet')
export class MonsterBullet extends Component {
    private maxDuration: number = 5;
    start() {
        this.scheduleOnce(this.onRecovery.bind(this), this.maxDuration);
        let collider = this.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
           
            

        }
    }
    public setData():void{
      
    }
    onBeginContact (selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        // 只在两个碰撞体开始接触时被调用一次
        if(otherCollider.tag==ColliderTag.Role||otherCollider.tag==ColliderTag.Wall){
            this.node.active=false;
            this.unscheduleAllCallbacks();
            
            this.scheduleOnce(this.onRecovery.bind(this), 0.5);//极速回收会导致碰撞检测有问题，延迟回收
        }
      
    }
    protected onDestroy(): void {
        let collider = this.getComponent(Collider2D);
        if (collider) {
            collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            
           
            

        }
    }
    update(deltaTime: number) {
        
    }
    private onRecovery() {
        this.unscheduleAllCallbacks();
       
        if (this.node.parent) oops.message.dispatchEvent(EffectEvent.Put, this.node);
    }
}


