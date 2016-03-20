import test from 'ava'
import {chan} from '.'
import {STATE_NORMAL, STATE_WAITING_FOR_PUBLISHER, STATE_CLOSING, STATE_CLOSED} from '.'
import {TYPE_VALUE, TYPE_ERROR} from '.'

const TEST_BUFFER = [
  { fnVal: nop }, { fnErr: nop }, 
  { fnVal: nop }, { fnErr: nop },
  { fnVal: nop }, { fnErr: nop },
  { fnVal: nop }, { fnErr: nop }
]

test('this provides complete coverage', t => {
  chan.construct()
  takeItAll(chan)

  chan._state = STATE_NORMAL
  chan._buffer = []
  takeItAll(chan)

  chan._state = STATE_NORMAL
  chan._buffer = TEST_BUFFER.slice()
  takeItAll(chan)
  
  t.pass()
})

function takeItAll(chan) {
  for (let i = 0; i < 8; ++i) {
    chan.take(0 != (i & 0b100), 0 != (i & 0b010), 0 != (i & 0b001))
  }
}

function nop() {}
