// BUDGE CONTROLLER
var budgetController = (function() {
   
    var Expense = function(id,description,value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var Income = function(id,description,value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var calculateTotal = function(type) {
        var sum = 0;

        data.allItems[type].forEach(function(cur) {
            sum += cur.value;
        });
        data.totals[type] = sum;
    };

    var data = {
        allItems: {
            exp:[],
            inc:[]
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: 0
    };

    return {

        addItem: function(type,des,val) {

            var newItem, ID;
            
            //[1 2 3 4 5], next ID = 6
            //[1 2 4 6 8], next ID = 9
            // ID = last ID + 1
            
            // Create new ID
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }
            
            // Create new item based on 'inc' or 'exp' type
            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }
            
            // Push it into our data structure
            data.allItems[type].push(newItem);
            
            // Return the new element
            return newItem;
        },

        calculateBudget: function() {
            // calculate total incom and expenses.
            calculateTotal('exp');
            calculateTotal('inc');
            // calculate total budget: incom - expenses.
            data.budget = data.totals.inc - data.totals.exp;
            // calculate total percentage of incom that we spent.
            /* 1. Exp = 100 and Inc =  200  spent = 50%  calcu is 100/200 = 0.5 * 100 = 50
               2. Exp = 100 and Inc = 300 spent = 33.333 calcu is 100/300 = 0.333 * 100 = 33 for that we use 
               method "Meth.round"
            */
           data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);   
        },

        getBudget:function() {
            return{
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
        },

        testing: function() {
            console.log(data);
        }
        
    };
})();

// UI CONTROLLER
var UIController = (function() {
    
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list'
    }
    return{
        getInput: function() {
            return {
                type: document.querySelector(DOMstrings.inputType).value, // it will be a inc or exp.
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };
        },

        addListItem: function(obj, type) {
            var html, newHtml, element;
            // Create HTML string with placeholder text
            
            if (type === 'inc') {
                element = DOMstrings.incomeContainer;
                
                html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp') {
                element = DOMstrings.expensesContainer;
                
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            
            // Replace the placeholder text with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value, type);
           
            // Insert the HTML into the DOM
            var x = document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        // clear fielfd.
        clearField: function() {
            var fields, fieldsArr;

            fields = document.querySelectorAll(DOMstrings.inputDescription + ',' + DOMstrings.inputValue) ;
            console.log(fields);

            /* doing this bcs "querySelectorAll" gives us a result in a list form and we dont have a good methods
            for a list like we have for array so we have to  convert in to the array we can't do  directly so
            we have to use a array method slice in a prototype and useing the call method to call the slice method 
            */ 
            fieldsArr = Array.prototype.slice.call(fields);
            console.log(fieldsArr);

            // clear the input value(disception & value).
            fieldsArr.forEach(function(current) {
                current.value = "";
            });
            // put us back to the discription field
            fieldsArr[0].focus();
        },
        getDOMstrings: function(){
            return DOMstrings;
        }
    };
    
})();

// GLOBEL APP CONTROLLER
var Controller = (function(budgectrl,UICtlrl) {

    var setupEventListner = function() {
            var Dom = UICtlrl.getDOMstrings();

            document.querySelector(Dom.inputBtn).addEventListener('click', ctlrAddItem);
            document.addEventListener('keypress', function(event) {
            if (event.keyCode === 13 || event.which === 13) {
                ctlrAddItem();
            }
        });
    };  
    
    var updateBudget = function() {
        //1. Calculate the budget
        budgectrl.calculateBudget();
        //2. Return the Budget.
        var budget = budgectrl.getBudget();
        //3. Display the budget on the UI.
        console.log(budget);
    };

    var ctlrAddItem = function() {
        var input, newitem;
        // 1. get the filed input data
        input = UICtlrl.getInput();

        if(input.description !== "" && !isNaN(input.value) && input.value > 0) {
            // 2. add the item to  the budget controller
            newitem = budgectrl.addItem(input.type, input.description, input.value);
            // 3. add item to the UI
            UICtlrl.addListItem(newitem, input.type);
            // 4. Clear all Fields
            UICtlrl.clearField(); 
            // 5. Calculate and Update Budget.
            updateBudget();   
        }
            
     
    };
     
    return{
        Init: function() {
            console.log('app start working');
            setupEventListner();
        }
    };
    
})(budgetController,UIController);

Controller.Init(); 

