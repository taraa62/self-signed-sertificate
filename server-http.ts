import {createServer} from "http";

const hostname = '127.0.0.1';
const port = 31020;


const testServer = createServer( (req: any, res: any) => {
    const data: Uint8Array[] = [];
    req.on('data', (chunk: Uint8Array) => {
        data.push(chunk);
    });
    req.on('end', () => {
        res.end(
            JSON.stringify({
                data: {
                    service1: 'http',
                },
            })
        );
    });
});

testServer!.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
