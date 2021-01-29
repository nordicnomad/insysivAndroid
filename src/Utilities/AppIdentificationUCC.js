import UccNumLengthReference from '../Utilities/UccNumLengthReference.json'

export function SiftWorkingAIString(aiString) {
  let matchedAppIdentifierObjects = []
  let aiStringFull = aiString
  let aiStringTwo = aiStringFull.substring(0,2)
  let aiStringThree = aiStringFull.substring(0,3)

  UccNumLengthReference.forEach((uccreference, i) => {
    if(aiStringTwo.includes(uccreference.identifier)) {
      matchedAppIdentifierObjects.push(uccreference)
    }
  });

  if(matchedAppIdentifierStrings.length > 1) {
    matchedAppIdentifierObjects = []
    UccNumLengthReference.forEach((uccthreereference, i) => {
      if(aiStringThree.includes(uccthreereference.identifier)) {
        matchedAppIdentifierObjects.push(uccthreereference)
      }
    });
  }

  if(matchedAppIdentifierStrings.length > 1) {
    matchedAppIdentifierObjects = []
    UccNumLengthReference.forEach((uccfullreference, i) => {
      if(aiStringFull.includes(uccfullreference.identifier)) {
        matchedAppIdentifierObjects.push(uccfullreference)
      }
    });
  }

  matchedAppIdentifierObjects[0]


  return(matchedAppIdentifierObjects[0])
}
