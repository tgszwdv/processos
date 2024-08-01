const processos = [];
const rows = document.querySelectorAll('tr[ng-repeat="processo in ctrl.inscricoesAbertas track by $index"]');

rows.forEach(row => {
    const cells = row.querySelectorAll('td');
    const titulo = cells[0].innerText.trim();
    const descricao = cells[1].innerText.trim();
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

console.log(processos);  // Imprime o array de processos no console
