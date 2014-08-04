import Ember from 'ember';
import {test, moduleFor} from 'ember-qunit';

moduleFor('controller:loan', 'Unit - LoanController', {

});

test('missingBalance', function () {
  var ctrl = this.subject();

  ok(!ctrl.get('missingBalance'));

  ctrl.set('balance', 0);

  ok(ctrl.get('missingBalance'));
});

test('missingMonthly', function () {
  var ctrl = this.subject();

  ok(!ctrl.get('missingMonthly'));

  ctrl.set('monthly', 0);

  ok(ctrl.get('missingMonthly'));
});

test('missingInterest', function () {
  var ctrl = this.subject();

  ok(!ctrl.get('missingInterest'));

  ctrl.set('interest', 0);

  ok(!ctrl.get('missingInterest'));

  ctrl.set('interest', null);

  ok(ctrl.get('missingInterest'));
});

test('cannotCalculate', function () {
  var ctrl = this.subject();

  ctrl.setProperties({
    monthly: 1,
    balance: 1,
    interest: 1
  });

  ok(!ctrl.get('cannotCalculate'));

  ctrl.set('monthly', 0);

  ok(ctrl.get('cannotCalculate'));

  ctrl.setProperties({
    monthly: 1,
    balance: 0
  });

  ok(ctrl.get('cannotCalculate'));

  ctrl.setProperties({
    balance: 1,
    interest: null
  });

  ok(ctrl.get('cannotCalculate'));
});

test('monthsToPayOff', function () {
  var ctrl = this.subject();

  ctrl.setProperties({
    balance: 1500,
    monthly: 300
  });

  equal(ctrl.get('monthsToPayOff'), 5);

  ctrl.set('balance', 1600);

  equal(ctrl.get('monthsToPayOff'), 6);
});

test('calculate', function () {
  var ctrl = this.subject();

  ctrl.setProperties({
    balance: 1500,
    monthly: 200,
    interest: 0
  });

  ctrl.send('calculate');

  var payments = ctrl.get('payments');

  equal(payments.length, 8);
  equal(payments[0].newBalance, 1300);
  equal(payments[1].newBalance, 1100);
  equal(payments[2].newBalance, 900);
  equal(payments[3].newBalance, 700);
  equal(payments[4].newBalance, 500);
  equal(payments[5].newBalance, 300);
  equal(payments[6].newBalance, 100);
  equal(payments[7].newBalance, 0);
});
