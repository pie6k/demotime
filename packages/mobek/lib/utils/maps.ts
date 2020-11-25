export function mapGetOrCreate<K, V>(
  map: Map<K, V>,
  key: K,
  creator: () => V,
): V {
  if (map.has(key)) {
    return map.get(key)!;
  }

  const newValue = creator();
  map.set(key, newValue);

  return newValue;
}
