// ─── Bali 2026 Unit Tests (vanilla JS, no framework) ───
// Run with: node tests/unit.test.js

let passed = 0;
let failed = 0;

function assert(desc, actual, expected) {
  if (actual === expected) {
    console.log(`  ✓ ${desc}`);
    passed++;
  } else {
    console.error(`  ✗ ${desc}`);
    console.error(`    expected: ${JSON.stringify(expected)}`);
    console.error(`    actual:   ${JSON.stringify(actual)}`);
    failed++;
  }
}

function assertClose(desc, actual, expected, tolerance = 0.01) {
  if (Math.abs(actual - expected) <= tolerance) {
    console.log(`  ✓ ${desc}`);
    passed++;
  } else {
    console.error(`  ✗ ${desc}`);
    console.error(`    expected: ${expected} (±${tolerance})`);
    console.error(`    actual:   ${actual}`);
    failed++;
  }
}

// ─── toTWD ───
const RATE = 500;

function toTWD(amount, currency) {
  if (currency === 'TWD') return amount;
  if (currency === 'IDR') return amount / RATE;
  if (currency === 'USD') return amount * 30.5;
  return amount;
}

console.log('\n── toTWD() ──');
assert('TWD passthrough', toTWD(100, 'TWD'), 100);
assertClose('IDR → TWD (100,000 IDR = 200 TWD)', toTWD(100000, 'IDR'), 200);
assertClose('USD → TWD (1 USD = 30.5 TWD)', toTWD(1, 'USD'), 30.5);
assertClose('USD → TWD (10 USD = 305 TWD)', toTWD(10, 'USD'), 305);
assertClose('IDR → TWD (500 IDR = 1 TWD)', toTWD(500, 'IDR'), 1);
assert('Unknown currency passthrough', toTWD(99, 'EUR'), 99);

// ─── Day index → date string mapping ───
const DAY_DATES = {
  0: '2026-02-22', 1: '2026-02-23', 2: '2026-02-24',
  3: '2026-02-25', 4: '2026-02-26', 5: '2026-02-27', 6: '2026-02-28'
};

const TRIP_START = new Date(2026, 1, 22); // Feb 22 2026

function dayIndexFromDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  const diff = Math.round((d - TRIP_START) / (1000 * 60 * 60 * 24));
  return (diff >= 0 && diff <= 6) ? diff : -1;
}

console.log('\n── Date mapping ──');
assert('Day 0 = 2026-02-22', DAY_DATES[0], '2026-02-22');
assert('Day 2 = 2026-02-24 (D3, rain day)', DAY_DATES[2], '2026-02-24');
assert('Day 4 = 2026-02-26 (D5, dive split)', DAY_DATES[4], '2026-02-26');
assert('Day 6 = 2026-02-28 (last day)', DAY_DATES[6], '2026-02-28');
assert('dayIndexFromDate 2026-02-22 → 0', dayIndexFromDate('2026-02-22'), 0);
assert('dayIndexFromDate 2026-02-24 → 2', dayIndexFromDate('2026-02-24'), 2);
assert('dayIndexFromDate 2026-02-28 → 6', dayIndexFromDate('2026-02-28'), 6);
assert('dayIndexFromDate out of range → -1', dayIndexFromDate('2026-03-01'), -1);

// ─── Expense calculations ───
const MEMBERS = ['小咖', 'Yoyo', '薏萱', '韵馨', 'Millie', '天澤', '曹曹', '小夫', 'Ting'];

function calcTotals(expenses) {
  let grandTotal = 0;
  const perPerson = {};
  MEMBERS.forEach(m => { perPerson[m] = 0; });
  expenses.forEach(e => {
    const twd = toTWD(e.amount, e.currency);
    grandTotal += twd;
    if (perPerson[e.person] !== undefined) perPerson[e.person] += twd;
  });
  return { grandTotal, perPerson };
}

const sampleExpenses = [
  { person: '小咖', amount: 200, currency: 'TWD' },
  { person: '小夫', amount: 200, currency: 'TWD' },
  { person: 'Millie', amount: 200, currency: 'TWD' },
  { person: '天澤', amount: 200, currency: 'TWD' },
  { person: '曹曹', amount: 200, currency: 'TWD' },
];

console.log('\n── Expense calculations ──');
const { grandTotal, perPerson } = calcTotals(sampleExpenses);
assert('Grand total of 5×200 TWD = 1000', grandTotal, 1000);
assert('小咖 total = 200', perPerson['小咖'], 200);
assert('Yoyo total = 0 (no expenses)', perPerson['Yoyo'], 0);
assertClose('Average per person (1000/9)', grandTotal / MEMBERS.length, 111.11, 0.1);

// Mixed currency
const mixed = [
  { person: 'Yoyo', amount: 50000, currency: 'IDR' },  // 100 TWD
  { person: 'Ting', amount: 2, currency: 'USD' },       // 61 TWD
];
const { grandTotal: mixedTotal } = calcTotals(mixed);
assertClose('Mixed: 50000 IDR + 2 USD = 161 TWD', mixedTotal, 161, 0.01);

// ─── Summary ───
console.log(`\n── Results: ${passed} passed, ${failed} failed ──`);
if (failed > 0) process.exit(1);
