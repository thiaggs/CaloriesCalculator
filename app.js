// Storage Controller
const StorageCtrl = (function(){

    return {

        storeItem: function(item){
            let items;
            
            //Check if any items in ls
            if(localStorage.getItem('items') === null){

                items = [];
                //Push new item
                items.push(item);
                //Set ls
                localStorage.setItem('items', JSON.stringify(items));

            }else{

                items = JSON.parse(localStorage.getItem('items'));
                items.push(item);
                localStorage.setItem('items', JSON.stringify(items));
            }
        },
        unstoreItem: function(id){

            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach(function(item){
                if(item.id === id){
                    items.splice(item, 1);
                }
            });

            localStorage.setItem('items', JSON.stringify(items));

        },
        unstoreAllItems: function(){
            
            localStorage.removeItem('items');
        },
        updateItemStorage: function(updatedItem){

            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach(function(item, index){

                if(updatedItem.id === item.id){
                    items.splice(index, 1, updatedItem);
                }
            });

        },

        getItemsFromStorage: function(){

            let items;

            if(localStorage.getItem('items') === null){
                items = [];
                
            }else{
                items = JSON.parse(localStorage.getItem('items'));
            }

            return items;
        },

    }
})();

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
        // items: [
            // {id: 0, name: 'Steak Dinner', calories: 1200},
            // {id: 1, name: 'Cookie', calories: 400},
            // {id: 2, name: 'Eggs', calories: 300}
        // ],
        items: StorageCtrl.getItemsFromStorage(),
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
        getItemById: function(id){

            let found;

            data.items.forEach(function(item){
                if(item.id === id){
                    found = item;
                }
            });

            return found;
        },
        setCurrentItem: function(item){
            data.currentItem = item;
        },
        getCurrentItem: function(){

            return data.currentItem;
        },
        updateItem: function(name, calories){

            calories = parseInt(calories);
            let found;

            data.items.forEach(function(item){

                if(item.id === data.currentItem.id){
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }

                
            });

            return found;
        },
        deleteItem: function(id){

            data.items.forEach(function(item){

                if(item.id === id){
                    data.items.splice(item, 1);
                }
            });
        },
        clearAllItems: function(){

            data.items = [];
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
    }

})();

//UI Controller

const UICtrl = (function(){
    const UISelectors = {
        itemList: '#item-list',
        listItems: '#item-list li',
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        clearAll: '.clear-btn',
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
                <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>
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
            <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>`;

            //Insert item
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);

        },
        updateListItem: function(item){
          
            let listItems = document.querySelectorAll(UISelectors.listItems);

            //Convert a node list into array
            listItems = Array.from(listItems);

            listItems.forEach(function(listItem){

                const itemID = listItem.getAttribute('id');

                if(itemID === `item-${item.id}`){
                    document.querySelector(`#${itemID}`).innerHTML = `<strong>${item.name}:</strong> <em>${item.calories} Calories</em> 
                    <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>`;
                }
            });

            UICtrl.hideEditState();
            UICtrl.showTotalCalories(ItemCtrl.getTotalCalories());
 
        },
        deleteListItem: function(id){

            document.querySelector(`#item-${id}`).remove();
            UICtrl.showTotalCalories(ItemCtrl.getTotalCalories());
            UICtrl.hideEditState();
        },
        removeAllItems: function(){
          
            let listItems = document.querySelectorAll(UISelectors.listItems);

            // Turn node list into an array
            listItems = Array.from(listItems);
            
            listItems.forEach(function(item){

                item.remove();
            });
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
        },
        hideEditState: function(){

            UICtrl.clearInput();
            document.querySelector(UISelectors.addBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none'; 
        },
        showEditState: function(){

            UICtrl.clearInput();
            document.querySelector(UISelectors.addBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline'; 
        },
        addItemToForm: function(){
            UICtrl.showEditState();

            const currentItem = ItemCtrl.getCurrentItem();
            
            document.querySelector(UISelectors.itemNameInput).value = currentItem.name;
            document.querySelector(UISelectors.itemCaloriesInput).value = currentItem.calories;
        
            
        }
    };
})();

// App Controller

const App = (function(ItemCtrl, StorageCtrl, UICtrl){

    // Load Event listeners
    const loadEventListeners = function(){
        //get UI Selectors
        const UISelectors = UICtrl.getSelectors();

        // Add Item Event
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);
        document.addEventListener('keypress', function(e){
            if(e.keyCode === 13 || e.which === 13){

                e.preventDefault();
                return false;
            }
        });

        document.querySelector(UISelectors.itemList).addEventListener('click', itemClickEdit);
        document.querySelector(UISelectors.deleteBtn).addEventListener('click',itemDeleteSubmit);
        document.querySelector(UISelectors.backBtn).addEventListener('click',UICtrl.hideEditState);
        document.querySelector(UISelectors.updateBtn).addEventListener('click',itemUpdateSubmit);
        document.querySelector(UISelectors.clearAll).addEventListener('click',clearAllItemsClick);

        
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

            //Store in localStorage
            StorageCtrl.storeItem(newItem);

        }else{
            M.toast({html: `Please check the input fields`,
                    displayLength: '2000',
                    classes:'rounded red darken-2'                 
        });
        }


        e.preventDefault();
    };

    const itemClickEdit = function(e){

        if(e.target.classList.contains('edit-item')){

            //Get the li id 'item-0' 'item-1'
            const listItemId = e.target.parentNode.parentNode.id;

            // Split the id in 'item' and 'number'
            const listItemIdArr = listItemId.split('-');
            //Get only the number
            const onlyId = parseInt(listItemIdArr[1]);
            
            const itemToEdit = ItemCtrl.getItemById(onlyId);
            ItemCtrl.setCurrentItem(itemToEdit);

            //Add item to form
            UICtrl.addItemToForm();

        }
    };
    const itemUpdateSubmit = function(e){
        const UISelectors = UICtrl.getSelectors();
        const input = UICtrl.getItemInput();
    
        const updatedItem = ItemCtrl.updateItem(input.name, input.calories);
    
        //Update UI
        UICtrl.updateListItem(updatedItem);

        //Update local storage

        StorageCtrl.updateItemStorage(updatedItem);

        e.preventDefault();
    };

    const itemDeleteSubmit = function(e){
        const currentItem = ItemCtrl.getCurrentItem();
        const UISelectors = UICtrl.getSelectors();

        ItemCtrl.deleteItem(currentItem.id);

        //Delete from UI
        UICtrl.deleteListItem(currentItem.id);

        //Delete from local storage

        StorageCtrl.unstoreItem(currentItem.id);

        e.preventDefault();
    };

    const clearAllItemsClick = function(){
        //Delete all items from data structure

        ItemCtrl.clearAllItems();
        //Remove from  ui

        UICtrl.removeAllItems();
        // Remove from storage

        StorageCtrl.unstoreAllItems();


        UICtrl.hideList();
        UICtrl.showTotalCalories(ItemCtrl.getTotalCalories());
    }

    //Public Methods
    return {
        init: function(){

            // Clear edit State
            UICtrl.hideEditState();
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
    
})(ItemCtrl, StorageCtrl, UICtrl);

//Initialize app
App.init();