#include "KGUI.as";
#include "RpgCommon.as"

const string knightIconName = "$CHARMENU_KNIGHT_ICON$";
const string scrollIconName = "$CHARMENU_SCROLL_ICON$";
const string titleIconName = "$CHARMENU_TITLE$";
const string strengthIconName = "$CHARMENU_STRENGTH_ICON$";
const string agilityIconName = "$CHARMENU_AGILITY_ICON$";
const string plusIconName = "$CHARMENU_PLUS_ICON$";
const Vec2f windowDimensions = Vec2f(300,300);

Window@ window;
Button@ agilityAddBtn;
Button@ strengthAddBtn;
Rectangle@ strengthPopup;
Rectangle@ agilityPopup;
Label@ aglityLabel;
Label@ strengthLabel;
Label@ expLabel;
Label@ levelLabel;
Label@ spLabel;

Icon@ agilityIcon;
Icon@ strengthIcon;

ProgressBar@ expBar;

//This code could be so much simplier, if we had function handles working.


void onInit(CSprite@ this){
	

	
	//Adding icons
    AddIconToken( titleIconName, "GUI/charmenu_title.png", Vec2f(157,25), 0);
    AddIconToken( knightIconName, "GUI/actors.png", Vec2f(32,32), 55 );
    AddIconToken( strengthIconName, "GUI/icons.png", Vec2f(34,34), 359 );
    AddIconToken( scrollIconName, "GUI/icons.png", Vec2f(34,34), 248 );
    AddIconToken( agilityIconName, "GUI/icons.png", Vec2f(34,34), 367 );
    AddIconToken( plusIconName, "GUI/icons.png", Vec2f(34,34), 315 );

	Icon@ titleIcon = @Icon(Vec2f(16,16),Vec2f(0,0),titleIconName,0.5f);
	Icon@ scrollIcon = @Icon(Vec2f(windowDimensions.x-34-16,16-5),Vec2f(0,0),scrollIconName,0.5f);
	Icon@ knightIcon = @Icon(Vec2f(16,70),Vec2f(0,0),knightIconName,1.5f);
	Icon@ addIcon1 = @Icon(Vec2f(0,0),Vec2f(0,0),plusIconName,0.5f);
	Icon@ addIcon2 = @Icon(Vec2f(0,0),Vec2f(0,0),plusIconName,0.5f);
	
	//Varying stuff which is interacted during OnRender
	//Stats labels/icons/textes/addbuttons
	@strengthIcon = @Icon(Vec2f(130,125),Vec2f(34,34),strengthIconName,0.5f);
	@agilityIcon = @Icon(Vec2f(130,85),Vec2f(34,34),agilityIconName,0.5f);	

	@aglityLabel = @Label(Vec2f(42,5),Vec2f(100,34),"Agility\n 0",SColor(255,0,175,0));
	@strengthLabel = @Label(Vec2f(42,5),Vec2f(100,34),"Strength\n 0",SColor(255,175,0,0));	

	@agilityAddBtn = @Button(Vec2f(110,0),Vec2f(34,34));
	@strengthAddBtn = @Button(Vec2f(110,0),Vec2f(34,34));

	@strengthPopup = @Rectangle(Vec2f(50,-30),Vec2f(200,30));
	@agilityPopup =  @Rectangle(Vec2f(50,-30),Vec2f(350,30));

	strengthPopup.addChild(@Label(Vec2f(10,6),Vec2f(80,80),"Increases your damage",SColor(255,255,255,255)));
	agilityPopup.addChild(@Label(Vec2f(10,6),Vec2f(180,80),"Increases your slashing speed",SColor(255,255,255,255)));

	agilityAddBtn.addChild(addIcon1);
	agilityIcon.addChild(aglityLabel);
	agilityIcon.addChild(agilityAddBtn);
	agilityIcon.addChild(agilityPopup);
	strengthAddBtn.addChild(addIcon2);
	strengthIcon.addChild(strengthLabel);
	strengthIcon.addChild(strengthAddBtn);
	strengthIcon.addChild(strengthPopup);
	
	@expBar =  @ProgressBar(Vec2f(16,200),Vec2f(windowDimensions.x-16*2,24),0);
	@expLabel = @Label(Vec2f(windowDimensions.x/2-50,-20),Vec2f(200,30),"0/10000",SColor(255,50,100,210));
	@levelLabel = @Label(Vec2f(0,25),Vec2f(200,30),"Level: 1",SColor(255,50,100,210));
	@spLabel = @Label(Vec2f(windowDimensions.x-16*2-30,-13),Vec2f(200,30),"Skillpoints: 2",SColor(255,50,100,210));
	expBar.addChild(expLabel);
	expBar.addChild(levelLabel);

	//Assembling every element to window
	
	@window = @Window(Vec2f(100,100),windowDimensions);	
	window.addChild(@Line(Vec2f(16,54),Vec2f(windowDimensions.x-16*2,0),SColor(255,50,50,50)));
	window.addChild(titleIcon);
	window.addChild(knightIcon);
	window.addChild(scrollIcon);
	window.addChild(agilityIcon);
	window.addChild(strengthIcon);
	window.addChild(expBar);

	//disabling popups
	agilityPopup.setEnabled(false);
	strengthPopup.setEnabled(false);

	CBlob@ blob = this.getBlob();

  //Rollback to defaut view in case something goes wrong
	if(blob is null
		|| blob.getPlayer() is null
		|| blob.getPlayer() !is getLocalPlayer()) return;
	
	agilityAddBtn.setEnabled(blob.get_u8(s_sp)>0);
	strengthAddBtn.setEnabled(blob.get_u8(s_sp)>0);
	//Initial content
	aglityLabel.setText("Agility\n "+blob.get_u16(s_agi));
	strengthLabel.setText("Strength\n "+blob.get_u16(s_str));
	expBar.setVal((1.0f*blob.get_u16(s_curexp))/blob.get_u16(s_maxexp));
	expLabel.setText(blob.get_u16(s_curexp)+"/"+blob.get_u16(s_maxexp));
	levelLabel.setText("Level: "+blob.get_u8(s_lvl));
	spLabel.setText("Skillpoints: "+blob.get_u8(s_sp));


}

