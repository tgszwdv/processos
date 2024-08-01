const puppeteer = require('puppeteer');

async function scrapeProcessos() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://selecao-login.app.ufgd.edu.br/');

    const processos = await page.evaluate(() => {
        const rows = document.querySelectorAll('table tbody tr');
        return Array.from(rows).map(row => {
            const cols = row.querySelectorAll('td');
            return {
                titulo: cols[0].innerText.trim(),
                descricao: cols[1].innerText.trim(),
                periodo: cols[2].innerText.trim(),
                edital: cols[3].querySelector('a').href.trim(),
                url: cols[4].querySelector('a').href.trim()
            };
        });
    });

    await browser.close();
    return processos;
}

scrapeProcessos().then(processos => {
    const fs = require('fs');
    fs.writeFileSync('processos.json', JSON.stringify(processos, null, 2));
    console.log('Processos salvos em processos.json');
}).catch(console.error);
