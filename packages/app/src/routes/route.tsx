import isEqual from 'lodash/isEqual';
import Router, { useRouter, NextRouter } from 'next/router';
import Link, { LinkProps } from 'next/link';
import { forwardRef, ReactNode } from 'react';

export interface Route<Args> {
  endpoint: string;
  useParams(): Args;
  useIsActive(args?: Args): boolean;
  open(args: Args): void;
  prefetch(args: Args): Promise<void>;
}

const BASE_PATH_REGEXP = /\[(\w+)\]/g;

function prepareLink<Args>(endpoint: string, params?: Args) {
  if (!params) {
    return endpoint;
  }

  const preparedLink = endpoint.replace(
    BASE_PATH_REGEXP,
    (match, matchedParamName: keyof Args) => {
      const paramValue = params[matchedParamName];

      if (paramValue === undefined) {
        throw new Error(
          `Missing param [${matchedParamName}] in link ${endpoint}`,
        );
      }

      return `${paramValue}`;
    },
  );

  if (preparedLink.match(BASE_PATH_REGEXP)) {
    console.warn(
      `Prepared link (${preparedLink}) might be not properly parsed`,
    );
  }

  return preparedLink;
}

interface RouteConfig<Args> {
  onPrefetch?: (args: Args) => void;
}

export function createRoute<Args = {}>(
  endpoint: string,
  config?: RouteConfig<Args>,
): Route<Args> {
  const requiredParamNames = pickRouteParamsFromRoute(endpoint);

  function handleOpen(router: NextRouter, args: Args) {
    const fullPath = prepareLink(endpoint, args);

    router.push(endpoint, fullPath);
  }

  function tryToGetParamsFromBrowser() {
    if (typeof window === 'undefined') {
      return null;
    }

    const path = window.location.pathname;

    const params: string[] = [];
    const endpointMatcher = endpoint
      .replace(/\[([a-z]+)\]/gi, (match, paramName) => {
        params.push(paramName);

        return '([a-z]+)';
      })
      .replace(/\//g, '\\/');

    const endpointRegexp = new RegExp(endpointMatcher, 'ig');

    const result = endpointRegexp.exec(path);

    if (!result) {
      return null;
    }

    const [, ...matchingParts] = result;

    const paramsFromPath: Record<string, string> = {};

    matchingParts.forEach((value, index) => {
      const paramName = params[index];

      paramsFromPath[paramName] = value;
    });

    return (paramsFromPath as any) as Args;
  }

  function useParams() {
    const router = useRouter();

    if (router.route !== endpoint) {
      throw new Error(`Used wrong route ${endpoint} vs ${router.route}`);
    }

    const params = (router.query as any) as Args;

    if (Object.keys(params).length > 0) {
      return params;
    }

    if (requiredParamNames.length > 0) {
      const argsFromBrowser = tryToGetParamsFromBrowser();

      if (argsFromBrowser) {
        return argsFromBrowser;
      }
    }

    return params;
  }

  async function prefetch(args: Args) {
    const fullPath = prepareLink(endpoint, args);
    config?.onPrefetch?.(args);

    await Router.prefetch(endpoint, fullPath);
  }

  function open(args: Args) {
    handleOpen(Router, args);
  }

  function useIsActive(args: Args) {
    const router = useRouter();

    function getIsActive() {
      if (router.route !== endpoint) {
        return false;
      }

      const params = (router.query as any) as Args;

      if (Object.keys(params).length === 0) {
        return true;
      }

      return isEqual(params, args);
    }

    return getIsActive();
  }

  return {
    useIsActive,
    endpoint,
    useParams,
    open,
    prefetch,
  };
}

interface RouteLinkProps<Args> extends Pick<LinkProps, 'scroll' | 'prefetch'> {
  route: Route<Args>;
  args: Args;
  children: ReactNode;
}

export function RouteLink<Args>({
  route,
  args,
  children,
  scroll,
  prefetch,
}: RouteLinkProps<Args>) {
  const href = prepareLink(route.endpoint, args);
  return (
    <Link href={href} passHref scroll={scroll} prefetch={prefetch}>
      {children}
    </Link>
  );
}

export function pickRouteParamsFromRoute(route: string) {
  const regexp = /\[([a-zA-Z0-9]+)\]/g;

  const params: string[] = [];

  let match = regexp.exec(route);

  while (match) {
    const [_, paramName] = match;
    params.push(paramName);
    match = regexp.exec(route);
  }

  return params;
}
