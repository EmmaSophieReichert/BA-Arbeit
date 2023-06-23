/**
 * Represents an Event, published by an Observable. Similar events are identified by 
 * a common type to which Observables may subscribe. With each Event a unique payload,
 * consisting of a single value or an object can be published.
 */
class Event {
    constructor(type, data) {
      this.type = type;
      this.data = data;
      Object.freeze(this);
    }
}
  
/**
 * Represents an object which may act as an Observable. Observers can subscribe to future
 * events broadcasted from the Observer.
 */
class Observable {

    constructor() {
        this.listener = {};
    }

    /**
     * Adds a new Observer (Callback), subscribed to certain events.
     * 
     * @param {type} String 
     * @param {*} callback 
     */
    addEventListener(type, callback) {
        if (this.listener[type] === undefined) {
        this.listener[type] = [];
        }
        this.listener[type].push(callback);
    }

    /**
     * Broadcasts the given event to all Observers subscribed to its type.
     * 
     * @param {Object} event 
     */
    notifyAll(event) {
        if (this.listener[event.type] !== undefined) {
        for (let i = 0; i < this.listener[event.type].length; i++) {
            this.listener[event.type][i](event);
        }
        }
    }

}
  
export { Event, Observable };
  
export default Observable;