module.exports = {
    getEventFromTransaction: (tx, log = 0) => getEventFromTransaction(tx, log),
    jsonToArray: (object) => jsonToArray(object),
    arrayOfJsonToArray: (array) => arrayOfJsonToArray(array),
    sleep: async (milliseconds) => await sleep(milliseconds),
}

getEventFromTransaction = (tx, log) => {
    return tx.logs[log].args
}

jsonToArray = (object) => {
    let arr = [];
    Object.entries(object).forEach((obj) => {
        //push only the value
        arr.push(obj[1]);
    });

    return arr;
}

arrayOfJsonToArray = (array) => {
    let tuple = [];
    for (i = 0; i < array.length; i++) {
        let arr = [];
        Object.entries(array[i]).forEach((obj) => {
            //push only the value
            arr.push(obj[1]);
        });
        tuple.push(arr);
    }
    return tuple;
}

sleep = async (milliseconds) => {
    return new Promise((resolve) => {
        setTimeout(resolve, milliseconds)
    })
}