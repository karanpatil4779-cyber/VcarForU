const fs = require('fs');
const data = JSON.parse(fs.readFileSync('lint.json', 'utf16le'));
const issues = data.filter(d => d.errorCount > 0 || d.warningCount > 0);
issues.forEach(file => {
    console.log(file.filePath);
    file.messages.forEach(m => {
        console.log(`  Line ${m.line}: ${m.message} [${m.ruleId}]`);
    });
});
