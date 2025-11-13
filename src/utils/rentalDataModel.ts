import { z } from 'zod';

const getCurrentMonthName = (): "Janeiro" | "Fevereiro" | "Março" | "Abril" | "Maio" | "Junho" | "Julho" | "Agosto" | "Setembro" | "Outubro" | "Novembro" | "Dezembro" => {
  const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ] as const;
  return monthNames[new Date().getMonth()];
};

export const rentalContractSchema = z.object({
  imovel: z.object({
    rua: z.string().min(1, "Rua é obrigatória."),
    numero: z.string().min(1, "Número é obrigatório."),
    apartamento: z.string().optional().default(""),
    cidade: z.string().min(1, "Cidade é obrigatória.").default("Rio de Janeiro")
  }),
  locador: z.object({
    tipoLocador: z.enum(["empresa", "pessoa_fisica"], { message: "Tipo de locador é obrigatório." }).default("empresa"),
    nomeRazaoSocial: z.string().min(1, "Nome/Razão Social é obrigatório.").default("CASAS DE MARGARIDA ADMINISTRAÇÃO DE IMÓVEIS LTDA."),
    cnpjCpf: z.string().min(1, "CNPJ/CPF é obrigatório.").default("55.986.721/0001-04"),
    endereco: z.string().min(1, "Endereço é obrigatório.").default("SHVP TR1, QD 3, CJ 3, CS 2, CEP 72005247, Brasília - DF")
  }),
  locatario: z.object({
    nomeCompleto: z.string().min(1, "Nome completo do locatário é obrigatório."),
    nacionalidade: z.string().min(1, "Nacionalidade é obrigatória."),
    local: z.string().min(1, "Local (cidade/estado) é obrigatório."),
    cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "CPF inválido. Use o formato XXX.XXX.XXX-XX."),
    identidade: z.string().min(1, "Identidade é obrigatória."),
    orgaoEmissor: z.string().min(1, "Órgão emissor é obrigatório."),
    passaporte: z.string().optional().default(""),
    email: z.string().email("E-mail inválido."),
    telefone1: z.string().min(1, "Telefone é obrigatório."),
    contatoAlternativo: z.string().optional().default("")
  }),
  locacao: z.object({
    prazoDias: z.coerce.number().min(1, "Prazo deve ser pelo menos 1 dia."),
    dataInicio: z.string().min(1, "Data de início é obrigatória."),
    dataTermino: z.string().min(1, "Data de término é obrigatória."),
    horaTermino: z.string().default("12:00"),
    valorAluguel: z.coerce.number().min(0, "Valor do aluguel deve ser positivo."),
    valorAluguelExtenso: z.string().min(1, "Valor por extenso é obrigatório."),
    valorDeposito: z.coerce.number().min(0, "Valor do depósito deve ser positivo."),
    valorDepositoExtenso: z.string().min(1, "Valor do depósito por extenso é obrigatório.")
  }),
  ocupantes: z.array(
    z.object({
      nome: z.string().min(1, "Nome do ocupante é obrigatório."),
      identidade: z.string().min(1, "Identidade do ocupante é obrigatória.")
    })
  ).optional().default([]),
  itensRecebidos: z.object({
    descricao: z.string().default("Jogo de cama completo, toalhas de banho e rosto"),
    valorToalha: z.coerce.number().default(50),
    valorLencolQueen: z.coerce.number().default(150),
    valorLencolSolteiro: z.coerce.number().default(100),
    valorTravesseiro: z.coerce.number().default(80)
  }),
  pagamentosRecebidos: z.array(
    z.object({
      data: z.string().min(1, "Data do pagamento é obrigatória."),
      valor: z.coerce.number().min(0, "Valor deve ser positivo."),
      referencia: z.string().min(1, "Referência é obrigatória.")
    })
  ).min(1, "Pelo menos um pagamento deve ser registrado."),
  assinatura: z.object({
    cidade: z.string().min(1, "Cidade de assinatura é obrigatória.").default("Rio de Janeiro"),
    dia: z.coerce.number().min(1, "Dia inválido.").max(31, "Dia inválido.").default(new Date().getDate()),
    mes: z.enum(["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"], { message: "Mês inválido." }).default(getCurrentMonthName()),
    ano: z.coerce.number().min(2023, "Ano inválido.").max(2100, "Ano inválido.").default(new Date().getFullYear())
  }),
  testemunhas: z.array(
    z.object({
      nomeCompleto: z.string().min(1, "Nome da testemunha é obrigatório."),
      cpf: z.string().optional().default("")
    })
  ).min(2, "Duas testemunhas são obrigatórias.").max(2, "São permitidas apenas duas testemunhas."),
  foroEleito: z.string().min(1, "Foro eleito é obrigatório.").default("Rio de Janeiro/RJ")
});

export type RentalContractFormData = z.input<typeof rentalContractSchema>;
export type RentalContractData = z.output<typeof rentalContractSchema>;
