class EventManager {
    static addEvent(fileName) {
        let ref = require(`../Events/${fileName}`); 
        if (!ref.config) return;
        global.Client.on(ref.config.Event, ref);
    }
}

module.exports = EventManager;