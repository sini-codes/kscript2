#define SERVER_ONLY
#include "Hitters.as";

void onPlayerDie( CRules@ this, CPlayer@ victimPlayer, CPlayer@ attackerPlayer, u8 hitter ){

  if(victimPlayer !is null &&
  attackerPlayer !is null &&
    victimPlayer.getTeamNum() == attackerPlayer.getTeamNum() &&
  victimPlayer.getUsername()!=attackerPlayer.getUsername()) return;

  string attacker = attackerPlayer is null ? "" : attackerPlayer.getUsername();
  if(victimPlayer !is null &&
  attackerPlayer !is null && victimPlayer.getUsername()==attackerPlayer.getUsername())
  attacker = "";
  string victim = victimPlayer is null ? "" : victimPlayer.getUsername();
  string assist = attackerPlayer is null ? "" : " with the help of "+attacker;

  if(hitter==Hitters::nothing){
    print(victim+" has suicided");
  } else if(hitter == Hitters::crush){
    print(victim+" was squashed under the collapse"+assist);
  } else if(hitter == Hitters::fall){
    print(victim+" fell to death"+assist);
  } else if(hitter == Hitters::water_stun_force){
    print(victim+" put a waterbomb in his inventory");
  } else if(hitter == Hitters::drown){
    print(victim+" drown"+assist);
  } else if(hitter == Hitters::fire){
    print(victim+" was shot with a firearrow by "+attacker);
  } else if(hitter == Hitters::burn){
    print(victim+" burned to death"+assist);
  } else if(hitter == Hitters::flying){
    if(attackerPlayer !is null){
      print(attacker+" dropped a boulder on "+victim);
    } else {
      print(victim+" was smashed");
    }
  } else if(hitter == Hitters::stomp){
    print(attacker+" stomped "+victim);
  } else if(hitter == Hitters::bite){
    print(victim+" was eaten");
  } else if(hitter == Hitters::builder){
    print(attacker+" hammered "+victim);
  } else if(hitter == Hitters::sword){
    print(attacker+" slew "+victim);
  } else if(hitter == Hitters::bomb){
    print(attacker+" bombed "+victim);
  } else if(hitter == Hitters::arrow){
    print(victim+" was shot with an arrow by "+attacker);
  } else if(hitter == Hitters::bomb_arrow){
    print(victim+" was shot with a bombarrow by "+attacker);
  } else if(hitter == Hitters::ballista){
    print(victim+" was shot with a ballista bolt by "+attacker);
  } else if(hitter == Hitters::cata_stones){
    print(victim+" was burried with a catapult by "+attacker);
  } else if(hitter == Hitters::explosion){
    print(attacker+" gibbed "+victim);
  } else if(hitter == Hitters::keg){
    print(attacker+" kegged "+victim);
  } else if(hitter == Hitters::spikes){
    print(victim+" died on spikes"+assist);
  } else if(hitter == Hitters::saw){
    print(attacker+" dominated over "+victim);
  } else {
    print("died of "+hitter);
  }

}