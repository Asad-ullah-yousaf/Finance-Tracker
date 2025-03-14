/*-------------- Responsive Menu-------------------- */
const open = document.getElementById('open');
    const menu = document.getElementById('menu');
    const close = document.getElementById('close');
    const menuSec = document.getElementById('menu-2')
    open.addEventListener('click', function () {
        menuSec.classList.add('flex')
        return menuSec.classList.remove('hidden')
    });
    close.addEventListener('click', function () {
        menuSec.classList.add('hidden')
    })

   

    /*<!-------------------------Dark Mode-----------------> */
    const theme = document.getElementById('theme-toggle');
    const themeOnSmallScreen = document.getElementById('theme-toggle-2');
    const savedTheme = localStorage.getItem('data-theme');
    if (savedTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        theme.innerHTML = `<img src="ICONS/light-mode-icon.svg" class="size-auto"/>`;
        themeOnSmallScreen.innerHTML = `<img src="ICONS/light-mode-icon.svg" class="size-auto"/>`;
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        theme.innerHTML = `<img src="ICONS/dark-mode-icon.svg" class="size-auto"/>`;
        themeOnSmallScreen.innerHTML = `<img src="ICONS/dark-mode-icon.svg" class="size-auto"/>`;
    }
    theme.addEventListener('click', function () {
        const currentTheme = document.documentElement.getAttribute('data-theme');

        if (currentTheme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'light');
            theme.innerHTML = `<img src="ICONS/light-mode-icon.svg" class="size-auto"/>`;
            localStorage.setItem('data-theme', 'light');

        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            theme.innerHTML = `<img src="ICONS/dark-mode-icon.svg" class="size-auto"/>`;
            localStorage.setItem('data-theme', 'dark');
        }
    });

     //for smaller screen     
    function SmallScreenTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');

        if (currentTheme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'light');
            themeOnSmallScreen.innerHTML = `<img src="ICONS/light-mode-icon.svg" class="size-fit"/>`;
            localStorage.setItem('data-theme', 'light');

        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            themeOnSmallScreen.innerHTML = `<img src="ICONS/dark-mode-icon.svg" class="size-fit"/>`;
            localStorage.setItem('data-theme', 'dark');
        }
    }
    themeOnSmallScreen.addEventListener('click', SmallScreenTheme);

    /*----------------------------Main form interaction/Validation--------------------------------------*/
    //Display Ids
    const Income = document.getElementById('total');
    const Expense = document.getElementById('expense');
    const Balance = document.getElementById('balance');
    //form ids
    const description = document.getElementById('description');
    const amount = document.getElementById('amount');
    const select = document.getElementById('select');
    const add = document.getElementById('add');
    //checking type of amount and enabling category based on selection
    const Category = document.getElementById('select-category');
    // table ids
    const tbody = document.getElementById('tbody');
    let DataArray = JSON.parse(localStorage.getItem('DataArray')) || [];
    let currentId = DataArray.length > 0 ? Math.max(...DataArray.map((item) => item.id)) + 1 : 1;
    
    const MonthArray = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    let currentDate = new Date();
    const RetrieveMonth = (MonthArray) => {
        const dateMonth = MonthArray[currentDate.getMonth()];
        const dateDay = currentDate.getDate();
        const dateYear = currentDate.getFullYear();

        return dateMonth + "-" + dateDay + "-" + dateYear;
    }

    console.log(RetrieveMonth(MonthArray));



    document.addEventListener('DOMContentLoaded', function () {
        //save DataArray to local Storage
        function saveStorage() {
            localStorage.setItem('DataArray', JSON.stringify(DataArray));
            localStorage.setItem('updateChart()', JSON.stringify(updateChart()));
        }
        
        //Chart.js
        const ctx = document.getElementById('myChart');

        let myChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Income','Expense'],
                datasets: [{
                    label: 'Montly Income $',
                    data: [0, 0],
                    backgroundColor: '#5ce35cc4',
                    borderWidth: 3,
                    borderColor: '#5ce35cc4',
                    //barThickness: 500
                    // barPercentage:1.0

                },
                {
                    label: 'Montly Expense $',
                    data: [0, 0],
                    backgroundColor: '#eb3636be',
                    borderWidth: 3,
                    borderColor: '#eb3636be',
                    // barThickness: 500
                    // barPercentage:1.0,
                    // offset:true

                }
                ]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                maintainAspectRatio: false
            }
        });
        function updateChart() {
            // Calculate total income and expense
            const totalIncome = DataArray
                .filter((item) => item.type === "Income")
                .reduce((sum, item) => sum + parseFloat(item.amt), 0);

            const totalExpense = DataArray
                .filter((item) => item.type === "Expense")
                .reduce((sum, item) => sum + parseFloat(item.amt), 0);

            // Update the chart's datasets
            myChart.data.datasets[0].data = [totalIncome, 0]; // Income dataset
            myChart.data.datasets[1].data = [0, totalExpense]; // Expense dataset

            // Re-render the chart
            myChart.update();
        }

        /*-----------------------Form dropdown-----------------------------*/
        const seLect = document.getElementById('select');
        const expCat = document.getElementById('expenseCat');
        const incomeCat = document.getElementById('incomeCat');
    
        seLect.addEventListener('change', function(){
            if(seLect.value === "Income"){
                incomeCat.classList.remove('hidden');
                expCat.classList.add('hidden');
            }else if(seLect.value === "Expense"){
                expCat.classList.remove('hidden');
                incomeCat.classList.add('hidden');
            }else{
                expCat.classList.add('hidden');
                incomeCat.classList.add('hidden');
            }
        })
        
        /*-----function to check if all fields are filled or not---*/ 
        function ValidateFields() {
            if (description.value === "" || amount.value === "" || seLect.value === "--choose--") {
                alert("Please Fill out all fields and choose a type!");
                tbody.innerHTML = "";
            } else {
                return;
            }
        }
        /*------------------------Creating Rows-------------------------*/
        function CreateNewRow() {
            tbody.innerHTML = "";
            DataArray.forEach((item) => {
                const newRow = document.createElement('tr');
                newRow.innerHTML = `
                <td>${item.date}</td>
                <td>${item.desc}</td>
                <td>$${item.amt}</td>
                <td>${item.type}</td>
                <td class="flex gap-2">
                   <button class="text-white bg-blue-600 rounded-md px-2 py-1 cursor-pointer text-sm hover:scale-115 transition-all font-semibold" data-id="${item.id}">Edit</button>
                   <button class="text-white bg-red-600 rounded-md px-2 py-1 cursor-pointer text-sm hover:scale-115 transition-all font-semibold " data-id="${item.id}">Delete</button>
                </td>`
                if (item.type === "Income") {
                    newRow.classList.add('bg-green-200')
                } else {
                    newRow.classList.add('bg-red-100')
                }
                newRow.classList.add('Hover')
                tbody.appendChild(newRow);

            })
            saveStorage();
            CheckBalance(DataArray);
        }
        //


        /*------------------------Calculations for income/expense/balance -------------------------*/
        function CheckBalance(DataArray) {
            //total income
            const TotalExpense = DataArray.filter((item) => item.type === "Expense").map((item) => parseInt(item.amt));
            const sumExpense = TotalExpense.reduce((sum, acc) => sum + acc, 0);
            //Total Expense
            const TotalIncome = DataArray.filter((item) => item.type === "Income").map((item) => parseInt(item.amt));
            const sumIncome = TotalIncome.reduce((sum, acc) => sum + acc, 0);
            //Remaining Balance
            if (sumIncome > sumExpense) {
                const remainingBalance = sumIncome - sumExpense;
                Expense.innerHTML = "$" + sumExpense;
                Income.innerHTML = "$" + sumIncome;
                Balance.innerHTML = "$" + remainingBalance;
                return { sumExpense, sumIncome, remainingBalance }
            } else if (sumExpense === sumIncome) {
                Income.innerHTML = "$" + sumIncome;
                Expense.innerHTML = "$" + sumExpense;
                Balance.innerHTML = "$" + remainingBalance;
                return;
            } else if (sumExpense > sumIncome) {
                alert("You Cannot add an expense greater than your current income!");
                alert("Please remove some expenses or Add more income");
                return;
            }
        }

        /*------------------------Delete Function-------------------------*/
        function DeleteRow(event) {
            if (event.target.classList.contains('bg-red-600')) {
                const ID = parseInt(event.target.getAttribute('data-id'));
                console.log('ID to delete:', ID);
                const index = DataArray.findIndex(index => index.id === ID);
                console.log('Index found:', index);
                if (index !== -1) {
                    DataArray.splice(index, 1)
                    console.log("DataArray removed the object", DataArray);
                }
                event.target.closest('tr').remove();
                CheckBalance(DataArray);
                saveStorage();
            }
        }
        /*------------------------Edit Row-------------------------*/
        function EditRow(event) {
            //const openModal = document.getElementById('open-modal');
            const closeModal = document.getElementById('close-Modal');
            const overlay = document.getElementById('overlay');
            const formContainer = document.getElementById('form-container');
            const addBtn = document.getElementById('addBtn');
            const descriptionInput = document.getElementById('descriptionInput');
            const amountInput = document.getElementById('amountInput');
            const selectInput = document.getElementById('selectInput');

            if (event.target.classList.contains('bg-blue-600')) {
                const ID = parseInt(event.target.getAttribute('data-id'));
                const index = DataArray.findIndex(item => item.id === ID);
                if (index !== -1) {
                    const item = DataArray[index];
                    descriptionInput.value = item.desc;
                    amountInput.value = item.amt;
                    selectInput.value = item.type;

                    OpenIt();

                    addBtn.onclick = function () {
                        if (descriptionInput.value !== "" && amountInput.value !== "" && selectInput.value !== "") {
                            item.desc = descriptionInput.value;
                            item.amt = amountInput.value;
                            item.type = selectInput.value;

                            DataArray[index] = item;
                            CreateNewRow();
                            CheckBalance(DataArray);
                            updateChart();
                            saveStorage();
                            CloseIt();
                        } else {
                            alert('Error! Empty fields');
                        }
                    };
                }
            }

            function CloseIt() {
                overlay.classList.add('hidden');
                formContainer.classList.remove('flex');
                formContainer.classList.add('hidden');
            }

            function OpenIt() {
                overlay.classList.remove('hidden');
                formContainer.classList.remove('hidden');
                formContainer.classList.add('flex');
            }

            closeModal.addEventListener('click', CloseIt);
        }

        tbody.addEventListener('click', function (event) {
            DeleteRow(event);
            EditRow(event);
        });
        //     const MonthArray = ['January','February','March','April','May','June','July','August','September','October','November','December'];
        // let currentDate = new Date();
        // function RetriveMonth(MonthArray){
        //      const dateMonth = MonthArray[currentDate.getMonth()];
        //      const dateDay = currentDate.getDay();
        //      //const dateTime = currentDate.getHours();
        //      return dateMonth+ " " +dateDay;
        // }

        add.addEventListener('click', function () {
            const desc = description.value.trim();
            const amt = amount.value.trim();
            const type = select.value;
            const date = RetrieveMonth(MonthArray);
            if (description.value !== "" && amount.value !== "") {
                const Object = {
                    date: date,
                    desc: desc,
                    amt: amt,
                    type: type,
                    id: currentId++
                }

                DataArray.push(Object);
                CreateNewRow();
                ValidateFields();
                CheckBalance(DataArray);
                updateChart();
                saveStorage();
                console.log(DataArray);
                //tbody
                description.value = "";
                amount.value = "";
            } else {
                return alert("Please fill out all fields!")
            }

        });
        tbody.addEventListener('click', function (event) {
            DeleteRow(event);
            console.log(DataArray)
        })
        //repopulating Table with exsisting rows
        if (DataArray.length > 0) {
            CreateNewRow();
        }


    })
    /*------------------------Filter for transactions history---------------------------------*/
    const filterSelect = document.getElementById('filter-select');
    const expenseCategory = document.getElementById('expense-category');
    const incomeCategory = document.getElementById('income-category');
    const Filter = document.getElementById('Filter');
    const show = document.getElementById('show');



    //returning Expense transactions
    function separateExp(expenseCategory){
        const sep = DataArray.filter((item)=>item.name===expenseCategory.value);
        if(sep.length == 0 ){
            return alert("No data was found")
        }
        else{
        return sep;
    }
    }
