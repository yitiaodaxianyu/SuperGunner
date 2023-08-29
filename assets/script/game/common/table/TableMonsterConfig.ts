
import { JsonUtil } from "../../../../../extensions/oops-plugin-framework/assets/core/utils/JsonUtil";

export class TableMonsterConfig {
    static TableName: string = "MonsterConfig";

    private data: any;

    init(id: number) {
        var table = JsonUtil.get(TableMonsterConfig.TableName);
        this.data = table[id];
        this.id = id;
    }

    /** 编号【KEY】 */
    id: number = 0;

    /** 怪物名称 */
    get monsterName(): string {
        return this.data.monsterName;
    }
    /** 技能个数 */
    get weaponType(): any {
        return this.data.weaponType;
    }
    /** 等级 */
    get grade(): number {
        return this.data.grade;
    }
    /** 血量 */
    get health(): number {
        return this.data.health;
    }
    /** 防御 */
    get defense(): number {
        return this.data.defense;
    }
    /** 攻击 */
    get attack(): number {
        return this.data.attack;
    }
    /** 移动速度 */
    get speed(): number {
        return this.data.speed;
    }
    /** 攻击距离 */
    get attackDistance(): number {
        return this.data.attackDistance;
    }
    /** 攻击速度 */
    get attackSpeed(): number {
        return this.data.attackSpeed;
    }
    /** 命中 */
    get hit(): number {
        return this.data.hit;
    }
    /** 闪避 */
    get miss(): number {
        return this.data.miss;
    }
    /** 暴击率 */
    get critical(): number {
        return this.data.critical;
    }
    /** 暴击增幅 */
    get extraCritical(): number {
        return this.data.extraCritical;
    }
    /** 必杀概率 */
    get zxc(): number {
        return this.data.zxc;
    }
    /** 移动方式(步行，飞天) */
    get attackMode(): number {
        return this.data.attackMode;
    }
}
    