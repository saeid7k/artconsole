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

function stringifyArray(arr: string[] | string | null | undefined): string {
  if (Array.isArray(arr) && arr.length == 1) {
    return String(arr[0]);
  }

  if (Array.isArray(arr) && arr.length == 0) {
    return '';
  }

  if (!Array.isArray(arr)) {
    return String(arr || '');
  }

  return arr.map(item => String(item)).join(', ');
}

function stringifyObject(obj: Record<string, any> | null | undefined): string {
  if (!obj) {
    return '';
  }

  return Object.entries(obj)
    .map(([key, value]) => `${key}: ${String(value)}`)
    .join(', ');
}

export { ucFirst, getInitials, keyToTitle, stringifyArray, stringifyObject };
