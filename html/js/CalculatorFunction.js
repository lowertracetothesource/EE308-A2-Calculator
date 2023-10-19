
function display(input) {
  const str = document.getElementById("text");
  str.value += input;
}




async function equals() {
  const str = document.getElementById("text");
  let input = str.value;
  let lastExpression = input;

  if (input.includes('Ans')) {
    try {
      const ansValue = await getAns();
      input = input.replace(/Ans/g, ansValue);
    } catch (error) {
      console.error('获取答案出错: ' + error);
    }
}


  if (input.includes('asin') || input.includes('acos')) {
    const asinMatch = input.match(/asin\(([^)]+)\)/);
    const acosMatch = input.match(/acos\(([^)]+)\)/);

    if (asinMatch) {
        const x = parseFloat(asinMatch[1]);
        if (x < -1 || x > 1) {
            str.value = "Error: Invalid input for asin(x). x must be in the range [-1, 1].";
            return;
        }
    }

    if (acosMatch) {
        const x = parseFloat(acosMatch[1]);
        if (x < -1 || x > 1) {
            str.value = "Error: Invalid input for acos(x). x must be in the range [-1, 1].";
            return;
        }
    }
  }



  if (input.includes('^')) {
    input = input.replace(/\^/g, '**');
  }
  // 先处理 asin, acos, atan
if (input.includes('asin') || input.includes('acos') || input.includes('atan')) {
  input = input.replace(/(\b(asin|acos|atan))\(/g, 'Math.$2(');
}


if (input.includes('sin') || input.includes('cos') || input.includes('tan')) {
  input = input.replace(/(\b(sin|cos|tan))\(/g, 'Math.$2(');
}

  


  
  
  
  if (input.includes('e')){
    input = input.replace(/e/g,'Math.E');
  }
  if (input.includes('π')){
    input = input.replace(/π/g,'Math.PI')
  }
  if (input.includes('log')) {
    input = input.replace(/log\(([^)]+)\)\(([^)]+)\)/g, 'Math.log($2) / Math.log($1)');
  }
  if (input.includes('ln')) {
    input = input.replace(/ln/g, 'Math.log');
  }
  if (input.includes('Ans')){
    let ansValue = getAns();
    input = input.replace(/Ans/g,ansValue);
  }


  if (input.includes('/0')) {
    str.value = "Error: Division by zero is not allowed";
    return;
  }


  
  try {
    const result = eval(input);
    str.value = result;

    // 创建一个XMLHttpRequest对象并发送POST请求
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:5000/post', true);
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        const response = xhr.responseText;
        console.log(response);
        } else {
        console.error('请求失败，状态码：' + xhr.status);
        }
      }
    }
    const data ={
      expression:lastExpression,
      result:result
    };
    xhr.send(JSON.stringify(data));
    
    
  } catch (error) {
    str.value = "Error";
  }
}


function back() {
    str = document.getElementById("text");
    str.value = str.value.substring(0, str.value.length - 1);
}

function reset() {
    str = document.getElementById("text");
    str.value = "";
}

function insertE() {
  const str = document.getElementById("text");
  str.value += Math.E;
}

// 在 getAns 函数中返回 Promise
function getAns() {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://localhost:5000/get', true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          const Data = JSON.parse(xhr.responseText);
          const array = Data["data"];
          console.log(array);
          resolve(array[0][1]);
        } else {
          console.error('获取数据出错: ' + xhr.status);
          reject(xhr.status);
        }
      }
    };
    xhr.send();
  });
}

function getHistory() {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'http://localhost:5000/get', true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
          Data = JSON.parse(xhr.responseText);
          array = Data["data"];
          console.log(array)
          let string = "";
          for(let i = 0; i < array.length; i++) {
              string += array[i][0] + " = " + array[i][1];
              string += '\n';
          }
          
      } else {
          console.error('获取数据出错: ' + xhr.status);
      }
    }
  };
  xhr.send();
}

