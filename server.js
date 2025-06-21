import express from 'express';
import { spawn } from 'child_process';

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.status(200).send('The MCP server wrapper is running. Send POST requests to /api/rpc');
});

app.post('/api/rpc', (req, res) => {
    console.log('Spawning the MCP server...');
    const mcpServer = spawn('node', ['build/index.js']);
    
    let stdoutData = '';
    let stderrData = ''; // We'll still capture stderr for logging, but won't treat it as a fatal error

    mcpServer.stdout.on('data', (data) => {
        stdoutData += data.toString();
    });

    mcpServer.stderr.on('data', (data) => {
        stderrData += data.toString();
    });

    mcpServer.on('close', (code) => {
        console.log(`Child process exited with code ${code}.`);
        
        if (stderrData) {
            console.log(`Note: Data was received on stderr: ${stderrData}`);
        }

        // The MOST IMPORTANT CHANGE: We only fail if the exit code was NOT 0.
        if (code !== 0) {
            console.error(`Process failed with exit code ${code}.`);
            return res.status(500).json({ 
                error: 'Script exited with a non-zero code.', 
                exitCode: code,
                stderr: stderrData,
                stdout: stdoutData 
            });
        }

        // Success! The exit code was 0. The real data is in stdout.
        console.log('Process succeeded. Sending stdout data as response.');
        res.setHeader('Content-Type', 'application/json');
        res.status(200).send(stdoutData);
    });

    mcpServer.stdin.write(JSON.stringify(req.body));
    mcpServer.stdin.end();
});

app.listen(PORT, () => {
    console.log(`Server is online and listening on port ${PORT}`);
});
