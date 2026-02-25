const { execSync } = require('child_process');

try {
    const output = execSync('npx cucumber-js --dry-run --format summary', { encoding: 'utf-8' });
    console.log(output);
    if (output.includes('Undefined steps:')) {
        console.log('Found undefined steps!');
    } else {
        console.log('No undefined steps found in summary.');
    }
} catch (e) {
    console.log(e.stdout || e.message);
}
