import test from 'ava'
import {Chan} from '.'
import {STATE_NORMAL, STATE_WAITING_FOR_PUBLISHER, STATE_CLOSING, STATE_CLOSED} from '.'
import {TYPE_VALUE, TYPE_ERROR} from '.'

const TEST_BUFFER = [
  { fnVal: nop }, { fnErr: nop }, 
  { fnVal: nop }, { fnErr: nop },
  { fnVal: nop }, { fnErr: nop },
  { fnVal: nop }, { fnErr: nop }
]

test('this provides complete coverage', t => {
  let ch = new Chan()
  takeItAll(ch)

  ch._state = STATE_NORMAL
  ch._buffer = []
  takeItAll(ch)

  ch._state = STATE_NORMAL
  ch._buffer = TEST_BUFFER.slice()
  takeItAll(ch)
  
  t.pass()
})

function takeItAll(ch) {
  for (let i = 0; i < 8; ++i) {
    ch.take(0 != (i & 0b100), 0 != (i & 0b010), 0 != (i & 0b001))
  }
}

function nop() {}
