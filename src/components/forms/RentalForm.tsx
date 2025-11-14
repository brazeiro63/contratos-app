'use client';

import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { rentalContractSchema, type RentalContractFormData } from '../../utils/rentalDataModel';
import { generateRentalContractPDF } from '../../utils/rentalTemplate';
import { formatCPF } from '../../utils/formatters';

const getCurrentMonthName = (): "Janeiro" | "Fevereiro" | "Março" | "Abril" | "Maio" | "Junho" | "Julho" | "Agosto" | "Setembro" | "Outubro" | "Novembro" | "Dezembro" => {
  const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ] as const;
  return monthNames[new Date().getMonth()];
};

const RentalForm: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<RentalContractFormData>({
    resolver: zodResolver(rentalContractSchema),
    defaultValues: {
      imovel: {
        rua: "",
        numero: "",
        apartamento: "",
        cidade: "Rio de Janeiro"
      },
      locador: {
        tipoLocador: "empresa",
        nomeRazaoSocial: "CASAS DE MARGARIDA ADMINISTRAÇÃO DE IMÓVEIS LTDA.",
        cnpjCpf: "55.986.721/0001-04",
        endereco: "SHVP TR1, QD 3, CJ 3, CS 2, CEP 72005247, Brasília - DF"
      },
      locatario: {
        nomeCompleto: "",
        nacionalidade: "",
        local: "",
        cpf: "",
        identidade: "",
        orgaoEmissor: "",
        passaporte: "",
        email: "",
        telefone1: "",
        contatoAlternativo: ""
      },
      locacao: {
        prazoDias: 7,
        dataInicio: "",
        dataTermino: "",
        horaTermino: "12:00",
        valorAluguel: 0,
        valorAluguelExtenso: "",
        valorDeposito: 0,
        valorDepositoExtenso: ""
      },
      ocupantes: [],
      itensRecebidos: {
        descricao: "Jogo de cama completo, toalhas de banho e rosto",
        valorToalha: 50,
        valorLencolQueen: 150,
        valorLencolSolteiro: 100,
        valorTravesseiro: 80
      },
      pagamentosRecebidos: [
        { data: "", valor: 0, referencia: "Aluguel" }
      ],
      assinatura: {
        cidade: "Rio de Janeiro",
        dia: new Date().getDate(),
        mes: getCurrentMonthName(),
        ano: new Date().getFullYear()
      },
      testemunhas: [
        { nomeCompleto: "PAULO RICARDO BRAZEIRO DE CARVALHO", cpf: "388.413.980-00" },
        { nomeCompleto: "", cpf: "" }
      ],
      foroEleito: "Rio de Janeiro/RJ"
    }
  });

  const { fields: ocupantesFields, append: appendOcupante, remove: removeOcupante } = useFieldArray({
    control,
    name: "ocupantes"
  });

  const { fields: pagamentosFields, append: appendPagamento, remove: removePagamento } = useFieldArray({
    control,
    name: "pagamentosRecebidos"
  });

  const { fields: testemunhasFields } = useFieldArray({
    control,
    name: "testemunhas"
  });

  const onSubmit = async (data: RentalContractFormData) => {
    setIsGenerating(true);
    try {
      const validatedData = rentalContractSchema.parse(data);
      generateRentalContractPDF(validatedData);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Erro ao gerar o PDF. Verifique os dados e tente novamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"] as const;

  return (
    <div className="container">
      <header className="header">
        <h1>Contrato de Locação por Temporada</h1>
        <p>Casas de Margarida Administração de Imóveis Ltda.</p>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="form">
        {/* Dados do Imóvel */}
        <section className="section">
          <h2>Dados do Imóvel</h2>

          <div className="form-group">
            <label>Rua *</label>
            <input
              type="text"
              {...register("imovel.rua")}
              className={errors.imovel?.rua ? "error" : ""}
            />
            {errors.imovel?.rua && (
              <span className="error-message">{errors.imovel.rua.message}</span>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Número *</label>
              <input
                type="text"
                {...register("imovel.numero")}
                className={errors.imovel?.numero ? "error" : ""}
              />
              {errors.imovel?.numero && (
                <span className="error-message">{errors.imovel.numero.message}</span>
              )}
            </div>

            <div className="form-group">
              <label>Apartamento</label>
              <input
                type="text"
                {...register("imovel.apartamento")}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Cidade *</label>
            <input
              type="text"
              {...register("imovel.cidade")}
              className={errors.imovel?.cidade ? "error" : ""}
            />
            {errors.imovel?.cidade && (
              <span className="error-message">{errors.imovel.cidade.message}</span>
            )}
          </div>
        </section>

        {/* Dados do Locador */}
        <section className="section">
          <h2>Dados do Locador</h2>

          <div className="form-group">
            <label>Tipo de Locador *</label>
            <select {...register("locador.tipoLocador")}>
              <option value="empresa">Empresa</option>
              <option value="pessoa_fisica">Pessoa Física</option>
            </select>
          </div>

          <div className="form-group">
            <label>Nome/Razão Social *</label>
            <input
              type="text"
              {...register("locador.nomeRazaoSocial")}
              className={errors.locador?.nomeRazaoSocial ? "error" : ""}
            />
            {errors.locador?.nomeRazaoSocial && (
              <span className="error-message">{errors.locador.nomeRazaoSocial.message}</span>
            )}
          </div>

          <div className="form-group">
            <label>CNPJ/CPF *</label>
            <input
              type="text"
              {...register("locador.cnpjCpf")}
              className={errors.locador?.cnpjCpf ? "error" : ""}
            />
            {errors.locador?.cnpjCpf && (
              <span className="error-message">{errors.locador.cnpjCpf.message}</span>
            )}
          </div>

          <div className="form-group">
            <label>Endereço Completo *</label>
            <input
              type="text"
              {...register("locador.endereco")}
              className={errors.locador?.endereco ? "error" : ""}
            />
            {errors.locador?.endereco && (
              <span className="error-message">{errors.locador.endereco.message}</span>
            )}
          </div>
        </section>

        {/* Dados do Locatário */}
        <section className="section">
          <h2>Dados do Locatário</h2>

          <div className="form-group">
            <label>Nome Completo *</label>
            <input
              type="text"
              {...register("locatario.nomeCompleto")}
              className={errors.locatario?.nomeCompleto ? "error" : ""}
            />
            {errors.locatario?.nomeCompleto && (
              <span className="error-message">{errors.locatario.nomeCompleto.message}</span>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Nacionalidade *</label>
              <input
                type="text"
                {...register("locatario.nacionalidade")}
                className={errors.locatario?.nacionalidade ? "error" : ""}
              />
              {errors.locatario?.nacionalidade && (
                <span className="error-message">{errors.locatario.nacionalidade.message}</span>
              )}
            </div>

            <div className="form-group">
              <label>Local (Cidade/Estado) *</label>
              <input
                type="text"
                {...register("locatario.local")}
                className={errors.locatario?.local ? "error" : ""}
              />
              {errors.locatario?.local && (
                <span className="error-message">{errors.locatario.local.message}</span>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>CPF * (XXX.XXX.XXX-XX)</label>
              <input
                type="text"
                placeholder="000.000.000-00"
                {...register("locatario.cpf")}
                className={errors.locatario?.cpf ? "error" : ""}
                onChange={(e) => {
                  const formatted = formatCPF(e.target.value);
                  setValue("locatario.cpf", formatted);
                }}
              />
              {errors.locatario?.cpf && (
                <span className="error-message">{errors.locatario.cpf.message}</span>
              )}
            </div>

            <div className="form-group">
              <label>Identidade *</label>
              <input
                type="text"
                {...register("locatario.identidade")}
                className={errors.locatario?.identidade ? "error" : ""}
              />
              {errors.locatario?.identidade && (
                <span className="error-message">{errors.locatario.identidade.message}</span>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Órgão Emissor *</label>
              <input
                type="text"
                {...register("locatario.orgaoEmissor")}
                className={errors.locatario?.orgaoEmissor ? "error" : ""}
              />
              {errors.locatario?.orgaoEmissor && (
                <span className="error-message">{errors.locatario.orgaoEmissor.message}</span>
              )}
            </div>

            <div className="form-group">
              <label>Passaporte</label>
              <input
                type="text"
                {...register("locatario.passaporte")}
              />
            </div>
          </div>

          <div className="form-group">
            <label>E-mail *</label>
            <input
              type="email"
              {...register("locatario.email")}
              className={errors.locatario?.email ? "error" : ""}
            />
            {errors.locatario?.email && (
              <span className="error-message">{errors.locatario.email.message}</span>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Telefone *</label>
              <input
                type="tel"
                {...register("locatario.telefone1")}
                className={errors.locatario?.telefone1 ? "error" : ""}
              />
              {errors.locatario?.telefone1 && (
                <span className="error-message">{errors.locatario.telefone1.message}</span>
              )}
            </div>

            <div className="form-group">
              <label>Contato Alternativo</label>
              <input
                type="tel"
                {...register("locatario.contatoAlternativo")}
              />
            </div>
          </div>
        </section>

        {/* Dados da Locação */}
        <section className="section">
          <h2>Dados da Locação</h2>

          <div className="form-row">
            <div className="form-group">
              <label>Prazo (dias) *</label>
              <input
                type="number"
                min="1"
                {...register("locacao.prazoDias")}
                className={errors.locacao?.prazoDias ? "error" : ""}
              />
              {errors.locacao?.prazoDias && (
                <span className="error-message">{errors.locacao.prazoDias.message}</span>
              )}
            </div>

            <div className="form-group">
              <label>Hora de Término *</label>
              <input
                type="time"
                {...register("locacao.horaTermino")}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Data de Início *</label>
              <input
                type="date"
                {...register("locacao.dataInicio")}
                className={errors.locacao?.dataInicio ? "error" : ""}
              />
              {errors.locacao?.dataInicio && (
                <span className="error-message">{errors.locacao.dataInicio.message}</span>
              )}
            </div>

            <div className="form-group">
              <label>Data de Término *</label>
              <input
                type="date"
                {...register("locacao.dataTermino")}
                className={errors.locacao?.dataTermino ? "error" : ""}
              />
              {errors.locacao?.dataTermino && (
                <span className="error-message">{errors.locacao.dataTermino.message}</span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>Valor do Aluguel (R$) *</label>
            <input
              type="number"
              step="0.01"
              min="0"
              {...register("locacao.valorAluguel")}
              className={errors.locacao?.valorAluguel ? "error" : ""}
            />
            {errors.locacao?.valorAluguel && (
              <span className="error-message">{errors.locacao.valorAluguel.message}</span>
            )}
          </div>

          <div className="form-group">
            <label>Valor do Aluguel por Extenso *</label>
            <input
              type="text"
              placeholder="Ex: Três mil reais"
              {...register("locacao.valorAluguelExtenso")}
              className={errors.locacao?.valorAluguelExtenso ? "error" : ""}
            />
            {errors.locacao?.valorAluguelExtenso && (
              <span className="error-message">{errors.locacao.valorAluguelExtenso.message}</span>
            )}
          </div>

          <div className="form-group">
            <label>Valor do Depósito Caução (R$) *</label>
            <input
              type="number"
              step="0.01"
              min="0"
              {...register("locacao.valorDeposito")}
              className={errors.locacao?.valorDeposito ? "error" : ""}
            />
            {errors.locacao?.valorDeposito && (
              <span className="error-message">{errors.locacao.valorDeposito.message}</span>
            )}
          </div>

          <div className="form-group">
            <label>Valor do Depósito por Extenso *</label>
            <input
              type="text"
              placeholder="Ex: Mil reais"
              {...register("locacao.valorDepositoExtenso")}
              className={errors.locacao?.valorDepositoExtenso ? "error" : ""}
            />
            {errors.locacao?.valorDepositoExtenso && (
              <span className="error-message">{errors.locacao.valorDepositoExtenso.message}</span>
            )}
          </div>
        </section>

        {/* Ocupantes */}
        <section className="section">
          <h2>Ocupantes Adicionais</h2>
          <p style={{ marginBottom: '15px', color: '#666', fontSize: '14px' }}>
            Adicione os ocupantes além do locatário principal
          </p>

          {ocupantesFields.map((field, index) => (
            <div key={field.id} className="witness-section" style={{ position: 'relative', paddingRight: '50px' }}>
              <h3>Ocupante {index + 1}</h3>

              <div className="form-group">
                <label>Nome Completo *</label>
                <input
                  type="text"
                  {...register(`ocupantes.${index}.nome`)}
                />
              </div>

              <div className="form-group">
                <label>Identidade *</label>
                <input
                  type="text"
                  {...register(`ocupantes.${index}.identidade`)}
                />
              </div>

              <button
                type="button"
                onClick={() => removeOcupante(index)}
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '0',
                  background: '#e53e3e',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Remover
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={() => appendOcupante({ nome: "", identidade: "" })}
            style={{
              background: '#3182ce',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              marginTop: '10px'
            }}
          >
            + Adicionar Ocupante
          </button>
        </section>

        {/* Itens Recebidos */}
        <section className="section">
          <h2>Itens Recebidos pelo Locatário</h2>

          <div className="form-group">
            <label>Descrição dos Itens *</label>
            <textarea
              rows={3}
              {...register("itensRecebidos.descricao")}
              placeholder="Ex: Jogo de cama completo, toalhas de banho e rosto"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Valor Toalha (R$) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                {...register("itensRecebidos.valorToalha")}
              />
            </div>

            <div className="form-group">
              <label>Valor Lençol Queen (R$) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                {...register("itensRecebidos.valorLencolQueen")}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Valor Lençol Solteiro (R$) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                {...register("itensRecebidos.valorLencolSolteiro")}
              />
            </div>

            <div className="form-group">
              <label>Valor Travesseiro (R$) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                {...register("itensRecebidos.valorTravesseiro")}
              />
            </div>
          </div>
        </section>

        {/* Pagamentos Recebidos */}
        <section className="section">
          <h2>Pagamentos Recebidos</h2>

          {pagamentosFields.map((field, index) => (
            <div key={field.id} className="witness-section" style={{ position: 'relative', paddingRight: '50px' }}>
              <h3>Pagamento {index + 1}</h3>

              <div className="form-row">
                <div className="form-group">
                  <label>Data *</label>
                  <input
                    type="date"
                    {...register(`pagamentosRecebidos.${index}.data`)}
                  />
                </div>

                <div className="form-group">
                  <label>Valor (R$) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    {...register(`pagamentosRecebidos.${index}.valor`)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Referência *</label>
                <input
                  type="text"
                  placeholder="Ex: Aluguel, Depósito Caução"
                  {...register(`pagamentosRecebidos.${index}.referencia`)}
                />
              </div>

              {pagamentosFields.length > 1 && (
                <button
                  type="button"
                  onClick={() => removePagamento(index)}
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '0',
                    background: '#e53e3e',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Remover
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={() => appendPagamento({ data: "", valor: 0, referencia: "" })}
            style={{
              background: '#3182ce',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              marginTop: '10px'
            }}
          >
            + Adicionar Pagamento
          </button>
        </section>

        {/* Dados da Assinatura */}
        <section className="section">
          <h2>Dados da Assinatura</h2>

          <div className="form-group">
            <label>Cidade de Assinatura *</label>
            <input
              type="text"
              {...register("assinatura.cidade")}
              className={errors.assinatura?.cidade ? "error" : ""}
            />
            {errors.assinatura?.cidade && (
              <span className="error-message">{errors.assinatura.cidade.message}</span>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Dia *</label>
              <input
                type="number"
                min="1"
                max="31"
                {...register("assinatura.dia")}
                className={errors.assinatura?.dia ? "error" : ""}
              />
              {errors.assinatura?.dia && (
                <span className="error-message">{errors.assinatura.dia.message}</span>
              )}
            </div>

            <div className="form-group">
              <label>Mês *</label>
              <select
                {...register("assinatura.mes")}
                className={errors.assinatura?.mes ? "error" : ""}
              >
                {meses.map(mes => (
                  <option key={mes} value={mes}>{mes}</option>
                ))}
              </select>
              {errors.assinatura?.mes && (
                <span className="error-message">{errors.assinatura.mes.message}</span>
              )}
            </div>

            <div className="form-group">
              <label>Ano *</label>
              <input
                type="number"
                min="2023"
                max="2100"
                {...register("assinatura.ano")}
                className={errors.assinatura?.ano ? "error" : ""}
              />
              {errors.assinatura?.ano && (
                <span className="error-message">{errors.assinatura.ano.message}</span>
              )}
            </div>
          </div>
        </section>

        {/* Testemunhas */}
        <section className="section">
          <h2>Testemunhas</h2>

          {testemunhasFields.map((field, index) => (
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
                <label>CPF (XXX.XXX.XXX-XX)</label>
                <input
                  type="text"
                  placeholder="000.000.000-00"
                  {...register(`testemunhas.${index}.cpf`)}
                  onChange={(e) => {
                    const formatted = formatCPF(e.target.value);
                    setValue(`testemunhas.${index}.cpf`, formatted);
                  }}
                />
              </div>
            </div>
          ))}
        </section>

        {/* Configurações Adicionais */}
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

export default RentalForm;
