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

test('calculate', function () {
  var ctrl = this.subject();

  ctrl.setProperties({
    balance: 1500,
    monthly: 200,
    interest: 4.5
  });

  ctrl.send('calculate');

  var payments = ctrl.get('payments');

  equal(payments.length, 8);

  equal(payments[0].amountPaid, 200);
  equal(payments[0].principalPaid, 194.38);
  equal(payments[0].interestPaid, 5.62);
  equal(payments[0].interestToDate, 5.62);
  equal(payments[0].newBalance, 1305.62);

  equal(payments[1].amountPaid, 200);
  equal(payments[1].principalPaid, 195.10);
  equal(payments[1].interestPaid, 4.90);
  equal(payments[1].interestToDate, 10.52);
  equal(payments[1].newBalance, 1110.52);

  equal(payments[2].amountPaid, 200);
  equal(payments[2].principalPaid, 195.84);
  equal(payments[2].interestPaid, 4.16);
  equal(payments[2].interestToDate, 14.68);
  equal(payments[2].newBalance, 914.68);

  equal(payments[3].amountPaid, 200);
  equal(payments[3].principalPaid, 196.57);
  equal(payments[3].interestPaid, 3.43);
  equal(payments[3].interestToDate, 18.11);
  equal(payments[3].newBalance, 718.11);

  equal(payments[4].amountPaid, 200);
  equal(payments[4].principalPaid, 197.31);
  equal(payments[4].interestPaid, 2.69);
  equal(payments[4].interestToDate, 20.80);
  equal(payments[4].newBalance, 520.80);

  equal(payments[5].amountPaid, 200);
  equal(payments[5].principalPaid, 198.05);
  equal(payments[5].interestPaid, 1.95);
  equal(payments[5].interestToDate, 22.75);
  equal(payments[5].newBalance, 322.75);

  equal(payments[6].amountPaid, 200);
  equal(payments[6].principalPaid, 198.79);
  equal(payments[6].interestPaid, 1.21);
  equal(payments[6].interestToDate, 23.96);
  equal(payments[6].newBalance, 123.96);

  equal(payments[7].amountPaid, 124.42);
  equal(payments[7].principalPaid, 123.96);
  equal(payments[7].interestPaid, 0.46);
  equal(payments[7].interestToDate, 24.42);
  equal(payments[7].newBalance, 0);
});

test('adjustPayment - overpaying', function () {
  var ctrl = this.subject();

  ctrl.setProperties({
    balance: 1500,
    monthly: 200,
    interest: 0
  });

  ctrl.send('calculate');

  ctrl.send('adjustPayment', 450, 3);

  var payments = ctrl.get('payments');

  equal(payments.length, 7);
  equal(payments[0].newBalance, 1300);
  equal(payments[1].newBalance, 1100);
  equal(payments[2].newBalance, 900);
  equal(payments[3].newBalance, 450);
  equal(payments[3].amountPaid, 450);
  equal(payments[4].newBalance, 250);
  equal(payments[5].newBalance, 50);
  equal(payments[6].newBalance, 0);
  equal(payments[6].amountPaid, 50);
});

test('adjustPayment - underpaying', function () {
  var ctrl = this.subject();

  ctrl.setProperties({
    balance: 1500,
    monthly: 200,
    interest: 0
  });

  ctrl.send('calculate');

  ctrl.send('adjustPayment', 10, 3);

  var payments = ctrl.get('payments');

  equal(payments.length, 9);
  equal(payments[0].newBalance, 1300);
  equal(payments[1].newBalance, 1100);
  equal(payments[2].newBalance, 900);
  equal(payments[3].newBalance, 890);
  equal(payments[3].amountPaid, 10);
  equal(payments[4].newBalance, 690);
  equal(payments[5].newBalance, 490);
  equal(payments[6].newBalance, 290);
  equal(payments[7].newBalance, 90);
  equal(payments[8].newBalance, 0);
  equal(payments[8].amountPaid, 90);

  ctrl.send('adjustPayment', 10, 8);

  payments = ctrl.get('payments');

  equal(payments.length, 10);
  equal(payments[0].newBalance, 1300);
  equal(payments[1].newBalance, 1100);
  equal(payments[2].newBalance, 900);
  equal(payments[3].newBalance, 890);
  equal(payments[4].newBalance, 690);
  equal(payments[5].newBalance, 490);
  equal(payments[6].newBalance, 290);
  equal(payments[7].newBalance, 90);
  equal(payments[8].newBalance, 80);
  equal(payments[8].amountPaid, 10);
  equal(payments[9].newBalance, 0);
  equal(payments[9].amountPaid, 80);
});
