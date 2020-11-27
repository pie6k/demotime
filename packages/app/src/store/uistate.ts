import { makeObservable, observable } from 'mobx';
import { RefObject } from 'react';
import { Issue } from './models';

class UIStateStore {
  constructor() {
    makeObservable(this);
  }

  @observable.ref
  pickerOwner: RefObject<HTMLElement> | null = null;
}

export const uiStateStore = new UIStateStore();
