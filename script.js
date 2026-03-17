// DATA ATUAL
const hoje = new Date().toISOString().split("T")[0];
document.getElementById("inp-date").value = hoje;

// MOSTRAR CATEGORIA APENAS PARA DESPESA
const tipo = document.getElementById("tipo");
const categoria = document.getElementById("categoriaContainer");

tipo.addEventListener("change", () => {
    if (tipo.value === "despesa") {
        categoria.classList.remove("hidden");
    } else {
        categoria.classList.add("hidden");
    }
});

const form = document.querySelector("#form-transactions")
const inputName = document.querySelector("#inp-name")
const inputDate = document.querySelector("#inp-date")
const inputAmount = document.querySelector("#inp-amount")
const inputCategoria = document.querySelector("#categoria")

let transactions = JSON.parse(localStorage.getItem("transactions")) || []

const init = () => {
    renderTransactions()
    balance()
}

const balance = () => {
    const totalIncome = transactions
        .filter(t => t.type === "Receita")
        .reduce((acc, t) => acc + t.amount, 0)

    const totalExpense = transactions
        .filter(t => t.type === "Despesas")
        .reduce((acc, t) => acc + t.amount, 0)

    document.querySelector("#balance").textContent = "€" + (totalIncome - totalExpense).toFixed(2)
    document.querySelector("#total-income").textContent = "+ €" + totalIncome.toFixed(2)
    document.querySelector("#total-expense").textContent = "- €" + totalExpense.toFixed(2)
}

const removeTransaction = id => {
    transactions = transactions.filter(t => t.id !== id)
    saveToLocalStorage()
    init()
}

form.addEventListener("submit", event => {
    event.preventDefault()

    const newTransaction = {
        id: transactions.length + 1,
        name: inputName.value,
        date: inputDate.value,
        type: tipo.value === "despesa" ? "Despesas" : "Receita",
        category: tipo.value === "despesa" ? inputCategoria?.value || "" : "",
        amount: parseFloat(inputAmount.value)
    }

    transactions.push(newTransaction)
    form.reset()
    inputDate.value = hoje
    categoria.classList.add("hidden")

    renderTransactions()
    saveToLocalStorage()
})

const saveToLocalStorage = () => {
    localStorage.setItem("transactions", JSON.stringify(transactions))
}



const renderTransactions = () => {
    const transactionsUL = document.querySelector("#transactions-list")
    transactionsUL.innerHTML = ""

    if(transactions.length === 0){
        const li = document.createElement("li")
        li.innerHTML =  `<p class="text-gray-400 text-xs text-center">Nenhuma transação registrada</p>`
        transactionsUL.append(li)
    }else{
        transactions.forEach(transaction => {
            const li = document.createElement("li")
            const amountColor = transaction.type === "Despesas" ? "text-red-600" : "text-green-600"
            const amountIcon = transaction.type === "Despesas" ? "bx-cart" : "bx-piggy-bank"
    
            li.classList.add("bg-gray-50", "p-3", "rounded-lg", "flex", "flex-col", "sm:flex-row", "sm:items-center", "sm:justify-between", "gap-2", "hover:bg-gray-100")
    
            li.innerHTML = `
                <div class="flex items-center gap-3 w-full">
                    <i class='bx ${amountIcon} text-xl ${amountColor === "text-red-600" ? "text-red-400" : "text-green-400"}'></i>
    
                    <div class="flex-1">
                        <p class="font-semibold">${transaction.name}</p>
                        <p class="text-xs sm:text-sm text-gray-500">${transaction.date}</p>
                    </div>
                    
                    <div class="flex items-center justify-between sm:justify-end gap-3">
                        <span class="${amountColor} font-semibold">${transaction.type === "Despesas" ? "- €" + transaction.amount.toFixed(2) : "+ €" + transaction.amount.toFixed(2)}</span>
    
                        <div class="flex gap-2">
                            <button class="text-gray-500 text-lg">
                                <i class='bx bx-edit'></i>
                            </button>
    
                            <button onClick="removeTransaction(${transaction.id})" class="text-red-500 text-lg">
                                <i class='bx bx-trash'></i>
                            </button>
                        </div>
                    </div>
                </div>
            `
    
            transactionsUL.prepend(li)
            balance()
        })       
    }

}

init()