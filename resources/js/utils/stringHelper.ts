function ucFirst(input: string): string {
  // split by dash or space
  let array = input.split(/[- ]/)

  // map each word to uppercase first letter and join with space
  let upperFirst = array.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  return upperFirst;
}

function getInitials(name: string): string {
  let array = name.split(/[- ]/)

  let initials = array.map(word => word.charAt(0).toUpperCase()).join('');

  return initials;
}

function keyToTitle(key: string): string {
  if (!key) {
    return '';
  }
  let label = key.replace(/([A-Z])/g, ' $1');

  label = label
    .replace(/[._\-\/]+/g, ' ')
    .replace(/\s{2,}/g, ' ').trim();

  if (label.length > 0) {
    label = ucFirst(label);
  }

  return label;
}

export { ucFirst, getInitials, keyToTitle }
