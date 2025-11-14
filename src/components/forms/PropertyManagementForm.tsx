'use client';

import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contractSchema, type ContractFormData } from '../../utils/dataModel';
import { generateContractPDF } from '../../utils/contractTemplate';
import { formatCPF, formatCEP } from '../../utils/formatters';

const getCurrentMonthName = (): "Janeiro" | "Fevereiro" | "Março" | "Abril" | "Maio" | "Junho" | "Julho" | "Agosto" | "Setembro" | "Outubro" | "Novembro" | "Dezembro" => {
  const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ] as const;
  return monthNames[new Date().getMonth()];
};

const PropertyManagementForm: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<ContractFormData>({
    resolver: zodResolver(contractSchema),
    defaultValues: {
      representanteAdministradora: {
        nomeRepresentanteAdministradora: "MARIA MARGARIDA DOS SANTOS",
        nacionalidadeRepresentanteAdministradora: "Brasileira",
        estadoCivilRepresentanteAdministradora: "Casado(a)",
        profissaoRepresentanteAdministradora: "Empresária",
        rgRepresentanteAdministradora: "427358 SSP/DF",
        cpfRepresentanteAdministradora: "214.325.201-30"
      },
      assinatura: {
        cidadeAssinatura: "",
        diaAssinatura: new Date().getDate(),
        mesAssinatura: getCurrentMonthName(),
        anoAssinatura: new Date().getFullYear()
      },
      testemunhas: [
        { nomeCompleto: "PAULO RICARDO BRAZEIRO DE CARVALHO", cpf: "388.413.980-00" },
        { nomeCompleto: "", cpf: "" }
      ],
      opcoes: {
        administradoraPagaDespesas: false
      },
      anexo1Descricao: "Lista detalhada de bens móveis, eletrodomésticos e utensílios que guarnecem o IMÓVEL, a ser fornecida pelo PROPRIETÁRIO e aprovada pela ADMINISTRADORA, e que constituirá parte integrante e indissociável deste Contrato, após sua devida assinatura.",
      foroEleito: "Brasília/DF"
    }
  });

  const { fields } = useFieldArray({
    control,
    name: "testemunhas"
  });

  const onSubmit = async (data: ContractFormData) => {
    setIsGenerating(true);
    try {
      const validatedData = contractSchema.parse(data);
      generateContractPDF(validatedData);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Erro ao gerar o PDF. Verifique os dados e tente novamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  const estadosCivis = ["Solteiro(a)", "Casado(a)", "Divorciado(a)", "Viúvo(a)", "União Estável"] as const;
  const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"] as const;

  return (
    <div className="container">
      <header className="header">
        <h1>Gerador de Contrato de Administração de Imóvel</h1>
        <p>Casas de Margarida Administração de Imóveis Ltda.</p>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <section className="section">
          <h2>Dados do Proprietário</h2>

          <div className="form-group">
            <label>Nome Completo *</label>
            <input
              type="text"
              {...register("proprietario.nomeCompletoProprietario")}
              className={errors.proprietario?.nomeCompletoProprietario ? "error" : ""}
            />
            {errors.proprietario?.nomeCompletoProprietario && (
              <span className="error-message">{errors.proprietario.nomeCompletoProprietario.message}</span>
            )}
          </div>

          <div className="form-group">
            <label>Nacionalidade *</label>
            <input
              type="text"
              {...register("proprietario.nacionalidadeProprietario")}
              className={errors.proprietario?.nacionalidadeProprietario ? "error" : ""}
            />
            {errors.proprietario?.nacionalidadeProprietario && (
              <span className="error-message">{errors.proprietario.nacionalidadeProprietario.message}</span>
            )}
          </div>

          <div className="form-group">
            <label>Estado Civil *</label>
            <select
              {...register("proprietario.estadoCivilProprietario")}
              className={errors.proprietario?.estadoCivilProprietario ? "error" : ""}
            >
              <option value="">Selecione...</option>
              {estadosCivis.map(estado => (
                <option key={estado} value={estado}>{estado}</option>
              ))}
            </select>
            {errors.proprietario?.estadoCivilProprietario && (
              <span className="error-message">{errors.proprietario.estadoCivilProprietario.message}</span>
            )}
          </div>

          <div className="form-group">
            <label>Profissão *</label>
            <input
              type="text"
              {...register("proprietario.profissaoProprietario")}
              className={errors.proprietario?.profissaoProprietario ? "error" : ""}
            />
            {errors.proprietario?.profissaoProprietario && (
              <span className="error-message">{errors.proprietario.profissaoProprietario.message}</span>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>RG *</label>
              <input
                type="text"
                {...register("proprietario.rgProprietario")}
                className={errors.proprietario?.rgProprietario ? "error" : ""}
              />
              {errors.proprietario?.rgProprietario && (
                <span className="error-message">{errors.proprietario.rgProprietario.message}</span>
              )}
            </div>

            <div className="form-group">
              <label>CPF * (XXX.XXX.XXX-XX)</label>
              <input
                type="text"
                placeholder="000.000.000-00"
                {...register("proprietario.cpfProprietario")}
                className={errors.proprietario?.cpfProprietario ? "error" : ""}
                onChange={(e) => {
                  const formatted = formatCPF(e.target.value);
                  setValue("proprietario.cpfProprietario", formatted);
                }}
              />
              {errors.proprietario?.cpfProprietario && (
                <span className="error-message">{errors.proprietario.cpfProprietario.message}</span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>Endereço Completo *</label>
            <input
              type="text"
              {...register("proprietario.enderecoCompletoProprietario")}
              className={errors.proprietario?.enderecoCompletoProprietario ? "error" : ""}
            />
            {errors.proprietario?.enderecoCompletoProprietario && (
              <span className="error-message">{errors.proprietario.enderecoCompletoProprietario.message}</span>
            )}
          </div>

          <div className="form-group">
            <label>CEP * (XXXXX-XXX)</label>
            <input
              type="text"
              placeholder="00000-000"
              {...register("proprietario.cepProprietario")}
              className={errors.proprietario?.cepProprietario ? "error" : ""}
              onChange={(e) => {
                const formatted = formatCEP(e.target.value);
                setValue("proprietario.cepProprietario", formatted);
              }}
            />
            {errors.proprietario?.cepProprietario && (
              <span className="error-message">{errors.proprietario.cepProprietario.message}</span>
            )}
          </div>
        </section>

        <section className="section">
          <h2>Dados do Representante da Administradora</h2>

          <div className="form-group">
            <label>Nome Completo *</label>
            <input
              type="text"
              {...register("representanteAdministradora.nomeRepresentanteAdministradora")}
              className={errors.representanteAdministradora?.nomeRepresentanteAdministradora ? "error" : ""}
            />
            {errors.representanteAdministradora?.nomeRepresentanteAdministradora && (
              <span className="error-message">{errors.representanteAdministradora.nomeRepresentanteAdministradora.message}</span>
            )}
          </div>

          <div className="form-group">
            <label>Nacionalidade *</label>
            <input
              type="text"
              {...register("representanteAdministradora.nacionalidadeRepresentanteAdministradora")}
              className={errors.representanteAdministradora?.nacionalidadeRepresentanteAdministradora ? "error" : ""}
            />
            {errors.representanteAdministradora?.nacionalidadeRepresentanteAdministradora && (
              <span className="error-message">{errors.representanteAdministradora.nacionalidadeRepresentanteAdministradora.message}</span>
            )}
          </div>

          <div className="form-group">
            <label>Estado Civil *</label>
            <select
              {...register("representanteAdministradora.estadoCivilRepresentanteAdministradora")}
              className={errors.representanteAdministradora?.estadoCivilRepresentanteAdministradora ? "error" : ""}
            >
              <option value="">Selecione...</option>
              {estadosCivis.map(estado => (
                <option key={estado} value={estado}>{estado}</option>
              ))}
            </select>
            {errors.representanteAdministradora?.estadoCivilRepresentanteAdministradora && (
              <span className="error-message">{errors.representanteAdministradora.estadoCivilRepresentanteAdministradora.message}</span>
            )}
          </div>

          <div className="form-group">
            <label>Profissão *</label>
            <input
              type="text"
              {...register("representanteAdministradora.profissaoRepresentanteAdministradora")}
              className={errors.representanteAdministradora?.profissaoRepresentanteAdministradora ? "error" : ""}
            />
            {errors.representanteAdministradora?.profissaoRepresentanteAdministradora && (
              <span className="error-message">{errors.representanteAdministradora.profissaoRepresentanteAdministradora.message}</span>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>RG *</label>
              <input
                type="text"
                {...register("representanteAdministradora.rgRepresentanteAdministradora")}
                className={errors.representanteAdministradora?.rgRepresentanteAdministradora ? "error" : ""}
              />
              {errors.representanteAdministradora?.rgRepresentanteAdministradora && (
                <span className="error-message">{errors.representanteAdministradora.rgRepresentanteAdministradora.message}</span>
              )}
            </div>

            <div className="form-group">
              <label>CPF * (XXX.XXX.XXX-XX)</label>
              <input
                type="text"
                placeholder="000.000.000-00"
                {...register("representanteAdministradora.cpfRepresentanteAdministradora")}
                className={errors.representanteAdministradora?.cpfRepresentanteAdministradora ? "error" : ""}
                onChange={(e) => {
                  const formatted = formatCPF(e.target.value);
                  setValue("representanteAdministradora.cpfRepresentanteAdministradora", formatted);
                }}
              />
              {errors.representanteAdministradora?.cpfRepresentanteAdministradora && (
                <span className="error-message">{errors.representanteAdministradora.cpfRepresentanteAdministradora.message}</span>
              )}
            </div>
          </div>
        </section>

        <section className="section">
          <h2>Dados do Imóvel</h2>

          <div className="form-group">
            <label>Endereço Completo *</label>
            <input
              type="text"
              {...register("imovel.enderecoCompletoImovel")}
              className={errors.imovel?.enderecoCompletoImovel ? "error" : ""}
            />
            {errors.imovel?.enderecoCompletoImovel && (
              <span className="error-message">{errors.imovel.enderecoCompletoImovel.message}</span>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>CEP * (XXXXX-XXX)</label>
              <input
                type="text"
                placeholder="00000-000"
                {...register("imovel.cepImovel")}
                className={errors.imovel?.cepImovel ? "error" : ""}
                onChange={(e) => {
                  const formatted = formatCEP(e.target.value);
                  setValue("imovel.cepImovel", formatted);
                }}
              />
              {errors.imovel?.cepImovel && (
                <span className="error-message">{errors.imovel.cepImovel.message}</span>
              )}
            </div>

            <div className="form-group">
              <label>Valor Mínimo da Diária (R$) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                {...register("imovel.valorMinimoDiariaImovel")}
                className={errors.imovel?.valorMinimoDiariaImovel ? "error" : ""}
              />
              {errors.imovel?.valorMinimoDiariaImovel && (
                <span className="error-message">{errors.imovel.valorMinimoDiariaImovel.message}</span>
              )}
            </div>
          </div>
        </section>

        <section className="section">
          <h2>Opções de Administração</h2>

          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                {...register("opcoes.administradoraPagaDespesas")}
                style={{ cursor: 'pointer' }}
              />
              <span>A Administradora realizará o pagamento de despesas (condomínio, impostos, água, luz, gás, etc.)</span>
            </label>
            <p style={{ marginTop: '8px', fontSize: '0.9em', color: '#666', marginLeft: '30px' }}>
              Quando marcado, a Administradora fica autorizada a pagar as despesas do imóvel e descontá-las do valor repassado ao proprietário.
            </p>
          </div>
        </section>

        <section className="section">
          <h2>Dados da Assinatura</h2>

          <div className="form-group">
            <label>Cidade de Assinatura *</label>
            <input
              type="text"
              {...register("assinatura.cidadeAssinatura")}
              className={errors.assinatura?.cidadeAssinatura ? "error" : ""}
            />
            {errors.assinatura?.cidadeAssinatura && (
              <span className="error-message">{errors.assinatura.cidadeAssinatura.message}</span>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Dia *</label>
              <input
                type="number"
                min="1"
                max="31"
                {...register("assinatura.diaAssinatura")}
                className={errors.assinatura?.diaAssinatura ? "error" : ""}
              />
              {errors.assinatura?.diaAssinatura && (
                <span className="error-message">{errors.assinatura.diaAssinatura.message}</span>
              )}
            </div>

            <div className="form-group">
              <label>Mês *</label>
              <select
                {...register("assinatura.mesAssinatura")}
                className={errors.assinatura?.mesAssinatura ? "error" : ""}
              >
                {meses.map(mes => (
                  <option key={mes} value={mes}>{mes}</option>
                ))}
              </select>
              {errors.assinatura?.mesAssinatura && (
                <span className="error-message">{errors.assinatura.mesAssinatura.message}</span>
              )}
            </div>

            <div className="form-group">
              <label>Ano *</label>
              <input
                type="number"
                min="2023"
                max="2100"
                {...register("assinatura.anoAssinatura")}
                className={errors.assinatura?.anoAssinatura ? "error" : ""}
              />
              {errors.assinatura?.anoAssinatura && (
                <span className="error-message">{errors.assinatura.anoAssinatura.message}</span>
              )}
            </div>
          </div>
        </section>

        <section className="section">
          <h2>Testemunhas</h2>

          {fields.map((field, index) => (
            <div key={field.id} className="witness-section">
              <h3>Testemunha {index + 1}</h3>

              <div className="form-group">
                <label>Nome Completo *</label>
                <input
                  type="text"
                  {...register(`testemunhas.${index}.nomeCompleto`)}
                  className={errors.testemunhas?.[index]?.nomeCompleto ? "error" : ""}
                />
                {errors.testemunhas?.[index]?.nomeCompleto && (
                  <span className="error-message">{errors.testemunhas[index]?.nomeCompleto?.message}</span>
                )}
              </div>

              <div className="form-group">
                <label>CPF * (XXX.XXX.XXX-XX)</label>
                <input
                  type="text"
                  placeholder="000.000.000-00"
                  {...register(`testemunhas.${index}.cpf`)}
                  className={errors.testemunhas?.[index]?.cpf ? "error" : ""}
                  onChange={(e) => {
                    const formatted = formatCPF(e.target.value);
                    setValue(`testemunhas.${index}.cpf`, formatted);
                  }}
                />
                {errors.testemunhas?.[index]?.cpf && (
                  <span className="error-message">{errors.testemunhas[index]?.cpf?.message}</span>
                )}
              </div>
            </div>
          ))}
        </section>

        <section className="section">
          <h2>Configurações Adicionais</h2>

          <div className="form-group">
            <label>Foro Eleito *</label>
            <input
              type="text"
              {...register("foroEleito")}
              className={errors.foroEleito ? "error" : ""}
            />
            {errors.foroEleito && (
              <span className="error-message">{errors.foroEleito.message}</span>
            )}
          </div>

          <div className="form-group">
            <label>Descrição do Anexo I</label>
            <textarea
              rows={4}
              {...register("anexo1Descricao")}
              className={errors.anexo1Descricao ? "error" : ""}
            />
            {errors.anexo1Descricao && (
              <span className="error-message">{errors.anexo1Descricao.message}</span>
            )}
          </div>
        </section>

        <div className="submit-section">
          <button
            type="submit"
            className="submit-button"
            disabled={isGenerating}
          >
            {isGenerating ? 'Gerando PDF...' : 'Gerar Contrato em PDF'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PropertyManagementForm;