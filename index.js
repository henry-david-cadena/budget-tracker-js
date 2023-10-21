const form = document.querySelector(".add");

// In these variables (constants) we are selecting ul elements where we save the transactions as appropriate
const incomeList = document.querySelector("ul.income-list");
const expenseList = document.querySelector("ul.expense-list");

const balance = document.getElementById("balance");
const income = document.getElementById("income");
const expense = document.getElementById("expense");

// Here we will save multiple transactions, we have an empty list
// The problem is when tha page is reloaded the information saved in the localStorage will be rewrited with the new transactions of the new session
// const transactions = [];

// To fix the last line, we need to add a condition to bring the information of local storage if this exists
let transactions = localStorage.getItem("transactions") !== null 
    ? JSON.parse(localStorage.getItem("transactions"))/*if it is true, we convert the information in local storage in object format*/
    : []/*if it is false we create an empty array*/;

// Function moved
// Here we create a function to update the statistics section
function updateStatistics (){
    // We create a new array that contains all transactions that are greater than 0
    const updatedIncome = transactions
        .filter(transaction => transaction.amount > 0)
        .reduce((total, transaction) => total += transaction.amount, 0);
    console.log(updatedIncome);

    // We create a new array that contains all transactions that are less than 0
    const updatedExpense = transactions
        .filter(transaction => transaction.amount < 0)
        // Here we use reduce method to sum all amounts we get in tha last filter
        .reduce((total, transaction) => total += Math.abs(transaction.amount), 0);
    console.log(updatedExpense);

    updatedbalance = updatedIncome - updatedExpense;

    income.textContent = updatedIncome;
    expense.textContent = updatedExpense;
    balance.textContent = updatedbalance;
};


// We call this function here, because we need the statistics to be loaded as soon as the page is loaded.
// We are grouping the two functions that need to be executed as soon as the page is loaded at the end of the entire code.
// updateStatistics();

// We create a function, this function will generate the li item for each transaction
function generatetemplate(id, source, amount, time){
    // Here we are creating a data-id, custom attribute that allow us identify a unique element
    return `<li data-id="${id}">
                <p>
                    <span>${source}</span>
                    <span id="time">${time}</span>
                </p>
                $<span>${Math.abs(amount)}</span>
                <i class="bi bi-trash delete"></i>
            </li>`
};

// We need to create a new function, this function will be in charge of to add the new transaction on the DOM
function addTransactionDOM(id, source, amount, time){
    if(amount > 0){
        // When it is being repeated over and over, we can create a function will be in charge of process
        incomeList.innerHTML += generatetemplate(id, source, amount, time);
                                // `<li data-id="">
                                //     <p>
                                //         <span>Freelancing - Js Project</span>
                                //         <span id="time">12:45:38 AM 5/19/2022</span>
                                //     </p>
                                //     <span>$700</span>
                                //     <i class="bi bi-trash delete"></i>
                                // </li>`;
    } else {
        expenseList.innerHTML += generatetemplate(id, source, amount, time);
                                // `<li data-id="">
                                //     <p>
                                //         <span>Streaming Room - Js Project</span>
                                //         <span id="time">12:44:21 AM 5/19/2022</span>
                                //     </p>
                                //     <span>$700</span>
                                //     <i class="bi bi-trash delete"></i>
                                // </li>`;
    }
}

// here we define a function (addTransaction) this function will be in charge to add all information of a new transaction, we are moving a block of code we have below
// This function receive 2 parameters
function addTransaction(source, amount){
    const time = new Date();
    const transaction = {
        // We need to save a unique identifier for each transaction, so that we will create another key called (id), in which we will save a unique indentifier generated with random MAth method
        id: Math.floor(Math.random()*100000),
        // Here we can simplify, thanks to literal objects, but this time we conserve this syntax
        // source,
        // amount,
        source: source,
        amount: amount,
        // We need to save the date of each transaction
        time: `${time.toLocaleTimeString()} ${time.toLocaleDateString()}`
    };
    transactions.push(transaction);
    // To save the information in localStorage correctly, in string format we need to convert the information  
    localStorage.setItem("transactions", JSON.stringify(transactions));

    // we need to call to addTransactionDOM function to add immediately the transactions in the section Transaction History
    addTransactionDOM(transaction.id, source, amount, transaction.time);
};

