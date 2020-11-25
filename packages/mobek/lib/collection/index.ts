import {
  action,
  computed,
  IObservableArray,
  makeObservable,
  observable,
} from 'mobx';
import { Model } from '../model';

interface CollectionConfig<I extends Model> {
  orderBy?: (item: I) => number;
}

export class Collection<I extends Model> {
  private config?: CollectionConfig<I>;
  constructor(config?: CollectionConfig<I>) {
    this.config = config;
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
  }

  @action
  public remove(item: I) {
    if (!this.rawList.includes(item)) {
      return;
    }

    this.rawList.remove(item);
    this.idLookupMap.delete(item.id);
  }

  @action
  public replaceOne(currentItem: I, newItem: I) {
    this.remove(currentItem);
    this.add(newItem);
  }

  @action
  public replaceAll(items: I[]) {
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
  get items(): I[] {
    return this.rawList;
  }
}
