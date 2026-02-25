const { execSync } = require('child_process');

try {
    const output = execSync('npx cucumber-js', { encoding: 'utf-8' });
    console.log(output);
} catch (e) {
    const stdout = e.stdout || '';
    const stderr = e.stderr || '';
    const full = stdout + '\n' + stderr;
    console.log(full);
    
    // Look for undefined steps in the output
    const matches = full.matchAll(/\? (.*)\n\s+Undefined\. Implement with the following snippet:\n\n\s+(.*)/g);
    let undefinedSteps = [];
    for (const match of matches) {
        undefinedSteps.push({ text: match[1].trim(), snippet: match[2].trim() });
    }
    
    console.log('\n--- EXTRACTED UNDEFINED STEPS ---');
    console.log(JSON.stringify(undefinedSteps, null, 2));
}
