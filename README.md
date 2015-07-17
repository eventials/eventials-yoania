# Yoania [![Version](http://img.shields.io/npm/v/yoania.svg)](https://www.npmjs.org/package/yoania)

An easy way to control multiple playable resources on your page.
This component's mission is to control the buffering state of all playable content that requires synchronization.

[![npm package](https://nodei.co/npm/yoania.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/yoania/)

## Install

Via npm:

`npm install yoania`

Via bower:

`bower install yoania`

## Dependencies

- [klass](https://github.com/ded/klass)

## Dev Dependencies

- gulp
- gulp-jshint

## Usage

### `yoania.BufferingState`

Enum with all buffering states.
Supported states are `READY`, `BUFFERING` and `ERROR`.

### `yoania.bufferingControl`

Takes control of buffering state of all resources.

#### `addResource`

Add a new resource. Takes 2 arguments, `resourceName` and `bufferingState`.
`bufferingState` is optional (default: 'BUFERRING').

#### `removeResource`

Remove a resource. Takes 1 argument, `resourceName`.

#### `changeResourceBufferingState`

Change the state of a resource. Takes 2 arguments, `resourceName` and `bufferingState`.

#### `getState`

Return state of buffer control. See `yoania.BufferingState`.

#### `clear`

Remove all events, resources and reset state to `READY`.

### `on`, `off` and `trigger`

Bind, unblind and trigger an event.

### `yoania.mainTimelineControl`

A generic timeline control.

Use this to register your video player and take control of play/pause/seek events.

### `on`, `off` and `trigger`

Bind, unblind and trigger an event.

### Events

Events triggerred by `yoania.bufferingControl`.

|   event   |  arguments   |           description            |
|-----------|:------------:|----------------------------------|
| ready     |              | if all resources are ready to go |
| buferring | resourceName | if any resource is buffering     |
| error     | resourceName | if any resource get an error     |

### Example

```js
yoania.bufferingControl.on("ready", function () {
    console.log('Ready to go!');
});

yoania.bufferingControl.on("buffering", function (resource) {
    console.log('Wait a litte! %s is buffering.', resource);
});

yoania.bufferingControl.on("ready", function (resource) {
    console.log('Oh snap! We got an error from %s.', resource);
});

yoania.bufferingControl.addResource("slides");
yoania.bufferingControl.addResource("chat");
yoania.bufferingControl.addResource("video");

yoania.bufferingControl.changeResourceBufferingState("slides", yoania.BufferingState.READY);
yoania.bufferingControl.changeResourceBufferingState("chat", yoania.BufferingState.BUFFERING);
yoania.bufferingControl.changeResourceBufferingState("video", yoania.BufferingState.ERROR);
```

## Development

### Running Tests

Open the file tests/yoania.html in your browser.

### Check code quality

`gulp lint`

### Minify

`gulp minify`

## References

[Yoania](http://en.wikipedia.org/wiki/Yoania)
