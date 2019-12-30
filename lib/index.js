import { compose, lifecycle } from 'recompose';
import isEqual from 'lodash/isEqual';
import groupBy from 'lodash/groupBy';
import get from 'lodash/get';


const assertFunction = (func, message = 'is not a function') => {
  if (typeof func !== 'function') {
    throw new TypeError(`updating-hoc assert: ${message}`);
  }
};


const base = Date.now();

export const INIT = `@INIT@${base}@`;
export const AFTER_UPDATE = `@AFTER_UPDATE@${base}@`;
export const BEFORE_UPDATE = `@BEFORE_UPDATE@${base}@`;
export const AFTER_INIT_AND_BEFORE_UPDATE = `@AFTER_INIT_AND_BEFORE_UPDATE@${base}@`;


const methodsMap = {
  [INIT]: [ 'componentDidMount' ],
  [BEFORE_UPDATE]: [ 'UNSAFE_componentWillUpdate' ],
  [AFTER_UPDATE]: [ 'componentDidUpdate' ],
  [AFTER_INIT_AND_BEFORE_UPDATE]: [ 'componentDidMount', 'UNSAFE_componentWillUpdate' ],
};


const callFuncs = (funcs, currentProps, otherProps) => {
  funcs.forEach((func) => {
    func(currentProps, otherProps);
  });
};

const methodsToFunction = {
  componentDidMount: (funcs) => function () {
    callFuncs(funcs, this.props, null);
  },
  UNSAFE_componentWillUpdate: (funcs) => function (nextProps) {
    callFuncs(funcs, nextProps, this.props);
  },
  componentDidUpdate: (funcs) => function (prevProps) {
    callFuncs(funcs, this.props, prevProps);
  }
};

const availableWhenValues = Object.keys(methodsMap);


export const callWhen = (condition, executor, when = AFTER_INIT_AND_BEFORE_UPDATE) => {
  assertFunction(condition, 'condition is not a function');
  assertFunction(executor, 'executor is not a function');

  if (!availableWhenValues.includes(when)) {
    throw new ReferenceError(`when "${when}" is undefined. must be [${availableWhenValues.join(', ')}]`);
  }

  return {
    when,
    condition,
    executor
  };
};


const selectSimple = (props, prop) => props[prop];
const selectLodashGet = (props, prop) => get(props, prop);
const eqShallow = (prop1, prop2) => prop1 === prop2;

export const propsAreUpdated = (propNames, deep = false, useGet = false) => {
  if (!Array.isArray(propNames)) {
    throw new TypeError(`propNames must be array of strings`);
  }

  let getProp = useGet ? selectLodashGet : selectSimple;
  const isEq = deep ? isEqual : eqShallow;

  return (props, prevProps) => prevProps === null ? false : propNames.some((propName) => !isEq(getProp(prevProps, propName), getProp(props, propName)));
};


export const callWhenPropsAreUpdated = (propNames, executor, useGet = false) => callWhen(
  propsAreUpdated(propNames, false, useGet),
  executor,
  BEFORE_UPDATE
);


export const callWhenPropsAreUpdatedDeeply = (propNames, executor, useGet = false) => callWhen(
  propsAreUpdated(propNames, true, useGet),
  executor,
  BEFORE_UPDATE
);


export const callWhenAreInitialized = (condition, executor = null) => {
  if (executor === null) {
    executor = condition;
    condition = () => true;
  }

  return callWhen(condition, executor, INIT);
};


export default (...triggers) => (Target) => {
  triggers = triggers
    .map((trigger) => {
      if (trigger && typeof trigger === 'object' && trigger.when && trigger.condition && trigger.executor) {
        return trigger;
      }

      throw new Error('invalid type of trigger');
    });

  const triggerByWhen = groupBy(triggers, 'when');

  const triggersByMethods = Object.keys(triggerByWhen).reduce((triggersByMethods, when) =>
    methodsMap[when].reduce((methods, methodName) => {
      methods[methodName] = methods.hasOwnProperty(methodName) ? [ ...methods[methodName], ...triggerByWhen[when] ] : [ ...triggerByWhen[when] ];

      return methods;
    }, triggersByMethods)
  , {});

  const methodsNames = Object.keys(triggersByMethods);

  if (!methodsNames.length) {
    return Target;
  }

  const methods = methodsNames.reduce((methods, method) => {
    const funcs = triggersByMethods[method].map(({ condition, executor }) => (props, otherProps) => {
      const reason = condition(props, otherProps);

      if (!reason) {
        return;
      }

      executor(props, reason);
    });

    methods[method] = methodsToFunction[method](funcs);

    return methods;
  }, {});

  return compose(
    lifecycle(methods)
  )(Target);
};
