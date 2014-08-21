/**
 * Created by tennizmazter on 7/27/14.
 */

/** jshint globals: moment*/
import Ember from 'ember';

function evenRound (num, decimalPlaces) {
  var d = decimalPlaces || 0;
  var m = Math.pow(10, d);
  var n = +(d ? num * m : num).toFixed(8); // Avoid rounding errors
  var i = Math.floor(n), f = n - i;
  var e = 1e-8; // Allow for rounding errors in f
  var r = (f > 0.5 - e && f < 0.5 + e) ?
              ((i % 2 == 0) ? i : i + 1) : Math.round(n);
  return d ? r / m : r;
}

export default Ember.Controller.extend({

  /**
   * @property {Number} - the balance of the loan
   */
  balance: 1500,

  /**
   * @property {Number} - the initial monthly payment to be made on the loan
   */
  monthly: 200,

  /**
   * @property {Number} - the interest rate on the loan
   */
  interest: 0,

  /**
   * @property {Boolean} _ has a balance been entered and is greater than zero
   */
  missingBalance: function () {
    return !this.get('balance');
  }.property('balance'),

  /**
   * @property {Boolean} - has a monthly payment and is greater than zero
   */
  missingMonthly: function () {
    return !this.get('monthly');
  }.property('monthly'),

  /**
   * @property {Boolean} - has an interest rate filled in, can be zero
   */
  missingInterest: function () {
    var interest = parseInt(this.get('interest'));

    return !interest && interest !== 0;
  }.property('interest'),

  /**
   * @property {Boolean} - returns true if any of the required fields are not
   * filled in
   */
  cannotCalculate: function () {
    return this.get('missingBalance') ||
           this.get('missingMonthly') ||
           this.get('missingInterest');
  }.property('missingBalance', 'missingMonthly', 'missingInterest'),

  /**
   * @property {Boolean} - can show the table with results or not
   */
  canShowTable: false,

  /**
   * @property {Array} - array of payment objects consisting of a balance,
   * interest rate, and monthly payment
   */
  payments: [],

  actions: {

    /**
     * @action recalculates a new payments array based on the modified payment
     * amount
     * @param {Number} - the new payment amount
     * @param {Number} - the identifier for which element in the array to modify
     */
    adjustPayment: function (newPayment, index) {
      var ret = [],
          payments = this.get('payments'),
          balance = parseInt(this.get('balance')),
          monthly = parseInt(this.get('monthly')),
          i = 0;

      while (balance > 0) {
        var amountPaid, newBalance;
        var currPayment = payments[i],
            modifiedByAlgorithm = false;

        //this iteration in the loop is the payment we want to modify
        if (i === index) {
          amountPaid = parseInt(newPayment);
        } else {
        //use the previously calculated amountPaid amount since we're not
        //modifying this payment if that payment object exists, it might not
        //if a modified payment was made to be less than the monthly payment
          if (currPayment) {
            if (!currPayment.modifiedByAlgorithm) {
                amountPaid = currPayment.amountPaid;
            } else {
              //ignore the payment amount, it was modified on behalf of the user
                amountPaid = monthly;
            }
          } else {
            amountPaid = monthly;
          }
        }

        //for the first month, it's always the balance minus the amount paid
        if (i === 0) {
          newBalance = balance - amountPaid;
        } else {
        //for subsequent months, the new balance for that month is the previous
        //month's balance minus the amount paid
          newBalance = ret[i - 1].newBalance - amountPaid;
        }

        //we're at the last month, no point in showing negative numbers
        //the last payment should be the payoff amount
        if (newBalance < 0) {
          newBalance = 0;
          amountPaid = ret[i - 1].newBalance;
          modifiedByAlgorithm = true;
        }

        ret.push({
          number: i,
          date: moment().add(i, 'M').format('MMM YYYY'),
          amountPaid: amountPaid,
          newBalance: newBalance,
          modifiedByAlgorithm: modifiedByAlgorithm
        });

        balance = newBalance;

        i++;
      }

      this.set('payments', ret);
    },

    /* Interest calculation
      apr - 4.5
      yearly interest = balance * 0.045
      monthly interest = yearly interest / 12
      principal paid = payment - monthly interest
      interest paid = monthly interest
    */

    calculate: function () {
      this.set('canShowTable', true);

      var ret = [],
          balance = parseFloat(this.get('balance')),
          monthly = parseFloat(this.get('monthly')),
          interest = parseFloat(this.get('interest')) / 100,
          modifiedByAlgorithm = false,
          i = 0;

      while (balance > 0) {
        var interestPaid = balance * interest / 12;
        interestPaid = evenRound(interestPaid, 2);

        var principalPaid = monthly - interestPaid,
            newBalance = balance - principalPaid,
            interestToDate,
            amountPaid = monthly;


        principalPaid = parseFloat(principalPaid.toFixed(2));
        newBalance = parseFloat(newBalance.toFixed(2));
        interestToDate = !i ? interestPaid : ret[i - 1].interestToDate + interestPaid;

        if (newBalance < 0) {
          newBalance = 0;
          amountPaid = ret[i - 1].newBalance;
          modifiedByAlgorithm = true;
        }

        ret.push({
          number: i,
          date: moment().add(i, 'M').format('MMMM YYYY'),
          amountPaid: amountPaid,
          newBalance: newBalance,
          interestPaid: interestPaid,
          principalPaid: principalPaid,
          interestToDate: interestToDate,
          modifiedByAlgorithm: modifiedByAlgorithm
        });

        balance = newBalance;
        i++;
      }

      this.set('payments', ret);
    }
  }
});
