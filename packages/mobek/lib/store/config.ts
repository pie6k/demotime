export interface StoreIdConfig {
  create(): string;
  validate(id: string): boolean;
}

export interface StoreConfig {
  id: StoreIdConfig;
}
