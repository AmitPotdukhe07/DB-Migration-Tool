const { spawn } = require('child_process');

function callPythonScript(scriptPath, args = []) {
    return new Promise((resolve, reject) => {
        const pythonProcess = spawn('python3', [scriptPath, ...args]);

        let data = '';
        pythonProcess.stdout.on('data', (chunk) => {
            data += chunk.toString();
        });

        pythonProcess.stderr.on('data', (error) => {
            console.error(`Error: ${error}`);
        });

        pythonProcess.on('close', (code) => {
            if (code !== 0) {
                reject(`Python script exited with code ${code}`);
            } else {
                resolve(data);
            }
        });
    });
}

callPythonScript('script.py', ['arg1', 'arg2'])
    .then(output => {
        console.log('Output from Python script:', output);
    })
    .catch(error => {
        console.error('Error calling Python script:', error);
    });
