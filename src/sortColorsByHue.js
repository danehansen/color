import { distance } from "./color";

function rgbToKey(rgb) {
  return `${rgb.red}.${rgb.green}.${rgb.blue}`;
}

function rgbsToKey(rgb1, rgb2) {
  const str1 = rgbToKey(rgb1);
  const str2 = rgbToKey(rgb2);
  if (str1 < str2) {
    return `${str1}-${str2}`;
  }
  return `${str2}-${str1}`;
}

function mergeArrays(a, b, pair, sortedArrays) {
  if (a === b || !pair[0].isEndPiece || !pair[1].isEndPiece) {
    return;
  }

  const persistant = b.length > a.length ? b : a;
  const disposable = persistant === a ? b : a;

  const first = pair.includes(persistant[0]) ? disposable : persistant;
  const last = a === first ? b : a;

  if (
    (disposable === last && !pair.includes(disposable[0])) ||
    (disposable === first && pair.includes(disposable[0]))
  ) {
    disposable.reverse();
  }

  first[first.length - 1].isEndPiece = false;
  last[0].isEndPiece = false;

  let spliceIndex;
  if (persistant === first) {
    spliceIndex = persistant.length;
  } else {
    spliceIndex = 0;
  }
  persistant.splice(spliceIndex, 0, ...disposable);

  sortedArrays.splice(sortedArrays.indexOf(disposable), 1);
  for (let obj of disposable) {
    obj.parentArray = persistant;
  }

  let totalEndPeices = 0;
  for (let obj of persistant) {
    if (obj.isEndPiece === true) {
      totalEndPeices++;
    }
  }
}

function addToArray(array, single, pair) {
  const first = array[0];
  const last = array[array.length - 1];
  const endInPair = pair.includes(first) ? first : last;

  if (!pair.includes(endInPair)) {
    return;
  }

  const endNotInPair = endInPair === first ? last : first;

  if (endInPair === first) {
    // put in front
    array.unshift(single);
    first.isEndPiece = false;
  } else {
    // put in back
    array.push(single);
    last.isEndPiece = false;
  }

  single.parentArray = array;

  let totalEndPeices = 0;
  for (let obj of array) {
    if (obj.isEndPiece === true) {
      totalEndPeices++;
    }
  }
}

function createUniqueArray(rgbs) {
  const uniqueArray = [];
  // object of unique colors, with an array of rgb's that match that color
  const unsortedColors = {};
  for (let i = 0; i < rgbs.length; i++) {
    const rgb = rgbs[i];
    const key = rgbToKey(rgb);
    let obj = unsortedColors[key];
    if (!obj) {
      obj = {
        instances: [rgb],
        key,
        parentArray: null,
        isEndPiece: true
      };
      unsortedColors[key] = obj;
      uniqueArray.push(obj);
    } else {
      obj.instances.push(rgb);
    }
  }
  return uniqueArray;
}

function createUniqueArrayFromArrayEnds(parent) {
  const uniqueArray = [];
  for (let child of parent) {
    let next = child[0];
    next.isEndPiece = true;
    uniqueArray.push(next);
    next = child[child.length - 1];
    next.isEndPiece = true;
    uniqueArray.push(next);
  }
  return uniqueArray;
}

function createPairsByDistance(uniqueArray) {
  const pairsByDistance = [];
  for (let i = 0; i < uniqueArray.length - 1; i++) {
    for (let j = i + 1; j < uniqueArray.length; j++) {
      const a = uniqueArray[i];
      const b = uniqueArray[j];
      const key = rgbsToKey(a.instances[0], b.instances[0]);

      pairsByDistance.push({
        pair: [a, b],
        distance: distance(a.instances[0], b.instances[0])
      });
    }
  }
  pairsByDistance.sort(function(a, b) {
    return a.distance - b.distance;
  });
  return pairsByDistance;
}

function joinPairs(pairsByDistance, sortedArrays) {
  for (let i = 0; i < pairsByDistance.length; i++) {
    const { pair } = pairsByDistance[i];
    const a = pair[0];
    const b = pair[1];
    const aParent = a.parentArray;
    const bParent = b.parentArray;

    if (!aParent && !bParent) {
      // neither added to a position array yet
      const array = [a, b];
      a.parentArray = array;
      b.parentArray = array;
      sortedArrays.push(array);
    } else if (aParent && bParent) {
      // both added to position arrays already
      mergeArrays(aParent, bParent, pair, sortedArrays);
    } else {
      // only one added to position array so far
      const parent = aParent || bParent;
      const single = parent === a.parentArray ? b : a;
      addToArray(parent, single, pair);
    }
  }
}

export default function sortColorsByHue(rgbs) {
  // array of unique colors, only used for iterating to calculate distances
  let uniqueArray = createUniqueArray(rgbs);

  // array of keys of distances to be sorted
  let pairsByDistance = createPairsByDistance(uniqueArray);

  // repeatedly join the two closest colors that are not in an array, or are at either end of an array
  const sortedArrays = [];
  joinPairs(pairsByDistance, sortedArrays);
  while (sortedArrays.length !== 1) {
    uniqueArray = createUniqueArrayFromArrayEnds(sortedArrays);
    pairsByDistance = createPairsByDistance(uniqueArray);
    joinPairs(pairsByDistance, sortedArrays);
  }

  // rearrange the original array
  let index = 0;
  for (let obj of sortedArrays[0]) {
    for (let rgb of obj.instances) {
      rgbs[index] = rgb;
      index++;
    }
  }
  return rgbs;
}
