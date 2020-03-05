// Storage Controller


//Item Controller

const ItemCtrl = (function (){

    //Item Constructor
    const Item = function(id, name, calories){
        this.id = id;
        this.name = name;
        this.calories = calories;

    }

    //Data Structur / State

    const data = {
        items: [
            // {id: 0, name: 'Steak Dinner', calories: 1200},
            // {id: 1, name: 'Cookie', calories: 400},
            // {id: 2, name: 'Eggs', calories: 300}
        ],
        currentItem: null,
        totalCalories: 0
    };

    // Public Methods
    return {

        logData: function(){
            return data;
        },
        getItems: function(){
            return data.items;
        },
        addItem: function(name, calories){
            let ID;

            // Create ID
             if(data.items.length > 0){
                ID = data.items[data.items.length - 1].id + 1;
             }else{
                ID = 0;
             }

             //Calories to number
             calories = parseInt(calories);

             //Create a new Item
             const newItem = new Item(ID, name, calories);
             data.items.push(newItem);

             return newItem;

        },
        getTotalCalories: function(){
            let total = 0;

            data.items.forEach(function(item){

                total += item.calories;
            });
            data.totalCalories = total;
            return data.totalCalories;
              
        }
    };

})();

//UI Controller

const UICtrl = (function(){
    const UISelectors = {
        itemList: '#item-list',
        addBtn: '.add-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        totalCalories: '.total-calories'
    };

    //Public Methods
    return {
        populateItemList: function(items){

            let html = '';
            items.forEach(function(item){

                html += `<li class="collection-item" id="item-${item.id}"><strong>${item.name}:</strong> <em>${item.calories} Calories</em> 
                <a href="" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>
                </li>`
            });

            //Insert list Items

            document.querySelector(UISelectors.itemList).innerHTML = html;
        },
        getItemInput: function(){

            return {
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories:document.querySelector(UISelectors.itemCaloriesInput).value
            }
        },
        getSelectors: function(){
            return UISelectors;
        },
        addListItem: function(newItem){
            //Show the list

            document.querySelector(UISelectors.itemList).style.display = 'block'
            
            //Create li element
            const li = document.createElement('li');
            li.className = 'collection-item';
            li.id = `item-${newItem.id}`;

            //Add HTML

            li.innerHTML = `<strong>${newItem.name}:</strong> <em>${newItem.calories} Calories</em> 
            <a href="" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>`;

            //Insert item
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);

        },

        clearInput: function(){

            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCaloriesInput).value = '';
        },
        hideList: function(){
            document.querySelector(UISelectors.itemList).style.display = 'none';
        },
        showTotalCalories: function(totalCalories){
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
        }
    };
})();

// App Controller

const App = (function(ItemCtrl, UICtrl){

    // Load Event listeners
    const loadEventListeners = function(){
        //get UI Selectors
        const UISelectors = UICtrl.getSelectors();

        // Add Item Event
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);
    }

    // add item submit
    const itemAddSubmit = function(e){

        const input = UICtrl.getItemInput();
        let newItem;
        //Check for name and calorie input
        if(input.name !== '' && input.calories !== ''){

            //add item
            newItem = ItemCtrl.addItem(input.name,input.calories);
            //Add item to UI list
            UICtrl.addListItem(newItem);
            //Clear fields
            UICtrl.clearInput();
            //Get total calories;
            const totalCalories = ItemCtrl.getTotalCalories();
            //Show up the total calories
            UICtrl.showTotalCalories(totalCalories);

        }else{
            M.toast({html: `Please check the input fields`,
                    displayLength: '2000',
                    classes:'rounded red darken-2'                 
        });
        }


        e.preventDefault();
    }

    //Public Methods
    return {
        init: function(){

            // Fetch items from data structure
            const items = ItemCtrl.getItems();
            
            // Check if the list is empty
            if(items.length === 0){
                UICtrl.hideList();

            }else{
                // Populate List with items
                UICtrl.populateItemList(items);
            }

            //Get total calories;
            const totalCalories = ItemCtrl.getTotalCalories();
            //Show up the total calories
            UICtrl.showTotalCalories(totalCalories);
            
            //Load Event Listeners
            loadEventListeners();
        } 
    }
    
})(ItemCtrl, UICtrl);

//Initialize app
App.init();