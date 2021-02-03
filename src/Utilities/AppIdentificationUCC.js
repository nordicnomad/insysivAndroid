import UccNumLengthReference from '../Utilities/UCCNumLengthReference.json'

export function AppIdentificationUCC(aiString) {
  let matchedAppIdentifierObjects = []
  let aiStringFull = aiString
  let aiStringTwo = aiStringFull.substring(0,2)
  let aiStringThree = aiStringFull.substring(0,3)
  let lengthReference = UccNumLengthReference

  lengthReference.forEach((uccreference, i) => {
    if(aiStringTwo.includes(uccreference.identifier)) {
      matchedAppIdentifierObjects.push(uccreference)
    }
  });
  console.log("MATCHED AI OBJECTS AFTER FIRST SEARCH")
  console.log(matchedAppIdentifierObjects)
  if(matchedAppIdentifierObjects.length >= 2) {
    matchedAppIdentifierObjects = []
    lengthReference.forEach((uccthreereference, i) => {
      if(aiStringThree.includes(uccthreereference.identifier)) {
        matchedAppIdentifierObjects.push(uccthreereference)
      }
    });
    console.log("MATCHED AI OBJECTS AFTER SECOND SEARCH")
    console.log(matchedAppIdentifierObjects)
  }

  if(matchedAppIdentifierObjects.length >= 2) {
    matchedAppIdentifierObjects = []
    lengthReference.forEach((uccfullreference, i) => {
      if(aiStringFull.includes(uccfullreference.identifier)) {
        matchedAppIdentifierObjects.push(uccfullreference)
      }
    });
    console.log("MATCHED AI OBJECTS AFTER THIRD SEARCH")
    console.log(matchedAppIdentifierObjects)
  }

  return(matchedAppIdentifierObjects[0])
}
