import express from 'express';
import { spawn } from 'child_process';

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// ===================================================================
// MCP Authentication Middleware
// ===================================================================
const authMiddleware = (req, res, next) => {
    const providedApiKey = req.header('X-API-KEY');
    const expectedApiKey = process.env.MCP_SERVER_API_KEY;

    if (!expectedApiKey) {
        console.error('CRITICAL: MCP_SERVER_API_KEY is not set in environment. Denying all requests.');
        return res.status(500).send({ error: 'Server configuration error' });
    }

    if (!providedApiKey || providedApiKey !== expectedApiKey) {
        console.warn(`Unauthorized request attempt. Provided key: ${providedApiKey}`);
        return res.status(401).send({ error: 'Unauthorized' });
    }

    // If the keys match, proceed to the next handler.
    next();
};
// ===================================================================

app.get('/', (req, res) => {
    res.status(200).send('MCP server is running.');
});

// The POST route is protected by the MCP authentication middleware.
app.post('/api/rpc', authMiddleware, (req, res) => {
    console.log('Spawning the MCP server for an authenticated request...');
    const mcpServer = spawn('node', ['build/index.js']);
    
    let stdoutData = '';
    let stderrData = '';

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

        if (code !== 0) {
            console.error(`Process failed with exit code ${code}.`);
            return res.status(500).json({ 
                error: 'Script exited with a non-zero code.', 
                exitCode: code,
                stderr: stderrData,
                stdout: stdoutData 
            });
        }

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
