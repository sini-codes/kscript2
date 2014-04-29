bool onServerProcessChat( CRules@ this, const string &in textIn, string &out textOut, CPlayer@ player ){
  print("["+player.getUsername()+"] : "+textIn);
  return !(textIn.findFirst('/') == 0);
}