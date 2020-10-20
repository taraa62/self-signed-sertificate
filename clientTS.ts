import fetch from 'node-fetch';
import {Agent, globalAgent} from "https";
import FileUtils from "./FileUtils";

process.env.NODE_EXTRA_CA_CERTS = '/home/yatsyshyn-taras/Documents/my/test-sll/cert3/cert.crt'



const url = 'https://localhost:31022/'
const run = async () => {
    console.log('start request!!');
    const agent = new Agent({
        ca: FileUtils.readSync([__dirname, 'cert', 'localhost.crt'])
    })
    const res = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({_post_getlist: {CPARAMS: {role: "GPEF$Реєстр особових справ, повний доступ", surName: "Са*"}}}),
        headers:{
            Authorization: "Basic thisIsMyKey="
        },
        agent
    }).then(dat => dat.json()).catch(er => console.error(er));
    console.log(res);
    console.log('end request!!');
}

run().catch(er => console.error(er));

