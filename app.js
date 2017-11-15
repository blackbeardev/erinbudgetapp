//The Budget controller module - keeps track of all the incomes and expenses, the budget and the percentages

var budgetController = (function () {

    //Create expense function constructor:
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    //Create income function constructor:
    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        }
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
        expensesContainer: ".expenses__list"
    };
    

    return {
        //Get the input values:       
        getInput: function() {
            return {
                type: document.querySelector(domStrings.inputType).value,   //Will be inc or exp
                description: document.querySelector(domStrings.inputDescription).value,
                value: document.querySelector(domStrings.inputValue).value
            };
        },
        addListItem: function(obj, type) {      //obj will be the newItem variable from the ctrlAddItem function
            var html, newHtml, element;
            //Create html string with placeholder text:
            if(type === "inc") {
                element = domStrings.incomeContainer;
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div> <div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if(type === "exp") {
                element = domStrings.expensesContainer;
                html = '<div class="item clearfix" id="%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            
            //Replace the placeholder text with actual data - using the replace method:
            newHtml = html.replace("%id%", obj.id);
            newHtml = newHtml.replace("%description%", obj.description);
            newHtml = newHtml.replace("%value%", obj.value);

            //Insert html into the DOM - select an existing element in the DOM and then insert the new element next to that:
            document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);
            

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
    };

    

    //Create a function which will perform all the necessary tasks to add a new item to the budget:
    var ctrlAddItem = function() {
        var input, newItem;
        //Get the field input data
        input = UICtrl.getInput();
        console.log(input);

        //Add the item to the budget controller:
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);

        //Add the new item to the UI - call the UICtrl.addListItem function:
        UICtrl.addListItem(newItem, input.type);

        //Calculate the budget:

        //Display the budget on the UI:

    };

    return {
        init: function() {
            console.log("The application has started.");
            setUpEventListeners();
        }
    }



})(budgetController, UIController);

//Call the init function:
controller.init();