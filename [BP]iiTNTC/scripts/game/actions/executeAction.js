export function executeAction(game, action) {
    switch (action.actionType) {
        case 'Summon':
            game.summonEntities({
                entityName: action.summonOptions.entityName,
                amount: action.summonOptions.amount,
                locationType: action.summonOptions.locationType,
                onTop: action.summonOptions.onTop,
                batchSize: action.summonOptions.batchSize,
                batchDelay: action.summonOptions.batchDelay,
                playSound: {
                    playSoundOnSummon: action.summonOptions.playSound.playSoundOnSummon,
                    sound: action.summonOptions.playSound.sound,
                },
                onSummon: () => {
                    if (action.summonOptions.playSound.playSoundOnSummon) {
                        game.feedback.playSound(action.summonOptions.playSound.sound);
                    }
                },
            });
            break;
        case 'Clear Blocks':
            game.structure.clearFilledBlocks();
            break;
        case 'Fill':
            game.structure.fill();
            break;
        case 'Play Sound':
            game.feedback.playSound(action.playSound);
            break;
        case 'Screen Title':
            game.feedback.setTitle(action.screenTitle);
            break;
        case 'Screen Subtitle':
            game.feedback.setSubtitle(action.screenSubtitle);
            break;
        case "Command":
            game.player.runCommand(action.commandOptions.command);
            break;
            
        case "WinManger":
            
            let Maxx="Changer"
            let WinNum=game.winManager.getCurrentWins()
            
            if(action.winOptions.changeMax){
                WinNum=game.winManager.getMaxWins()
                Maxx="Max Changer"
            }
            
            
            game.player.sendMessage(`WinCount ${Maxx}:${WinNum}+${action.winOptions.win}=>${WinNum+action.winOptions.win}`)
            
            if(action.winOptions.changeMax){
                let WinMaxNum=WinNum + action.winOptions.win < 1 ? 1 : WinNum + action.winOptions.win
                game.winManager.setMaxWins(WinMaxNum)
            }else{
                game.winManager.setWins(WinNum + action.winOptions.win)
            }
            
            break;
    }
}
