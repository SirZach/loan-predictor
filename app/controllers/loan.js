/**
 * Created by tennizmazter on 7/27/14.
 */

/** jshint globals: moment*/
import Ember from 'ember';

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

  /**
   * @property {Number} - number of months to pay off the loan given a monthly
   * payment and balance
   */
  monthsToPayOff: function () {
    var balance = parseInt(this.get('balance')),
        monthly = parseInt(this.get('monthly'));

    return Math.ceil(balance / monthly);
  }.property('balance', 'monthly'),

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
          monthsToPayOff = this.get('monthsToPayOff');

      for (var i = 0; i < monthsToPayOff; i++) {
        var amountPaid, newBalance;

        //this iteration in the loop is the payment we want to modify
        if (i === index) {
          amountPaid = parseInt(newPayment);
        } else {
        //use the previously calculated amountPaid amount since we're not
        //modifying this payment
          amountPaid = payments[i].amountPaid;
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
        //TODO: recalculate the amount paid to bring the new balance exactly to
        //zero
        if (newBalance < 0) {
          newBalance = 0;
        }

        ret.push({
          number: i,
          date: moment().add(i, 'M').format('MMM YYYY'),
          amountPaid: amountPaid,
          newBalance: newBalance
        });

        //the amount paid was made greater than original and at least one month
        //was cut off, shorten the array
        if (!newBalance) {
          i = monthsToPayOff;
        }
      }

      this.set('payments', ret);
    },

    calculate: function () {
      this.set('canShowTable', true);

      var ret = [],
          balance = parseInt(this.get('balance')),
          monthly = parseInt(this.get('monthly')),
          monthsToPayOff = this.get('monthsToPayOff');

      for (var i = 0; i < monthsToPayOff; i++) {
        ret.push({
          number: i,
          date: moment().add(i, 'M').format('MMMM YYYY'),
          amountPaid: monthly,
          newBalance: balance - (monthly * i + monthly)
        });
      }

      this.set('payments', ret);
    }
  }
});
