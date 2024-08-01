const fs = require('fs');
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://selecao-login.app.ufgd.edu.br/');

  // Espera até que a tabela esteja carregada
  await page.waitForSelector('fieldset.ng-scope');

  // Extração dos dados da tabela
  const processos = await page.evaluate(() => {
    const rows = document.querySelectorAll('fieldset.ng-scope tbody tr');
    let data = [];

    rows.forEach(row => {
      const cols = row.querySelectorAll('td');
      const processo = {
        titulo: cols[0].innerText.trim(),
        descricao: cols[1].innerText.trim(),
        periodo: cols[2].innerText.trim(),
        edital: cols[3].querySelector('a').href,
        pagina: cols[4].querySelector('a').href
      };
      data.push(processo);
    });

    console.log(data); // Adiciona este log para verificar os dados extraídos

    return data;
  });

  console.log('Processos:', processos); // Adiciona este log para verificar os dados extraídos

  // Salva os dados no arquivo processos.json
  fs.writeFileSync('processos.json', JSON.stringify(processos, null, 2));

  await browser.close();
})();
