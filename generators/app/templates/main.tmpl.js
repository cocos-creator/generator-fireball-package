'use strict';

module.exports = {
  load () {
  },

  unload () {
  },

  <% if (packageType === 'panel') { %>
  '<%= packageName %>:open' () {
    Editor.Panel.open('<%= packageName %>.<%= panelName %>');
  },
  <% } %>
};