//returning INcome Transactions
    function separateInc(incomeCategory){
    
        const sepInc = DataArray.filter((item)=>item.name===incomeCategory.value);
        if(sepInc.length == 0){
        return alert('No Data Found')
        }
        else{
        return sepInc;
    }
    }


   Filter.addEventListener('click',()=>{
    if(filterSelect.value === "Income"){
        console.log(separateInc(incomeCategory))
    }else if(filterSelect.value === "Expense"){
       console.log( separateExp(expenseCategory))
    }else{
        return console.log(arr);
    }
    saveStorage();
    });


    filterSelect.addEventListener('change',function(){
        //const SelectIncome = filterSelect.value;
             if(filterSelect.value === 'Income'){
                incomeCategory.classList.remove('hidden');
                expenseCategory.classList.add('hidden');
                console.log(filterSelect.value);
                
             }else if(filterSelect.value === 'Expense'){
                expenseCategory.classList.remove('hidden');
                incomeCategory.classList.add('hidden');
                console.log(filterSelect.value);
             }else{
                expenseCategory.classList.add('hidden');
                incomeCategory.classList.add('hidden');
             }
             saveStorage();
             //console.log(SelectIncome);
       })


    // function updateChart(amount,type){
        // if(DataArray.filter((item)=>item.type==="Expense")){
        //     myChart.datasets[0].data += amount
        // }else if(DataArray.filter((item)=>item.type==="Income")){
        //     myChart.datasets[0].data += amount
        // }
        // myChart.update();
        // }