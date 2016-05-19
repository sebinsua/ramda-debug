#!/usr/bin/env node
'use strict';

var look = require('..').on();

function Entity (state) {
    this.state = state;
}

var someEntity = new Entity(1);

var mylibrary = {
  update: function update(entity, newValue) {
    entity.state = newValue;
    return entity;
  }
};

var f1 = function () {
  var promiseReturnsTwo = Promise.resolve(2);
  return promiseReturnsTwo.then(function (v) {
    return mylibrary.update(someEntity, v);
  });
};

mylibrary = look.wrap(mylibrary);
f1 = look('f1', f1);

f1();
