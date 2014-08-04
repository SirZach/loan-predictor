import Ember from 'ember';
import {test, moduleFor} from 'ember-qunit';

moduleFor('controller:loan', 'Unit - LoanController', {

});

test('missingBalance', function () {
  var ctrl = this.subject();

  equal(ctrl.get('missingBalance'), false);

  ctrl.set('balance', 0);

  equal(ctrl.get('missingBalance'), true);
});

test('missingMonthly', function () {
  var ctrl = this.subject();

  equal(ctrl.get('missingMonthly'), false);

  ctrl.set('monthly', 0);

  equal(ctrl.get('missingMonthly'), true);
});

test('missingInterest', function () {
  var ctrl = this.subject();

  equal(ctrl.get('missingInterest'), false);

  ctrl.set('interest', 0);

  equal(ctrl.get('missingInterest'), false);

  ctrl.set('interest', null);

  equal(ctrl.get('missingInterest'), true);
});
