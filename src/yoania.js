/**
 * This module's mission is to control the buffering state of all
 * playable content that requires synchronization.
 */

/* exported yoania */
var yoania = (function () {
    'use strict';
    var EventGenerator = klass(function () {
        this._eventListeners = [];
    }).methods({
        /**
         * Register a new event listener.
         */
        on: function (event, funct) {
            this._eventListeners[event] = this._eventListeners[event] || [];
            var eventListenerArray = this._eventListeners[event];

            eventListenerArray.push(funct);
        },

        /**
         * Clear this class state.
         */
        clear: function () {
            this._eventListeners = [];
        },

        /**
         * Triggers an event to the ones who are interested in.
         */
        _triggerEvent: function (event, args) {
            var eventListenerArray = this._eventListeners[event] || [];

            for (var idx = 0; idx < eventListenerArray.length; idx++) {
                var callback = eventListenerArray[idx];
                try {
                    callback.apply(this, args);
                } catch (e) {
                    console.error("Exception calling back the event '" + event + "'");
                }
            }
        }
    });

    var BufferingState = {
        READY: 0,
        BUFFERING: 1,
        ERROR: 2
    };

    /**
     * Class definition.
     */
    var BufferingControl = EventGenerator.extend(function () {
        this._bufferingState = BufferingState.READY;
        this._resources = {};
    }).methods({
        /**
         * Add a resource to be considered by the buffering control.
         * if not informed, bufferingState is considered true.
         */
        addResource: function (resourceName, bufferingState) {
            this._resources[resourceName] = bufferingState || BufferingState.BUFFERING;
        },

        /**
         * Remove a resource from the buffering control.
         */
        removeResource: function (resourceName) {
            var index = this._resources.indexOf(resourceName);
            this._resources.splice(index, 1);
        },

        /**
         * Changes the buffering state of a resource.
         */
        changeResourceBufferingState: function (resourceName, bufferingState) {
            this._resources[resourceName] = bufferingState;
            this._checkResources();
        },

        /**
         * Return true if it is currently buffering, false otherwise.
         */
        getState: function () {
            return this._bufferingState;
        },

        /**
         * Clear this class state.
         */
        clear: function () {
            this.supr();

            this._bufferingState = BufferingState.READY;
            this._resources = {};
        },

        /**
         * Go through all registered resources to see if is there
         * at least one that is currently buffering. If so, triggers a
         * 'buffering' event. If there's an error, 'error' event will be triggered.
         * Otherwise, triggers a 'ready' event.
         */
        _checkResources: function () {
            this._bufferingState = BufferingState.READY;

            for (var ri in this._resources) {
                var state = this._resources[ri];

                if (state === BufferingState.BUFFERING) {
                    this._triggerEvent('buffering', [ri]);
                } else if (state === BufferingState.ERROR) {
                    this._triggerEvent('error', [ri]);
                }

                // If there's an error, that's nothing that we can do about it.
                if (state !== BufferingState.READY &&
                        this._bufferingState !== BufferingState.ERROR) {
                    this._bufferingState = state;
                }
            }

            if (this._bufferingState === BufferingState.READY) {
                this._triggerEvent('ready', []);
            }
        }
    });

    return {
        BufferingState: BufferingState,
        bufferingControl: new BufferingControl(),
        mainTimelineControl: new EventGenerator()
    };

})();
