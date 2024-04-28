const fs = require('fs').promises;

async function main() {
    const fileData = await fs.readFile('dataFavcyHive.json', 'utf-8');
    const jsonData = JSON.parse(fileData);

    const data = jsonData['__collections__']['allusers'];
    let email = [];
    for(const userId in data){
        email.push(data[userId].email);
    }

    console.log(email);
}

main();