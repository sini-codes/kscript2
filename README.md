Introduction

KScript2 follows the concept of KScript (originally created by Master4523 fo KAG Classic).
It provides convenient way of parsing RCON and executing all sorts of actions which are not available
inside kag runtime environment.

With KScript2 you can:
- Capture certain game events and react to them.
- Saving/Reading from internal/external database.
- Extending KScript2 to interact with your own mods.
- Create custom algorithms for balancing teams/banning/muting...
- Download and use any kinds of NodeJS libraries. Implementing Game2IRC connection? Easy!

Folder structure:

/db - stores database files. (managed by Dao service and underlying Nedb module)
/lib/services - stores core services
/logs - stores logs
/mods - stores mods
/node - stores local copy of NodeJS
/node_modules - stores NodeJS modules

Architecture:

The core of KScript2 are so called services. There are 6 of them:
Config
    Handles mods configuration reading and generation.
Dao
    Provides access to Datastore, so you can easily persist data to file database.
GameEvents
    Serves as a global events emitting and subscription service.
Logger
    Convenient logger service
Parser
    Handles RCON parsing and allows you easily subscribe to certain inputs by means of regular expressions
RCON
    Service for direct communication with server. Allows you to send arbitrary commands to the server.

Every service can and should be used inside "mods". Mods are pieces of custom functionality and are described in the next section.
Mods are stored inside /mods each having their own folder.

Mods
    Things you can do
    Mods configuration
RPG Example

KScript2 includes some mods out of the box. The most complicated one is rpg_demo, which demonstrates how
kag mod can interact with KScript2 and rely on it when calculating and saving character information like
level, experience and others.

Stability

KScript2 was extensively tested on Black Death servers.
Global BD ranking and custom messages are handled completely by KScript2.