import { _decorator, Component, log, Node, RigidBody2D, Vec2, Vec3 } from 'cc';
import { oops } from '../../../../extensions/oops-plugin-framework/assets/core/Oops';
import { EffectEvent } from '../../../../extensions/oops-plugin-framework/assets/libs/animator-effect/EffectEvent';
const { ccclass, property } = _decorator;

@ccclass('Bullet')
export class Bullet extends Component {


    move_speed:number=0;//移速
    move_direction:number=0;//角度

    rigidbody2d:RigidBody2D;//刚体
    
    isInit:boolean=false;

    private maxDuration: number = 2;
    
    start() {
        this.rigidbody2d=this.getComponent(RigidBody2D);
        this.isInit=true;
        this.rigidbody2d.linearVelocity=new Vec2(Math.cos(this.move_direction* Math.PI / 180)*this.move_speed,Math.sin(this.move_direction* Math.PI / 180)*this.move_speed );
    }
    public setData(move_speed:number,move_direction:number):void{
        this.node.eulerAngles =new Vec3(0,0,move_direction);
        this.move_speed=move_speed;
        this.move_direction=move_direction;
       
        if(this.isInit){
            this.rigidbody2d.linearVelocity=new Vec2(Math.cos(this.move_direction* Math.PI / 180)*this.move_speed,Math.sin(this.move_direction* Math.PI / 180)*this.move_speed );
        }
        this.scheduleOnce(this.onRecovery.bind(this), this.maxDuration);
    }

    update(deltaTime: number) {
        
    }
    private onRecovery() {
        if (this.node.parent) oops.message.dispatchEvent(EffectEvent.Put, this.node);
    }
}


