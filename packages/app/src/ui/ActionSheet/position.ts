export type Position = 'above' | 'below' | 'left' | 'right';

export function getOptimalPositionSideForActionSheet(
  hostRect: DOMRect,
  actionSheetRect: DOMRect,
  hostMargin = 15,
  windowMargin = 20,
  positionsPriority?: Position[],
): Position {
  const possiblePositions: Position[] = [];
  const totalMargin = hostMargin + windowMargin;

  const targetXCenter = hostRect.x + hostRect.width / 2;
  const targetYCenter = hostRect.y + hostRect.height / 2;

  const viewPortWidth = document.documentElement.clientWidth;
  const viewPortHeight = document.documentElement.clientHeight;

  const { width: requiredWidth, height: requiredHeight } = actionSheetRect;

  if (hostRect.y > requiredHeight + totalMargin) {
    const tooltipXStart =
      targetXCenter - actionSheetRect.width / 2 - windowMargin;
    const tooltipXEnd =
      targetXCenter + actionSheetRect.width / 2 + windowMargin;

    if (tooltipXStart > 0 && tooltipXEnd < viewPortWidth) {
      possiblePositions.push('above');
    }
  }

  const { innerHeight: windowHeight, innerWidth: windowWidth } = window;

  const distanceToBottom = windowHeight - (hostRect.y + hostRect.height);

  if (distanceToBottom > requiredHeight + totalMargin) {
    const tooltipXStart =
      targetXCenter - actionSheetRect.width / 2 - windowMargin;
    const tooltipXEnd =
      targetXCenter + actionSheetRect.width / 2 + windowMargin;
    if (tooltipXStart > 0 && tooltipXEnd < viewPortWidth) {
      possiblePositions.push('below');
    }
  }

  const distanceToRight = windowWidth - (hostRect.x + hostRect.width);
  const distanceToLeft = hostRect.x;

  if (distanceToLeft > requiredWidth + totalMargin) {
    const tooltipYStart =
      targetYCenter - actionSheetRect.height / 2 - windowMargin;
    const tooltipYEnd =
      targetYCenter + actionSheetRect.height / 2 + windowMargin;

    if (tooltipYStart > 0 && tooltipYEnd < viewPortHeight) {
      possiblePositions.push('left');
    }
  }

  if (distanceToRight > requiredWidth + totalMargin) {
    const tooltipYStart =
      targetYCenter - actionSheetRect.height / 2 - windowMargin;
    const tooltipYEnd =
      targetYCenter + actionSheetRect.height / 2 + windowMargin;

    if (tooltipYStart > 0 && tooltipYEnd < viewPortHeight) {
      possiblePositions.push('right');
    }
  }

  if (possiblePositions.length === 0) {
    return positionsPriority?.[0] ?? 'above';
  }

  if (!positionsPriority) {
    return possiblePositions[0]!;
  }

  for (const preferredPosition of positionsPriority) {
    if (possiblePositions.includes(preferredPosition)) {
      return preferredPosition;
    }
  }

  return possiblePositions[0]!;
}

export interface PositionPoint {
  x: number;
  y: number;
}

export function getActionSheetPosition(
  hostElement: HTMLElement,
  actionSheetElement: HTMLDivElement,
  hostMargin = 15,
  windowMargin = 20,
  positionsPriority?: Position[],
): PositionPoint {
  const targetRect = hostElement.getBoundingClientRect();
  const tooltipRect = actionSheetElement.getBoundingClientRect();

  const optimalPosition = getOptimalPositionSideForActionSheet(
    targetRect,
    tooltipRect,
    hostMargin,
    windowMargin,
    positionsPriority,
  );

  const targetXCenter = targetRect.x + targetRect.width / 2;
  const targetYCenter = targetRect.y + targetRect.height / 2;

  const { height: tooltipHeight, width: tooltipWidth } = tooltipRect;

  if (optimalPosition === 'above') {
    return {
      x: targetXCenter - tooltipWidth / 2,
      y: targetRect.y - tooltipHeight - hostMargin,
    };
  }

  if (optimalPosition === 'below') {
    return {
      x: targetXCenter - tooltipWidth / 2,
      y: targetRect.y + targetRect.height + hostMargin,
    };
  }

  if (optimalPosition === 'left') {
    return {
      x: targetRect.x - tooltipWidth - hostMargin,
      y: targetYCenter - tooltipHeight / 2,
    };
  }

  // right
  return {
    x: targetRect.x + targetRect.width + hostMargin,
    y: targetYCenter - tooltipHeight / 2,
  };
}
