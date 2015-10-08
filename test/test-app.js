'use strict';

var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;

describe('editor-framework:app', function () {

  // panel
  // ===============

  describe('package-type = panel', function () {
    before(function (done) {
      helpers.run(path.join(__dirname, '../generators/app'))
        .withPrompts({
          packageName: 'foobar',
          packageType: 'panel',
          panelName: 'simple-panel',
        })
        .on('end', done);
    });

    it('creates files', function () {
      assert.file([
        'package.json',
        'main.js',

        // panel files
        'panel/panel.js',
        'panel/panel.css',
        'panel/panel.html',

        // config
        '.editorconfig',
        '.jshintrc',

        // misc
        'LICENSE.md',
        'README.md',
      ]);
    });

    it('should have the contents we expect', function () {
      assert.fileContent('package.json', '"name": "foobar",');
      assert.fileContent('package.json', '"panels": {\n    "simple-panel"');
      assert.fileContent('panel/panel.html', 'id="foobar-simple-panel"');
      assert.fileContent('panel/panel.js', 'Editor.registerPanel( \'foobar.simple-panel\', {');
    });
  });

  // widget
  // ===============

  describe('package-type = widget', function () {
    before(function (done) {
      helpers.run(path.join(__dirname, '../generators/app'))
        .withPrompts({
          packageName: 'foobar',
          packageType: 'widget',
          widgetName: 'simple-widget',
        })
        .on('end', done);
    });

    it('creates files', function () {
      assert.file([
        'package.json',
        'main.js',

        // widget files
        'widget/simple-widget.js',
        'widget/simple-widget.css',
        'widget/simple-widget.html',

        // config
        '.editorconfig',
        '.jshintrc',

        // misc
        'LICENSE.md',
        'README.md',
      ]);
    });

    it('should have the contents we expect', function () {
      assert.fileContent('package.json', '"name": "foobar",');
      assert.fileContent('widget/simple-widget.html', 'id="simple-widget"');
    });
  });

  // core
  // ===============

  describe('package-type = core', function () {
    before(function (done) {
      helpers.run(path.join(__dirname, '../generators/app'))
        .withPrompts({
          packageName: 'foobar',
          packageType: 'core',
        })
        .on('end', done);
    });

    it('creates files', function () {
      assert.file([
        'package.json',
        'main.js',

        // config
        '.editorconfig',
        '.jshintrc',

        // misc
        'LICENSE.md',
        'README.md',
      ]);
    });

    it('should have the contents we expect', function () {
      assert.fileContent('package.json', '"name": "foobar",');
    });
  });
});
