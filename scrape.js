const fs = require('fs');
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://selecao.ufgd.edu.br/');

  // Espera até que as tabelas estejam carregadas
  await page.waitForSelector('#table-1 tbody');
  await page.waitForSelector('#table-2 tbody');

  // Extração dos dados das duas tabelas
  const processosAbertos = await page.evaluate(() => {
    const rows = document.querySelectorAll('#table-1 tbody tr');
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

    return data;
  });

  const processosAndamento = await page.evaluate(() => {
    const rows = document.querySelectorAll('#table-2 tbody tr');
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

    return data;
  });

  console.log('Processos Abertos:', processosAbertos);
  console.log('Processos em Andamento:', processosAndamento);

  // Salva os dados em arquivos JSON separados
  fs.writeFileSync('processos_abertos.json', JSON.stringify(processosAbertos, null, 2));
  fs.writeFileSync('processos_andamento.json', JSON.stringify(processosAndamento, null, 2));

  await browser.close();
})();
