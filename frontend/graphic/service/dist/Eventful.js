class Eventful {
    _eventCallback = new Map();
    on(eventName, callback) {
        let handlers = this._eventCallback.get(eventName);
        if (handlers === undefined) {
            handlers = [];
            this._eventCallback.set(eventName, handlers);
        }
        handlers.push(callback);
        return () => {
            const idx = handlers.indexOf(callback);
            if (idx !== -1) {
                handlers.splice(idx, 1);
            }
        };
    }
    off(eventName, callback) {
        const handlers = this._eventCallback.get(eventName);
        if (handlers !== undefined) {
            if (callback === undefined) {
                handlers.splice(0, handlers.length);
            }
            else {
                const idx = handlers.indexOf(callback);
                handlers.splice(idx, 1);
            }
        }
    }
    dispatch(eventName, event, ...args) {
        const handlers = this._eventCallback.get(eventName);
        if (handlers !== undefined && handlers.length > 0) {
            handlers.forEach(handler => handler.call(this, event, ...args));
        }
    }
}
export default Eventful;
//# sourceMappingURL=Eventful.js.map