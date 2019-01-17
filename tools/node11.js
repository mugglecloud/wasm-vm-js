const { execFile } = require('child_process');

const bat = execFile('C:\\Program Files\\node-v11.6.0-win-x64\\node.exe', process.argv.slice(2));

bat.stdout.on('data', (data) => {
    if (data.trim() != 'undefined') {
        console.log(data.toString());
    }
});

bat.stderr.on('data', (data) => {
    console.error(data.toString());
});

bat.on('exit', (code) => {
    //   console.log(`Child exited with code ${code}`);
});