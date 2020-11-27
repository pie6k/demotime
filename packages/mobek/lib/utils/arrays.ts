type Empty = null | undefined;

export function isNotEmpty<T>(item: T | Empty): item is T {
  if (item === null || item === undefined) {
    return false;
  }

  return true;
}

export function removeEmptyFromArray<T>(itemsWithEmpty: Array<T | Empty>): T[] {
  return itemsWithEmpty.filter(isNotEmpty);
}
