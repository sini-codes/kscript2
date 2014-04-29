//CMD consts
const string cinfo_cmd = "character_info";
const string cskillpoint_cmd = "character_skillpoint";
const string windowPath = "Entities/Characters/Knight/SkillWindow.as";

//Stats consts
const string s_lvl = "character level";
const string s_curexp = "character curexp";
const string s_maxexp = "character maxexp";
const string s_sp = "character skillpoints";
const string s_str = "character strength";
const string s_agi = "character agility";

//Default stats consts
const int defaultAgility = 1;
const int defaultStrength = 1;
const f32 startExp = 0;
const f32 maxExp = 10;
const int defaultSkillPoints = 0;
const int defaultLevel = 1;

uint16 getAgility(CBlob@ blob){
	return blob.get_u16(s_agi);
}