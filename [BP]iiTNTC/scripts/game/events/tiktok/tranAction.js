export const actionTypeMap = {
  Summon: {
    optionsKey: 'summonOptions',
    mapping: (simple) => ({
      "entityName": simple.entity,
      "amount": simple.amount,
      "locationType": simple.location,
      "onTop": simple.onTop,
      "batchSize": simple.batch?.[0] ?? 1,
      "batchDelay": simple.batch?.[1] ?? 1,
      "playSound": {
        "playSoundOnSummon": simple.sound?.[0] ?? true,
        "sound": simple.sound?.[1] ?? "kururin"
      }
    })
  },
  WinManger: {
    optionsKey: 'winOptions',
    mapping: (simple) => ({
      "win": simple.win,
      "changeMax": !!simple.changeMax
    })
  },
  RangeSet: {
    optionsKey: 'rangeOptions',
    mapping: (simple) => ({
      "range": simple.range,
      "changeHeight": !!simple.changeHeight
    })
  },
  Fill: {
    optionsKey: 'fillOptions',
    mapping: (simple) => ({
      "delay":simple.delay,
      "amount":simple.amount,
      "fillStop": !!simple.fillStop
    })
  },
  "Clear Blocks": {
    optionsKey: null,
    mapping: () => ({})
  },
  "Play Sound": {
    optionsKey: 'playSound',
    mapping: (simple) => simple.sound
  },
  "Screen Title": {
    optionsKey: 'screenTitle',
    mapping: (simple) => simple.screenTitle
  },
  "Screen Subtitle": {
    optionsKey: 'screenSubtitle',
    mapping: (simple) => simple.screenSubtitle
  },
  Command: {
    optionsKey: 'commandOptions',
    mapping: (simple) => ({ "command": simple.command })
  }
};