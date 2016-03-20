export const STATE_NORMAL = 0
export const STATE_WAITING_FOR_PUBLISHER = 1
export const STATE_CLOSING = 2
export const STATE_CLOSED = 3

export const TYPE_VALUE = 0
export const TYPE_ERROR = 1

export const CLOSED = {}
export const FAILED = {}

export let chan = {
  _state: STATE_WAITING_FOR_PUBLISHER,
  _buffer: [],
  take, _take, _takeFromWaitingPublisher, _triggerWaiters, _emitDrain
}

function take(passResolve, passReject, needsCancelFn) {
  return new Promise(resolve => {
    chan._take(
      passResolve ? resolve : undefined,
      passReject ? resolve : undefined,
      needsCancelFn)
  })
}

function _take(fnVal, fnErr, needsCancelFn) {
  if (chan._state == STATE_CLOSED) {
    fnVal && fnVal(CLOSED)
    return nop
  }

  let prevState = chan._state
  if (prevState != STATE_WAITING_FOR_PUBLISHER) {
    let item = chan._takeFromWaitingPublisher()
    if (item === FAILED) {
      if (chan._state == STATE_CLOSED) {
        fnVal && fnVal(CLOSED)
        return nop
      }
    } else {
      assert(item.type == TYPE_VALUE || item.type == TYPE_ERROR)
      let fn = item.type == TYPE_VALUE ? fnVal : fnErr
      item.fnVal && item.fnVal()
      fn && fn(item.value)
      if (chan._state != STATE_CLOSED) {
        chan._triggerWaiters(true)
      }
      return nop
    }
  }

  assert(chan._state == STATE_WAITING_FOR_PUBLISHER)

  let item = { fnVal, fnErr }
  let buf = []
  buf.push(item)

  if (prevState == STATE_NORMAL) {
    // notify all waiters for the opportunity to publish
    chan._triggerWaiters(true)
    chan._emitDrain() // TODO: probably not needed here
  }

  return needsCancelFn ? () => { item.fnVal = item.fnErr = undefined } : nop
}

function _takeFromWaitingPublisher() {
  assert(chan._state == STATE_NORMAL || chan._state == STATE_CLOSING)

  let len = chan._buffer.length
  if (len == 0) {
    chan._state = STATE_WAITING_FOR_PUBLISHER
    return FAILED
  }

  let item = chan._buffer.shift()
  --len

  assert(item != undefined)
  assert(item.type == TYPE_VALUE || item.type == TYPE_ERROR)

  if (item.type == TYPE_VALUE) {
    chan._value = item.value
  }

  return item
}

function _triggerWaiters() {
  return undefined
}

function _emitDrain() {
  return undefined
}

function assert() {
  return undefined
}

function nop() {
  return undefined
}
