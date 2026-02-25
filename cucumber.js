// c:/Users/RANJITH/Documents/Playwright_MrYodaDiagnostics/cucumber.js
module.exports = {
  default: {
    require: ['step_definitions/**/*.js', 'support/**/*.js'],
    format: ['html:cucumber-report.html'],
    worldParameters: {
      // You can pass parameters to the world constructor here
    }
  }
};
