import { advanceBy, advanceTo, clear } from 'jest-date-mock';

const DEFAULT_ALPHABET =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

function getRandomCharFromAlphabet(alphabet: string): string {
  return alphabet.charAt(Math.floor(Math.random() * alphabet.length));
}

function generateId(
  idDesiredLength: number,
  alphabet = DEFAULT_ALPHABET,
): string {
  /**
   * Create n-long array and map it to random chars from given alphabet.
   * Then join individual chars as string
   */
  return Array.from({ length: idDesiredLength })
    .map(() => {
      return getRandomCharFromAlphabet(alphabet);
    })
    .join('');
}

let idCount = 0;

afterEach(() => {
  idCount = 0;
});

export function generateTestId() {
  return `${++idCount}`;
}

const TESTS_DATE = new Date(2020, 0, 0);

export function mockDate(initialDate = TESTS_DATE) {
  advanceTo(initialDate);
  function forward(ms: number) {
    advanceBy(ms);
  }

  function restore() {
    clear();
  }

  return { forward, restore };
}

afterEach(() => {
  clear();
});
