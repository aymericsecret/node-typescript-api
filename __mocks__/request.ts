// __mocks__/request.js

// Has to be json stringified!
const bodyReturn = JSON.stringify({
    data: 'success',
});
const errorReturn = JSON.stringify({
    data: 'error',
});

const request = (data, callback?: (error: any, data: any, success: any) => void) => {

    let error;
    let success;
    if (data.uri === 'error/test') error = errorReturn;
    else success = bodyReturn;
    // return new Promise((resolve, reject) => {
    //     process.nextTick(() => {
    //         // resolve(data);
    //         if (data.uri === 'error') reject(error);
    //         else resolve(data);
    //     });
    // });
    callback(error, data, success);
};

module.exports = request;
