import cluster from 'cluster';
import { cpus } from 'os';
import { createServer } from 'http';
import { fork } from 'child_process';
import http from 'http';

const PORT = parseInt(process.env.PORT || '4000', 10);
const workersCount = cpus().length - 1;

if (cluster.isPrimary) {
    let current = 0;
    const workers = Array.from({ length: workersCount }, (_, i) =>
        fork('./dist/index.js', [], { env: { PORT: (PORT + 1 + i).toString() } })
    );

    const balancer = createServer((req, res) => {
        const workerPort = PORT + 1 + (current % workersCount);
        const proxy = http.request(
            {
                hostname: 'localhost',
                port: workerPort,
                path: req.url,
                method: req.method,
                headers: req.headers
            },
            proxyRes => {
                res.writeHead(proxyRes.statusCode || 500, proxyRes.headers);
                proxyRes.pipe(res, { end: true });
            }
        );
        req.pipe(proxy, { end: true });
        current++;
    });

    balancer.listen(PORT, () => {
        console.log(`Load balancer running on port ${PORT}`);
    });
} else {
    import('./index');
}