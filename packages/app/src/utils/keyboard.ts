import isHotkey from 'is-hotkey';
import { RefObject, useEffect } from 'react';
import { useMethod } from '~/hooks/callback/useMethod';

// prettier-ignore
type ShortcutKey =  '⇧'  | 'shift' | 'mod'  | 'option'  | '⌥'  | 'alt'  | 'ctrl'  | 'control'  | 'command'  | '⌘'  | 'A'  | 'B'  | 'C'  | 'D'  | 'E'  | 'F'  | 'G'  | 'H'  | 'I'  | 'J'  | 'K'  | 'L'  | 'M'  | 'N'  | 'O'  | 'P'  | 'Q'  | 'R'  | 'S'  | 'T'  | 'U'  | 'V'  | 'W'  | 'X'  | 'Y'  | 'Z'  | '1'  | '2'  | '3'  | '4'  | '5'  | '6'  | '7'  | '8'  | '9'  | 'f1'  | 'f2'  | 'f3'  | 'f4'  | 'f5'  | 'f6'  | 'f7'  | 'f8'  | 'f9'  | 'f10'  | 'f11'  | 'f12'  | '['  | ']'  | ';'  | "'"  | '\\'  | ''  | '.'  | '/'  | '-'  | '='  | '`'  | 'backspace'  | 'tab'  | 'clear'  | 'enter'  | 'return'  | 'esc'  | 'escape'  | 'space'  | 'up'  | 'down'  | 'left'  | 'right'  | 'home'  | 'end'  | 'pageup'  | 'pagedown'  | 'del'  | 'delete'  | '+';

type ShortcutDefinition = ShortcutKey | ShortcutKey[];

/**
 * Will convert
 * ['cmd', 'f'] => 'cmd+f'
 * 'cmd' => 'cmd'
 */
function parseShortcutDefinition(definition: ShortcutDefinition): string {
  if (typeof definition === 'string') {
    return definition;
  }

  return definition.join('+');
}

interface ShortcutHandlingConfig {
  /** Whether shortcuts are active while input elements are focused. */
  allowInputFocus?: boolean;
  /** Allows attaching shortcut event handler to specific element ref. */
  elementRef?: RefObject<HTMLElement | null | undefined>;
}

type KeyboardEventHandler = (event: KeyboardEvent) => void;

export function useShortcut(
  set: ShortcutDefinition,
  handler?: KeyboardEventHandler,
  config?: ShortcutHandlingConfig,
): void {
  const parsedShortcutDefinition = parseShortcutDefinition(set);

  useShortcuts({ [parsedShortcutDefinition]: handler }, config);
}

type ShortcutsMap = {
  [key in ShortcutKey]?: KeyboardEventHandler;
} &
  { [key in string]?: KeyboardEventHandler };

export function useShortcuts(
  map: ShortcutsMap,
  config?: ShortcutHandlingConfig,
): void {
  const handleEvent = useMethod((event: KeyboardEvent) => {
    const matchingShortcut = Object.keys(map).find(shortcut => {
      const isMatching = isHotkey(shortcut, event);

      return isMatching;
    });

    if (!matchingShortcut) {
      return;
    }

    map[matchingShortcut]?.(event);
  });

  useEffect(() => {
    const targetElement = config?.elementRef?.current ?? window.document.body;

    targetElement.addEventListener('keydown', handleEvent);

    return function (): void {
      targetElement.removeEventListener('keydown', handleEvent);
    };
  }, [map, config?.elementRef]);
}

export function getShortcutHintChar(key: ShortcutKey): string {
  return mapString(key, {
    command: '⌘',
    option: '⌥',
    alt: '⌥',
    enter: '↩︎',
    return: '↩︎',
    shift: '⇧',
    control: '⌃',
    backspace: '⌫',
    up: '↑',
    down: '↓',
    left: '←',
    right: '→',
    del: '⌦',
    delete: '⌦',
    tab: '⇥',
    escape: 'esc',
  });
}

type StringMappingMap<S extends string> = {
  [key in S]?: string;
};

function mapString<S extends string>(
  input: S,
  mappingMap: StringMappingMap<S>,
): string {
  if (mappingMap[input]) {
    return mappingMap[input]!;
  }

  return input;
}
