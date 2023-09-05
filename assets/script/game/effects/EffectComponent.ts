import { _decorator, Component, Node, Vec3 } from 'cc';
import { oops } from '../../../../extensions/oops-plugin-framework/assets/core/Oops';
import { EffectEvent } from '../../../../extensions/oops-plugin-framework/assets/libs/animator-effect/EffectEvent';
const { ccclass, property } = _decorator;

@ccclass('EffectComponent')
export class EffectComponent extends Component {
    start() {

    }

    private maxDuration: number = 0.2;

    public setData(move_direction:number):void{


        this.node.eulerAngles =new Vec3(0,0,move_direction);
        this.scheduleOnce(this.onRecovery.bind(this), this.maxDuration);
    }
    private onRecovery() {
        this.unscheduleAllCallbacks();
       
        if (this.node.parent) oops.message.dispatchEvent(EffectEvent.Put, this.node);
    }
}


