/**
 * Test setup.
 */
QUnit.testStart(function() {
  yoania.bufferingControl.clear();
});

/**
 * Test the buffering control with only one resource.
 */
asyncTest("test on resource.", 1, function() {
  yoania.bufferingControl.on("buffering", function() {
    ok(true);
    start();
  });

  yoania.bufferingControl.addResource("slides");
  yoania.bufferingControl.changeResourceBufferingState("slides", true);
});

/**
 * Test the buffering control with three resource.
 * All resources start in buffering state.
 * One by one I change the buffering state resource to false
 * When all the buffering control detects that all resources are NOT
 * buffering, I except the 'canplay' event.
 */
asyncTest("test three resource.", 3, function() {
  // must pass in this callback twice.
  yoania.bufferingControl.on("buffering", function() {
    ok(true);
  });

  // must pass in this callback only once.
  yoania.bufferingControl.on("canplay", function() {
    ok(true);
    start();
  });

  yoania.bufferingControl.addResource("slides");
  yoania.bufferingControl.addResource("chat");
  yoania.bufferingControl.addResource("video");

  yoania.bufferingControl.changeResourceBufferingState("slides", false);
  yoania.bufferingControl.changeResourceBufferingState("chat", false);
  yoania.bufferingControl.changeResourceBufferingState("video", false);
});

/**
 * Test the buffering control with three resource.
 * All resources start in buffering state.
 * First I set both of them to false.
 * 1 second later I set one resource to true (will buffer again)
 * 1 second later I set the same resrouce to false afain (another 
 * 'canplay' event is expected).
 */
asyncTest("test two resource changing states.", 4, function() {
  var passCount = 0;

  // must pass in this callback twice.
  yoania.bufferingControl.on("buffering", function() {
    ok(true);
    passCount++;
  });

  // must pass in this callback twice.
  yoania.bufferingControl.on("canplay", function() {
    ok(true);
    passCount++;

    if (passCount === 4) {
      start();
    }
  });

  yoania.bufferingControl.addResource("video");
  yoania.bufferingControl.addResource("slides");
  
  yoania.bufferingControl.changeResourceBufferingState("video", false);
  yoania.bufferingControl.changeResourceBufferingState("slides", false);

  setTimeout(function() {
    yoania.bufferingControl.changeResourceBufferingState("video", true);

    setTimeout(function() {
      yoania.bufferingControl.changeResourceBufferingState("video", false);
    }, 1000);
  }, 1000);
});