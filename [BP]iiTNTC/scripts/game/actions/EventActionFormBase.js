export class EventActionFormBase {
    _player;
    _eventActionForm;
    _actionOptions = [
        'Summon', 'Play Sound', 'Fill', 'Clear Blocks', 'Screen Title', 'Screen Subtitle','Command',
		'WinManger'
    ];
    constructor(player, eventActionForm) {
        this._player = player;
        this._eventActionForm = eventActionForm;
    }
}
