/**
 * Created by tennizmazter on 7/27/14.
 */

import Ember from 'ember';

export default Ember.Controller.extend({

  balance: 1500,

  monthly: 200,

  /**
   * @property {Boolean} - can show the table with results or not
   */
  canShowTable: false,

  payments: [],

  actions: {

    adjustPayment: function (newPayment, index) {
      var ret = [],
          payments = this.get('payments'),
          balance = +this.get('balance'),
          interest = +this.get('interest'),
          monthly = +this.get('monthly');

      if (monthly && balance) {
        var monthsToPayOff = Math.ceil(balance / monthly);

        for (var i = 0; i < monthsToPayOff; i++) {
          var amountPaid = i === index ? newPayment : payments[i] ? payments[i].amountPaid : monthly,
              newBalance;

          amountPaid = parseInt(amountPaid);

          if (i === 0) {
            newBalance = balance - amountPaid;
          } else {
            newBalance = ret[i - 1].newBalance - amountPaid;
          }

          if (newBalance < 0) {
            newBalance = 0;
          }

          ret.push({
            number: i,
            date: 'dno yet',
            amountPaid: amountPaid,
            newBalance: newBalance
          });

          if (!newBalance) {
            i = monthsToPayOff;
          }
        }
      }

      this.set('payments', ret);
    },

    calculate: function () {
      this.set('canShowTable', true);

      var ret = [],
          balance = +this.get('balance'),
          interest = +this.get('interest'),
          monthly = +this.get('monthly');

      if (monthly && balance) {
        var monthsToPayOff = Math.ceil(balance / monthly);

        for (var i = 0; i < monthsToPayOff; i++) {
          ret.push({
            number: i,
            date: 'dno yet',
            amountPaid: monthly,
            newBalance: balance - (monthly * i + monthly)
          });
        }
      }

      this.set('payments', ret);
    }
  }
});
