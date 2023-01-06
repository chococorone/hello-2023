
/* Object の実験  */
const list = {
    test : 'test',
    test2 : {test: "test"},
    test3 : [3,2]
};


console.log(list);

let key = 'test';
console.log(key in list);
console.log(Object.keys(list));


/* async / await  , promise による非同期処理の実験  */

// promise を返り値とする //promiseとは成功したか、失敗したかの状態を表すオブジェクト
function dummyPromise(value){
    console.log('dummy Promise');
    return new Promise((resolve) =>{ //promiseのインスタンスには、resolve もしくはrejectという関数を渡す
        setTimeout(() =>{
            resolve(value + 2); //resolveの引数は呼び元の成功時(onFulfilled)の引数になる
        }, 1000);
    });
}

async function dummyAsync(value){
    console.log('dummy Async');
    value = await new Promise((resolve) => {
        setTimeout(()=>{
            resolve(value + 3);
        },1000);
    });
    return value; //aync関数の返り値はPromise型にwrapされて返る
}

function dummyCallThen(){
    console.log('dummy Call Then');
    let value = 10;

    return dummyPromise(value).then(function onFulfilled(result){ //非同期に、dummyPromiseとdummyAsyncを順番に呼びたい
        return dummyAsync(result);
    }).then(result =>{
        return result;
    });
}

async function dummyCallAwait(){
    console.log('dummy Call Await');
    let value = 10;

    value = await dummyPromise(value);
    value = await dummyAsync(value);
    return value;
}


dummyCallThen().then((result) =>{
    console.log('result dummyCallThen');
    console.log(result);
});

dummyCallAwait().then((result) =>{
    console.log('result dummyCallAwait');
    console.log(result);
});

