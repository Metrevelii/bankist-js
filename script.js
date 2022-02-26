'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function(movements, sort = false) {
  containerMovements.innerHTML = '';

  // 163. sorting button
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function(mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    // creating template literal:: copied HTML element and changed its static elements with dynamic elements
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
        <div class="movements__value">${mov} €</div>
      </div>
    `;


  // insertAdjacentHTML has 4 states. google: mdn insertAdjacentHTML
  containerMovements.insertAdjacentHTML('afterbegin', html)
  });
}
// displayMovements(account1.movements);

// console.log(containerMovements.innerHTML);
const calcDisplayBalance = function(acc) {
  acc.balance = acc.movements.reduce((acc, cur) => acc + cur, 0);
  labelBalance.textContent = `${acc.balance} €`;
}

// calcDisplayBalance(account1.movements);

const calcDisplaySummary = function(acc) {
  const incomes = acc.movements.filter(mov => mov > 0).reduce((acc, mov) => acc + mov, 0);

  labelSumIn.textContent = `${incomes} €`;

  // to remove - sign to the outcome number we use Math.abs
  const outcomes = acc.movements.filter(mov => mov < 0).reduce((acc, mov) => acc + mov, 0);

  labelSumOut.textContent = `${Math.abs(outcomes)} €`;

  // only accepts interest if its >= 1

  const interest = acc.movements.filter(mov => mov > 0).map(deposit => deposit * acc.interestRate/100).filter((int, i, arr) => {
    return int >= 1;
  }).reduce((acc, int) => acc + int, 0);

  labelSumInterest.textContent = `${interest} €`;
}

// calcDisplaySummary(account1.movements);

const createUsernames = function(accs) {
  accs.forEach(function(acc) {
    acc.username = acc.owner.toLowerCase().split(' ').map(name => name[0]).join('');
  })

  
}

// const user = 'Steven Thomas Williams'; // username: stw
// split name into " stw "

createUsernames(accounts);

const updateUI = function(acc) {
      // Display Movements 
      displayMovements(acc.movements);
      // Display Balance 
      calcDisplayBalance(acc);
      // Display Summary
      calcDisplaySummary(acc);
}

//Event handler 
let currentAccount; 


btnLogin.addEventListener('click', function(e) {
  // after Login webpage refreshes. preventDefault fixes that. prevents form from submitting
  e.preventDefault();
  
  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);
  // console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and Welcome Message
    // split('')[0] -- [0] takes only first element of splitted array.
    labelWelcome.textContent = `Welcome Back ${currentAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity = 100;
    // Clear the input fields 
    inputLoginUsername.value = inputLoginPin.value = '';
    // fixing cursor still blinking in PIN area
    inputLoginPin.blur();
    
    updateUI(currentAccount);
  }
})

// 159. Implementing transfers 

btnTransfer.addEventListener('click', function(e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const recieverAcc = accounts.find( acc => acc.username === inputTransferTo.value);
  inputTransferAmount.value = inputTransferTo.value = '';
  

  // adding positive number to reciever, negative to curr user

  if(amount > 0 && recieverAcc && currentAccount.balance >= amount && recieverAcc?.username !== currentAccount.username) {
    // doing the transfer
    currentAccount.movements.push(-amount);
    recieverAcc.movements.push(amount);

    updateUI(currentAccount);
  } 



})

// 161. some and every
btnLoan.addEventListener('click', function(e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // Add movement 
    currentAccount.movements.push(amount);

    // Update UI
    updateUI(currentAccount);

    inputLoanAmount.value = '';
  }
});

// 160. The findindex Method
// findindex method returns the index of element
// Event handler
btnClose.addEventListener('click', function(e) {
  e.preventDefault();

  
  if (inputCloseUsername.value === currentAccount.username && Number(inputClosePin.value) === currentAccount.pin) {
    const index = accounts.findIndex(acc => acc.username === currentAccount.username);
    // console.log(index);
    
    // delete acc
    accounts.splice(index, 1);
    
    // hide ui
    containerApp.style.opacity = 0;
  }
  
  
  inputCloseUsername.value = inputClosePin.value = '';  
})

let sorted = false;

btnSort.addEventListener('click', function(e) {
  e.preventDefault();
  
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
})



labelBalance.addEventListener('click', function(e) {
  e.preventDefault();

  const movementsUI = Array.from(document.querySelectorAll('.movements__value'));
  console.log(movementsUI);
  
})


// 166. Array methods Practice

// flat method to collect all the movements together in one array
// map at flat together = flatMap method

//1. how much have been deposited to bank from all the accounts

const bankDepositSum = accounts
.flatMap(acc => acc.movements)
.filter(mov => mov > 0)
.reduce((sum, cur) => sum + cur, 0);

console.log(bankDepositSum);

// 2. how many deposits have been with at least $1,000

const numDeposits1000 = accounts
.flatMap(acc => acc.movements)
.filter(mov => mov >= 1000)
.length;

// same result using reduce method

// const numDeposits1000 = accounts
// .flatMap(acc => acc.movements)
// .reduce((count, cur) => (cur >= 1000 ? count + 1 : count), 0);

console.log(numDeposits1000); // Five deposits.

// 3. create an object which contains the sum of the deposits and withdrawals

const {deposits, withdrawals} = accounts 
.flatMap(acc => acc.movements).reduce((sums, cur) => {
  // cur > 0 ? sums.deposits += cur : sums.withdrawals += cur;

  sums[cur > 0 ? 'deposits' : 'withdrawals'] += cur; // same result with different cleaner way

  // if arrow function has a {} body, we need to use return
  return sums;
}, {deposits: 0, withdrawals: 0});

