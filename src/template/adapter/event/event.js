/**
 * 检查节点间的关系
 */
function checkRelation(node1, node2) {
  if (node1 === node2) return true

  while (node1) {
    if (node1 === node2) return true

    node1 = node1.parentNode
  }

  return false
}

class Event {
  constructor(options) {
    this._name = options.name.toLowerCase()
    this._target = options.target
    this._timeStamp = options.timeStamp || Date.now()
    this._currentTarget = options.currentTarget || options.target
    this._eventPhase = options.eventPhase || Event.NONE
    this._detail = options.detail || null
    this._canBubble = true
    this._bubbles = options.bubbles || false
    this._touches = null
    this._targetTouches = null
    this._changedTouches = null

    // 补充字段
    const extra = options._$extra
    if (extra) {
      Object.keys(extra).forEach(key => {
        this[key] = extra[key]
      })
    }

    // 处理 touches
    if (options.touches && options.touches.length) {
      this._touches = options.touches.map(touch => {
        touch.target = options.target
        return touch
      })

      this._$checkTargetTouches()
    }

    // 处理 changedTouches
    if (options.changedTouches && options.changedTouches.length) {
      this._changedTouches = options.changedTouches.map(touch => {
        touch.target = options.target
        return touch
      })
    }
  }

  /**
   * 返回事件时否还可以冒泡
   */
  get _$canBubble() {
    return this._canBubble
  }

  /**
   * 设置 target
   */
  _$setTarget(target) {
    this._target = target
  }

  /**
   * 设置 currentTarget
   */
  _$setCurrentTarget(currentTarget) {
    this._currentTarget = currentTarget
    this._$checkTargetTouches()
  }

  /**
   * 设置事件所处阶段
   */
  _$setEventPhase(eventPhase) {
    this._eventPhase = eventPhase
  }

  /**
   * 检查 targetTouches
   */
  _$checkTargetTouches() {
    if (this._touches && this._touches.length) {
      this._targetTouches = this._touches.filter(touch => checkRelation(touch.target, this._currentTarget))
    }
  }

  /**
   * 对外属性和方法
   */
  get bubbles() {
    return this._bubbles
  }

  get cancelable() {
    // 因为不支持 preventDefault，所以永远返回 false
    return false
  }

  get target() {
    return this._target
  }

  get currentTarget() {
    return this._currentTarget
  }

  get eventPhase() {
    return this._eventPhase
  }

  get type() {
    return this._name
  }

  get timeStamp() {
    return this._timeStamp
  }

  get touches() {
    return this._touches
  }

  get targetTouches() {
    return this._targetTouches
  }

  get changedTouches() {
    return this._changedTouches
  }

  get detail() {
    return this._detail
  }

  preventDefault() {
    // 目前无法支持
  }

  stopPropagation() {
    if (this.eventPhase === Event.NONE) return

    this._canBubble = false
  }

  initEvent(name = '', bubbles) {
    if (typeof name !== 'string') return

    this._name = name.toLowerCase()
    this._bubbles = bubbles === undefined ? this._bubbles : !!bubbles
  }
}

// 静态属性
Event.NONE = 0
Event.CAPTURING_PHASE = 1
Event.AT_TARGET = 2
Event.BUBBLING_PHASE = 3

module.exports = Event
