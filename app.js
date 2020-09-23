// BUDGE CONTROLLER
var budgetController = (function() {
   // some code
})();

// UI CONTROLLER
var UIController = (function() {
    // some code
})();

// GLOBEL APP CONTROLLER
var Controller = (function(budgectrl,UICtlrl) {

    var ctlrAddItem = function() {
        // 1. get the filed input data

       // 2. add the item to  the budget controller

       // 3. add item to the UI

       // 4. Calculate the budget

       // 5. Display the budget on the UI

       console.log('yes u can  fuck')
    }
    document.querySelector('.add__btn').addEventListener('click', ctlrAddItem);

    document.addEventListener('keypress', function(event) {
        if (event.keyCode === 13 || event.which === 13) {
        ctlrAddItem();
        }
    });

})(budgetController,UIController);