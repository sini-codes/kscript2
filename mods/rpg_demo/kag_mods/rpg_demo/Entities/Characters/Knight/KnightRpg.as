#include "RpgCommon.as"

//Skillwindow open flag
bool skillWinOpened = false;

void onInit(CBlob@ this){
		//Adding commands
		this.addCommandID(cinfo_cmd);
		this.addCommandID(cskillpoint_cmd);

		//Setup default stats, incase no stats will come from KScript2
		this.set_u8(s_lvl,defaultLevel);
		this.set_u16(s_curexp,startExp);
		this.set_u16(s_maxexp,maxExp);
		this.set_u8(s_sp,defaultSkillPoints);
		this.set_u16(s_str,defaultStrength);
		this.set_u16(s_agi,defaultAgility);
		this.Sync(s_lvl,true);
		this.Sync(s_curexp,true);
		this.Sync(s_maxexp,true);
		this.Sync(s_sp,true);
		this.Sync(s_str,true);
		this.Sync(s_agi,true);

		//We are in need of killfeed script on rules
		//getRules().AddScript(killfeedPath); //Comes with players mod
}

//Only opens/closes Skill Window
void onTick(CBlob@ this){
	if(getLocalPlayer() !is null && //Do we have local player?
		getLocalPlayer().getBlob() is this && //Does he control this blob?
		getControls().isKeyJustPressed(KEY_KEY_K)){ //Has he tapped K button?
		
		//Open/Close skill window
		if(skillWinOpened){
			this.getSprite().RemoveScript(windowPath);
		} else {
			this.getSprite().AddScript(windowPath);
		}

		skillWinOpened = !skillWinOpened;
	}
}

//Commands processing
void onCommand( CBlob@ this, u8 cmd, CBitStream @params ){
	
	//cskillpoint_cmd is CLIENT ---> SERVER only. 
	//It is sent from client to server only, when player clicks a button to add spend skillpoint.
	//Look at SkillWindow.as
	if(cmd == this.getCommandID(cskillpoint_cmd)){
		if(!getNet().isServer()) return;	
		string playerName = params.read_string();
		string stat = params.read_string();
		print(playerName+' spends skillpoint for '+stat);
	}

	//cinfo_cmd is KSCRIPT2 ---> SERVER only.
	//KSCRIPT2 sends this command to SERVER via RCON, when player requests character stats. 
	//Might be, that synchronization can be done directly from RCON.
	//However I faced some weird behaviour using such a technique in the past. 
	if(cmd == this.getCommandID(cinfo_cmd)){
		string playerName = params.read_string();
		if(this.getPlayer() is null || this.getPlayer().getUsername() != playerName){
				return;
		}
		
		this.set_u8(s_lvl,params.read_u8());
		this.set_u16(s_curexp,params.read_u16());
		this.set_u16(s_maxexp,params.read_u16());
		this.set_u8(s_sp,params.read_u8());
		this.set_u16(s_str,params.read_u16());
		this.set_u16(s_agi,params.read_u16());


		this.Sync(s_lvl,true);
		this.Sync(s_curexp,true);
		this.Sync(s_maxexp,true);
		this.Sync(s_sp,true);
		this.Sync(s_str,true);
		this.Sync(s_agi,true);
		print('dispatched!');
	}
}

//Each time knight spawns, we request info from KScript2
void onSetPlayer( CBlob@ this, CPlayer@ player ){
	if(player is null || !getNet().isServer()) return;
	//This is how we request character info from KScript2 mod.
	print(player.getUsername()+' requests character info');
}