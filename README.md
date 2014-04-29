Zen Laboratories humbly presents a remake of KScript (originally created by Master4523 and Ardivaba for KAG Classic), with a slightly different approach, compatible with Beta.

If you ever wanted to have global ranking system:chicken:, ingame currency, complete RPG system, special items available only for certain players and personal storages for them, KScript2 is here to help.

**Features:**

- Easily extendable parsing system
- Handy services to help you
- Example mods, which perform common tasks + Knight RPG Demo
- Clever system of configuration

**Idea:**

KScript2 follows the same idea as the original KScript - parsing the RCON output and writing to it. You can easily extend parsing system to define your own game events, coming from vanilla kag or your own mods. Then you can perform ANY task on your server be it saving/reading to/from external database, requesting weather from the Internet, or just posting a message to your IRC channel. Finally you can either respond to server with your own custom code or make use of handy mods, which do it for you!.  
The entire behavior of KScript2 is defined in mods.

**Stability:**

KScript2 was battle tested on Black Death Servers. The entire global ranking system is done using this utility.

**Roadmap:**

A few helpful mods are already there. Now we will be focusing on documentation, adding new mods, examples and bugfixes. If the concept survives, we will move to more advanced examples and mods.
You can report bugs and request common mods in the issues section.
Feel free to post any ideas as well! :)

**Known Issues:**

Knight RPG Demo may have some weird bug which causes client side errors, when a player spawns.
We've tested a lot and seems like the issue is fixed. If not, report it here, please. Reconnecting several times is a temporary fix.

**Getting started (For developers and server hosters)**

**1. Installation**

You can either download KScript2 from repository pages:

    https://github.com/nitreo/kscript2

or simply use terminal command:

    git clone https://github.com/nitreo/kscript2

KScript2 does not require to be in KAG folder. Same as original KScript, it does not require KScript2 to run on the same machine.

**2. Preparing server**

Open

    Kag/autoconfig.cfg.

Make sure that `sv_tcpr` is set to 1

    sv_tcpr = 1

And set up a password

    sv_rconpassword = sprskrtpswd

You should also know the port of your KAG server (default is 50301) and IP (in case you are running KScript2 on a different machine)

**3. Hello world**

When in your kscript2 folder, you can launch KScript2 by executing:

    ./kscript2.sh

On it's first launch it will generate default config.json for you, where you can configure mods, turn them on and off. Everytime you install or update a mod, KScript2 will generate necessary configuration if needed and will inform you about this.
Default config looks like this.

    {
        "host": "127.0.0.1",
        "port": "50301",
        "password": "mumba",
        "mods": [
          "info",
          "chat",
          "players",
        ]
    }

`host` - the ip adress/host name of your server machine
`port` - port you run your kag server on
`password` - your RCON password
`mods` - list of mods to be turned on.

You will also notice other settings below: these are mods settings. Some mods may ask you to configure them. It depends on the mod itself. Example: "info" mod configuration looks like this:

    "info" :{
      "infoInterval": "30",
      "infoMessage": "Welcome to our Super cool servers!\nNew content coming soon!\nBe nice and read books!"
    }

It allows you to set a text which will appear as a global message with a certain interval (in seconds).
Once you filled config with required data, start your server, wait for it to load, and, once again, execute

    ./kscript2.sh

You should now see your "info" message in game chat. You can also see how it is sent on your server console.

**3. Adding and configuring mods**

Whenever you want to install a third party KScript2 mod, you just have to copy it to your KScript2/mods folder.
There are some mods which are not included into the default configuration. You can always see what mods you currently have by looking into your KScript2/mods/ folder.
There is a "me" mod there. Whenever a player "AbC" types "/me WINS" into chat, a global message appears in the chat: "* AbC WINS".
To make use of it, you first have to turn it on by adding it to the mod list in your config.json:

    "mods": [
          "info",
          "me",
          "chat",
          "players",
        ]

Once you launch KScript2, it will inform you:

    Warning: New configs required by mods have been added to your main config. Fill it with correct data and try again.

This means that "me" mod requires your attention to check it's default configuration:

      "me": {
        "cooldown": "2"
      }

`cooldown` - (in seconds) allows you to prevent players from spamming  /me command.

Fill it with correct data. Now, it's time too look at how KScript2 mods can be combined with KAG mods.

"me" mod depends on "chat" mod. But "chat" mod has a dependency on Kag2d script, which you can find at

    'KScript2/mods/chat/kag_mods/RulesScripts'

You will see `CatchCommands.as` - a little script, which eliminates every message started with "/" symbol from chat. It also prints the message itself to RCON in a more clear manner, so that KScript2 "chat" mod can easily identify the sender and the command.

You have to attach this script to your server Rules.

It's fairly easy if you are not running custom gamemode (In fact, with custom gamemode it could be even easier).
Whatever gamemode you are going to run, you need to grab it's .cfg file. Suppose we are going to play TDM. Then we copy this file:

    KAG/Base/Rules/TDM/gamemode.cfg

To

    KAG/Mods/ks_mods/Rules/TDM/

Then we copy our little `CatchCommands.as` into the same folder.

After that we open copied gamemode.cfg with any text editor and look for something like:

    ...

    scripts                            = KAG.as;
                                         TDM.as;
										 TDM_Interface.as;

	...

We insert our script name at the very end of the list (most of the time):

    ...

    scripts                            = KAG.as;
                                         TDM.as;
										 TDM_Interface.as;
									     CatchCommands.as;
	...

Finally we open KAG/mods.cfg and simply add a new line: `ks_mods`

Some mods will not be able to function properly without corresponding Kag2d mods (like 'chat' and 'stats'). So check mods folder for "kag_mods" to see if there exists any dependency.

Now, when in game, you can type `"/me OWNZ"` into chat and see a global message.


*6. Advanced mods - Knight RPG demo*

The mod itself is visible at 1:35 for example.

<a href="http://www.youtube.com/watch?feature=player_embedded&v=90nZ5qzSRB0
" target="_blank"><img src="http://img.youtube.com/vi/YOUTUBE_VIDEO_ID_HERE/0.jpg"
alt="IMAGE ALT TEXT HERE" width="240" height="180" border="10" /></a>

This is a little showcase of combining Kag2d mod and KScript2, features:

- Calculating experience, levels, skillpoints...
- Updating those stats on the player
- Persisting stats between connections, so your progress is not lost.

ACHTUNG I: This is only a DEMO. It is neither good tested nor polished. There is no good balance.

ACHTUNG II: This is not a good example of how you should write kag2d mods. Instead it does it's best to demonstrate how KScript2 mod communicates with the Kag2d mod and the server.

Installation:

1. Configure "stats" mods properly, turn it on and add required script to your rules:

    `KScript2/mods/stats/kag_mods/RulesScripts/Killfeed.as`

2. Configure "rpg_demo" mod properly, turn it on and install required mod:

    `KScript2/mods/rpg_demo/kag_mods/rpg_demo`
    Install it as a usual Kag2d Beta mod: copy `"rpg_demo"` to `Kag/Mods` folder, add `"rpg_demo"` line to your `Kag/mods.cfg`.

3. Launch the server, wait until it loads, start KScript2.

Usage:

Switch to knight and press K. Read popups over icons.

Known Issue:
Knight RPG Demo may have some weird bug which causes errors client side, when a player spawns. It happens with uncertain probability. We've tested a lot and seems like the issue is fixed. If not, report it here, please.
