// BUDGE CONTROLLER
var budgetController = (function() {
   // some code
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
                type: document.querySelector(domString.inputType).value,
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
        // 1. get the filed input data
        var input = UICtlrl.getInput();
        console.log(input);
       // 2. add the item to  the budget controller

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
