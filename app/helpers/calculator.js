import Ember from 'ember';

var Calculator = Ember.Object.extend({

});

Calculator.reopenClass({
  GaussianRounding: function (num, decimalPlaces) {
    var d = decimalPlaces || 0;
    var m = Math.pow(10, d);
    var n = +(d ? num * m : num).toFixed(8); // Avoid rounding errors
    var i = Math.floor(n), f = n - i;
    var e = 1e-8; // Allow for rounding errors in f
    var r = (f > 0.5 - e && f < 0.5 + e) ?
                ((i % 2 === 0) ? i : i + 1) : Math.round(n);
    return d ? r / m : r;
  },

  InterestAccrued: function (balance, interestRate, compoundFrequency) {
    var interestAccrued = balance * (interestRate / 100) / compoundFrequency;
    interestAccrued = Calculator.GaussianRounding(interestAccrued, 2);

    return interestAccrued;
  },

  MonetaryDifference: function (moneyA, moneyB) {
    var difference = moneyA - moneyB;

    return parseFloat(difference.toFixed(2));
  }
});

export default Calculator;
