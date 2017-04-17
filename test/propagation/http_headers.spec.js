'use strict'

describe('HTTP Headers Propagator', () => {
  let HttpHeadersPropagator

  beforeEach(() => {
    HttpHeadersPropagator = require('../../src/propagation/http_headers')
  })

  it('should inject the span context into the carrier', () => {
    const carrier = {}
    const spanContext = {
      traceId: '123',
      spanId: '456',
      sampled: true,
      baggage: {
        foo: 'bar'
      }
    }

    const propagator = new HttpHeadersPropagator()
    propagator.inject(spanContext, carrier)

    expect(carrier).to.deep.equal({
      'dd-tracer-traceid': '123',
      'dd-tracer-spanid': '456',
      'dd-tracer-sampled': 'true',
      'dd-baggage-foo': 'bar'
    })
  })

  it('should extract a span context from the carrier', () => {
    const carrier = {
      'dd-tracer-traceid': '123',
      'dd-tracer-spanid': '456',
      'dd-tracer-sampled': 'true',
      'dd-baggage-foo': 'bar'
    }

    const propagator = new HttpHeadersPropagator()
    const spanContext = propagator.extract(carrier)

    expect(spanContext).to.deep.equal({
      traceId: '123',
      spanId: '456',
      sampled: true,
      baggage: {
        foo: 'bar'
      }
    })
  })
})