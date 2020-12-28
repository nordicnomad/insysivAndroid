import { NavigationContext } from 'react-navigation';

var Realm = require('realm');
let activeUser ;

export function Logout() {
  activeUser = new Realm({
    schema: [{name: 'Active_User',
      properties: {
        userId:"string",
        userName: "string",
        userToken: "string",
        tokenExpiration: "string?",
        syncAddress: "string?",
        //Additional Organization Level Configuration Options go Here.
    }}]
  });

  activeUser.write(() => {
    activeUser.deleteAll()
  })
  navigation.navigate('Login')

}


export function Homeout() {
  navigation.navigate('Home')
}
