var Yeoman = require('yeoman-generator');
var Chalk = require('chalk');
var Yosay = require('yosay');
var _ = require('lodash');

module.exports = Yeoman.generators.Base.extend({
  constructor: function () {
    Yeoman.generators.Base.apply(this,arguments);
  },

  prompting: {
    packageNameAndType: function () {
      var done = this.async();

      // Have Yeoman greet the user.
      this.log(Yosay(
        'Welcome to the posh ' + Chalk.red('editor-framework') + ' generator!'
      ));

      var prompts = [];

      // packageName
      prompts.push({
        type: 'input',
        name: 'packageName',
        message: 'Your package name',
        default: this.appname,
      });

      // package type
      prompts.push({
        type: 'list',
        name: 'packageType',
        message: 'Choose your package type',
        default: 'panel',
        choices: [
          'panel',
          'widget',
          'core',
          // TODO
          // 'asset',
        ],
      });

      this.prompt(prompts, function (answers) {
        this.packageName = answers.packageName;
        this.packageType = answers.packageType;

        done();
      }.bind(this));
    },

    promptsByType: function () {
      var done = this.async();
      var prompts = [];

      if ( this.packageType === 'panel' ) {
        prompts.push({
          type: 'input',
          name: 'panelName',
          message: 'Your panel name',
          default: 'panel',
        });
      } else if ( this.packageType === 'widget' ) {
        prompts.push({
          type: 'input',
          name: 'widgetName',
          message: 'Your widget name',
          default: 'simple-widget',
        });
      }

      this.prompt(prompts, function (answers) {
        this.templateData = answers;

        if ( this.packageType === 'panel' ) {
          this.templateData.panelName = _.kebabCase(answers.panelName);
        } else if ( this.packageType === 'widget' ) {
          this.templateData.widgetName = _.kebabCase(answers.widgetName);
        }

        this.templateData.packageName = this.packageName;
        this.templateData.packageType = this.packageType;

        done();
      }.bind(this));
    },
  },

  writing: {
    app: function () {
      this.template('main.js.tmpl', 'main.js', this.templateData);
    },

    panel: function () {
      if ( this.packageType !== 'panel' ) {
        return;
      }

      this.template('panel/package.json.tmpl', 'package.json', this.templateData);
      this.copy('panel/panel.css', 'panel/panel.css');
      this.template('panel/panel.html.tmpl', 'panel/panel.html', this.templateData);
      this.template('panel/panel.js.tmpl', 'panel/panel.js', this.templateData);
    },

    widget: function () {
      if ( this.packageType !== 'widget' ) {
        return;
      }

      this.template('widget/package.json.tmpl', 'package.json', this.templateData);
      this.copy('widget/widget.css', 'widget/' + this.templateData.widgetName + '.css');
      this.template('widget/widget.html.tmpl', 'widget/' + this.templateData.widgetName + '.html', this.templateData);
      this.template('widget/widget.js.tmpl', 'widget/' + this.templateData.widgetName + '.js', this.templateData);
    },

    core: function () {
      if ( this.packageType !== 'core' ) {
        return;
      }

      this.template('core/package.json.tmpl', 'package.json', this.templateData);
    },

    config: function () {
      this.copy('config/gitignore', '.gitignore');
      this.copy('config/jshintrc', '.jshintrc');
      this.copy('config/editorconfig', '.editorconfig');
    },

    misc: function () {
      this.copy('misc/LICENSE.md', 'LICENSE.md');
      this.template('misc/README.md.tmpl', 'README.md', this.templateData);
    },
  },

  install: function () {
    this.installDependencies();
  }
});
