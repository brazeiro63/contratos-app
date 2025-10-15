import { z } from 'zod';

const getCurrentMonthName = (): "Janeiro" | "Fevereiro" | "Março" | "Abril" | "Maio" | "Junho" | "Julho" | "Agosto" | "Setembro" | "Outubro" | "Novembro" | "Dezembro" => {
  const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ] as const;
  return monthNames[new Date().getMonth()];
};

export const contractSchema = z.object({
  proprietario: z.object({
    nomeCompletoProprietario: z.string().min(1, "Nome completo do proprietário é obrigatório."),
    nacionalidadeProprietario: z.string().min(1, "Nacionalidade é obrigatória."),
    estadoCivilProprietario: z.enum(["Solteiro(a)", "Casado(a)", "Divorciado(a)", "Viúvo(a)", "União Estável"], { message: "Estado civil inválido." }),
    profissaoProprietario: z.string().min(1, "Profissão é obrigatória."),
    rgProprietario: z.string().min(1, "RG é obrigatório."),
    cpfProprietario: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "CPF inválido. Use o formato XXX.XXX.XXX-XX.").min(14, "CPF inválido. Use o formato XXX.XXX.XXX-XX."),
    enderecoCompletoProprietario: z.string().min(1, "Endereço completo do proprietário é obrigatório."),
    cepProprietario: z.string().regex(/^\d{5}-\d{3}$/, "CEP inválido. Use o formato XXXXX-XXX.").min(9, "CEP inválido. Use o formato XXXXX-XXX.")
  }),
  representanteAdministradora: z.object({
    nomeRepresentanteAdministradora: z.string().min(1, "Nome do representante é obrigatório.").default("PAULO RICARDO BRAZEIRO DE CARVALHO"),
    nacionalidadeRepresentanteAdministradora: z.string().min(1, "Nacionalidade do representante é obrigatória.").default("Brasileiro"),
    estadoCivilRepresentanteAdministradora: z.enum(["Solteiro(a)", "Casado(a)", "Divorciado(a)", "Viúvo(a)", "União Estável"], { message: "Estado civil do representante inválido." }).default("Casado(a)"),
    profissaoRepresentanteAdministradora: z.string().min(1, "Profissão do representante é obrigatória.").default("Empresário"),
    rgRepresentanteAdministradora: z.string().min(1, "RG do representante é obrigatório.").default("2036424 SSP-DF"),
    cpfRepresentanteAdministradora: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "CPF do representante inválido. Use o formato XXX.XXX.XXX-XX.").min(14, "CPF do representante inválido. Use o formato XXX.XXX.XXX-XX.").default("388.413.980-00")
  }),
  imovel: z.object({
    enderecoCompletoImovel: z.string().min(1, "Endereço completo do imóvel é obrigatório."),
    cepImovel: z.string().regex(/^\d{5}-\d{3}$/, "CEP do imóvel inválido. Use o formato XXXXX-XXX.").min(9, "CEP do imóvel inválido. Use o formato XXXXX-XXX."),
    valorMinimoDiariaImovel: z.coerce.number().min(0, "O valor mínimo da diária deve ser um número positivo.")
  }),
  assinatura: z.object({
    cidadeAssinatura: z.string().min(1, "Cidade de assinatura é obrigatória."),
    diaAssinatura: z.coerce.number().min(1, "Dia inválido.").max(31, "Dia inválido.").default(new Date().getDate()),
    mesAssinatura: z.enum(["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"], { message: "Mês inválido." }).default(getCurrentMonthName()),
    anoAssinatura: z.coerce.number().min(2023, "Ano inválido.").max(2100, "Ano inválido.").default(new Date().getFullYear())
  }),
  testemunhas: z.array(
    z.object({
      nomeCompleto: z.string().min(1, "Nome da testemunha é obrigatório."),
      cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "CPF da testemunha inválido. Use o formato XXX.XXX.XXX-XX.").min(14, "CPF da testemunha inválido. Use o formato XXX.XXX.XXX-XX.")
    })
  ).min(2, "Duas testemunhas são obrigatórias.").max(2, "São permitidas apenas duas testemunhas."),
  anexo1Descricao: z.string().default("Lista detalhada de bens móveis, eletrodomésticos e utensílios que guarnecem o IMÓVEL, a ser fornecida pelo PROPRIETÁRIO e aprovada pela ADMINISTRADORA, e que constituirá parte integrante e indissociável deste Contrato, após sua devida assinatura."),
  foroEleito: z.string().min(1, "Foro eleito é obrigatório.").default("Brasília/DF")
});

export type ContractFormData = z.input<typeof contractSchema>;
export type ContractData = z.output<typeof contractSchema>;