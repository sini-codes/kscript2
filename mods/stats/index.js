
//Suicide
Parser.onRegex(
  "^(?<victim>  [\\S-]+ )" +
    "(?:[\\s]+has[\\s]+suicided)" +
    "(?:[\\s]+with\\sthe\\shelp\\sof[\\s]+)?" +
    "(?<killer>  [\\S-]+ )? " +
    "[\\s]*",
  function (victim, killer) {
    GameEvents.emit('player_killed', victim, killer);
  }
);

//collapse (s/a)
Parser.onRegex(
  '^(?<victim>  [\\S-]+ )' +
    ' (?:[\\s]+was[\\s]+squashed[\\s]+under[\\s]+the[\\s]+collapse)' +
    ' (?:[\\s]+with\\sthe\\shelp\\sof[\\s]+)?' +
    ' (?<killer>  [\\S-]+ )? ' +
    '[\\s]*',
  function (victim, killer) {
    GameEvents.emit('player_killed', victim, killer);
  }
);

//fall (s/a)
Parser.onRegex(
  '^(?<victim>  [\\S-]+ ) ' +
    '(?:[\\s]+fell[\\s]+to[\\s]+death)' +
    '(?:[\\s]+with\\sthe\\shelp\\sof[\\s]+)?' +
    ' (?<killer>  [\\S-]+ )? ' +
    '[\\s]*',
  function (victim, killer) {
    GameEvents.emit('player_killed', victim, killer);
  }
);
//water (s/a)
Parser.onRegex(
  '^(?<victim>  [\\S-]+ ) ' +
    '(?:[\\s]+put[\\s]+a[\\s]+waterbomb[\\s]+in[\\s]+his[\\s]+inventory)' +
    '(?:[\\s]+with\\sthe\\shelp\\sof[\\s]+)?' +
    '(?<killer>  [\\S-]+ )? ' +
    '[\\s]*',
  function (victim, killer) {
    GameEvents.emit('player_killed', victim, killer);
  }
);
//drown (s/a)
Parser.onRegex(
  '^(?<victim>  [\\S-]+ ) ' +
    '(?:[\\s]+drown) ' +
    '(?:[\\s]+with\\sthe\\shelp\\sof[\\s]+)?' +
    '(?<killer>  [\\S-]+ )? ' +
    '[\\s]*',
  function (victim, killer) {
    GameEvents.emit('player_killed', victim, killer);
  }
);
//fireshot (va)
Parser.onRegex(
  '^(?<victim>  [\\S-]+ )  ' +
    '(?:[\\s]+was[\\s]+shot[\\s]+with[\\s]+a[\\s]+firearrow[\\s]+by[\\s]+) ' +
    '(?<killer>  [\\S-]+ )  ' +
    '[\\s]*',
  function (victim, killer) {
    GameEvents.emit('player_killed', victim, killer);
  }
);
//burn (s/a)
Parser.onRegex(
  '^(?<victim>  [\\S-]+ ) ' +
    '(?:[\\s]+burned[\\s]+to[\\s]+death) ' +
    '(?:[\\s]+with\\sthe\\shelp\\sof[\\s]+)? ' +
    '(?<killer>  [\\S-]+ )? ' +
    '[\\s]*',
  function (victim, killer) {
    GameEvents.emit('player_killed', victim, killer);
  }
);
//boulder (av)
Parser.onRegex(
  '^(?<killer>  [\\S-]+ )' +
    ' (?:[\\s]+dropped[\\s]+a[\\s]+boulder[\\s]+on[\\s]+)' +
    ' (?<victim>  [\\S-]+ ) ' +
    '[\\s]*',
  function (killer, victim) {
    GameEvents.emit('player_killed', victim, killer);
  }
);
//smashin (s/a)
Parser.onRegex(
  '^(?<victim>  [\\S-]+ ) ' +
    '(?:[\\s]+was[\\s]+smashed) ' +
    '([\\s]+with\\sthe\\shelp\\sof[\\s]+)? ' +
    '(?<killer>  [\\S-]+ )? ' +
    '[\\s]*',
  function (victim, killer) {
    GameEvents.emit('player_killed', victim, killer);
  }
);
//stomp (av)
Parser.onRegex(
  '^(?<killer>  [\\S-]+ ) ' +
    '(?:[\\s]+stomped[\\s]+) ' +
    '(?<victim>  [\\S-]+ ) ' +
    '[\\s]*',
  function (killer, victim) {
    GameEvents.emit('player_killed', victim, killer);
  }
);
//eaten (s/a)
Parser.onRegex(
  '^(?<victim>  [\\S-]+ ) ' +
    '(?:[\\s]+was[\\s]+eaten) ' +
    '(?:[\\s]+with\\sthe\\shelp\\sof[\\s]+)? ' +
    '(?<killer>  [\\S-]+ )? ' +
    '[\\s]*',
  function (victim, killer) {
    GameEvents.emit('player_killed', victim, killer);
  }
);
//hammer (av)
Parser.onRegex(
  '^(?<killer>  [\\S-]+ ) ' +
    '(?:[\\s]+hammered[\\s]+) ' +
    '(?<victim>  [\\S-]+ ) ' +
    '[\\s]*',
  function (killer, victim) {
    GameEvents.emit('player_killed', victim, killer);
  }
);
//sword (av)
Parser.onRegex(
  '^(?<killer>  [\\S-]+ ) ' +
    '(?:[\\s]+slew[\\s]+)' +
    '(?<victim>  [\\S-]+ ) ' +
    '[\\s]*',
  function (killer, victim) {
    GameEvents.emit('player_killed', victim, killer);
  }
);
//bombed (av)
Parser.onRegex(
  '^(?<killer>  [\\S-]+ )? ' +
    '(?:[\\s]*bombed[\\s]+)' +
    '(?<victim>  [\\S-]+ ) ' +
    '[\\s]*',
  function (killer, victim) {
    GameEvents.emit('player_killed', victim, killer);
  }
);
//shot by arrow (va)
Parser.onRegex(
  '^(?<victim>  [\\S-]+ )  ' +
    '(?:[\\s]+was[\\s]+shot[\\s]+with[\\s]+an[\\s]+arrow[\\s]+by[\\s]+)' +
    '(?<killer>  [\\S-]+ )  ' +
    '[\\s]*',
  function (victim, killer) {
    GameEvents.emit('player_killed', victim, killer);
  }
);
//shot by bomb arrow (va)
Parser.onRegex(
  '^(?<victim>  [\\S-]+ )  ' +
    '(?:[\\s]+was[\\s]+shot[\\s]+with[\\s]+a[\\s]+bombarrow[\\s]+by[\\s]+) ' +
    '(?<killer>  [\\S-]+ )  ' +
    '[\\s]*',
  function (victim, killer) {
    GameEvents.emit('player_killed', victim, killer);
  }
);
//shot by ballista bold (va)
Parser.onRegex(
  '^(?<victim>  [\\S-]+ ) ' +
    '(?:[\\s]+was[\\s]+shot[\\s]+with[\\s]+a[\\s]+ballista[\\s]+bolt[\\s]+by[\\s]+) ' +
    '(?<killer>  [\\S-]+ ) ' +
    ' [\\s]*',
  function (victim, killer) {
    GameEvents.emit('player_killed', victim, killer);
  }
);
//shot by cata (va)
Parser.onRegex(
  '^(?<victim>  [\\S-]+ ) ' +
    ' (?:[\\s]+was[\\s]+burried[\\s]+with[\\s]+a[\\s]+catapult[\\s]+by[\\s]+)' +
    '(?<killer>  [\\S-]+ )  ' +
    '[\\s]*',
  function (victim, killer) {
    GameEvents.emit('player_killed', victim, killer);
  }
);
//mine (av
Parser.onRegex(
  '^(?<killer>  [\\S-]+ )? ' +
    '(?:[\\s]+gibbed[\\s]+)' +
    '(?<victim>  [\\S-]+ ) ' +
    '[\\s]*',
  function (killer, victim) {
    GameEvents.emit('player_killed', victim, killer);
  }
);
//keg av
Parser.onRegex(
  '^(?<killer>  [\\S-]+ )? ' +
    '(?:[\\s]+kegged[\\s]+) ' +
    '(?<victim>  [\\S-]+ ) ' +
    '[\\s]*',
  function (killer, victim) {
    GameEvents.emit('player_killed', victim, killer);
  }
);
//spikes va
Parser.onRegex(
  '^(?<victim>  [\\S-]+ )' +
    '(?:[\\s]+died[\\s]+on[\\s]+spikes) ' +
    '(?:[\\s]+with\\sthe\\shelp\\sof[\\s]+)? ' +
    '(?<killer>  [\\S-]+ )? ' +
    '[\\s]*',
  function (victim, killer) {
    GameEvents.emit('player_killed', victim, killer);
  }
);

//dominated av
Parser.onRegex(
  '^(?<killer>  [\\S-]+ ) ' +
    '(?:[\\s]+dominated[\\s]+over[\\s]+)' +
    '(?<victim>  [\\S-]+ ) ' +
    '[\\s]*',
  function (killer, victim) {
    GameEvents.emit('player_killed', victim, killer);
  }
);


//################## FLAGS

Parser.onRegex(
  '^(?:Blue|Red)(?:[\\s]+Team\'s[\\s]+flag[\\s]+has[\\s]+been[\\s]+captured[\\s]+by[\\s])' +
    '(?<capturer>  [\\S-]+ ) ' +
    '![\\s]*',
  function (capturer) {
    GameEvents.emit('flag_captured',capturer);
  }
);