void onRender(CSprite@ this){

	CBlob@ blob = this.getBlob();

	if(blob is null
		|| blob.getPlayer() is null
		|| blob.getPlayer() !is getLocalPlayer()) return;

//Draw
	window.draw();

	aglityLabel.setText("Agility\n "+blob.get_u16(s_agi));
	strengthLabel.setText("Strength\n "+blob.get_u16(s_str));
	expBar.setVal((1.0f*blob.get_u16(s_curexp))/blob.get_u16(s_maxexp));
	expLabel.setText(blob.get_u16(s_curexp)+"/"+blob.get_u16(s_maxexp));
	levelLabel.setText("Level: "+blob.get_u8(s_lvl));
	spLabel.setText("Skillpoints: "+blob.get_u8(s_sp));

//Clicking Handling
	agilityAddBtn.setEnabled(blob.get_u8(s_sp)>0);
	strengthAddBtn.setEnabled(blob.get_u8(s_sp)>0);
	agilityPopup.setEnabled(agilityIcon.isHovered());
	strengthPopup.setEnabled(strengthIcon.isHovered());
	if(agilityAddBtn.isEnabled() && agilityAddBtn.isClicked()){
		CBitStream params;
		params.write_string( getLocalPlayer().getUsername());
		params.write_string( "agility");
		blob.SendCommandOnlyServer( blob.getCommandID(cskillpoint_cmd), params );
	}
	if(strengthAddBtn.isEnabled() && strengthAddBtn.isClicked()){
		CBitStream params;
		params.write_string( getLocalPlayer().getUsername());
		params.write_string( "strength");
		blob.SendCommandOnlyServer( blob.getCommandID(cskillpoint_cmd), params );
	}

}



