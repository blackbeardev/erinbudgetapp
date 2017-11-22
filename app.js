//The Budget controller module - keeps track of all the incomes and expenses, the budget and the percentages

var budgetController = (function () {

    //Create expense function constructor:
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    //Add a method to the constructor to calculate the percentage of each expense:
    Expense.prototype.calcPercentage = function(totalIncome) {
        if(totalIncome > 0) {
            this.percentage = Math.round((this.value/totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercentage = function() {
        return this.percentage;
    }

    //Create income function constructor:
    var Income = function(id, description, value) {
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
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    };

    return {
        //To create a new item:
        addItem: function(type, des, val) {      //type refers to exp or inc
            var newItem;

            //Find the id for the new item:
            if(data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }
            

           //Create new item based on inc or exp type: 
           if(type === "exp" ){
                newItem = new Expense(ID, des, val);
           } else if(type === "inc") {
               newItem = new Income(ID, des, val);
           }

           //Push the item into the allItems object and the correct array - exp or inc:
           data.allItems[type].push(newItem);
           //Return the new element:
           return newItem;
        },
        deleteItem: function(type, id) {
            var ids, index;
            //Create an array with all the id numbers that we have:
            //Map will always return a new array:
            ids = data.allItems[type].map(function(current) {
                return current.id;
            });

            index = ids.indexOf(id);

            //Remove the item if the item exists:
            if(index !== -1) {
                //Delete item from the array:
                data.allItems[type].splice(index, 1);
            }
        },
        calculateBudget: function() {
            //calculate total income and expenses:
            calculateTotal("exp");
            calculateTotal("inc");

            //calculate the budget = income - expenses:\
            data.budget = data.totals.inc - data.totals.exp;

            //calculate the percentage of income that has been spent:
            if(data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }
            
        },
        calculatePercentages: function() {

            data.allItems.exp.forEach(function(current) {
                current.calcPercentage(data.totals.inc);
            });
        },
        getPercentages: function() {
            var allPerc = data.allItems.exp.map(function(current) {
                return current.getPercentage();
            });
            return allPerc;
        },
        getBudget: function() {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
        },
        testing: function() {
            console.log(data);
        }
    };

})();


//The UI controller module

var UIController = (function () {

    //Create a variable to hold all the querySelector values:
    var domStrings = {
        inputType: ".add__type",
        inputDescription: ".add__description",
        inputValue: ".add__value",
        inputBtn: ".add__btn",
        incomeContainer: ".income__list",
        expensesContainer: ".expenses__list",
        budgetLabel: ".budget__value",
        incomeLabel: ".budget__income--value",
        expenseLabel: ".budget__expenses--value",
        percentageLabel: ".budget__expenses--percentage",
        container: ".container",
        expensesPercentageLabel: ".item__percentage"
    };
    

    return {
        //Get the input values:       
        getInput: function() {
            return {
                type: document.querySelector(domStrings.inputType).value,   //Will be inc or exp
                description: document.querySelector(domStrings.inputDescription).value,
                value: parseFloat(document.querySelector(domStrings.inputValue).value)   //Convert the value from a string into a float
            };
        },
        addListItem: function(obj, type) {      //obj will be the newItem variable from the ctrlAddItem function
            var html, newHtml, element;
            //Create html string with placeholder text:
            if(type === "inc") {
                element = domStrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div> <div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if(type === "exp") {
                element = domStrings.expensesContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            
            //Replace the placeholder text with actual data - using the replace method:
            newHtml = html.replace("%id%", obj.id);
            newHtml = newHtml.replace("%description%", obj.description);
            newHtml = newHtml.replace("%value%", obj.value);

            //Insert html into the DOM - select an existing element in the DOM and then insert the new element next to that:
            document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);
        },
        deleteListItem: function(selectorID) {
            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
        },
        clearFields: function() {
            var fieldsToClear, fieldsToClearArr;
            
            fieldsToClear = document.querySelectorAll(domStrings.inputDescription + ", " + domStrings.inputValue);   //This will return a list of all the values which we need to convert to an array using the slice method:

            //Access the slice method via the Array function constructor's prototype property and then use the call method to change the this variable:
            //This will trick the slice method into believing that the list returned from the querySelectorAll method is an array instead of a list:
            fieldsToClearArr = Array.prototype.slice.call(fieldsToClear);

            //Now we can loop over the array to clear all the fields:
            //Can use three parameters - the current value, index number, entire array:
            fieldsToClearArr.forEach(function(current, index, array) {
                current.value = "";
            });

            //Set the focus on the description input field:
            fieldsToClearArr[0].focus();

        },
        displayBudget: function(obj) {
            document.querySelector(domStrings.budgetLabel).textContent = obj.budget;
            document.querySelector(domStrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(domStrings.expenseLabel).textContent = obj.totalExp;
            

            if(obj.percentage > 0) {
                document.querySelector(domStrings.percentageLabel).textContent = obj.percentage + "%";
            } else {
                document.querySelector(domStrings.percentageLabel).textContent = "---";
            }
        },
        displayPercentages: function(percentages) {
           var fields = document.querySelectorAll(domStrings.expensesPercentageLabel);

           var nodeListForEach = function(list, callback) {
                for(var i = 0; i < list.length; i++) {
                    callback(list[i], i);
                }
           };

           nodeListForEach(fields, function(current, index) {
                if(percentages[index] > 0) {
                    current.textContent = percentages[index] + "%";
                } else {
                    current.textContent = percentages[index] + "---";
                }
           });
        },
        getDomStrings: function() {
            return domStrings;
        }
    };

})();



//The controller module - which will connect the other two modules and tell them what to do:
var controller = (function (budgetCtrl, UICtrl) {

    //Get access to the getDomStrings function from the UIController:
    var DOM = UICtrl.getDomStrings();

    //Create a function that will contain all the event listeners - this will be used in the returned init function:
    var setUpEventListeners = function() {
        //Set up the event listener for when the add button is clicked - will call the ctrlAddItem function:
        document.querySelector(DOM.inputBtn).addEventListener("click", ctrlAddItem);
    
        //Set up the event listener for when the enter key is pressed:
        document.addEventListener("keypress", function(e) {
            if(e.keyCode === 13 || e.which === 13) {
                //Call the ctrlAddItem function:
                ctrlAddItem();
            }
        });

        document.querySelector(DOM.container).addEventListener("click", ctrlDeleteItem);

    };

    //Update the budget:
    var updateBudget = function() {
        
        //Calculate the budget:
        budgetCtrl.calculateBudget();

        //Return the budget:
        var budget = budgetCtrl.getBudget();

        //Display the budget on the UI:
        UICtrl.displayBudget(budget);
    };

    var updatePercentages = function() {

        //Calculate percentages:
        budgetCtrl.calculatePercentages();
        //Read them from the budgetController:
        var percentages = budgetCtrl.getPercentages();
        //Update the UI:
        UICtrl.displayPercentages(percentages);

    };

    //Create a function which will perform all the necessary tasks to add a new item to the budget:
    var ctrlAddItem = function() {
        var input, newItem;
        //Get the field input data
        input = UICtrl.getInput();
        console.log(input);

    //Only perform the next actions if there is data entered for us to use:
        if(input.description !== "" && !isNaN(input.value) && input.value > 0) {
            //Add the item to the budget controller:
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);
        
            //Add the new item to the UI - call the UICtrl.addListItem function:
            UICtrl.addListItem(newItem, input.type);
        
            //Clear the input fields:
            UICtrl.clearFields();
        
            //Calculate the budget:
            updateBudget();

            //Calculate and update percentages:
            updatePercentages();
        
            //Display the budget on the UI:
        }
    };

    var ctrlDeleteItem = function(e) {
        var itemID, splitID, type, ID;
        //Find where the event was first fired and capture the id of the item clicked on:
        itemID = e.target.parentNode.parentNode.parentNode.parentNode.id;

        if(itemID) {
            splitID = itemID.split("-");
            type = splitID[0];
            ID = parseInt(splitID[1]);

            //delete the item from the data structure:
            budgetCtrl.deleteItem(type, ID);

            //delete the item from the UI:
            UICtrl.deleteListItem(itemID);

            //update and show the new budget:
            updateBudget();

            //Calculate and update percentages:
            updatePercentages();
        }

    }

    return {
        init: function() {
            console.log("The application has started.");
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setUpEventListeners();
        }
    }



})(budgetController, UIController);

//Call the init function:
controller.init();