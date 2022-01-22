const getRandomValues = require("get-random-values")

module.exports = {
    getEventFromTransaction: (tx, log = 0) => getEventFromTransaction(tx, log),
    jsonToArray: (object) => jsonToArray(object),
    arrayOfJsonToArray: (array) => arrayOfJsonToArray(array),
    sleep: async (milliseconds) => await sleep(milliseconds),
    makeCommitment: async (vanityNameController, name, user) => await makeCommitment(vanityNameController, name, user),
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

makeCommitment = async (vanityNameController, name, user) => {
    // Generate a random value to mask our commitment
    const random = new Uint8Array(32)
    getRandomValues(random)
    const salt = "0x" + Array.from(random).map(b => b.toString(16).padStart(2, "0")).join("")
    // Submit our commitment to the smart contract
    const commitment = await vanityNameController.makeCommitment(name, user, salt)
    await vanityNameController.commit(commitment)

    return salt
}