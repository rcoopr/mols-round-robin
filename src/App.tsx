/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from 'react';
import './App.css';
import { generateMOLS, superimpose } from './lib/mols';

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const names = [
  'Aaron',
  'Barry',
  'Chris',
  'Dan',
  'Ed',
  'Frank',
  'Greg',
  'Harry',
  'Ian',
  'Jack',
  'Kevin',
  'Lee',
  'Mark',
  'Niles',
  'Oliver',
  'Paul',
  'Quinn',
  'Ray',
  'Sam',
  'Tom',
  'Ulf',
  'Victor',
  'Will',
  'Xavier',
  'Yan',
  'Zach',
];

export default function App() {
  return (
    <main className="text-left">
      <h1 className="text-center">Solving round-robin draws for multi-entry heats using sudoku</h1>
      <h2>A quick bit of maths</h2>
      <p>
        A <em>Latin Square</em> is essentially a sudoku board using 0's, and we don't care about the
        diagonals,{' '}
        <sup>
          unless we are talking about <em>Diagonal Latin Squares (DLS)</em>
        </sup>
        <br />
        <br />
        That is, we have <em>n</em> row and columns, each filled with the numbers 1 to n, with no
        repetition
      </p>
      <div
        className="sudoku"
        style={{
          '--n': 3,
        }}
      >
        {generateMOLS(3, 3)[1]
          .flat()
          .map((i) => (
            <div>{i}</div>
          ))}
      </div>
      <caption>A 3x3 Latin Square</caption>

      <p>
        A <em>Graeco-Latin (composite)</em> Square is a pair of{' '}
        <em>Mutually Orthogonal Latin Squares (MOLS)</em>. We take 2 Latin Squares and superimpose
        them where we simply join the values within the cells. Orthogonality here means that each
        pair found in a cell is only found once
      </p>
      <div className="flex flex-wrap justify-center gap-x-12 gap-y-6">
        <div
          className="sudoku"
          style={{
            '--n': 3,
          }}
        >
          {/* {Array.from({ length: 3 * 3 }, (_, i) => (
            <div>{(i + Math.floor(i / 3)) % 3}</div>
          ))} */}
          {generateMOLS(3, 3)[1]
            .flat()
            .map((i) => (
              <div>{i}</div>
            ))}
        </div>
        <div
          className="sudoku"
          style={{
            '--n': 3,
          }}
        >
          {generateMOLS(3, 3)[2]
            .flat()
            .map((i) => (
              <div>{alphabet[i]}</div>
            ))}
        </div>
        <div
          className="sudoku sudoku-highlight"
          style={{
            '--n': 3,
          }}
        >
          {superimpose(generateMOLS(3, 3)[1], generateMOLS(3, 3)[2])
            .flat()
            .map((i) => (
              <div>{i.map((c, ci) => (ci === 0 ? c : alphabet[c]))}</div>
            ))}
        </div>
      </div>
      <caption>A Graeco-Latin Square and its component MOLS</caption>
      <p>
        If we imagine 2 teams &mdash; Team 1 has players 0, 1 and 2; Team 2 has players A, B and C
        &mdash; We have created a round draw that enforces:
        <ul className="list-disc w-max text-left ml-8 mb-2">
          <li>Each player will play against every opponent</li>
          <li>No player can play the same opponent more than once</li>
        </ul>
        <span className="underline">
          Further, we can consider each row to be a round in which each entrant will play once. The
          columns can be permuted indepently of rows to create variance in the draw.
        </span>
      </p>

      <h2 className="mt-12">Cram more numbers in the squares</h2>
      <p>
        That's all well and good for head to head play, but what about heats with multiple entries?
        Using 2 MOLS got us heats with 2 entries, let's add more MOLS.
      </p>

      <div className="flex flex-wrap justify-center gap-12">
        <div
          className="sudoku"
          style={{
            '--n': 3,
          }}
        >
          {/* {Array.from({ length: 3 * 3 }, (_, i) => (
            <div>{(i + Math.floor(i / 3)) % 3}</div>
          ))} */}
          {generateMOLS(3, 3)[0]
            .flat()
            .map((i) => (
              <div>{i}</div>
            ))}
        </div>
        <div
          className="sudoku"
          style={{
            '--n': 3,
          }}
        >
          {/* {Array.from({ length: 3 * 3 }, (_, i) => (
            <div>{(i + Math.floor(i / 3)) % 3}</div>
          ))} */}
          {generateMOLS(3, 3)[1]
            .flat()
            .map((i) => (
              <div>{i}</div>
            ))}
        </div>
        <div
          className="sudoku"
          style={{
            '--n': 3,
          }}
        >
          {generateMOLS(3, 3)[2]
            .flat()
            .map((i) => (
              <div>{i}</div>
            ))}
        </div>
        <div
          className="sudoku sudoku-highlight"
          style={{
            '--n': 3,
          }}
        >
          {superimpose(...generateMOLS(3, 3))
            .flat()
            .map((i) => (
              <div>{i.join('')}</div>
            ))}
        </div>
      </div>
      <caption>Hold on, what's going on here?</caption>
      <p>
        The first square is not even a Latin Square! This is one of the limitations of MOLS. For a
        given <em>n</em>, there are at most <em>n - 1</em> pairs of MOLS. Thanksfully this isn't a
        dealbreaker. What it does mean is that we can't use columns to create a round draw. It also
        means we no longer satsify the rule{' '}
        <span className="italic">&#8220;Each player will play against every opponent&#8221;</span>.
        <br />
        <br />
        We can still use rows to create a round draw, but we need to be careful. We should also note
        where the dimensions come from and relate to a round draw.
        <ul className="list-disc text-left mb-2 mx-8">
          <li>
            In the composite square, Each <em>cell is a heat</em>
          </li>
          <li>
            In the composite square, Each <em>row is a round</em>
          </li>
          <li>
            The number of MOLS, or <em>K</em>, is the <em>heat size</em>. More MOLS, more values per
            cell
          </li>
          <li>
            The values in each MOLS are the entrants. So we must split the entrants into this group
            based on the total entrant count and the heat size
          </li>
          <li>We can select as many rows as we want, in any order we want</li>
          <li>
            We can permute/cycle the columns of a row however we wish to add variance (or else the
            1st entrant will always be in the first heat of each round)
          </li>
        </ul>
      </p>

      <h2 className="mt-12">Let's try it out</h2>
      <EvenGroupingExample />
      <p>Fantastic. It works. But what about when we don't have a perfectly even grouping?</p>
      <hr className="h-px w-full my-8 opacity-50" />
      <UnevenGroupingExample />
      <caption>Uh oh</caption>
      <p>
        We have a real problem with uneven groups here. I think this is the point where we have to
        diverge from purity and do some tinkering. An easy way to 'fix' this is to temporarily
        remove enough entrants to the point we have an even grouping. We can then add those back at
        random into the drawn heats
      </p>
      <hr className="h-px w-full my-8 opacity-50" />
      <TinkeredExample />
    </main>
  );
}

