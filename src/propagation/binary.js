'use strict'

const SpanContext = require('../span_context')
const TracerState = require('./state.proto.js').TracerState

class BinaryPropagator {
  inject (spanContext, carrier) {
    const err = TracerState.verify(spanContext)
    if (err) throw err

    const message = TracerState.create(spanContext)

    copy(message.baggageItems, spanContext.baggageItems, JSON.stringify)

    carrier.buffer = TracerState.encode(message).finish()
  }

  extract (carrier) {
    let state

    try {
      const message = TracerState.decode(carrier.buffer)
      state = TracerState.toObject(message)

      copy(state.baggageItems, state.baggageItems, JSON.parse)

      return new SpanContext(state)
    } catch (e) {
      return null
    }
  }
}

function copy (dest, src, customizer) {
  Object.keys(src).forEach(key => {
    dest[key] = customizer(src[key])
  })
}

module.exports = BinaryPropagator
