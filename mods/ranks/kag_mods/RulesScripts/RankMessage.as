const string rankMsgTag = "rank_message";

void onRender( CRules@ this )
{
  if (g_videorecording)
  		return;

  	string text;
  	text = this.get_string(rankMsgTag);
  	if (text.size() > 0)
  	{
  		GUI::DrawText( text, Vec2f(20,20), Vec2f(300,200), color_black, false, false, true );
  	}
}