import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { RentalContractData } from '../types/rental';

// Initialize pdfMake with fonts
pdfMake.vfs = pdfFonts.vfs;

export const generateRentalContractPDF = (data: RentalContractData): void => {
  const docDefinition: TDocumentDefinitions = {
    content: [
      {
        text: 'CONTRATO DE LOCAÇÃO PARA TEMPORADA',
        style: 'header',
        alignment: 'center',
        margin: [0, 0, 0, 20]
      },
      {
        text: [
          `Contrato de locação para temporada, consoante o disposto nos artigos 48 e seguintes, da lei 8245/91, do imóvel situado na Rua: `,
          { text: data.imovel.rua, bold: true },
          ` nº. `,
          { text: data.imovel.numero, bold: true },
          data.imovel.apartamento ? ` Aptº. nº. ` : '',
          data.imovel.apartamento ? { text: data.imovel.apartamento, bold: true } : '',
          `, nesta cidade, que entre si fazem de um lado como locador, neste ato representado pela Empresa ou Pessoa Física `,
          { text: data.locador.nomeRazaoSocial, bold: true },
          `. Inscrito no CNPJ ou CPF sob o nº. `,
          { text: data.locador.cnpjCpf, bold: true },
          `. Estabelecida no Endereço `,
          { text: data.locador.endereco, bold: true },
          `. E de outro, como locatário: `,
          { text: data.locatario.nomeCompleto, bold: true },
          `, nacionalidade `,
          { text: data.locatario.nacionalidade, bold: true },
          `, local `,
          { text: data.locatario.local, bold: true },
          `, CPF: `,
          { text: data.locatario.cpf, bold: true },
          `, identidade: `,
          { text: data.locatario.identidade, bold: true },
          `, órgão: `,
          { text: data.locatario.orgaoEmissor, bold: true },
          data.locatario.passaporte ? `, passaporte: ` : '',
          data.locatario.passaporte ? { text: data.locatario.passaporte, bold: true } : '',
          `, e-mail: `,
          { text: data.locatario.email, bold: true },
          `, telefone 1: `,
          { text: data.locatario.telefone1, bold: true },
          data.locatario.contatoAlternativo ? ` contato alternativo: ` : '',
          data.locatario.contatoAlternativo ? { text: data.locatario.contatoAlternativo, bold: true } : '',
          `.`
        ],
        margin: [0, 0, 0, 20],
        alignment: 'justify'
      },
      {
        text: 'OBRIGAÇÕES CONTRATUAIS',
        style: 'sectionHeader',
        margin: [0, 10, 0, 10]
      },
      // Cláusula 1º
      {
        text: '1º',
        style: 'clauseNumber',
        margin: [0, 0, 0, 5]
      },
      {
        text: [
          `O prazo da locação é de: `,
          { text: `${data.locacao.prazoDias} dias`, bold: true },
          `, com início em `,
          { text: data.locacao.dataInicio, bold: true },
          ` e término em `,
          { text: data.locacao.dataTermino, bold: true },
          `, às `,
          { text: data.locacao.horaTermino, bold: true },
          ` horas, data em que o imóvel será devolvido, impreterivelmente, no estado estético e de conservação em que foi entregue, com todos os móveis, aparelhos e objetos que o guarnecem, devendo suas condições de uso e estéticas estarem impecáveis como recebidos.`
        ],
        margin: [0, 0, 0, 10],
        alignment: 'justify'
      },
      // Cláusula 2º
      {
        text: '2º',
        style: 'clauseNumber',
        margin: [0, 0, 0, 5]
      },
      {
        text: [
          `O valor do aluguel é de `,
          { text: data.locacao.valorAluguelExtenso, bold: true },
          ` (R$ ${data.locacao.valorAluguel.toFixed(2).replace('.', ',')})`,
          `, cujo pagamento é feito integralmente e antecipadamente mediante a assinatura do contrato.`
        ],
        margin: [0, 0, 0, 5],
        alignment: 'justify'
      },
      {
        text: 'Parágrafo primeiro: A devolução do imóvel finda automaticamente a locação, que por isso mesmo, dispensa notificação, interpelação ou aviso, independerá de qualquer formalidade, emitindo o locador por motivo próprio, imediatamente na posse do imóvel, a resistência dos ocupantes em devolver o imóvel, configurará esbulho possessório, desde logo a pena de multa diária equivalente a (duas) vezes o valor locado.',
        margin: [20, 5, 0, 5],
        alignment: 'justify',
        italics: true
      },
      {
        text: 'Parágrafo segundo: Na oportunidade referida no parágrafo anterior, o imóvel deverá estar totalmente livre de pessoas e coisas, qualquer objeto ou pertence do locatário e acompanhantes, exigindo-se essa circunstância em presunção suficiente a exonerar o locador de qualquer responsabilidade em caso de eventuais reclamações posteriores.',
        margin: [20, 0, 0, 10],
        alignment: 'justify',
        italics: true
      },
      // Cláusula 3º
      {
        text: '3º',
        style: 'clauseNumber',
        margin: [0, 0, 0, 5]
      },
      {
        text: 'O locador fica desobrigado de todo e qualquer responsabilidade quanto à bagagem, objetos, jóias, ou outros valores de propriedade e uso do locatário e ocupantes.',
        margin: [0, 0, 0, 10],
        alignment: 'justify'
      },
      // Cláusula 4º
      {
        text: '4º',
        style: 'clauseNumber',
        margin: [0, 0, 0, 5]
      },
      {
        text: 'Fica proibido ao locatário sob qualquer pretexto, sublocar, emprestar, ceder ou transferir o imóvel, ou este contrato a terceiro. Só sendo admissível o uso do imóvel pelo locatário e seus ocupantes.',
        margin: [0, 0, 0, 5],
        alignment: 'justify'
      },
      // Ocupantes
      ...(data.ocupantes && data.ocupantes.length > 0 ? data.ocupantes.map(ocupante => ({
        text: `Nome: ${ocupante.nome} - Identidade: ${ocupante.identidade}`,
        margin: [20, 2, 0, 2],
        fontSize: 10
      })) : []),
      {
        text: '',
        margin: [0, 0, 0, 10]
      },
      // Cláusula 5º
      {
        text: '5º',
        style: 'clauseNumber',
        margin: [0, 0, 0, 5]
      },
      {
        text: 'Fica vedada a troca do segredo da fechadura do imóvel sem autorização por escrito do locador, inclusive cópias adicionais de chave. Sendo necessário, o locatário deverá solicitar novas copias ao locador.',
        margin: [0, 0, 0, 10],
        alignment: 'justify'
      },
      // Cláusula 6º
      {
        text: '6º',
        style: 'clauseNumber',
        margin: [0, 0, 0, 5]
      },
      {
        text: 'Fica desde já autorizado o locador a vistoriar o imóvel a qualquer tempo para verificar as respectivas condições de uso.',
        margin: [0, 0, 0, 10],
        alignment: 'justify'
      },
      // Cláusula 7º
      {
        text: '7º',
        style: 'clauseNumber',
        margin: [0, 0, 0, 5]
      },
      {
        text: 'O locatário terá que cumprir integralmente a convenção de condomínio e os regulamentos internos, do prédio, sob pena de não cumprimento, multa de 2 vezes o valor locado, pagamento da multa condominial e a rescisão do contrato.',
        margin: [0, 0, 0, 10],
        alignment: 'justify'
      },
      // Cláusula 8º
      {
        text: '8º',
        style: 'clauseNumber',
        margin: [0, 0, 0, 5]
      },
      {
        text: 'No caso de o locatário der o sinal ou desistir da locação antes do termo final de vigência deste contrato, não lhe serão devolvidas, ou devidas quaisquer importâncias relativas a diárias não usufruídas, ressalvadas a circunstância inserta na cláusula 10º.',
        margin: [0, 0, 0, 10],
        alignment: 'justify'
      },
      // Cláusula 9º
      {
        text: '9º',
        style: 'clauseNumber',
        margin: [0, 0, 0, 5]
      },
      {
        text: 'Obriga-se o locatário a zelar pela conservação e limpeza das paredes, portas, janelas, assoalhos, peças sanitárias do imóvel, assim como dos móveis, utensílios, equipamentos e decorações que o guarnecem, após o uso.',
        margin: [0, 0, 0, 10],
        alignment: 'justify'
      },
      // Cláusula 10º
      {
        text: '10º',
        style: 'clauseNumber',
        margin: [0, 0, 0, 5]
      },
      {
        text: [
          `O locatário deixa neste ato, além do aluguel estimado, um depósito em mãos do locador, como garantia da integridade física do imóvel, e os bens que os guarnecem, no valor de `,
          { text: data.locacao.valorDepositoExtenso, bold: true },
          ` (R$ ${data.locacao.valorDeposito.toFixed(2).replace('.', ',')})`,
          `, que lhe será devolvido findam a locação, deduzindo-se os valores para responder por eventuais perdas e danos.`
        ],
        margin: [0, 0, 0, 10],
        alignment: 'justify'
      },
      // Cláusula 11º
      {
        text: '11º',
        style: 'clauseNumber',
        margin: [0, 0, 0, 5]
      },
      {
        text: 'O locador confirma ter recebido os seguintes valores:',
        margin: [0, 0, 0, 10],
        alignment: 'justify'
      },
      {
        table: {
          widths: ['auto', '*', '*'],
          body: [
            [{ text: 'Data', bold: true }, { text: 'Valor R$', bold: true }, { text: 'Referência', bold: true }],
            ...data.pagamentosRecebidos.map(pag => [
              pag.data,
              `R$ ${pag.valor.toFixed(2).replace('.', ',')}`,
              pag.referencia
            ])
          ]
        },
        margin: [0, 0, 0, 10]
      },
      // Cláusula 12º
      {
        pageBreak: 'before',
        text: '12º',
        style: 'clauseNumber',
        margin: [0, 0, 0, 5]
      },
      {
        text: [
          `O locatário declara estar recebendo: `,
          { text: data.itensRecebidos.descricao, bold: true },
          `. Em caso de extravio ou dano, será cobrado o valor unitário de: R$ ${data.itensRecebidos.valorToalha.toFixed(2).replace('.', ',')} para cada toalha, R$ ${data.itensRecebidos.valorLencolQueen.toFixed(2).replace('.', ',')} para cada lençol queen, R$ ${data.itensRecebidos.valorLencolSolteiro.toFixed(2).replace('.', ',')} para cada lençol de solteiro, R$ ${data.itensRecebidos.valorTravesseiro.toFixed(2).replace('.', ',')} para cada travesseiro.`
        ],
        margin: [0, 0, 0, 10],
        alignment: 'justify'
      },
      // Cláusula 13º
      {
        text: '13º',
        style: 'clauseNumber',
        margin: [0, 0, 0, 5]
      },
      {
        text: 'Em caso de emergência, manutenção, consertos e outros serviços, o locatário desde já, autoriza a entrada do locador e dos seus representantes no imóvel para efetuarem o trabalho necessário.',
        margin: [0, 0, 0, 10],
        alignment: 'justify'
      },
      // Cláusula 14º
      {
        text: '14º',
        style: 'clauseNumber',
        margin: [0, 0, 0, 5]
      },
      {
        text: [
          'Do Foro: As partes elegem o foro de ',
          { text: data.foroEleito, bold: true },
          ', para dirimir todas e quaisquer dúvidas oriundas do presente contrato, afastado eventual privilégios por mais especiais que sejam.'
        ],
        margin: [0, 0, 0, 15],
        alignment: 'justify'
      },
      {
        text: 'E, por estarem justos e acordados, as partes firmam o presente em duas vias de igual teor e forma na presença de duas testemunhas.',
        margin: [0, 0, 0, 20],
        alignment: 'justify'
      },
      {
        text: `${data.assinatura.cidade}, ${data.assinatura.dia} de ${data.assinatura.mes} de ${data.assinatura.ano}.`,
        alignment: 'center',
        margin: [0, 0, 0, 30]
      },
      {
        text: 'Assinaturas:',
        style: 'subheader',
        margin: [0, 0, 0, 20]
      },
      {
        text: 'Locador:',
        margin: [0, 0, 0, 5]
      },
      {
        text: '___________________________________________________',
        margin: [0, 0, 0, 20]
      },
      {
        text: 'Locatário:',
        margin: [0, 0, 0, 5]
      },
      {
        text: '___________________________________________________',
        margin: [0, 0, 0, 5]
      },
      {
        text: data.locatario.nomeCompleto,
        margin: [0, 0, 0, 20]
      },
      {
        text: 'Testemunha 1:',
        margin: [0, 0, 0, 5]
      },
      {
        text: '___________________________________________________',
        margin: [0, 0, 0, 5]
      },
      {
        text: data.testemunhas[0]?.nomeCompleto || '',
        margin: [0, 0, 0, 20]
      },
      {
        text: 'Testemunha 2:',
        margin: [0, 0, 0, 5]
      },
      {
        text: '___________________________________________________',
        margin: [0, 0, 0, 5]
      },
      {
        text: data.testemunhas[1]?.nomeCompleto || '',
        margin: [0, 0, 0, 0]
      }
    ],
    styles: {
      header: {
        fontSize: 16,
        bold: true,
        margin: [0, 0, 0, 10]
      },
      subheader: {
        fontSize: 12,
        bold: true,
        margin: [0, 10, 0, 5]
      },
      sectionHeader: {
        fontSize: 12,
        bold: true,
        alignment: 'center',
        margin: [0, 10, 0, 10]
      },
      clauseNumber: {
        fontSize: 11,
        bold: true
      }
    },
    defaultStyle: {
      fontSize: 10,
      alignment: 'justify',
      lineHeight: 1.3
    },
    pageMargins: [40, 40, 40, 40],
    footer: function(currentPage, pageCount) {
      return {
        text: `Página ${currentPage} de ${pageCount}`,
        alignment: 'center',
        fontSize: 8,
        margin: [0, 10, 0, 0]
      };
    }
  };

  pdfMake.createPdf(docDefinition).download(`Contrato_Locacao_${data.locatario.nomeCompleto.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
};
