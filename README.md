# ffi-napi-steam-js
A node.js plugin to integrate nw.js/electron games with steamworks

### How use

Install
```js
 npm i ffi-napi
```

Download 
```
steam_api64.dll | version 1.53a
```

https://partner.steamgames.com/


### Examples
```js
//INIT
//"bool"
console.log( steam.init() )  

//FRIENDS
//"string", ["pointer"]
console.log( friends.getMyUsername( pointer.friends ) )

//"int", ["pointer", "int"]
console.log( friends.getTotal( pointer.friends, 4 ) )

// "uint64", ["pointer", "int", "int"]
console.log( friends.getFriendIDByIndex( pointer.friends, 0/*index*/, EFriendFlags.immediate ) )

//"void", ["pointer", "string"]
console.log( friends.activateGameOverlay( pointer.friends, pchDialog.friends ) )

//MATCHMAKING
// "uint64", ["pointer", "uint32", "int"] - return Lobby ID
console.log( lobby.create(pointer.matchmaking, ELobbyType.friendsOnly, 4/*max users*/ ) )
```


### Status
1-Make "steam callbacks" work

2-Make "steam overlay" work
