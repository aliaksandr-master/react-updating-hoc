[![npm](http://img.shields.io/npm/v/react-updating-hoc.svg?style=flat-square)](https://www.npmjs.com/package/react-updating-hoc)
[![npm](http://img.shields.io/npm/l/react-updating-hoc.svg?style=flat-square)](http://opensource.org/licenses/MIT)
[![Dependency Status](https://david-dm.org/aliaksandr-master/react-updating-hoc.svg?style=flat-square)](https://david-dm.org/aliaksandr-master/react-updating-hoc)
[![devDependency Status](https://david-dm.org/aliaksandr-master/react-updating-hoc/dev-status.svg?style=flat-square)](https://david-dm.org/aliaksandr-master/react-updating-hoc#info=devDependencies)

# react-updating-hoc

```shell
$ npm install react-updating-hoc recompose react lodash --save
```

## Usage 

```js
import React from 'react';
import updating, { callWhen, callWhenPropsAreUpdated, callWhenPropsAreUpdatedDeeply, callWhen } from 'react-updating-hoc';

const SomeComponent = () => (<div>Hello wordl!</div>);

export default updating(
  callWhen((props) => Boolean(props.some), (props) => {
      // do something useful
  }),
  callWhenPropsAreUpdated([ 'some', 'any' ], (props) => {
      // do something useful
  }),
  callWhenPropsAreUpdatedDeeply([ 'some', 'any' ], (props) => {
      // do something useful
  }),
  callWhenPropsAreUpdated([ 'some.nested.prop', 'any' ], (props) => { // shallow equality check with lodash get
      // do something useful
  }, true),
  callWhenPropsAreUpdatedDeeply([ 'some.nested.prop', 'any' ], (props) => { // deep equality check with lodash get
      // do something useful
  }, true)
)(SomeComponent);
```
