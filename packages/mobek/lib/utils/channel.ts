type Subscriber<T> = (value: T) => void;
type Cancel = () => void;
export type ChannelSubscribeFunction<T> = (subscriber: Subscriber<T>) => Cancel;

export interface Channel<T> {
  subscribe(subscriber: Subscriber<T>): Cancel;
  publish(value: T): void;
}

export function createChannel<T>(): Channel<T> {
  const subscribers = new Set<Subscriber<T>>();

  function subscribe(subscriber: Subscriber<T>) {
    subscribers.add(subscriber);
    return function stop() {
      subscribers.delete(subscriber);
    };
  }

  function publish(value: T) {
    Array.from(subscribers).forEach(subscriber => {
      subscriber(value);
    });
  }

  return {
    subscribe,
    publish,
  };
}
