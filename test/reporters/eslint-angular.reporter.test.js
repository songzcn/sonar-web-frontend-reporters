require('chai').should();

const fs = require('fs'),
  ESLintAngularReporter = require('../../index').ESLintAngularReporter,
  readJSONFile = require('../test.utils').readJSONFile,
  esLintAngularMock = require('./eslint-angular.reporter.mock');

module.exports = () => {

  describe('ESLintAngularReporter', () => {

    describe('#launch', () => {

      it('should throw an error if the project name is undefined', () => {
        (() => new ESLintAngularReporter(esLintAngularMock.defaultOptions)).should.throw(Error);
      });

      it('should be the right project name', (done) => {
        let reporter = new ESLintAngularReporter(esLintAngularMock.defaultOptions, 'SonarWebFrontEndReporters');

        reporter.launch(() => {
          readJSONFile(esLintAngularMock.defaultOptions.report).project.should.be.equal('SonarWebFrontEndReporters');

          done();
        });
      });

      it('should create the output file', (done) => {
        let reporter = new ESLintAngularReporter(esLintAngularMock.defaultOptions, 'SonarWebFrontEndReporters');

        reporter.launch(() => {
          fs.existsSync(esLintAngularMock.defaultOptions.report);

          done();
        });
      });

      it('should be the right number of files', (done) => {
        let reporter = new ESLintAngularReporter(esLintAngularMock.defaultOptions, 'SonarWebFrontEndReporters');

        reporter.launch(() => {
          let result = readJSONFile(esLintAngularMock.defaultOptions.report);

          result.files.length.should.be.equal(1);
          result.nbFiles.should.be.equal(1);

          done();
        });
      });

      it ('should have 4 issues', (done) => {
        let reporter = new ESLintAngularReporter(esLintAngularMock.defaultOptions, 'SonarWebFrontEndReporters');

        reporter.launch(() => {
          let result = readJSONFile(esLintAngularMock.defaultOptions.report);

          result.files[0].issues.length.should.be.equal(4);
          result.files[0].issues[0].rulekey.should.be.equal('ng_space_before_function_paren');
          result.files[0].issues[1].rulekey.should.be.equal('ng_strict');
          result.files[0].issues[2].rulekey.should.be.equal('ng_controller_name');
          result.files[0].issues[3].rulekey.should.be.equal('ng_no_undef');

          done();
        });
      });

      it ('should be a 13 lines file', () => {
        let reporter = new ESLintAngularReporter(esLintAngularMock.defaultOptions, 'SonarWebFrontEndReporters');

        reporter.launch((done) => {
          let result = readJSONFile(esLintAngularMock.defaultOptions.report);

          result.files[0].nbLines.should.be.equal(13);

          done();
        });
      });

      it ('shouldn\'t have processed files', () => {
        let reporter = new ESLintAngularReporter(esLintAngularMock.badSrcOption, 'SonarWebFrontEndReporters');

        reporter.launch((done) => {
          let result = readJSONFile(esLintAngularMock.badSrcOption.report);

          result.files.length.should.be.equal(0);
          result.nbFiles.should.be.equal(0);

          done();
        });
      });

      it('should find the rules file', () => {
        (() => new ESLintAngularReporter(esLintAngularMock.badRulesFileOption, 'SonarWebFrontEndReporters')).should.throw(Error);
      });

    });

  });

};