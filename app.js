// BUDGE CONTROLLER
var budgetController = (function() {
   
    var Expense = function(id,description,value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };
    Expense.prototype.calcPercentage = function(totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    };
    
    
    Expense.prototype.getPercentage = function() {
        return this.percentage;
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
            inc:[],
            exp:[]
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

        DeletItem: function(type,id) {
            var ids, index;
            
            // id = 6
            //data.allItems[type][id];
            // ids = [1 2 4  8]
            //index = 3
            
            ids = data.allItems[type].map(function(current) {
                return current.id;
            });

            index = ids.indexOf(id);

            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }
            
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
           if(data.totals.inc > 0) {
            data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            console.log(data.percentage); 
           }else {
               data.percentage = -1;
           }
             
        },
        calculatePercentages: function() {
            /*
            a=10
            b=30
            c=40
            incom=100
            percentage
            a = 10/100 = 10%
            b = 30/100 = 30%
            c = 40/100 = 40% 
            */
            data.allItems.exp.forEach(function(cur){
                cur.calcPercentage(data.totals.inc);
            });

        },
        
        getPercentages: function() {
            var allPerc = data.allItems.exp.map(function(cur){
                return cur.getPercentage();
            });
            return allPerc;
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
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        Container: '.container',
        expensesPercLabel: '.item__percentage',
        Datelabel: '.budget__title--month'
    }

    var formateNumber = function(num, type) {
       var numsplit, int, dec;
        num = Math.abs(num);
        num = num.toFixed(2);

        numsplit = num.split('.');
        console.log(numsplit);
        
        int = numsplit[0];
        console.log(int);

        if(int.length > 3){
            int = int.substr(0, int.length - 3)+ ',' + int.substr(int.length - 3, 3);
        }
        console.log(int);

        dec = numsplit[1];
        console.log(dec);

        return (type === 'exp' ? '-' : '+')+ ' ' + int + '.' + dec;
    }
    /*formateNumber(24564.56, 'inc');
    formateNumber(5089, 'exp');*/
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
            newHtml = newHtml.replace('%value%',formateNumber(obj.value, type));
           
            // Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        DeletListitem: function(selectorID) {
            var el
            el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
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

        displayBudget: function(obj) {
            var type;
            obj.budget > 0 ? type = 'inc' : type = 'exp';
            document.querySelector(DOMstrings.budgetLabel).textContent = formateNumber(obj.budget,type);
            document.querySelector(DOMstrings.incomLabel).textContent = formateNumber(obj.totalInc,'inc');
            document.querySelector(DOMstrings.expensesLabel).textContent = formateNumber(obj.totalExp,'exp');
           
            
            if(obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            } else{
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }
        },

        displayPercentages: function(percentages) {
            
            var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);
            var nodeListForEach = function(list, callback) {
                for (var i = 0; i < list.length; i++) {
                    callback(list[i], i);
                }
            };
            nodeListForEach(fields, function(current, index) {
                
                if (percentages[index] > 0) {
                    current.textContent = percentages[index] + '%';
                } else {
                    current.textContent = '---';
                }
            });
            
        },
        
        DisplayMonth: function() {
            var vats, months, month, year, date;

            vats = new Date();
            console.log(vats)

            date = vats.getDate();
            console.log(date);

            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            month = vats.getMonth();
            console.log(month);

            year = vats.getFullYear();
            console.log(year);
            document.querySelector(DOMstrings.Datelabel).textContent =date + ' ' + months[month] + ' ' + year;
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

            document.querySelector(Dom.Container).addEventListener('click', ctlrDeletItem)
        });
    };  
    
    var updateBudget = function() {
        //1. Calculate the budget
        budgectrl.calculateBudget();
        //2. Return the Budget.
        var budget = budgectrl.getBudget();
        //3. Display the budget on the UI.
        console.log(budget);
        UICtlrl.displayBudget(budget);
    };

   var updatePercentage = function() {
        //claculate percentages.
        budgectrl.calculatePercentages();
        //read percentage from the budgectlr.
        var Percentages = budgectrl.getPercentages();
        //Updte the UI and the percentge.
        UICtlrl.displayPercentages(Percentages);
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
            //6. calculate and Updet the percentage. 
            updatePercentage();  
        }
            
    };

    var ctlrDeletItem = function(event) {
        var itemID, splitID, type;
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if (itemID){
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);
        }
        //1.Delet the item from the data sturectur.
        budgetController.DeletItem(type,ID)
        //2.Delet the item from the UI.
        UICtlrl.DeletListitem(itemID);
        //3.Update and show the new budget.
        updateBudget();
        // 4.  calculate and Updet the percentage. 
        updatePercentage(); 
    }; 


     
    return{
        Init: function() {
            console.log('app start working');
            UICtlrl.DisplayMonth();
            UICtlrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setupEventListner();
        }
    };
    
})(budgetController,UIController);

Controller.Init(); 
