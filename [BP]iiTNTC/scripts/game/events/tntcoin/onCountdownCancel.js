export async function onCountdownCancel(game) {
    const TITLE = '§cOHHH NOOOO!!!§r';
    const SOUND = 'random.totem';
    game.feedback.showFeedbackScreen({
        title: TITLE,
        sound: SOUND
    });
}
