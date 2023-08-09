import { _decorator, Component, Node } from 'cc';
import { oops } from '../../../../../extensions/oops-plugin-framework/assets/core/Oops';
import { UIID } from '../../common/config/GameUIConfig';
import { GameEvent } from '../../common/config/GameEvent';
const { ccclass, property } = _decorator;

@ccclass('GameView')
export class GameView extends Component {
    start() {
        oops.message.dispatchEvent(GameEvent.GameServerConnected)
    }

    update(deltaTime: number) {
        
    }
    onToRoom():void{
  
        oops.gui.open(UIID.Room);


        oops.gui.remove(UIID.Game);
   }
}


