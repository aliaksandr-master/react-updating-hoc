[![npm](http://img.shields.io/npm/v/react-updating-hoc.svg?style=flat-square)](https://www.npmjs.com/package/react-updating-hoc)
[![npm](http://img.shields.io/npm/l/react-updating-hoc.svg?style=flat-square)](http://opensource.org/licenses/MIT)
[![Dependency Status](https://david-dm.org/aliaksandr-master/react-updating-hoc.svg?style=flat-square)](https://david-dm.org/aliaksandr-master/react-updating-hoc)
[![devDependency Status](https://david-dm.org/aliaksandr-master/react-updating-hoc/dev-status.svg?style=flat-square)](https://david-dm.org/aliaksandr-master/react-updating-hoc#info=devDependencies)

# react-updating-hoc

```shell
$ npm install react-updating-hoc --save
```

## Usage 

```js
import React from 'react';
import updating from 'react-updating-hoc';

const SomeComponent = () => (<div>Hello wordl!</div>);

export default updating(
  (props, isInit) => { // update method
    doSomething(); 
  },
  (props, prevProps) => false // should update one more time
)(SomeComponent);
```
