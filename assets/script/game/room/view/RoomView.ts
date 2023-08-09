import { _decorator, Component, Node } from 'cc';
import { oops } from '../../../../../extensions/oops-plugin-framework/assets/core/Oops';
import { UIID } from '../../common/config/GameUIConfig';
const { ccclass, property } = _decorator;

@ccclass('RoomView')
export class RoomView extends Component {
    start() {

    }

    update(deltaTime: number) {
        
    }
    onToGame():void{
  
         oops.gui.open(UIID.Game);


         oops.gui.remove(UIID.Room);
    }
}


