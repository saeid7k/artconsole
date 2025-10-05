function ucFirst(input: string): string {
  // split by dash or space
  let array = input.split(/[- ]/)

  // map each word to uppercase first letter and join with space
  let upperFirst = array.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  return upperFirst;
}

export { ucFirst }