function EvenGroupingExample() {
  const n = 24;
  const k = 6;
  const groupSize = Math.ceil(n / k);
  const minGroupSize = Math.floor(n / k);
  const numLargerGroups = n - minGroupSize * k;

  // Split into groups
  const groups: string[][] = [];
  let currentIndex = 0;

  // Create larger groups first
  for (let i = 0; i < numLargerGroups; i++) {
    groups.push(names.slice(currentIndex, currentIndex + minGroupSize + 1));
    currentIndex += minGroupSize + 1;
  }

  // Create remaining smaller groups
  while (currentIndex < n) {
    groups.push(names.slice(currentIndex, currentIndex + minGroupSize));
    currentIndex += minGroupSize;
  }

  const mols = generateMOLS(groupSize, k);

  return (
    <>
      <p>
        Let's start out with a set of {n} entrants. Assume we want heat sizes of {k}, we must split
        them into groups of {groupSize}
      </p>
      <div className="flex flex-wrap gap-8 justify-center items-start  w-full mb-8">
        {groups.map((group, gi) => (
          <div className="flex flex-col gap-4">
            <div className="sudoku" style={{ '--n': 1 }}>
              {Array.from({ length: groupSize }, (_, i) => (
                <div>{group[i]}</div>
              ))}
            </div>
            <div className="sudoku" style={{ '--n': groupSize }}>
              {mols[gi].flat().map((i) => (
                <div>{group[i]?.[0]}</div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="sudoku sudoku-highlight" style={{ '--n': groupSize }}>
        {superimpose(...mols).map((row) =>
          row.map((cell) => <div>{cell.map((c, i) => groups[i][c]?.[0])}</div>)
        )}
      </div>
    </>
  );
}

function UnevenGroupingExample() {
  const n = 21;
  const k = 5;
  const groupSize = Math.ceil(n / k);
  const minGroupSize = Math.floor(n / k);
  const numLargerGroups = n - minGroupSize * k;

  // Split into groups
  const groups: string[][] = [];
  let currentIndex = 0;

  // Create larger groups first
  for (let i = 0; i < numLargerGroups; i++) {
    groups.push(names.slice(currentIndex, currentIndex + minGroupSize + 1));
    currentIndex += minGroupSize + 1;
  }

  // Create remaining smaller groups
  while (currentIndex < n) {
    groups.push(names.slice(currentIndex, currentIndex + minGroupSize));
    currentIndex += minGroupSize;
  }

  const mols = generateMOLS(groupSize, k);

  return (
    <>
      <p>
        Let's try a set of {n} entrants. Assume we want heat sizes of {k}, we must split them into
        groups of {groupSize} and evenly distribute the entrants
      </p>
      <div className="flex flex-wrap gap-8 justify-center items-start  w-full mb-8">
        {groups.map((group, gi) => (
          <div className="flex flex-col gap-4">
            <div className="sudoku" style={{ '--n': 1 }}>
              {Array.from({ length: groupSize }, (_, i) => (
                <div>{group[i]}</div>
              ))}
            </div>
            <div className="sudoku" style={{ '--n': groupSize }}>
              {mols[gi].flat().map((i) => (
                <div>{group[i]?.[0]}</div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="sudoku sudoku-highlight" style={{ '--n': groupSize }}>
        {superimpose(...mols).map((row) =>
          row.map((cell) => <div>{cell.map((c, i) => groups[i][c]?.[0])}</div>)
        )}
      </div>
    </>
  );
}

function TinkeredExample() {
  const [_n, setN] = useState(21);
  const [k, setK] = useState(5);
  const n = Math.floor(_n / k) * k;
  const groupSize = Math.ceil(n / k);
  const minGroupSize = Math.floor(n / k);
  const numLargerGroups = n - minGroupSize * k;

  // Split into groups
  const groups: string[][] = [];
  let currentIndex = 0;

  // Create larger groups first
  for (let i = 0; i < numLargerGroups; i++) {
    groups.push(names.slice(currentIndex, currentIndex + minGroupSize + 1));
    currentIndex += minGroupSize + 1;
  }

  // Create remaining smaller groups
  while (currentIndex < n) {
    groups.push(names.slice(currentIndex, currentIndex + minGroupSize));
    currentIndex += minGroupSize;
  }

  const mols = generateMOLS(groupSize, k);

  const extra = mols[1].flat().map((i) => names.slice(n, _n)[i]?.[0]);

  return (
    <>
      <div className="flex justify-evenly gap-16">
        <div className="flex flex-col">
          Athlete count: {_n}
          <input
            type="range"
            min="1"
            max="26"
            step="1"
            value={_n}
            onChange={(e) => {
              console.log(e.target.value);
              console.log(parseInt(e.target.value));
              setN(parseInt(e.target.value));
            }}
          />
        </div>
        <div className="flex flex-col">
          Heat size: {k}
          <input
            type="range"
            min="1"
            max="26"
            step="1"
            value={k}
            onChange={(e) => setK(parseInt(e.target.value))}
          />
        </div>
      </div>
      <p>
        Let's try a set of {_n} entrants. Ignore the last {_n - n} entrant{_n - n === 1 ? '' : 's'}{' '}
        and assume we want heat sizes of {k}, we must split them into groups of {groupSize}
      </p>
      <div className="flex flex-wrap gap-8 justify-center items-start  w-full mb-8">
        {groups.map((group, gi) => (
          <div className="flex flex-col gap-4">
            <div className="sudoku" style={{ '--n': 1 }}>
              {Array.from({ length: groupSize }, (_, i) => (
                <div>{group[i]}</div>
              ))}
            </div>
            <div className="sudoku" style={{ '--n': groupSize }}>
              {mols[gi].flat().map((i) => (
                <div>{group[i]?.[0]}</div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-8 justify-center">
        <div className="sudoku sudoku-highlight" style={{ '--n': groupSize }}>
          {superimpose(...mols).map((row) =>
            row.map((cell) => <div>{cell.map((c, i) => groups[i][c]?.[0])}</div>)
          )}
        </div>

        <div className="sudoku" style={{ '--n': groupSize }}>
          {extra.map((c) => (
            <div>{c}</div>
          ))}
        </div>
      </div>
      <caption>
        The last {_n - n} entrant{_n - n === 1 ? '' : 's'} can be superimposed in a 2nd pass
      </caption>

      <div className="sudoku sudoku-highlight mt-8" style={{ '--n': groupSize }}>
        {superimpose(...mols).map((row, ri) =>
          row.map((cell, ci) => (
            <div>
              {cell.map((c, i) => groups[i][c]?.[0])}
              {extra[ci + ri * groupSize]?.[0]}
            </div>
          ))
        )}
      </div>
      <caption>Our final form... minus column permutations</caption>
      <p className="h-screen">
        There's a few bugs leftover. It's quite easy, by changing the values in this example, to
        remove wayyy too many entrants and forget about them entirely. There's also situations such
        at athlete count of 19, heat size of 5 where the group size is smaller than the 'forgotten'
        entrants, so the 4th forgotten entrant is never re-added.
        <br />
        <br />
        Seems to be a good start though
      </p>
    </>
  );
}
