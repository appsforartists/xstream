import xs from '../../src/index';

describe('xs.empty()', function() {
  it('should create a stream with 0 events that has already ended', (done) => {
    const stream = xs.empty();

    stream.addListener({
      next: () => done(new Error('This should not be called')),
      error: () => done(new Error('This should not be called')),
      end: done,
    });
  });
});
