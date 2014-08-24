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

test('missingTerm', function () {
  var ctrl = this.subject();

  ok(!ctrl.get('missingTerm'));

  ctrl.set('term', 0);

  ok(ctrl.get('missingTerm'));
});

test('missingInterestRate', function () {
  var ctrl = this.subject();

  ok(!ctrl.get('missingInterestRate'));

  ctrl.set('interestRate', 0);

  ok(!ctrl.get('missingInterestRate'));

  ctrl.set('interestRate', null);

  ok(ctrl.get('missingInterestRate'));
});

test('cannotCalculate', function () {
  var ctrl = this.subject();

  ctrl.setProperties({
    term: 1,
    balance: 1,
    interestRate: 1
  });

  ok(!ctrl.get('cannotCalculate'));

  ctrl.set('term', 0);

  ok(ctrl.get('cannotCalculate'));

  ctrl.setProperties({
    term: 1,
    balance: 0
  });

  ok(ctrl.get('cannotCalculate'));

  ctrl.setProperties({
    balance: 1,
    interestRate: null
  });

  ok(ctrl.get('cannotCalculate'));
});

test('minimumPayment', function () {
  var ctrl = this.subject();
  ctrl.setProperties({
    balance: 1500,
    term: 3,
    interestRate: 4.5
  });

  equal(ctrl.get('minimumPayment'), 44.62);
});

test('calculate', function () {
  var ctrl = this.subject();

  ctrl.setProperties({
    balance: 1500,
    term: 1,
    interestRate: 4.5
  });

  ctrl.send('calculate');

  var p = ctrl.get('payments');

  equal(p.length, 12);

  equal(p[0].amountPaid, 128.07);
  equal(p[0].principalPaid, 122.45);
  equal(p[0].interestPaid, 5.62);
  equal(p[0].interestToDate, 5.62);
  equal(p[0].newBalance, 1377.55);

  equal(p[1].amountPaid, 128.07);
  equal(p[1].principalPaid, 122.9);
  equal(p[1].interestPaid, 5.17);
  equal(p[1].interestToDate, 10.79);
  equal(p[1].newBalance, 1254.65);

  equal(p[2].amountPaid, 128.07);
  equal(p[2].principalPaid, 123.37);
  equal(p[2].interestPaid, 4.7);
  equal(p[2].interestToDate, 15.49);
  equal(p[2].newBalance, 1131.28);

  equal(p[3].amountPaid, 128.07);
  equal(p[3].principalPaid, 123.83);
  equal(p[3].interestPaid, 4.24);
  equal(p[3].interestToDate, 19.73);
  equal(p[3].newBalance, 1007.45);

  equal(p[4].amountPaid, 128.07);
  equal(p[4].principalPaid, 124.29);
  equal(p[4].interestPaid, 3.78);
  equal(p[4].interestToDate, 23.51);
  equal(p[4].newBalance, 883.16);

  equal(p[5].amountPaid, 128.07);
  equal(p[5].principalPaid, 124.76);
  equal(p[5].interestPaid, 3.31);
  equal(p[5].interestToDate, 26.82);
  equal(p[5].newBalance, 758.4);

  equal(p[6].amountPaid, 128.07);
  equal(p[6].principalPaid, 125.23);
  equal(p[6].interestPaid, 2.84);
  equal(p[6].interestToDate, 29.66);
  equal(p[6].newBalance, 633.17);

  equal(p[7].amountPaid, 128.07);
  equal(p[7].principalPaid, 125.7);
  equal(p[7].interestPaid, 2.37);
  equal(p[7].interestToDate, 32.03);
  equal(p[7].newBalance, 507.47);

  equal(p[8].amountPaid, 128.07);
  equal(p[8].principalPaid, 126.17);
  equal(p[8].interestPaid, 1.90);
  equal(p[8].interestToDate, 33.93);
  equal(p[8].newBalance, 381.3);

  equal(p[9].amountPaid, 128.07);
  equal(p[9].principalPaid, 126.64);
  equal(p[9].interestPaid, 1.43);
  equal(p[9].interestToDate, 35.36);
  equal(p[9].newBalance, 254.66);

  equal(p[10].amountPaid, 128.07);
  equal(p[10].principalPaid, 127.12);
  equal(p[10].interestPaid, 0.95);
  equal(p[10].interestToDate, 36.31);
  equal(p[10].newBalance, 127.54);

  equal(p[11].amountPaid, 128.07);
  equal(p[11].principalPaid, 127.59);
  equal(p[11].interestPaid, 0.48);
  equal(p[11].interestToDate, 36.79);
  equal(p[11].newBalance, 0);
});

test.skip('adjustPayment - overpaying', function () {
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

test.skip('adjustPayment - underpaying', function () {
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
