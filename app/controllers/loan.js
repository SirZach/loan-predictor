/**
 * Created by tennizmazter on 7/27/14.
 */

import Ember from 'ember';

export default Ember.Controller.extend({

  /**
   * @property {Boolean} - can show the table with results or not
   */
  canShowTable: false,

  rows: function () {
    var ret = [],
        balance = +this.get('balance'),
        interest = +this.get('interest'),
        monthly = +this.get('monthly');

    if (monthly && balance) {
      var monthsToPayOff = Math.ceil(balance / monthly);

      for (var i = 0; i < monthsToPayOff; i++) {
        ret.push({
          date: 'dno yet',
          amountPaid: monthly,
          newBalance: balance - (monthly * i + monthly)
        });
      }
    }

    return ret;
  }.property('balance', 'interest', 'monthly'),

  actions: {

    calculate: function () {
      this.set('canShowTable', true);
    }
  }
});