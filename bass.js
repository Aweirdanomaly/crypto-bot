let array = []

function addObj(name, delay) {
  let temp = new Object();
  temp.name = name
  temp.delay = delay
  temp.date = Date.now();
  temp.go = false;
  array.push(temp)
}

function timeCheck() {
for (x=0;x<array.length;x++){
  //let diff = ((array[x].date+ (1000*60*array[x].delay))-array[x].date)
  
  let diff = ((array[x].date + (1000*array[x].delay))-Date.now())
  console.log("check", diff, array[x].date)
  if ( diff <= 0){
    console.log("time passed")
  array[x].go = true;
  array[x].date = Date.now();
  }
}
}


function pair() {
for (x=0;x<array.length;x++){
  console.log("-------chok---------")
  if (array[x].go == true){
    array[x].go = false
    console.log(array[x].name, array[x].delay)
  }
}
  
}

addObj("first", 5)
let ups = setInterval(timeCheck, (1000*1))
let down = setInterval(pair, (1000*10))


console.log(array)
