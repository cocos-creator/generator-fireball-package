var Yeoman = require('yeoman-generator');
var Chalk = require('chalk');
var Yosay = require('yosay');
var _ = require('lodash');

module.exports = Yeoman.generators.Base.extend({
  constructor: function () {
    Yeoman.generators.Base.apply(this,arguments);

    this.config.defaults({
      packageName: _.kebabCase(this.appname),
      packageType: 'panel',
      panelName: 'panel',
      widgetName: 'simple-widget',
    });
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
        default: this.config.get('packageName'),
      });

      // package type
      prompts.push({
        type: 'list',
        name: 'packageType',
        message: 'Choose your package type',
        default: this.config.get('packageType'),
        choices: [
          'panel',
          'widget',
          'core',
          // TODO
          // 'asset',
        ],
      });

      this.prompt(prompts, function (answers) {
        this.packageName = _.kebabCase(answers.packageName);
        this.packageType = _.kebabCase(answers.packageType);

        this.config.set( 'packageName', this.packageName );
        this.config.set( 'packageType', this.packageType );

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
          default: this.config.get('panelName'),
        });
      } else if ( this.packageType === 'widget' ) {
        prompts.push({
          type: 'input',
          name: 'widgetName',
          message: 'Your widget name',
          default: this.config.get('widgetName'),
        });
      }

      this.prompt(prompts, function (answers) {
        this.templateData = answers;

        if ( this.packageType === 'panel' ) {
          this.templateData.panelName = _.kebabCase(answers.panelName);
          this.config.set( 'panelName', this.templateData.panelName );
        } else if ( this.packageType === 'widget' ) {
          this.templateData.widgetName = _.kebabCase(answers.widgetName);
          this.config.set( 'widgetName', this.templateData.widgetName );
        }

        this.templateData.packageName = this.packageName;
        this.templateData.packageType = this.packageType;

        done();
      }.bind(this));
    },
  },

  writing: {
    app: function () {
      this.template('main.tmpl.js', 'main.js', this.templateData);
    },

    panel: function () {
      if ( this.packageType !== 'panel' ) {
        return;
      }

      this.template('panel/package.tmpl.json', 'package.json', this.templateData);
      this.copy('panel/panel.css', 'panel/panel.css');
      this.template('panel/panel.tmpl.html', 'panel/panel.html', this.templateData);
      this.template('panel/panel.tmpl.js', 'panel/panel.js', this.templateData);
    },

    widget: function () {
      if ( this.packageType !== 'widget' ) {
        return;
      }

      this.template('widget/package.tmpl.json', 'package.json', this.templateData);
      this.copy('widget/widget.css', 'widget/' + this.templateData.widgetName + '.css');
      this.template('widget/widget.tmpl.html', 'widget/' + this.templateData.widgetName + '.html', this.templateData);
      this.template('widget/widget.tmpl.js', 'widget/' + this.templateData.widgetName + '.js', this.templateData);
    },

    core: function () {
      if ( this.packageType !== 'core' ) {
        return;
      }

      this.template('core/package.tmpl.json', 'package.json', this.templateData);
    },

    config: function () {
      this.copy('config/gitignore', '.gitignore');
      this.copy('config/jshintrc', '.jshintrc');
      this.copy('config/editorconfig', '.editorconfig');
    },

    misc: function () {
      this.copy('misc/LICENSE.md', 'LICENSE.md');
      this.template('misc/README.tmpl.md', 'README.md', this.templateData);
    },
  },

  install: function () {
    this.installDependencies();
  }
});
