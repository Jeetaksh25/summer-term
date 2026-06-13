var a = 10;
var b = 20;
var c = a + b;

console.log(c);

const r= require('readline');

const rl = r.createInterface({
input: process.stdin,
output: process.stdout
});

rl.question('Enter First Number: ', (a) => {
rl.question('Enter Second Number: ', (b) => {
const sum= Number(a) + Number(b);
console.log(`The sum of ${a} and ${b} is ${sum}`);
rl.close();
});
});


rl.question("Enter number for even odd test: ", (num) => {
    const result = num % 2 === 0 ? "even" : "odd";
    console.log(`The number ${num} is ${result}`);
    rl.close();
})