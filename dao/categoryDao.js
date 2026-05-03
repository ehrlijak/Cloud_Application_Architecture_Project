let categoryList = [];

// CREATE
const create = (dtoIn) => {
    if (!dtoIn?.name || !dtoIn?.limit || !dtoIn?.type) {
        throw new Error("dtoInIsNotValid");
    }

    const exists = categoryList.find(c => c.name === dtoIn.name);
    if (exists) throw new Error("categoryNameNotUnique");

    const category = {
        id: Date.now().toString(),
        name: dtoIn.name,
        limit: dtoIn.limit,
        type: dtoIn.type
    };

    categoryList.push(category);
    return category;
};

// GET
const get = (id) => {
    return categoryList.find(c => c.id === id);
};

// LIST
const list = () => {
    return { categoryList };
};

// UPDATE
const update = (dtoIn) => {
    if (!dtoIn?.id) throw new Error("dtoInIsNotValid");

    const category = categoryList.find(c => c.id === dtoIn.id);
    if (!category) throw new Error("categoryDoesNotExist");

    if (dtoIn.name && dtoIn.name !== category.name) {
        const exists = categoryList.find(c => c.name === dtoIn.name);
        if (exists) throw new Error("categoryNameNotUnique");
    }

    category.name = dtoIn.name ?? category.name;
    category.limit = dtoIn.limit ?? category.limit;
    category.type = dtoIn.type ?? category.type;

    return category;
};

// REMOVE
const remove = (id) => {
    const exists = categoryList.find(c => c.id === id);
    if (!exists) throw new Error("categoryDoesNotExist");

    categoryList = categoryList.filter(c => c.id !== id);
};

// MAP
const getCategoryMap = () => {
    const map = {};
    categoryList.forEach(c => {
        map[c.id] = c;
    });
    return map;
};

module.exports = {
    create,
    get,
    list,
    update,
    remove,
    getCategoryMap
};