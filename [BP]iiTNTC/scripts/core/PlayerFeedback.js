export class PlayerFeedback {
    player;
    constructor(player) {
        this.player = player;
    }
    success(message, options) {
        this.sendFeedback(message, "§a", options);
    }
    error(message, options) {
        this.sendFeedback(message, "§c", options);
    }
    info(message, options) {
        this.sendFeedback(message, "§b", options);
    }
    warning(message, options) {
        this.sendFeedback(message, "§e", options);
    }
    sendFeedback(message, color, options) {
        this.player.sendMessage(`${color}${message}`);
        if (options?.sound) {
            this.player.playSound(options.sound);
        }
        if (options?.title) {
            this.player.onScreenDisplay.setTitle(options.title);
        }
        if (options?.subtitle) {
            this.player.onScreenDisplay.updateSubtitle(options.subtitle);
        }
        if (options?.actionBar) {
            this.player.onScreenDisplay.setActionBar(options.actionBar);
        }
    }
    playSound(sound) {
        this.player.playSound(sound);
    }
    setTitle(title, options) {
        this.player.onScreenDisplay.setTitle(title, options);
    }
    setSubtitle(subtitle) {
        this.player.onScreenDisplay.updateSubtitle(subtitle);
    }
    setActionbar(actionBar) {
        this.player.onScreenDisplay.setActionBar(actionBar);
    }
    showFeedbackScreen({ title, subtitle, sound }) {
        if (title)
            this.setTitle(title);
        if (subtitle)
            this.setSubtitle(subtitle);
        if (sound)
            this.playSound(sound);
    }
}
