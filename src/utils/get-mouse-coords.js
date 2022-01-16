export const getMouseCoords = event => {
  // event handling source: https://codesandbox.io/s/react-click-and-touch-detection-gc3p2?file=/src/App.js:145-1386
  event.persist();
  const isTouch =
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0;
  const {
    clientWidth,
    clientHeight,
    offsetLeft,
    offsetTop
  } = event.currentTarget;
  if (!isTouch) {
    const { offsetX, offsetY } = event.nativeEvent;
    return {
      x: offsetX,
      y: offsetY,
      clientWidth,
      clientHeight,
    }
  } else {
    const { targetTouches: [targetEvent] = [] } = event.nativeEvent;
    if (targetEvent) {
      const { clientX, clientY } = targetEvent;
      const x = clientX - offsetLeft;
      const y = clientY - offsetTop;
      return {
        x,
        y,
        clientWidth,
        clientHeight
      };
    }
  }
}
