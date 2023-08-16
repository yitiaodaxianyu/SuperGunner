/*
 * @Author: dgflash
 * @Date: 2021-11-18 17:42:59
 * @LastEditors: dgflash
 * @LastEditTime: 2022-06-14 17:57:33
 */

import { Component, EventTouch, Node, UITransform, v3, _decorator } from "cc";
import { oops } from "../../../../../extensions/oops-plugin-framework/assets/core/Oops";
import { Monster } from "../Monster";


const { ccclass, property } = _decorator;

/** 角色资源加载 */
@ccclass('MonsterViewController')
export class MonsterViewController extends Component {
    /** 角色对象 */
    monster: Monster = null!;

    onLoad() {
       
    }

  

    onDestroy() {
       
    }
}