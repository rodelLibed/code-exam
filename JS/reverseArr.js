function reverseArray(arr) {
  const reversedArray = [];
  for (let i = arr.length - 1; i >= 0; i--) {
    reversedArray.push(arr[i]);
  }
  return reversedArray;
}

const inputArray = [1, 2, 3, 4, 5];
console.log(reverseArray(inputArray));
