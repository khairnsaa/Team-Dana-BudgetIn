// Getting the element
const currMonthText = document.querySelector('.current_month');
const totalBudgetText = document.querySelector('.total_budget');
const inputType = document.querySelector('.budget_type');
const inputDescription = document.querySelector('.input-description');
const inputValue = document.querySelector('.input-value');
const inputBtn = document.querySelector('.input_btn');
const incomeList = document.querySelector('.income-list');
const expenseList = document.querySelector('.expense-list');
const incomeLabel = document.querySelector('.budget-income-value span');
const expenseLabel = document.querySelector('.budget-expense-value span');
const budgetLabel = document.querySelector('.budget-value');
const incomeExpenseContainer = document.querySelector('.income-expense-container');

let budget = 0;
let prevInputIncome = 0;
let prevInputExpense = 0;
let itemList = [];
const itemDetail = (desc, type, value) => {
    return {
        id: Math.round(Math.random()*100),
        description: desc,
        type: type,
        value : value
    }
}

// Getting Current Month
let currMonth = new Date().getMonth()
const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
]
currMonthText.innerHTML = months[currMonth]

// Formating input number
const formatNumber = (number, type) => {

    let budgetString = number.toString(),
    split = budgetString.split(','),
    sisa = split[0].length % 3,
    rupiah = split[0].substr(0, sisa),
    ribuan = split[0].substr(sisa).match(/\d{3}/gi);

    if(ribuan){
		separator = sisa ? '.' : '';
		rupiah += separator + ribuan.join('.');
	}
 
	rupiah = split[1] != undefined ? rupiah + ',' + split[1] : rupiah;
    
    return `${type === 'inc' ? '+' : '-'} ${rupiah}` 
}

// Deleting Item in the UI
const deleteListItem = (event) => {
    const item = event.target.parentNode.parentNode.parentNode.parentNode;
    const itemID = item.id;
    const splitID = itemID.split('-');
    let id = parseInt(splitID[1])
    let deleteIndex = itemList.findIndex(item => item.id === parseInt(id))
    if (id !== -1) {
        deletedItem = itemList.splice(deleteIndex, 1)
        console.log(deletedItem[0].type);
        budget > 0 ? type = 'inc' : type = 'exp'
        if (deletedItem[0].type === 'inc') {
            budget -= parseInt(deletedItem[0].value)
            prevInputIncome -= deletedItem[0].value
            budgetLabel.innerHTML = 'IDR ' + formatNumber(budget, type);
            incomeLabel.innerHTML = formatNumber(prevInputIncome, 'inc');
        } else if (deletedItem[0].type === 'exp') {
            budget += parseInt(deletedItem[0].value)
            prevInputExpense -= deletedItem[0].value
            budgetLabel.innerHTML = 'IDR ' + formatNumber(budget, type)   
            expenseLabel.innerHTML = formatNumber(prevInputExpense, 'exp')
        }
    }
    item.remove()
    console.log(prevInputExpense);
}

// Changing budget label
const calcTotalBudget = () => {
    let type;

    budget = prevInputIncome - prevInputExpense;
    console.log(budget);
    budget > 0 ? type = 'inc' : type = 'exp'

    budgetLabel.innerHTML = 'IDR ' + formatNumber(budget, type)   
}

// Rendering income / expense item
const renderItem = (id, type, description, value, parentContainer) => {
    let renderedItem = '';
    
    if (type === 'inc'){
        renderedItem = `
            <div class="item" id="income-${id}">
                <div class="item-description">${description}</div>
                <div class="value-cta">
                    <div class="item-value">${formatNumber(value, 'inc')}</div>
                    <div class="item-delete">
                        <button><i class="fas fa-times"></i></button>
                    </div>
                </div>
            </div>
        `
    } else if (type === 'exp') {
        renderedItem = `
            <div class="item" id="expense-${id}">
                <div class="item-description">${description}</div>
                <div class="value-cta">
                    <div class="item-value">${formatNumber(value, 'exp')}</div>
                    <div class="item-delete">
                        <button><i class="fas fa-times"></i></button>
                    </div>
                </div>
            </div>
        `
    }
    parentContainer.insertAdjacentHTML('beforeend', renderedItem)
}

// Changing income and expense label
[ incomeLabel, expenseLabel ].forEach(el => {
    el.textContent = '--'
})
budgetLabel.innerHTML = 'IDR - 00.00'

const changeLabel = (...input) => {
    if (inputType.options[inputType.selectedIndex].value === 'inc') {
        input.map(i => {
            let labelTotal = parseInt(i)+ prevInputIncome;
            prevInputIncome = labelTotal
    
        })
        incomeLabel.innerHTML = formatNumber(prevInputIncome, 'inc');
    } else if (inputType.options[inputType.selectedIndex].value === 'exp') {
        input.map(i => {
            let labelTotal = parseInt(i)+ prevInputExpense;
            prevInputExpense = labelTotal
    
        })
        expenseLabel.innerHTML = formatNumber(prevInputExpense, 'exp');
    }
}

// Adding new Item
inputBtn.addEventListener('click', () => {
    const item = itemDetail(
        inputDescription.value, 
        inputType.options[inputType.selectedIndex].value , 
        inputValue.value
    );
    itemList.push(item)
    console.log(item);
    if (inputType.options[inputType.selectedIndex].value === 'inc') {
        renderItem(
            item.id, 
            item.type, 
            item.description, 
            item.value, 
            incomeList
        );
        changeLabel(inputValue.value);

    } else if (inputType.options[inputType.selectedIndex].value === 'exp') {
        renderItem(
            item.id, 
            item.type, 
            item.description, 
            item.value,  
            expenseList
        );
        changeLabel(inputValue.value);
    }
    calcTotalBudget()
    console.log(budget);
})

incomeExpenseContainer.addEventListener('click', deleteListItem)
