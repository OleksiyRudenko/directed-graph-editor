const stateInit = (context, watchedProps, props) => {
  context.state = {};
  watchedProps.forEach(propName => context.state[propName] = props[propName]);
}

const stateUpdate = (context, watchedProps, prevProps) => {
  const stateAmendments = {};
  watchedProps.forEach(propName => {
    if (prevProps[propName] !== context.props[propName]) {
      stateAmendments[propName] = context.props[propName];
    }
  });
  if (Object.keys(stateAmendments).length) {
    context.setState({
      ...context.state,
      ...stateAmendments,
    });
  }
}

export {
  stateInit,
  stateUpdate,
};
