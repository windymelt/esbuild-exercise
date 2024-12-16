import { fib, fact, map, filter } from 'scala:scalamain';
import { hello } from 'scala:anotherscalamain';

const main = async () => {
  //const str = await qr.toString("Hello, World!", { type: 'terminal' });

  console.log(fib(10));
  console.log(fact(5));
  console.log(map(x => x * 2, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]));
  console.log(filter(x => x % 2 === 0, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]));

  console.log(hello('windymelt'));
}

main();