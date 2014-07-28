/**
 * Created by tennizmazter on 7/27/14.
 */

import Ember from 'ember';

export default Ember.ObjectController.extend({

  /**
   * @property {Boolean} - can show the table with results or not
   */
  canShowTable: false,

  actions: {

    showTable: function () {
      this.set('canShowTable', true);
    }
  }
});