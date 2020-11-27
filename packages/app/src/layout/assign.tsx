import { ComponentType, ReactNode } from 'react';

const pageLayoutSymbol = Symbol('page-layout');

export type PageLayoutComponent = ComponentType<{ children: ReactNode }>;

export function assignLayout(
  LayoutComponent: PageLayoutComponent,
  PageComponent: ComponentType<any>,
) {
  Reflect.set(PageComponent, pageLayoutSymbol, LayoutComponent);
}

export function getPageLayout(
  PageComponent: ComponentType<any>,
): PageLayoutComponent | null {
  return Reflect.get(PageComponent, pageLayoutSymbol) ?? null;
}

export function renderPageWithLayout(
  PageComponent: ComponentType<any>,
  props: any,
): ReactNode {
  const PageLayoutComponent = getPageLayout(PageComponent);

  if (!PageLayoutComponent) {
    return <PageComponent {...props} />;
  }

  return (
    <PageLayoutComponent>
      <PageComponent {...props} />
    </PageLayoutComponent>
  );
}
