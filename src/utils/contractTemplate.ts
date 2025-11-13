import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { ContractData } from '../types/contract';

// Initialize pdfMake with fonts
pdfMake.vfs = pdfFonts.vfs;

export const generateContractPDF = (data: ContractData): void => {
  const docDefinition: TDocumentDefinitions = {
    content: [
      {
        text: 'CONTRATO DE ADMINISTRAÇÃO DE IMÓVEL PARA LOCAÇÃO POR TEMPORADA',
        style: 'header',
        alignment: 'center',
        margin: [0, 0, 0, 40]
      },
      {
        text: 'Pelo presente instrumento particular, de um lado:',
        margin: [0, 0, 0, 10]
      },
      {
        text: 'PROPRIETÁRIO(A):',
        style: 'subheader',
        margin: [0, 0, 0, 5]
      },
      {
        text: `${data.proprietario.nomeCompletoProprietario}, ${data.proprietario.nacionalidadeProprietario}, ${data.proprietario.estadoCivilProprietario}, ${data.proprietario.profissaoProprietario}, portador(a) da Cédula de Identidade RG nº ${data.proprietario.rgProprietario} e inscrito(a) no Cadastro de Pessoas Físicas (CPF) sob o nº ${data.proprietario.cpfProprietario}, residente e domiciliado(a) na ${data.proprietario.enderecoCompletoProprietario}, CEP ${data.proprietario.cepProprietario}.`,
        margin: [0, 0, 0, 15]
      },
      {
        text: 'E de outro lado, como ADMINISTRADORA:',
        margin: [0, 0, 0, 5]
      },
      {
        text: `CASAS DE MARGARIDA ADMINISTRAÇÃO DE IMÓVEIS LTDA., pessoa jurídica de direito privado, inscrita no Cadastro Nacional da Pessoa Jurídica (CNPJ) sob o nº 55.986.7217/0001-04, com sede em SHVP TR1, QD 3, CJ 3, CS 2, CEP 72005247, Brasília - DF, neste ato representada por seu sócio administrador ${data.representanteAdministradora.nomeRepresentanteAdministradora}, ${data.representanteAdministradora.nacionalidadeRepresentanteAdministradora}, ${data.representanteAdministradora.estadoCivilRepresentanteAdministradora}, ${data.representanteAdministradora.profissaoRepresentanteAdministradora}, portador(a) do RG nº ${data.representanteAdministradora.rgRepresentanteAdministradora} e inscrito(a) no CPF sob o nº ${data.representanteAdministradora.cpfRepresentanteAdministradora}, doravante simplesmente denominada ADMINISTRADORA.`,
        style: 'subheader',
        margin: [0, 0, 0, 15]
      },
      {
        text: 'As partes acima qualificadas, por este instrumento particular, têm entre si, justo e contratado, o presente Contrato de Administração de Imóvel, que se regerá pelas cláusulas e condições seguintes:',
        margin: [0, 0, 0, 20]
      },
      {
        text: 'CLÁUSULA PRIMEIRA – DO OBJETO DO CONTRATO',
        style: 'clauseHeader',
        margin: [0, 0, 0, 10]
      },
      {
        text: `1.1. Por meio deste contrato, o(a) PROPRIETÁRIO(A), legítimo(a) possuidor(a) e proprietário(a) do imóvel urbano localizado na ${data.imovel.enderecoCompletoImovel}, CEP ${data.imovel.cepImovel}, doravante denominado simplesmente IMÓVEL, juntamente com os móveis e demais utensílios que o guarnecem, conforme descrição detalhada no Anexo I que acompanha este instrumento, cuja cópia será entregue neste momento, confia à ADMINISTRADORA a gestão e administração do referido IMÓVEL.`,
        margin: [0, 0, 0, 8]
      },
      {
        text: '1.2. A partir da assinatura deste contrato, o(a) PROPRIETÁRIO(A) autoriza expressamente a ADMINISTRADORA a realizar, com terceiros, locações na modalidade "temporada", com prazo máximo de 90 (noventa) dias, nos termos das legislações aplicáveis ao caso, em especial a Lei nº 8.245/1991 (Lei de Locações).',
        margin: [0, 0, 0, 8]
      },
      {
        text: '1.3. Este contrato, bem como o instrumento de procuração que venha a ser outorgado pelo(a) PROPRIETÁRIO(A) à ADMINISTRADORA (o qual passará a fazer parte integrante deste pacto), autoriza a ADMINISTRADORA a promover a administração do IMÓVEL descrito no item 1.1, outorgando-lhe todos os poderes necessários para o desenvolvimento desta atividade, inclusive os inerentes ao ajuizamento de ações judiciais, promoção e divulgação do IMÓVEL para locação através de qualquer meio, desde que não cause dano ao(à) PROPRIETÁRIO(A) ou a terceiros, receber, negociar e dar quitação dos aluguéis pagos pelo locatário e seu(s) eventual(is) Fiador(es).',
        margin: [0, 0, 0, 8]
      },
      {
        text: '1.4. A ADMINISTRADORA poderá divulgar o IMÓVEL em plataformas virtuais especializadas, tais como Airbnb, Hoteis.com, Decolar, Booking.com, dentre outras igualmente idôneas, ou quaisquer outros meios de divulgação que se mostrem eficazes para a locação por temporada.',
        margin: [0, 0, 0, 8]
      },
      {
        text: '1.5. Tanto o(a) PROPRIETÁRIO(A) quanto a ADMINISTRADORA poderão agendar a ocupação do IMÓVEL, de forma que se faz necessário que ambos(as) organizem a agenda de locação para que não ocorra duplicidade de locação na mesma data e/ou período. Caso as datas estejam disponíveis, o(a) PROPRIETÁRIO(A) poderá bloquear datas para uso pessoal, de familiares ou amigos, sem a incidência de taxas de administração e intermediação.',
        margin: [0, 0, 0, 8]
      },
      {
        text: '1.6. O presente instrumento é acompanhado do Laudo de Vistoria, que descreve detalhadamente o IMÓVEL e o seu estado de conservação no momento da entrega à ADMINISTRADORA.',
        margin: [0, 0, 0, 8]
      },
      {
        text: '1.7. É vedada a transferência para terceiros dos direitos e obrigações regulados neste contrato, salvo prévia e expressa autorização por escrito da outra parte.',
        margin: [0, 0, 0, 15]
      },
      {
        text: 'CLÁUSULA SEGUNDA – DO PRAZO DE ADMINISTRAÇÃO E RENOVAÇÃO',
        style: 'clauseHeader',
        margin: [0, 0, 0, 10]
      },
      {
        text: '2.1. O prazo de administração do IMÓVEL é de 01 (um) ano, contado a partir da data da assinatura do presente contrato, renovando-se automaticamente, por mais 01 (um) ano e assim sucessivamente, salvo se houver expressa comunicação de qualquer das partes, por escrito, no prazo de 30 (trinta) dias anteriores ao término previsto da administração.',
        margin: [0, 0, 0, 15]
      },
      {
        text: 'CLÁUSULA TERCEIRA – DA REMUNERAÇÃO DA ADMINISTRADORA',
        style: 'clauseHeader',
        margin: [0, 0, 0, 10]
      },
      {
        text: '3.1. O valor da remuneração da ADMINISTRADORA está condicionado ao recebimento do pagamento por meio das plataformas digitais de locação ou diretamente dos locatários, conforme disposto na Cláusula Sexta.',
        margin: [0, 0, 0, 15]
      },
      {
        text: 'CLÁUSULA QUARTA – DAS OBRIGAÇÕES DA ADMINISTRADORA',
        style: 'clauseHeader',
        margin: [0, 0, 0, 10]
      },
      {
        text: '4.1. Compete à ADMINISTRADORA a análise e aprovação do "Cadastro dos Locatários", da seleção das garantias oferecidas e a condução dos assuntos relacionados com a locação pelo tempo que durar cada contrato de locação, ficando a critério do(a) PROPRIETÁRIO(A) a sua participação nestas etapas.',
        margin: [0, 0, 0, 8]
      },
      {
        text: '4.2. No intuito de promover e facilitar a locação, a ADMINISTRADORA poderá afixar cartazes e placas no IMÓVEL, além de publicar anúncios em jornais, na internet e em qualquer outro meio de divulgação.',
        margin: [0, 0, 0, 8]
      },
      {
        text: '4.3. A ADMINISTRADORA, até o quinto dia útil do mês subsequente, enviará ao(à) PROPRIETÁRIO(A) o "Relatório Mensal" da locação, em formato PDF ou similar, contendo, no mínimo, as informações abaixo, sem prejuízo de outras que se reputem importantes para a transparência da gestão:\na) Relatório de entrada: data do check-in/check-out, quantidade de hóspedes e valor final da locação;\nb) Relatório de saída: despesas do serviço de locação referentes ao mês em exercício;\nc) Saldo devedor/credor em caixa.',
        margin: [0, 0, 0, 8]
      },
      {
        text: '4.4. A ADMINISTRADORA assumirá a gestão de toda a operação de locação por temporada, incluindo a manutenção básica do IMÓVEL, controle de contas e de toda a operação de entrada e saída de hóspedes.',
        margin: [0, 0, 0, 8]
      },
      {
        text: '4.5. Na devolução do IMÓVEL pelo locatário, a ADMINISTRADORA fará o comparativo entre as informações que constam no Laudo de Vistoria de Entrada e no Laudo Final, devendo tomar as providências cabíveis para exigir do locatário a regularização dos eventuais danos causados ao IMÓVEL, ou, sendo o caso, cobrar a devida indenização.',
        margin: [0, 0, 0, 8]
      },
      {
        text: '4.6. A ADMINISTRADORA se responsabiliza pela supervisão da conservação do IMÓVEL, garantindo, assim, que a devolução ocorra no mesmo estado em que foi entregue ao locatário, salvo as deteriorações decorrentes de uso normal (art. 23, III, Lei nº 8.245/1991).',
        margin: [0, 0, 0, 8]
      },
      {
        text: data.opcoes?.administradoraPagaDespesas
          ? '4.7. A ADMINISTRADORA poderá realizar o pagamento das cotas condominiais, inclusive taxas extras, dos impostos e das taxas que incidam sobre o IMÓVEL, inclusive pelas despesas de água, energia elétrica, gás etc., tão logo receba os respectivos avisos de lançamento, fazendo o desconto correspondente, mediante prestação de contas, quando do repasse da remuneração que cabe ao(à) PROPRIETÁRIO(A).'
          : '4.7. A ADMINISTRADORA NÃO realizará o pagamento das cotas condominiais, impostos, taxas ou despesas que incidam sobre o IMÓVEL (água, energia elétrica, gás, etc.), sendo de exclusiva responsabilidade do(a) PROPRIETÁRIO(A) a quitação de tais encargos.',
        margin: [0, 0, 0, 8]
      },
      {
        text: '4.8. A ADMINISTRADORA está obrigada a ressarcir ao(à) PROPRIETÁRIO(A) os danos causados ao IMÓVEL quando estes ocorrerem em razão de sua culpa, seja por ação ou omissão comprovadas.',
        margin: [0, 0, 0, 15]
      },
      {
        text: 'CLÁUSULA QUINTA – DAS OBRIGAÇÕES DO(A) PROPRIETÁRIO(A)',
        style: 'clauseHeader',
        margin: [0, 0, 0, 10]
      },
      {
        text: data.opcoes?.administradoraPagaDespesas
          ? '5.1. O(A) PROPRIETÁRIO(A) autoriza expressamente a ADMINISTRADORA a realizar o pagamento das cotas condominiais, inclusive taxas extras, dos impostos e das taxas que incidam sobre o IMÓVEL, inclusive pelas despesas de água, energia elétrica, gás etc., ficando ciente de que tais valores serão descontados do repasse mensal, mediante prestação de contas detalhada.'
          : '5.1. É de responsabilidade do(a) PROPRIETÁRIO(A), a qualquer tempo, o pagamento das cotas condominiais, inclusive taxas extras, dos impostos e das taxas que incidam sobre o IMÓVEL, inclusive pelas despesas de água, energia elétrica, gás etc.',
        margin: [0, 0, 0, 8]
      },
      {
        text: '5.2. Cabe ao(à) PROPRIETÁRIO(A) a adoção de todas as medidas, inclusive judiciais, para manter o IMÓVEL em perfeito estado de conservação e funcionamento, devendo providenciar de imediato os reparos necessários. Caso não o faça, a ADMINISTRADORA, após autorização expressa do(a) PROPRIETÁRIO(A) (preferencialmente por escrito, como e-mail ou aplicativo de mensagem), poderá executar as obras/reformas, repassando os custos ao(à) PROPRIETÁRIO(A), mediante apresentação de comprovantes.',
        margin: [0, 0, 0, 8]
      },
      {
        text: '5.3. Fica o(a) PROPRIETÁRIO(A) obrigado(a) a conferir o Laudo de Vistoria de Entrada em até 10 (dez) dias após o seu recebimento, sob pena de aprovação tácita.',
        margin: [0, 0, 0, 8]
      },
      {
        text: '5.4. O(A) PROPRIETÁRIO(A), caso venha a alugar o IMÓVEL diretamente para o locatário durante a vigência deste contrato, deverá resguardar à ADMINISTRADORA o direito ao valor equivalente a 10% (dez por cento) do valor total da locação, a título de comissão pela intermediação e manutenção da gestão da agenda.',
        margin: [0, 0, 0, 15]
      },
      {
        text: 'CLÁUSULA SEXTA – DO CÁLCULO DAS REMUNERAÇÕES E REPASSES',
        style: 'clauseHeader',
        margin: [0, 0, 0, 10]
      },
      {
        text: '6.1. O cálculo das remunerações, tanto do(a) PROPRIETÁRIO(A) quanto da ADMINISTRADORA, será realizado da forma estabelecida na tabela abaixo:',
        margin: [0, 0, 0, 8]
      },
      {
        text: 'CÁLCULO DE PAGAMENTO AO(À) PROPRIETÁRIO(A): Receitas Brutas das Locações – (menos) Despesas operacionais (taxas condominiais, impostos, taxas, custos de limpeza, comissões de plataformas (OTAs), taxa de administração da ADMINISTRADORA e outros custos eventuais comprovados).',
        margin: [0, 0, 0, 8]
      },
      {
        text: 'CÁLCULO DE PAGAMENTO À ADMINISTRADORA: Receitas Brutas das Locações – (menos) valor da faxina - (menos) comissões das OTAs (Booking, Airbnb, etc.) – (menos) Valor a ser repassado ao PROPRIETÁRIO (C+A). Onde: C = 5% (cinco por cento) taxa de intermediação sobre as receitas brutas. A = 10% (dez por cento) taxa de administração sobre as receitas brutas.',
        margin: [0, 0, 0, 8]
      },
      {
        text: `6.2. Considerando as características do IMÓVEL e o preço médio das diárias na região, as partes ajustam que a diária não terá valor inferior a R$ ${data.imovel.valorMinimoDiariaImovel.toFixed(2).replace('.', ',')}, salvo acordo expresso entre as partes para campanhas promocionais ou ajustes de mercado.`,
        margin: [0, 0, 0, 8]
      },
      {
        text: '6.3. A ADMINISTRADORA manterá em conta bancária de sua titularidade os valores recebidos referentes aos pagamentos das reservas, devendo repassar ao(à) PROPRIETÁRIO(A), até o quinto dia útil do mês subsequente à locação, os valores devidos, os quais serão efetuados através de depósito bancário em conta indicada pelo(a) PROPRIETÁRIO(A).',
        margin: [0, 0, 0, 8]
      },
      {
        text: '6.4. O repasse acima citado será realizado mediante a apresentação do Relatório Mensal detalhado, com as devidas deduções em prestação de contas.',
        margin: [0, 0, 0, 15]
      },
      {
        text: 'CLÁUSULA SÉTIMA – DA VENDA DO IMÓVEL',
        style: 'clauseHeader',
        margin: [0, 0, 0, 10]
      },
      {
        text: '7.1. No caso de venda do IMÓVEL durante a vigência do presente contrato, será devida pelo(a) PROPRIETÁRIO(A) à ADMINISTRADORA, comissão no importe de 1% (um por cento) pela intermediação da venda sobre o valor total da transação de compra e venda do IMÓVEL.',
        margin: [0, 0, 0, 8]
      },
      {
        text: '7.2. Na hipótese de o IMÓVEL ser vendido no decorrer do prazo do presente contrato, e o novo adquirente não tiver interesse na continuidade deste instrumento contratual, o(a) PROPRIETÁRIO(A) pagará à ADMINISTRADORA a remuneração ajustada que incidirá sobre o valor total das reservas já agendadas e confirmadas para o período pós-venda.',
        margin: [0, 0, 0, 15]
      },
      {
        text: 'CLÁUSULA OITAVA – DA RESCISÃO E MULTA CONTRATUAL',
        style: 'clauseHeader',
        margin: [0, 0, 0, 10]
      },
      {
        text: '8.1. Este contrato poderá ser rescindido nas seguintes hipóteses:',
        margin: [0, 0, 0, 8]
      },
      {
        text: 'a) Pelo descumprimento de qualquer regra estabelecida neste instrumento por uma das partes, com incidência de multa equivalente a 01 (um) salário-mínimo vigente em favor da parte inocente, sem prejuízo de outras cominações legais e contratuais cabíveis;',
        margin: [15, 0, 0, 8]
      },
      {
        text: 'b) A qualquer tempo, por qualquer das partes, desde que haja notificação escrita à outra parte com antecedência mínima de 30 (trinta) dias e pagamento de multa no montante de 01 (um) salário-mínimo vigente, além da remuneração ajustada calculada sobre as reservas vigentes à época da rescisão;',
        margin: [15, 0, 0, 8]
      },
      {
        text: 'c) Quando houver comprovada venda do IMÓVEL para terceiros, desde que não existam reservas programadas para o IMÓVEL no momento da rescisão. Caso existam reservas, o(a) PROPRIETÁRIO(A) pagará à ADMINISTRADORA a remuneração ajustada incidente sobre o valor total das reservas já agendadas e confirmadas;',
        margin: [15, 0, 0, 8]
      },
      {
        text: 'd) Nos casos em que o(a) PROPRIETÁRIO(A) dificultar, impedir ou limitar a ADMINISTRADORA em suas funções contratualmente estabelecidas, bem como nas hipóteses em que houver interferência indevida do locatário que prejudique a gestão, caberá ao(a) PROPRIETÁRIO(A) o pagamento de multa equivalente a 01 (um) salário-mínimo vigente em favor da ADMINISTRADORA.',
        margin: [15, 0, 0, 15]
      },
      {
        text: 'CLÁUSULA NONA – DAS DISPOSIÇÕES FINAIS',
        style: 'clauseHeader',
        margin: [0, 0, 0, 10]
      },
      {
        text: '9.1. Caso ocorra uma ou mais das seguintes hipóteses, as partes ficarão isentas de todas as obrigações assumidas no presente instrumento, sem incidência de multas:',
        margin: [0, 0, 0, 8]
      },
      {
        text: 'a) Quando houver interrupção, suspensão ou rescisão do contrato de locação do IMÓVEL em decorrência de medidas tomadas pelo poder público, a exemplo da desapropriação ou interdição;',
        margin: [15, 0, 0, 8]
      },
      {
        text: 'b) Incêndio, ruína do IMÓVEL locado, danos oriundos de terremotos, maremotos ou outras ocorrências de natureza grave, inclusive pandemias ou epidemias com restrições de deslocamento, guerra civil ou surgimento de qualquer fato de força maior ou caso fortuito que impeça ou perturbe o uso do IMÓVEL para o fim a que se destina;',
        margin: [15, 0, 0, 8]
      },
      {
        text: 'c) Qualquer outra ocorrência não expressamente prevista no presente instrumento, que venha a determinar a impossibilidade do prosseguimento da locação ou deste contrato, desde que tal ocorrência não possa ser imputada à ADMINISTRADORA e/ou ao(à) PROPRIETÁRIO(A).',
        margin: [15, 0, 0, 8]
      },
      {
        text: '9.2. Salvo na hipótese de negligência comprovada, a ADMINISTRADORA não terá nenhuma responsabilidade em eventuais invasões, depredações, estragos ou qualquer situação não prevista neste contrato, que danifiquem o IMÓVEL no intervalo compreendido entre duas locações ou entre a data da assinatura deste e a primeira locação, principalmente quando o IMÓVEL estiver desocupado.',
        margin: [0, 0, 0, 8]
      },
      {
        text: '9.3. Todo e qualquer ajuste, aditamento ou alteração entre as partes deverá ser feito por escrito para ter validade.',
        margin: [0, 0, 0, 8]
      },
      {
        text: `9.4. As partes elegem o foro da comarca de ${data.foroEleito} para dirimir as questões resultantes da execução do presente contrato, com renúncia a qualquer outro, por mais privilegiado que seja.`,
        margin: [0, 0, 0, 15]
      },
      {
        text: 'Assim, por estarem justos e contratados, as partes assinam o presente instrumento em 02 (duas) vias de igual teor e forma, na presença das 02 (duas) testemunhas abaixo, para que produza seus jurídicos e legais efeitos.',
        margin: [0, 0, 0, 15]
      },
      {
        text: `${data.assinatura.cidadeAssinatura}, ${data.assinatura.diaAssinatura} de ${data.assinatura.mesAssinatura} de ${data.assinatura.anoAssinatura}.`,
        alignment: 'center',
        margin: [0, 0, 0, 30]
      },
      {
        text: 'PROPRIETÁRIO(A):',
        style: 'subheader',
        margin: [0, 0, 0, 10]
      },
      {
        text: '___________________________________________________',
        margin: [0, 0, 0, 5]
      },
      {
        text: data.proprietario.nomeCompletoProprietario,
        margin: [0, 0, 0, 20]
      },
      {
        text: 'ADMINISTRADORA:',
        style: 'subheader',
        margin: [0, 0, 0, 10]
      },
      {
        text: '___________________________________________________',
        margin: [0, 0, 0, 5]
      },
      {
        text: 'CASAS DE MARGARIDA ADMINISTRAÇÃO DE IMÓVEIS LTDA.',
        style: 'subheader',
        margin: [0, 0, 0, 5]
      },
      {
        text: `Representada por: ${data.representanteAdministradora.nomeRepresentanteAdministradora}`,
        margin: [0, 0, 0, 20]
      },
      {
        text: 'TESTEMUNHAS:',
        style: 'subheader',
        margin: [0, 0, 0, 10]
      },
      {
        text: '1. Nome Completo: ___________________________________',
        margin: [0, 0, 0, 5]
      },
      {
        text: '   CPF: ___________________________________',
        margin: [0, 0, 0, 5]
      },
      {
        text: `   ${data.testemunhas[0].nomeCompleto}`,
        margin: [0, 0, 0, 5]
      },
      {
        text: `   ${data.testemunhas[0].cpf}`,
        margin: [0, 0, 0, 15]
      },
      {
        text: '2. Nome Completo: ___________________________________',
        margin: [0, 0, 0, 5]
      },
      {
        text: '   CPF: ___________________________________',
        margin: [0, 0, 0, 5]
      },
      {
        text: `   ${data.testemunhas[1].nomeCompleto}`,
        margin: [0, 0, 0, 5]
      },
      {
        text: `   ${data.testemunhas[1].cpf}`,
        margin: [0, 0, 0, 30]
      },
      {
        pageBreak: 'before',
        text: 'ANEXO I – RELAÇÃO DE MÓVEIS E UTENSÍLIOS',
        style: 'header',
        alignment: 'center',
        margin: [0, 0, 0, 20]
      },
      {
        text: 'Nos termos deste contrato de administração, o(a) PROPRIETÁRIO(A) declara que o IMÓVEL é guarnecido pelos seguintes móveis e utensílios, estando todos em bom estado de conservação e funcionamento, conforme detalhamento a ser anexado em documento separado e assinado pelas partes:',
        margin: [0, 0, 0, 15]
      },
      {
        text: data.anexo1Descricao,
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
      clauseHeader: {
        fontSize: 12,
        bold: true,
        margin: [0, 15, 0, 10]
      }
    },
    defaultStyle: {
      fontSize: 10,
      alignment: 'justify',
      lineHeight: 1.3
    },
    pageMargins: [40, 60, 40, 60],
    footer: function(currentPage, pageCount) {
      return {
        text: `Página ${currentPage} de ${pageCount}`,
        alignment: 'center',
        fontSize: 8,
        margin: [0, 10, 0, 0]
      };
    }
  };

  pdfMake.createPdf(docDefinition).download(`Contrato_${data.proprietario.nomeCompletoProprietario.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
};