/*
 * @Author: dgflash
 * @Date: 2021-07-03 16:13:17
 * @LastEditors: dgflash
 * @LastEditTime: 2022-08-05 18:25:56
 */
import { profiler, _decorator } from 'cc';
import { DEBUG } from 'cc/env';
import { oops } from '../../extensions/oops-plugin-framework/assets/core/Oops';
import { Root } from '../../extensions/oops-plugin-framework/assets/core/Root';
import { ecs } from '../../extensions/oops-plugin-framework/assets/libs/ecs/ECS';
import { UIConfigData } from './game/common/config/GameUIConfig';

import { EcsInitializeSystem, Initialize } from './game/initialize/Initialize';
import { EcsAccountSystem } from './game/account/Account';
import { smc } from './game/common/ecs/SingletonModuleComp';

const { ccclass, property } = _decorator;

@ccclass('Main')
export class Main extends Root {
    start() {
        if (DEBUG) profiler.showStats();
    }

    protected run() {
        smc.initialize = ecs.getEntity<Initialize>(Initialize);
    }

    protected initGui() {
        oops.gui.init(UIConfigData);
    }

    protected initEcsSystem() {
        oops.ecs.add(new EcsInitializeSystem());
        oops.ecs.add(new EcsAccountSystem());
    }
}
