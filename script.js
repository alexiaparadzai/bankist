'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Alexia Paradzai',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1234,
  username: "afp"
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  username: "jd"
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  username: "stw"
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  username: "ss"
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

//dont use global variables all the time

//how to take inner html as a string and put it in to pay


//created a copy of the array using slice operator 

  const displayMovements = function (movements, sort = false) {
    containerMovements.innerHTML = '';
  
    const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
 

  movs.forEach(function(mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

  const html = `
  <div class="movements__row">
  <div class="movements__type movements__type--${type}">${
i + 1
} ${type}</div>
  <div class="movements__value">${mov}€</div>
</div>
`;

containerMovements.insertAdjacentHTML
('afterbegin', html);
  }
)
}


const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance}€`;
};


const calcDisplaySummary = function(acc) {
  const incomes = acc.movements.filter(mov => mov > 0).reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}`;

const out = acc.movements.filter(mov => mov < 0).reduce((acc, mov) => acc + mov, 0)
labelSumOut.textContent = `${Math.abs(out)}`;

const interest = acc.movements
.filter(mov => mov > 0)
.map(deposit => (deposit * acc.interestRate / 100))
.filter((int, i, arr) => {
  // console.log(arr);
  return int >= 1;
})
.reduce((acc, int) => acc + int, 0);
labelSumInterest.textContent = `${interest}`;
};


//creating usernames from abreviated first names
const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  } 
  )
}
createUsernames(accounts);

const updateUI = function(acc) {
  //display movements
  displayMovements(acc.movements);
  //display balance
  calcDisplayBalance(acc);
  //display summary
  calcDisplaySummary(acc);
}


//stopping the event (e) from reloading quickly using prevent default submitting quickly, pressing enter in any field triggers the button
//declaring the variable out here so we can access it 

//using the login details and the find method allows us to narrow down the account and show their specific balances 
let currentAccount;

btnLogin.addEventListener('click', function(e) {
  e.preventDefault();
  
    currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);

    console.log(currentAccount);

 //using optional chaining   
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //display UI and welcome message

    labelWelcome.textContent = `Welcome back ${currentAccount.owner.split(''[0])}`;

    containerApp.style.opacity = 100;

    //clear input field using one time assignment operator
    inputLoginUsername.value = inputLoginPin.value = '';

    inputLoginPin.blur();

    updateUI(currentAccount);
    console.log('LOGIN');
  }

  else // here is where I will put the error message

  {

  }

});

btnLoan.addEventListener('click', function(e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if(amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1))
  {

    // add movements
    currentAccount.movements.push(amount);
    updateUI(currentAccount); 
    inputLoanAmount.value ='';
  }
  
  else {
   // add error message
  }
}) 


//implementig transwer to button using username and find method
btnTransfer.addEventListener('click', function(e){
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(acc => acc.username === inputTransferTo.value);
  inputTransferAmount.value = inputTransferTo.value = '';
  console.log(amount, receiverAcc);

  // checking if user can transfer money

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    updateUI(currentAccount);
  } else {
    // put error message here

  }

})


btnClose.addEventListener('click', function(e) {
  e.preventDefault();
  if(inputCloseUsername.value === currentAccount.username && Number(inputClosePin.value) === Number(currentAccount.pin))
   {
     const index = accounts.findIndex(acc => acc.username === currentAccount.username);

     console.log(index);
    //delete account
    accounts.splice(index, 1);

    //hide UI
    containerApp.style.opacity = 0;
   }
   inputCloseUsername.value = inputClosePin.value = '';
});

//we start off with the movements sorted, if they are sorted we use the ! operator to make the opposite happen
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];


