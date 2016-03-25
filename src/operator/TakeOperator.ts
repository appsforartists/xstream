import {Observer} from '../Observer';
import {Operator} from '../Operator';
import {Stream} from '../Stream';
import {emptyObserver} from '../utils/emptyObserver';

export class Proxy<T> implements Observer<T> {
  constructor(public out: Stream<T>,
              public prod: TakeOperator<T>) {
  }

  next(t: T) {
    const {prod, out} = this;
    if (prod.taken++ < prod.max - 1) {
      out.next(t);
    } else {
      out.next(t);
      out.end();
      prod.stop();
    }
  }

  error(err: any) {
    this.out.error(err);
  }

  end() {
    this.out.end();
  }
}

export class TakeOperator<T> implements Operator<T, T> {
  public proxy: Observer<T> = emptyObserver;
  public taken: number = 0;

  constructor(public max: number,
              public ins: Stream<T>) {
  }

  start(out: Stream<T>): void {
    this.ins.addListener(this.proxy = new Proxy(out, this));
  }

  stop(): void {
    this.ins.removeListener(this.proxy);
  }
}
