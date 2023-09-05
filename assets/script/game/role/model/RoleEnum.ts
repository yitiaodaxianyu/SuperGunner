/*
 * @Author: dgflash
 * @Date: 2022-01-26 14:14:34
 * @LastEditors: dgflash
 * @LastEditTime: 2022-01-27 15:49:36
 */

/** 角色属性类型 */
export enum RoleAttributeType {
    /** 力量 */
    power = "power",
    /** 体质 */
    physical = "physical",
    /** 敏捷 */
    agile = "agile",
    /** 生命最大值 */
    hp = "hp"
}

/** 角色动作名 */
export enum RoleAnimatorType {
    /** 待机 */
    Idle = "Idle",
    /** 攻击 */
    Attack = "Attack",
    /** 受击 */
    Hurt = "Hurt",
    /** 死亡 */
    Dead = "Dead",
    /** 移动 */
    Walk = "Walk",
    /** 停止移动移动 */
    StopWalk = "StopWalk"
}

