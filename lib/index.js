import React, { Component } from 'react';


export default (updateMethod, shouldUpdate = null) => (Target) => {
  if (typeof updateMethod !== 'function') {
    throw new Error('updatingHOC: updateMethod is not a function');
  }

  if (shouldUpdate !== null) {
    if (Array.isArray(shouldUpdate)) {
      const propNames = shouldUpdate;

      shouldUpdate = (newProps, prevProps) =>
      prevProps === null || propNames.some((propName) => newProps[propName] !== prevProps[propName]); // shallow comparing
    } else {
      if (typeof shouldUpdate !== 'function') {
        throw new Error('updatingHOC: shouldUpdate is not a function');
      }
    }
  }

  return class extends Component {
    static displayName = `updating(${Target.displayName || Target.name})`;

    componentDidMount () {
      if (!shouldUpdate) {
        updateMethod(this.props, true);
      } else if (shouldUpdate(this.props, null)) {
        updateMethod(this.props, true);
      }
    }

    componentWillReceiveProps (newProps) {
      if (shouldUpdate && shouldUpdate(newProps, this.props)) {
        updateMethod(this.props, false);
      }
    }

    render () {
      return <Target {...this.props} />
    }
  };
};
