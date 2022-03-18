/*
 * ffi-napi-steam-js
 * 
 * Copyright (c) 2022-2022 Gurigraphics
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

var ffi = require('ffi-napi');

const Steam = new ffi.Library("./steam_api64.dll", {
    "SteamAPI_Init":[
        "bool", []
    ],
    "SteamAPI_RunCallbacks": [
        "void", []
    ],  
// FRIENDS -------------------------------------------
    "SteamAPI_SteamFriends_v017": [
        "pointer", []
    ],  
    "SteamAPI_ISteamFriends_GetPersonaName": [
        "string", ["pointer"]
    ],
    "SteamAPI_ISteamFriends_GetFriendCount": [
        "int", ["pointer", "int"]
    ],  
    "SteamAPI_ISteamFriends_GetFriendByIndex": [
        "uint64", ["pointer", "int", "int"]
    ],    
    "SteamAPI_ISteamFriends_ActivateGameOverlay": [
        "void", ["pointer", "string"]
    ],   
// MATCHMAKING -------------------------------------------
    "SteamAPI_SteamMatchmaking_v009": [
        "pointer", []
    ], 
    "SteamAPI_ISteamMatchmaking_CreateLobby": [ //uint64 SteamAPICall_t
        "uint64", ["pointer", "uint32", "int"]
    ],
    "SteamAPI_ISteamMatchmaking_JoinLobby": [ // return SteamAPICall_t
        "uint64", ["pointer", "uint64"]
    ],
})

var pointer = {}

const steam = {
    init: () => {
        Steam.SteamAPI_Init()
        steam.pointerInit()
        //steam.startCallbacks()
        steam.runCallbacks()
    }, 
    startCallbacks: () => {
        //Add callbacks
        Steam.SteamAPI_ISteamMatchmaking_CreateLobby.async(
            pointer.matchmaking,
            ffi.Callback( "void", ["int", "uint64"], (m_eResult, m_ulSteamIDLobby) => {
               console.log("Lobby created")  
               console.log( m_eResult )
               console.log( m_ulSteamIDLobby )    
            }),
            err => { console.log(err) },
            err => { console.log(err) },
        )
    },
    runCallbacks: () => {
        setInterval(function(){
            Steam.SteamAPI_RunCallbacks()
        },20)
    },
    pointerInit: () => {
        pointer = {
            //Add pointers
            friends: Steam.SteamAPI_SteamFriends_v017(),
            matchmaking: Steam.SteamAPI_SteamMatchmaking_v009()
        }
    }
} 

// FRIENDS -------------------------------------------
const friends = {
    getTotal: Steam.SteamAPI_ISteamFriends_GetFriendCount,
    getMyUsername: Steam.SteamAPI_ISteamFriends_GetPersonaName, 
    getFriendIDByIndex: Steam.SteamAPI_ISteamFriends_GetFriendByIndex,
    activateGameOverlay: Steam.SteamAPI_ISteamFriends_ActivateGameOverlay,
} 

//https://partner.steamgames.com/doc/api/ISteamFriends
const pchDialog = {
    friends: "friends", 
    community: "community",
    players: "players", 
    settings: "settings", 
    officialgamegroup: "officialgamegroup", 
    stats: "stats", 
    achievements: "achievements"
}

//https://partner.steamgames.com/doc/api/ISteamFriends
const EFriendFlags = {
    none: 0x00, //None.
    blocked: 0x01, //Users that the current user has blocked from contacting.
    friendshipRequested: 0x02, //Users that have sent a friend invite to the current user.
    immediate: 0x04, //The current user's "regular" friends.
    clanMember: 0x08, //Users that are in one of the same (small) Steam groups as the current user.
    onGameServer: 0x10, //Users that are on the same game server; as set by SetPlayedWith.
    requestingFriendship: 0x80, //Users that the current user has sent friend invites to.
    requestingInfo: 0x100, //Users that are currently sending additional info about themselves after a call to RequestUserInformation
    ignored: 0x200, //Users that the current user has ignored from contacting them.
    ignoredFriend: 0x400, //Users that have ignored the current user; but the current user still knows about them.
    chatMember: 0x1000, //Users in one of the same chats.
    all: 0xFFFF, //Returns all friend flags.
} 

// MATCHMAKING -------------------------------------------
const lobby = {
    create: Steam.SteamAPI_ISteamMatchmaking_CreateLobby
} 
 
//https://partner.steamgames.com/doc/api/ISteamMatchmaking#ELobbyType
const ELobbyType = {
    private: 0,
    friendsOnly: 1,
    public: 2,
    invisible: 3
}
 
//INIT
console.log( steam.init() )  
 
Steam.SteamAPI_ISteamMatchmaking_CreateLobby.async(
    pointer.matchmaking,
    ffi.Callback( "void", ["int", "uint64"], (m_eResult, m_ulSteamIDLobby) => {
       console.log("Lobby created")  
       console.log( m_eResult )
       console.log( m_ulSteamIDLobby )    
    }),
    err => { console.log(err) },
    err => { console.log(err) },
)

console.log( lobby.create(pointer.matchmaking, ELobbyType.friendsOnly, 4/*max users*/ ) )
 
