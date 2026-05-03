const categoryDao = require("./categoryDao");

let transactionList = [];

// CREATE
const create = (dtoIn) => {
    if (!dtoIn?.counterparty || dtoIn?.amount === undefined || !dtoIn?.date || !dtoIn?.categoryId) {
        throw new Error("dtoInIsNotValid");
    }

    const category = categoryDao.get(dtoIn.categoryId);
    if (!category) throw new Error("categoryDoesNotExist");

    const date = new Date(dtoIn.date);
    if (date > new Date()) throw new Error("invalidDate");

    // category limit check (only for non-flexible)
    const spent = transactionList
        .filter(t => t.categoryId === dtoIn.categoryId)
        .reduce((sum, t) => sum + t.amount, 0);

    if (category.type === "non-flexible") {
        if (Math.abs(spent + dtoIn.amount) > category.limit) {
            throw new Error("categoryLimitExceeded");
        }
    }

    const tx = {
        id: Date.now().toString(),
        counterparty: dtoIn.counterparty,
        amount: dtoIn.amount,
        date: dtoIn.date,
        note: dtoIn.note || "",
        categoryId: dtoIn.categoryId
    };

    transactionList.push(tx);
    return tx;
};

// GET
const get = (id) => {
    return transactionList.find(t => t.id === id);
};

// LIST (with optional month filter)
const list = (filter = {}) => {
    let result = transactionList;

    if (filter.date) {
        const [year, month] = filter.date.split("-");
        result = result.filter(t => {
            const d = new Date(t.date);
            return (
                d.getFullYear() === parseInt(year) &&
                d.getMonth() + 1 === parseInt(month)
            );
        });
    }

    result = result.sort((a, b) => new Date(a.date) - new Date(b.date));

    return { itemList: result, categoryMap: categoryDao.getCategoryMap() };
};

// UPDATE
const update = (dtoIn) => {
    if (!dtoIn?.id) throw new Error("dtoInIsNotValid");

    const tx = transactionList.find(t => t.id === dtoIn.id);
    if (!tx) throw new Error("transactionDoesNotExist");

    const category = categoryDao.get(dtoIn.categoryId);
    if (!category) throw new Error("categoryDoesNotExist");

    const date = new Date(dtoIn.date);
    if (date > new Date()) throw new Error("invalidDate");

    tx.counterparty = dtoIn.counterparty;
    tx.amount = dtoIn.amount;
    tx.date = dtoIn.date;
    tx.note = dtoIn.note;
    tx.categoryId = dtoIn.categoryId;

    return tx;
};

// DELETE
const remove = (id) => {
    const exists = transactionList.find(t => t.id === id);
    if (!exists) throw new Error("transactionDoesNotExist");

    transactionList = transactionList.filter(t => t.id !== id);
};

// LIST BY CATEGORY
const listByCategoryId = (categoryId) => {
    return { transactionList: transactionList.filter(t => t.categoryId === categoryId) };
};

module.exports = {
    create,
    get,
    list,
    update,
    remove,
    listByCategoryId
};