console.log(deposits, withdrawals);

// 4. Converting title case
const convertTitleCase = function(title) {
  const capitalize = str => str[0].toUpperCase() + str.slice(1)
  
  const exceptions = ['a', 'an', 'the', 'but', 'or', 'on', 'in', 'with'];

  const titleCase = title
    .toLowerCase()
    .split(' ').
    map(word => (exceptions.includes(word) ? word : capitalize(word))
    )
    .join(' ');
  return titleCase;
}
console.log(convertTitleCase('this is a nice title'));
console.log(convertTitleCase('this is a LONG title but not too long'));
console.log(convertTitleCase('and here is another title with an EXAMPLE'));


// 164. more ways of creating and filling arrays
// old way
// const arr = [1,2,3,4,5,6,7];
// also old way
// console.log(new Array(1,2,3,4,5,6,7));

// const x = new Array(7);
// console.log(x); // nothing happens : [empty x 7]

//fill method
//x.fill(1); // [1,1,1,1,1,1,1] 
// x.fill(1, 3, 5);

// console.log(x); 

// arr.fill(23, 2, 6);
// console.log(arr); // puts 23 in from 2 to 6 position

// Array.from 
// const y = Array.from({length: 7}, () => 1);
// console.log(y); // same result: 1,1,1,1,1,1 x7 times


// when we dont use parameters we can use ' _ ' (one before i)
// const z = Array.from({length: 7}, (_, i) => i + 1);
// console.log(z); // gives value: from 1 to 7.



// 163. Sorting Arrays
// const owners = ['Jonas', 'Zach', 'Adam', 'Martha'];

// sorts arrays from A to Z; it only works alphabetically. mutates the array too
// console.log(owners.sort());

// Number
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// console.log(movements);
// console.log(movements.sort());

// if we return < 0 , A will be before B (keep order)
// if we return > 0 , B will be before A (switch order)
// Ascending from - to +
// movements.sort((a, b) => {
//   if (a > b) return 1;
//   if (a < b) return -1;
// })

// same with shorter 
// movements.sort((a, b) => a - b);

// console.log(movements);

// // Descending from + to -
// movements.sort((a, b) => {
//   if (a > b) return -1;
//   if (a < b) return 1;
// })

// movements.sort((a,b ) => b - a);

// console.log(movements);




//162. flat and flatMap methods

// const arr = [[1,2,3], [4,5,6], 7, 8];

// collects them all together = [1,2,3,4,5,6,7,8]
// console.log(arr.flat())

// const arrDeep = [[[1,2],3], [4,[5,6]], 7, 8];
// with flat(2) it does same. (2nd level nesting)
// console.log(arrDeep.flat(2));

// const accountMovements = accounts.map(acc => acc.movements);
// console.log(accountMovements);

// collecting all movements into one array
// const allMovements = accountMovements.flat();
// console.log(allMovements);
// const overallBalance = allMovements.reduce((acc, mov) => acc + mov, 0);
// console.log(overallBalance);

// same with chaining method ** flat method **
// const overallBalance = 
// accounts
//   .map(acc => acc.movements)
//   .flat()
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(overallBalance);


// same with flatMap method
// Flatmap method only goes level 1 deeper. flat method can set any level.

// const overallBalance2 = 
// accounts
//   .flatMap(acc => acc.movements)
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(overallBalance2);




// 161. some and every
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];


// // includes returns true if this value exists in array ** EQUALITY **
// console.log(movements.includes(-130));
// console.log(movements);


// // SOME: we can check if some value exists in array. ** CONDITION ***
// console.log(movements.some(mov => mov === -130));

// const anyDeposits = movements.some(mov => mov > 5000);
// console.log(anyDeposits); 

// // EVERY method: only returns true if all elements satisfy condition that we pass in
// console.log(movements.every(mov => mov > 0)); // false cuz it has negative deposits too
// console.log(account4.movements.every(mov => mov > 0)); // true, only positive deposits

// // Separate callback
// const deposit = mov => mov > 0;
// console.log(movements.some(deposit)); // true
// console.log(movements.every(deposit)); // false
// console.log(movements.filter(deposit)); // only mov > 0 elements (positive)


// 157. The Find Method
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// unlike of filter method, find method wont return new array but returns first element
// of array for which this operation becomes true.
// FIND METHOD ONLY RETURNS ONE ELEMENT WHICH IS NOT ARRAY
// const firstWithdrawal = movements.find(mov => mov < 0);

// console.log(movements);
// console.log(firstWithdrawal); // -400 : cuz its first negative number


// const account = accounts.find(acc => acc.owner === 'Jessica Davis');

// console.log(account);


// 156. Coding Challenge N3
// rewriting Challenge N2 with arrow functions and chaining methods

// const calcAverageHumanAge = ages => 
// ages
//   .map(age => (age <= 2 ? 2 * age : 16 + age * 4))
//   .filter(age => age >= 18)
//   .reduce((acc, age, i, arr) => acc + age / arr.length, 0);


// console.log(calcAverageHumanAge);


// 154. Challenge N2 

// const calcAverageHumanAge = function (ages) {
//   const humanAges = ages.map(age => (age <= 2 ? 2 * age : 16 + age * 4));

//   const adults = humanAges.filter(age => age >= 18);
//   console.log(humanAges);
//   console.log(adults);

//   const average = adults.reduce((acc, age) => acc + age, 0) / adults.length;

//   return average;
// }

// const avg1 = calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
// const avg2 = calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);
// console.log(avg1, avg2);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];


/////////////////////////////////////////////////
/////////////////////////////////////////////////

