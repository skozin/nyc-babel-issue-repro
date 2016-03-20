export const STATE_NORMAL = 0
export const STATE_WAITING_FOR_PUBLISHER = 1
export const STATE_CLOSING = 2
export const STATE_CLOSED = 3

export const TYPE_VALUE = 0
export const TYPE_ERROR = 1

export const CLOSED = {}
export const FAILED = {}

export class Chan {

  constructor() {
    this._state = STATE_WAITING_FOR_PUBLISHER
    this._buffer = []
  }

  take(passResolve, passReject, needsCancelFn) {
    return new Promise(resolve => {
      this._take(
        passResolve ? resolve : undefined,
        passReject ? resolve : undefined,
        needsCancelFn)
    })
  }

  _take(fnVal, fnErr, needsCancelFn) {
    if (this._state == STATE_CLOSED) {
      fnVal && fnVal(CLOSED)
      return nop
    }
 
    let prevState = this._state
    if (prevState != STATE_WAITING_FOR_PUBLISHER) {
      let item = this._takeFromWaitingPublisher()
      if (item === FAILED) {
        if (this._state == STATE_CLOSED) {
          fnVal && fnVal(CLOSED)
          return nop
        }
      } else {
        assert(item.type == TYPE_VALUE || item.type == TYPE_ERROR)
        let fn = item.type == TYPE_VALUE ? fnVal : fnErr
        item.fnVal && item.fnVal()
        fn && fn(item.value)
        if (this._state != STATE_CLOSED) {
          this._triggerWaiters(true)
        }
        return nop
      }
    }
 
    assert(this._state == STATE_WAITING_FOR_PUBLISHER)
 
    let item = { fnVal, fnErr }
    let buf = []
    buf.push(item)
 
    if (prevState == STATE_NORMAL) {
      // notify all waiters for the opportunity to publish
      this._triggerWaiters(true)
      this._emitDrain()
    }
 
    return needsCancelFn ? () => { item.fnVal = item.fnErr = undefined } : nop
  }

  _takeFromWaitingPublisher() {
    assert(this._state == STATE_NORMAL || this._state == STATE_CLOSING)

    let len = this._buffer.length
    if (len == 0) {
      this._state = STATE_WAITING_FOR_PUBLISHER
      return FAILED
    }

    let item = this._buffer.shift()
    --len

    assert(item != undefined)
    assert(item.type == TYPE_VALUE || item.type == TYPE_ERROR)

    if (item.type == TYPE_VALUE) {
      this._value = item.value
    }

    return item
  }

  _triggerWaiters() {
    return undefined
  }

  _emitDrain() {
    return undefined
  }
}

function assert() {
  return undefined
}

function nop() {
  return undefined
}
