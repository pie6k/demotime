import {
  action,
  computed,
  IObservableArray,
  makeObservable,
  observable,
} from 'mobx';
import { Model } from '../model';
import { createChannel } from '../utils/channel';

interface CollectionConfig<I extends Model> {
  orderBy?: (item: I) => number;
}

export class Collection<I extends Model> {
  private config?: CollectionConfig<I>;

  onItemAdded = createChannel<I>();
  onItemRemoved = createChannel<I>();
  onItemsChange = createChannel<I[]>();

  constructor(config?: CollectionConfig<I>, initialItems?: I[]) {
    this.config = config;

    if (initialItems) {
      for (const initialItem of initialItems) {
        this.rawList.push(initialItem);
        this.idLookupMap.set(initialItem.id, initialItem);
      }
    }

    makeObservable(this);
  }

  @observable
  private rawList = ([] as any) as IObservableArray<I>;

  @observable
  private idLookupMap = new Map<string, I>();

  @action
  public add(item: I) {
    if (this.rawList.includes(item)) {
      return;
    }

    this.rawList.push(item);
    this.idLookupMap.set(item.id, item);

    this.onItemAdded.publish(item);

    this.onItemsChange.publish(this.items);
  }

  @action
  public remove(item: I) {
    if (!this.rawList.includes(item)) {
      return;
    }

    this.rawList.remove(item);
    this.idLookupMap.delete(item.id);

    this.onItemRemoved.publish(item);
    this.onItemsChange.publish(this.items);
  }

  @action
  public replaceOne(currentItem: I, newItem: I) {
    this.remove(currentItem);
    this.add(newItem);
  }

  @action
  public replaceAll(items: I[]) {
    // TODO Publish to channels
    this.rawList.replace(items);
    this.idLookupMap.clear();

    for (const item of items) {
      this.idLookupMap.set(item.id, item);
    }
  }

  @computed
  get size() {
    return this.rawList.length;
  }

  @computed
  get itemIds() {
    return this.rawList.map(item => item.id);
  }

  @computed
  get items(): I[] {
    return this.rawList;
  }
}