form.addEventListener("submit", event => {
    // First we need to restrict the preventDefault functionality
    event.preventDefault();
    // We need avoid to create a new transaction without data in the inputs (source and amount), for that we are going to create an if statement 
    if(form.source.value.trim() === "" || form.amount.value.trim() === ""){
        return alert("Please add proper values");
    }
    // Here we can access to the information that the user entered in the form
    // To pass the value of amount in number format we need to convert the value to a number
    console.log(form.source.value, Number(form.amount.value));

    // const time = new Date();
    // const transaction = {
    //     // We need to save a unique identifier for each transaction, so that we will create another key called (id), in which we will save a unique indentifier generated with random MAth method
    //     Id: Math.floor(Math.random()*100000),
    //     source: form.source.value,
    //     amount: form.amount.value,
    //     // We need to save the date of each transaction
    //     time: `${time.toLocaleTimeString()} ${time.toLocaleDateString()}`
    // };
    // transactions.push(transaction);
    // // To save the information in localStorage correctly, in string format we need to convert the information  
    // localStorage.setItem("transactions", JSON.stringify(transactions));

    // Call the addTransaction function, we need to send two arguments
    // We added trim method to avoid empty spaces
    addTransaction(form.source.value.trim(), Number(form.amount.value));

    //We need to call this function here to uddate the Statistics section
    updateStatistics();

    // Here we reset the inputs of this form, when the user submited the data the inputs will reset 
    form.reset();
});

// This function will allow us to get all transactions we have in our local storage
function getTransaction(){
    // Here we are accessing to the whole transactions
    transactions.forEach(transaction => {   
        if(transaction.amount > 0){
           return incomeList.innerHTML += generatetemplate(transaction.id, transaction.source, transaction.amount, transaction.time);
        } else {
            return expenseList.innerHTML += generatetemplate(transaction.id, transaction.source, transaction.amount, transaction.time);
        }
    });
};

// We are calling this function as soon as the page loads
// We are grouping the two functions that need to be executed as soon as the page is loaded at the end of the entire code.
// getTransaction();

// To delete a transaction we use the id of this transaction
function deleteTransaction(id){
    console.log(id);
    // We will use filter method to create a list with elements that doesn't contain the id 
    // As well we save the new list except for the transaction that met the condition
    transactions = transactions.filter(transaction => {
        // We will return all transactions that are diffrent from the ID we are evaluating
        return transaction.id !== id
    })
    // Here we are updating in local storage the new list, in other words we are overwriting on the old information
    localStorage.setItem("transactions", JSON.stringify(transactions));
};

incomeList.addEventListener("click", event => {
    if(event.target.classList.contains("delete")){
        console.log(event.target);
        console.log(event.target.parentElement);
        // here we are deleting only the DOM
        event.target.parentElement.remove();
        // we create a function to delete the item of our localstorage as well
        // To access a custom attribute, we use the dataset
        deleteTransaction(Number(event.target.parentElement.dataset.id));
        // Here we need to call updateStatistics function
        updateStatistics();
    };
});

expenseList.addEventListener("click", event => {
    if(event.target.classList.contains("delete")){
        // here we are deleting only the DOM
        event.target.parentElement.remove();
        console.log(event.target);
        // we create a function to delete the item of our localstorage as well
        // To access a custom attribute, we use the dataset
        deleteTransaction(Number(event.target.parentElement.dataset.id));
        // Here we need to call updateStatistics function
        updateStatistics();
    };
});

// We need to move this function up because it should load as soon as the user clicks the submit button and new transaction is created check(updateStatistics)

// Here, we are grouping the two functions that need to load as soon as the page to be loaded
function init(){
    updateStatistics();
    getTransaction();
}

init();