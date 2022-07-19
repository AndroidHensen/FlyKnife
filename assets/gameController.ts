
import { _decorator, Component, Node, Prefab, tween, Vec3, systemEvent, SystemEvent, instantiate, MotionStreakAssemblerManager, UITransform, Size, size, view } from 'cc';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = GameController
 * DateTime = Mon Jul 18 2022 19:57:44 GMT+0800 (中国标准时间)
 * Author = 我爱喜洋洋
 * FileBasename = gameController.ts
 * FileBasenameNoExtension = gameController
 * URL = db://assets/gameController.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/zh/
 *
 */

@ccclass('GameController')
export class GameController extends Component {

    @property(Prefab)
    knife: Prefab = null

    @property(Node)
    knifeRootNode: Node = null

    @property(Node)
    knifeNode: Node = null

    @property(Node)
    targetNode: Node = null

    knifeNodeArray = []

    canThrow = true

    onLoad() {
        systemEvent.on(SystemEvent.EventType.TOUCH_START, this._touchStart, this)
    }

    update(deltaTime: number) {
        this.targetNode.angle = (this.targetNode.angle + 3) % 360

        this.knifeNodeArray.forEach(element => {
            element.angle = (element.angle + 3) % 360

            //半径
            let r = this.targetNode.getComponent(UITransform).width / 2
            //弧度
            let rad = Math.PI * (element.angle - 90) / 180
            //Math.cos(弧度)
            element.setPosition(this.targetNode.position.x + r * Math.cos(rad), this.targetNode.position.y + r * Math.sin(rad))
        });

    }

    onDestroy() {
        systemEvent.off(SystemEvent.EventType.TOUCH_START, this._touchStart, this)
    }

    _touchStart() {
        if (!this.canThrow) {
            return
        }

        this.canThrow = false

        tween()
            .target(this.knifeNode)
            .to(0.1, { position: new Vec3(0, 50) })
            .call(() => {
                var isHit = false
                var gap = 15

                this.knifeNodeArray.forEach(element => {
                    if (element.angle < gap || 360 - element.angle < gap) {
                        isHit = true
                    }
                });

                if (isHit) {
                    tween()
                        .target(this.knifeNode)
                        .to(0.4, { position: new Vec3(200, -view.getFrameSize().height - this.knifeNode.getComponent(UITransform).height), angle: 120 })
                        .call(() => {
                            this.knifeNode.angle = 0
                            this.knifeNode.setPosition(0, -300)
                            this.canThrow = true
                        })
                        .start()
                } else {
                    var k = instantiate(this.knife)
                    k.setPosition(this.knifeNode.position)
                    this.knifeRootNode.addChild(k)
                    this.knifeNodeArray.push(k)

                    this.knifeNode.setPosition(0, -300)
                    this.canThrow = true
                }

            })
            .start()
    }
}