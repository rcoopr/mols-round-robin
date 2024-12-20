type LatinSquare = number[][];
type CompositeSquare<T = number> = T[][][];

export function generateMOLS(n: number, K: number): LatinSquare[] {
  const squares: LatinSquare[] = Array.from({ length: K }, () =>
    Array.from({ length: n }, () => [])
  );

  for (let k = 0; k < K; k++) {
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        const a = (k * i + j) % n;
        squares[k][i].push(a);
      }
    }
  }

  return squares;
}

export function superimpose(...arrays: LatinSquare[]): CompositeSquare {
  const first = arrays[0];
  const composite: CompositeSquare = first.map((row, i) =>
    row.map((_cell, j) => arrays.map((square) => square[i][j]))
  );
  return composite;
}

export function prettyPrintSquare(
  square: CompositeSquare<string | number> | LatinSquare[]
): string[][] {
  return square.map((row) => row.map((cell) => `(${cell.join(', ')})`));
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  // Used to test is a composite square was made of mutually orthogoanl squares
  function isMutuallyOrthogonal(square: CompositeSquare): boolean {
    return new Set(square.flat()).size === square.flat().length;
  }

  describe('generation', () => {
    it('creates a set of Latin Squares', () => {
      const square3x3 = generateMOLS(3, 3);
      console.log({ square3x3: JSON.stringify(square3x3, null, 4) });
      expect(square3x3).toHaveLength(3);
      expect(square3x3[0]).toHaveLength(3);
    });

    it('superimposes', () => {
      const square3x3 = generateMOLS(3, 4);
      const composite = superimpose(...square3x3);
      expect(composite).toHaveLength(3);
      expect(isMutuallyOrthogonal(composite)).toBe(true);
      console.log(square3x3);
      console.log(composite);
    });
  });

  describe('prettyPrint', () => {
    it('pretty prints a composite square', () => {
      const composite = superimpose(
        [
          [0, 1],
          [2, 3],
        ],
        [
          [4, 5],
          [6, 7],
        ],
        [
          [8, 9],
          [10, 11],
        ]
      );
      expect(prettyPrintSquare(composite)).toMatchObject([
        ['(0, 4, 8)', '(1, 5, 9)'],
        ['(2, 6, 10)', '(3, 7, 11)'],
      ]);
    });
  });

  describe('superimpose', () => {
    it('superimposes arrays', () => {
      const composite = superimpose(
        [
          [0, 1],
          [2, 3],
        ],
        [
          [4, 5],
          [6, 7],
        ],
        [
          [8, 9],
          [10, 11],
        ]
      );

      expect(prettyPrintSquare(composite)).toMatchObject([
        ['(0, 4, 8)', '(1, 5, 9)'],
        ['(2, 6, 10)', '(3, 7, 11)'],
      ]);

      expect(isMutuallyOrthogonal(composite)).toBe(true);
    });
  });
}
