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

    var data = {
        allItems: {
            exp:[],
            inc:[]
        },
        totals: {
            exp: 0,
            inc: 0
        }
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
        testing: function() {
            console.log(data);
        }
        
    };
})();

// UI CONTROLLER
var UIController = (function() {
    
    var domString = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn'
    }
    return{
        getInput: function() {
            return {
                type: document.querySelector(domString.inputType).value, // it will be a inc or exp.
                description: document.querySelector(domString.inputDescription).value,
                value: document.querySelector(domString.inputValue).value
            };
        },

        getDomstring: function() {
            return domString;
        }
    };
    
})();

// GLOBEL APP CONTROLLER
var Controller = (function(budgectrl,UICtlrl) {

    var setupEventListner = function() {
            var Dom = UICtlrl.getDomstring();

            document.querySelector(Dom.inputBtn).addEventListener('click', ctlrAddItem);
            document.addEventListener('keypress', function(event) {
            if (event.keyCode === 13 || event.which === 13) {
                ctlrAddItem();
            }
        });
    };  
    

    var ctlrAddItem = function() {
        var input, newitem;
        // 1. get the filed input data
            input = UICtlrl.getInput();
       // 2. add the item to  the budget controller
            newitem = budgectrl.addItem(input.type, input.description, input.value);
       // 3. add item to the UI

       // 4. Calculate the budget

       // 5. Display the budget on the UI
     
    };
     
    return{
        Init: function() {
            console.log('app start working');
            setupEventListner();
        }
    };
    
})(budgetController,UIController);

Controller.Init(); 
