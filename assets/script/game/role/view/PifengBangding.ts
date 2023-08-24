import { _decorator, Component, log, Node,Vec3 } from 'cc';
import { smc } from '../../common/ecs/SingletonModuleComp';
const { ccclass, property } = _decorator;

@ccclass('PifengBangding')
export class PifengBangding extends Component {
    @property({ type: Node })
    spineBody: Node = null!;

    @property({ type: Node })
    guadian: Node = null!;
    start() {

    }

    update(deltaTime: number) {
       
        this.spineBody.worldPosition=this.guadian.worldPosition;
       
     
    }
}


