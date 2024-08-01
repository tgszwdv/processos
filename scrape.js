const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://selecao.ufgd.edu.br/');

  // Captura "Processos Seletivos com Inscrições Abertas"
  const abertos = await page.evaluate(() => {
    const processosAbertos = [];
    const rows = document.querySelectorAll('fieldset.ng-scope:nth-of-type(1) .table tbody tr');
    
    rows.forEach(row => {
      processosAbertos.push({
        titulo: row.children[0].innerText,
        descricao: row.children[1].innerText.trim(),
        periodo: row.children[2].innerText,
        edital: row.children[3].querySelector('a') ? row.children[3].querySelector('a').href : '',
        pagina: row.children[4].querySelector('a') ? row.children[4].querySelector('a').href : ''
      });
    });

    return processosAbertos;
  });

  // Captura "Processos Seletivos em Andamento"
  const andamento = await page.evaluate(() => {
    const processosAndamento = [];
    const rows = document.querySelectorAll('fieldset.ng-scope:nth-of-type(2) .table tbody tr');
    
    rows.forEach(row => {
      processosAndamento.push({
        titulo: row.children[0].innerText,
        descricao: row.children[1].innerText.trim(),
        periodo: row.children[2].innerText,
        edital: row.children[3].querySelector('a') ? row.children[3].querySelector('a').href : '',
        pagina: row.children[4].querySelector('a') ? row.children[4].querySelector('a').href : ''
      });
    });

    return processosAndamento;
  });

  await browser.close();

  // Salva os dados em arquivos JSON separados
  fs.writeFileSync('processos-abertos.json', JSON.stringify(abertos, null, 2));
  fs.writeFileSync('processos-andamento.json', JSON.stringify(andamento, null, 2));
})();
