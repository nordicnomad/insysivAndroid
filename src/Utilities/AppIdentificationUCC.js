import UccNumLengthReference from '../Utilities/UCCNumLengthReference.json'

export function AppIdentificationUCC(aiString) {
  let matchedAppIdentifierObjects = []
  let aiStringFull = aiString
  let aiStringTwo = aiStringFull.substring(0,2)
  let aiStringThree = aiStringFull.substring(0,3)
  let lengthReference = UccNumLengthReference

  lengthReference.forEach((uccreference, i) => {
    if(uccreference.identifierLength === 2) {
      if(aiStringTwo.includes(uccreference.identifier)) {
        console.log("AI MATCH 2 Length")
        matchedAppIdentifierObjects.push(uccreference)
      }
    }
  });
  console.log("MATCHED AI OBJECTS AFTER FIRST SEARCH")
  console.log(matchedAppIdentifierObjects)
  if(matchedAppIdentifierObjects.length >= 2 || matchedAppIdentifierObjects.length === 0) {
    matchedAppIdentifierObjects = []
    lengthReference.forEach((uccthreereference, i) => {
      if(uccthreereference.identifierLength === 3) {
        if(aiStringThree.includes(uccthreereference.identifier)) {
          console.log("AI MATCH 3 Length")
          matchedAppIdentifierObjects.push(uccthreereference)
        }
      }
    });
    console.log("MATCHED AI OBJECTS AFTER SECOND SEARCH")
    console.log(matchedAppIdentifierObjects)
  }

  if(matchedAppIdentifierObjects.length >= 2 || matchedAppIdentifierObjects.length === 0) {
    matchedAppIdentifierObjects = []
    lengthReference.forEach((uccfullreference, i) => {
      if(uccfullreference.identifierLength === 4) {
        if(aiStringFull.includes(uccfullreference.identifier)) {
          console.log("AI MATCH 4 Length")
          matchedAppIdentifierObjects.push(uccfullreference)
        }
      }
    });
    console.log("MATCHED AI OBJECTS AFTER THIRD SEARCH")
    console.log(matchedAppIdentifierObjects)
  }

  if(matchedAppIdentifierObjects.length === 0) {
    matchedAppIdentifierObjects.push(
      {
        identifier: '',
        identifierLength: 0,
        segmentMinLength: 0,
        segmentMaxLength: 0,
        totalMaxLength: 0,
        totalMinLength: 0,
        isVariableLength: false,
      }
    )
  }

  return(matchedAppIdentifierObjects[0])
}
