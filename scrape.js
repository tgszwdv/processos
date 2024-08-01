const puppeteer = require('puppeteer');
const fs = require('fs');

async function scrape() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  const url = 'https://selecao-login.app.ufgd.edu.br/';
  await page.goto(url, { waitUntil: 'networkidle2' });

  const processos = await page.evaluate(() => {
    const processos = [];
const rows = document.querySelectorAll('tr[ng-repeat="processo in ctrl.inscricoesAbertas track by $index"]');

rows.forEach(row => {
    const cells = row.querySelectorAll('td');
    const titulo = cells[0].innerText.trim();
    const descricao = cells[1].innerText.trim().replace('Mostrar mais', '').trim(); // Remover 'Mostrar mais'
    const periodo = cells[2].innerText.trim();
    const editalUrl = cells[3].querySelector('a').href;
    const paginaUrl = cells[4].querySelector('a').href;

    processos.push({
        titulo: titulo,
        descricao: descricao,
        periodo: periodo,
        url: paginaUrl,
        edital: editalUrl
    });
});

console.log(JSON.stringify(processos));

    return processos;
  });

  await browser.close();

  // Salvar os dados em um arquivo JSON
  fs.writeFileSync('processos.json', JSON.stringify(processos, null, 2));
}

scrape().catch(console.error);
