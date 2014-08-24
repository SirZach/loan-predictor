/**
 * Created by tennizmazter on 7/27/14.
 */

/** jshint globals: moment*/
import Ember from 'ember';
import Calculator from '../helpers/calculator';
import Payment from '../models/payment';

export default Ember.Controller.extend({

  /**
   * @property {Number} - the balance of the loan
   */
  balance: 1500,

  /**
   * @property {Number} - the length of the loan in years
   */
  term: 3,

  /**
   * @property {Number} - the interest rate on the loan
   */
  interestRate: 0,

  /**
   * @property {Boolean} _ has a balance been entered and is greater than zero
   */
  missingBalance: Ember.computed.not('balance'),

  /**
   * @property {Boolean} - has a term and is greater than zero
   */
  missingTerm: Ember.computed.not('term'),

  /**
   * @property {Boolean} - has an interest rate filled in, can be zero
   */
  missingInterestRate: function () {
    var interestRate = parseInt(this.get('interestRate'));

    return !interestRate && interestRate !== 0;
  }.property('interestRate'),

  /**
   * @property {Boolean} - returns true if any of the required fields are not
   * filled in
   */
  cannotCalculate: function () {
    return this.get('missingBalance') ||
           this.get('missingTerm') ||
           this.get('missingInterestRate');
  }.property('missingBalance', 'missingTerm', 'missingInterestRate'),

  /**
   * @property {Float} - calculates the minimum payment on the loan
   */
  minimumPayment: function () {
    var balance = parseFloat(this.get('balance')),
        interestRate = parseFloat(this.get('interestRate')),
        term = this.get('term');

    return Calculator.MinimumPayment(balance, interestRate, term);
  }.property('balance', 'interestRate', 'term'),

  /**
   * @property {Boolean} - can show the table with results or not
   */
  canShowTable: false,

  /**
   * @property {Array} - array of payment objects consisting of a balance,
   * interest rate, and monthly payment
   */
  payments: [],

  _calculatePayment: function (paymentNumber, paymentsArray) {
    var balance = !paymentNumber ? parseFloat(this.get('balance')) : paymentsArray[paymentNumber - 1].newBalance,
        minimumPayment = parseFloat(this.get('minimumPayment')),
        interestRate = parseFloat(this.get('interestRate'));

    var interestPaid = Calculator.InterestAccrued(balance, interestRate, 12),
        principalPaid = Calculator.MonetaryDifference(minimumPayment, interestPaid),
        newBalance = Calculator.MonetaryDifference(balance, principalPaid),
        interestToDate,
        amountPaid = minimumPayment;

    interestToDate = !paymentNumber ? interestPaid : paymentsArray[paymentNumber - 1].interestToDate + interestPaid;
    interestToDate = Calculator.Floatize(interestToDate);

    if (newBalance < 0) {
      newBalance = 0;
    }

    return Payment.create({
      number: paymentNumber,
      amountPaid: amountPaid,
      newBalance: newBalance,
      interestPaid: interestPaid,
      principalPaid: principalPaid,
      interestToDate: interestToDate
    });
  },

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

      var balance = this.get('balance'),
          payment,
          ret = [],
          i = 0;

      while (balance > 0) {
        payment = this._calculatePayment(i, ret);
        ret.push(payment);
        balance = payment.get('newBalance');
        i++;
      }

      this.set('payments', ret);
    }
  }
});
