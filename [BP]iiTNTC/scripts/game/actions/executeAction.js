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
            if(action.fillOptions.fillStop){
                game.structure.fillStop()
                game.player.sendMessage("[Fill]Stop Fill Block Work")
            }else{
             game.structure.fillSettings = {
                tickInterval : action.fillOptions.delay,
                blocksPerTick : action.fillOptions.amount
                }
             game.player.sendMessage(`填充速度${action.fillOptions.delay}T 數量：${action.fillOptions.amount}`)
             game.structure.fill();
             game.player.sendMessage("[Fill]Start Fill Block Work")
            }
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
            
        case "RangeSet":
            let CopyStructureSet={ ...game.structure.structureProperties }
            let limitHeight = CopyStructureSet.limitHeight
            let limitWidth = CopyStructureSet.limitWidth
            
            if(action.rangeOptions.changeHeight){
                let HeightRange=CopyStructureSet.height + action.rangeOptions.range
                
                if(HeightRange > limitHeight ){
                    game.player.sendMessage(`兄弟擴建太高了 限制最大高度${limitHeight}`)
                    HeightRange=limitHeight
                } else if(HeightRange < 5){
                    game.player.sendMessage(`兄弟太矮了 限制最小高度：5`)
                    HeightRange = 5
                }
                
                CopyStructureSet.height = HeightRange
            }
            
            else{
                let WidthRange=CopyStructureSet.width + action.rangeOptions.range
                
                if(WidthRange > limitWidth ){
                    game.player.sendMessage(`兄弟太寬了 限制最大寬度${limitWidth}`)
                    WidthRange=limitWidth
                } else if(WidthRange < 5){
                    game.player.sendMessage(`兄弟太小了 限制最小寬度：5`)
                    WidthRange = 5
                }
                
                CopyStructureSet.width = WidthRange
            }
            game.player.sendMessage(`Range Change:${action.rangeOptions.range} ->${CopyStructureSet.width}x${CopyStructureSet.height}`)
            game.structure.structureProperties = JSON.stringify(CopyStructureSet);   
            game.changeGame()
            
            break;
            
    }
}
