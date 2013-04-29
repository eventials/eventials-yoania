/**
 * This module's mission is to control the buffering state of all
 * playable content that requires synchronization.
 */
var yoania = (function() {

  var EventGenerator = klass(function(params) {
    this._eventListeners = [];
  }).methods({
    /**
     * Register a new event listener.
     */
    on: function(event, funct) {
      this._eventListeners[event] = this._eventListeners[event] || [];
      var eventListenerArray = this._eventListeners[event];

      eventListenerArray.push(funct);
    },

    /**
     * Clear this class state.
     */
    clear: function() {
      this._eventListeners = [];
    },

    /**
     * Triggers an event to the ones who are interested in.
     */
    _triggerEvent: function(event, args) {
      var eventListenerArray = this._eventListeners[event] || [];

      for (var idx = 0; idx < eventListenerArray.length; idx++) {
        var callback = eventListenerArray[idx];
        try {
          callback.apply(this, args);
        }
        catch (e) {
          console.error("Exception calling back the event '" + event + "'");
        }
      }
    }
  });

  /**
   * Class definition.
   */
  var BufferingControl = EventGenerator.extend(function (params) {
    this._isBuffering = false;
    this._resources = {};
  }).methods({
    /**
     * Add a resource to be considered by the buffering control.
     * if not informed, bufferingState is considered true.
     */
    addResource: function(resourceName, bufferingState) {
      this._resources[resourceName] = bufferingState || true;
    },

    /**
     * Remove a resource from the buffering control.
     */
    removeResource: function(resourceName) {
      var index = this._resources.indexOf(resourceName);
      this._resources.splice(index, 1);
    },

    /**
     * Changes the buffering state of a resource.
     */
    changeResourceBufferingState: function(resourceName, bufferingState) {
      this._resources[resourceName] = bufferingState;
      this._checkResources();
    },

    /**
     * Return true if it is currently buffering, false otherwise.
     */
    isBuffering: function() {
      return this._isBuffering;
    },

    /**
     * Clear this class state.
     */
    clear: function() {
      this.supr();

      this._isBuffering = false;
      this._resources = {};
    },

    /**
     * Go through all registered resources to see if is there
     * at least one that is currently buffering. If so, triggers a
     * 'buffering' event. Otherwise, triggers a 'canplay' event.
     */
    _checkResources: function() {
      this._isBuffering = false;

      for (var ri in this._resources) {
        if (this._resources[ri]) {
          this._isBuffering = true;
          this._triggerEvent('buffering', []);
          break;
        }
      }

      if (!this._isBuffering) {
        this._triggerEvent('canplay', []);
      }
    }
  });

  return {
    bufferingControl: new BufferingControl(),
    mainTimelineControl: new EventGenerator()
  };

})();