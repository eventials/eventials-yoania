/**
 * Test setUp.
 */
QUnit.testStart(function() {
  yoania.bufferingControl.clear();
});

/**
 * Test the buffering control with only one resource.
 */
asyncTest("test one resource buffering.", 2, function() {
  var count = 0;
  yoania.bufferingControl.on("buffering", function() {
    ok(true);
    count++;

    if (count === 2) {
      start();
    }
  });

  yoania.bufferingControl.addResource("slides");
  yoania.bufferingControl.changeResourceBufferingState("slides", yoania.BufferingState.BUFFERING);
});

/**
 * Test the buffering control with three resource.
 * All resources start in buffering state.
 * One by one I change the buffering state resource to READY
 * When the buffering control detects that all resources are NOT
 * buffering, I expect the 'ready' event.
 */
asyncTest("test three resource.", 10, function() {
  yoania.bufferingControl.on("buffering", function() {
    ok(true);
  });

  // must pass in this callback only once.
  yoania.bufferingControl.on("ready", function() {
    ok(true);
    start();
  });

  yoania.bufferingControl.addResource("slides");
  yoania.bufferingControl.addResource("chat");
  yoania.bufferingControl.addResource("video");

  yoania.bufferingControl.changeResourceBufferingState("slides", yoania.BufferingState.READY);
  yoania.bufferingControl.changeResourceBufferingState("chat", yoania.BufferingState.READY);
  yoania.bufferingControl.changeResourceBufferingState("video", yoania.BufferingState.READY);
});

/**
 * Test the buffering control with three resource.
 * All resources start in buffering state.
 * First I set both of them to READY.
 * 1 second later I set one resource to BUFFERING (will buffer again)
 * 1 second later I set the same resrouce to READY afain (another 
 * 'ready' event is expected).
 */
asyncTest("test two resource changing states.", 7, function() {
  var passCount = 0;

  yoania.bufferingControl.on("buffering", function() {
    ok(true);
    passCount++;
  });

  // must pass in this callback twice.
  yoania.bufferingControl.on("ready", function() {
    ok(true);
    passCount++;

    if (passCount === 7) {
      start();
    }
  });

  yoania.bufferingControl.addResource("video");
  yoania.bufferingControl.addResource("slides");

  yoania.bufferingControl.changeResourceBufferingState("video", yoania.BufferingState.READY);
  yoania.bufferingControl.changeResourceBufferingState("slides", yoania.BufferingState.READY);

  setTimeout(function() {
    yoania.bufferingControl.changeResourceBufferingState("video", yoania.BufferingState.BUFFERING);

    setTimeout(function() {
      yoania.bufferingControl.changeResourceBufferingState("video", yoania.BufferingState.READY);
    }, 1000);
  }, 1000);
});

/**
 * Test the buffering control with three resource.
 * All resources start in buffering state.
 * One by one I change the buffering state resource to READY,
 * and the last one to ERROR.
 * When the buffering control detects that there's an erro,
 * I expect the 'error' event.
 */
asyncTest("test three resources one with error.", 10, function() {
  // must pass in this callback twice.
  yoania.bufferingControl.on("buffering", function() {
    ok(true);
  });

  // must pass in this callback only once.
  yoania.bufferingControl.on("error", function() {
    ok(true);
    start();
  });

  yoania.bufferingControl.addResource("slides");
  yoania.bufferingControl.addResource("chat");
  yoania.bufferingControl.addResource("video");

  yoania.bufferingControl.changeResourceBufferingState("slides", yoania.BufferingState.READY);
  yoania.bufferingControl.changeResourceBufferingState("chat", yoania.BufferingState.READY);
  yoania.bufferingControl.changeResourceBufferingState("video", yoania.BufferingState.ERROR);
});
