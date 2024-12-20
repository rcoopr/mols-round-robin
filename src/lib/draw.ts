import { generateMOLS, prettyPrintSquare, superimpose } from './mols';

export function draw(athleteCount: number, heatSize: number) {
  const groupSize = Math.ceil(athleteCount / heatSize);
  const mols = generateMOLS(groupSize, heatSize);
  const composite = superimpose(...mols);
  console.log(prettyPrintSquare(mols));
  console.log(prettyPrintSquare(composite));

  const alpha = 'abcdefghijklmnopqrstuvwxyz';
  const namedComposite = composite.map((row) =>
    row.map((cell) => cell.map((entry, i) => alpha[entry + i * heatSize]))
  );
  console.log(prettyPrintSquare(namedComposite));
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe('draw', () => {
    it('draws a mol', () => {
      draw(14, 4);
      expect(true).toBe(true);
    });
  });
}
