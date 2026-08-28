/**
 * ============================================================================
 *  CONFIGURAÇÃO CENTRAL DO CASAMENTO
 * ============================================================================
 *
 *  Este é o ÚNICO lugar que você precisa editar para mudar o conteúdo do site:
 *  nomes, datas, cores, endereços, textos, versículos, links, áudio e fotos.
 *
 *  Nada de conteúdo ou cor deve ser "chumbado" (hardcoded) nos componentes.
 *  Se precisar alterar algo visível ao convidado, comece por aqui.
 *
 *  --------------------------------------------------------------------------
 *  COMO ADICIONAR O ÁUDIO DOS NOIVOS
 *  --------------------------------------------------------------------------
 *  1. Coloque o arquivo em:  public/audio/convite.mp3   (ou .ogg / .m4a)
 *  2. Ajuste `audio.src` abaixo para "/audio/convite.mp3"
 *  3. Deixe `audio.enabled` como `true`.
 *  Enquanto `audio.src` estiver vazio, o portão de áudio mostra um estado
 *  de preparação e permite entrar (modo desenvolvimento).
 *
 *  --------------------------------------------------------------------------
 *  COMO ADICIONAR AS FOTOS DOS NOIVOS
 *  --------------------------------------------------------------------------
 *  Coloque as imagens em `public/photos/` e referencie os caminhos abaixo.
 *  Sugestão de nomes:
 *    public/photos/hero.jpg          -> foto principal (tela inicial)
 *    public/photos/couple.jpg        -> retrato do casal
 *    public/photos/story-1.jpg ...   -> fotos da seção "História"
 *    public/photos/gallery-1.jpg ... -> galeria
 *  Placeholders elegantes aparecem automaticamente enquanto o caminho não
 *  apontar para um arquivo real.
 * ============================================================================
 */

export type AttendanceType = "CEREMONY_AND_RESTAURANT" | "CEREMONY_ONLY";

export interface PhotoSlot {
  /** Caminho público da imagem, ex: "/photos/hero.jpg". Vazio = placeholder. */
  src: string;
  /** Texto alternativo para acessibilidade. */
  alt: string;
  /** Proporção sugerida (usada pelo placeholder e pelo layout). */
  aspect?: "portrait" | "landscape" | "square";
  /** Legenda opcional exibida sob a foto. */
  caption?: string;
}

/**
 * Slot de foto. `src` é relativo a /public (ex.: "/photos/hero.webp").
 * Passe "" para exibir um placeholder elegante no lugar da imagem.
 */
const img = (
  src: string,
  alt: string,
  aspect: PhotoSlot["aspect"] = "landscape",
  caption?: string,
): PhotoSlot => ({ src, alt, aspect, caption });

export const wedding = {
  /* ---------------------------------------------------------------------- */
  /*  IDENTIDADE                                                            */
  /* ---------------------------------------------------------------------- */
  couple: {
    brideFirstName: "Brenda",
    groomFirstName: "Samuel",
    /** Ordem de exibição do casal no site. */
    displayName: "Brenda & Samuel",
    /** Hashtag opcional para redes sociais (sem #). Deixe "" para ocultar. */
    hashtag: "BrendaESamuel2027",
  },

  /* ---------------------------------------------------------------------- */
  /*  DATA E HORÁRIOS                                                       */
  /* ---------------------------------------------------------------------- */
  event: {
    /**
     * Data/hora da cerimônia em ISO 8601 COM fuso horário.
     * São Paulo é UTC-03:00 o ano todo (sem horário de verão).
     */
    ceremonyIso: "2027-01-23T09:30:00-03:00",
    /** Texto amigável da data, exibido no site. */
    dateLabel: "23 de janeiro de 2027",
    /** Texto amigável do horário da cerimônia. */
    ceremonyTimeLabel: "09:30",
    /** Dia da semana por extenso. */
    weekdayLabel: "sábado",
    city: "São José dos Campos",
    state: "SP",
  },

  /* ---------------------------------------------------------------------- */
  /*  TEMA / DESIGN SYSTEM                                                  */
  /* ---------------------------------------------------------------------- */
  /**
   * Paleta central. Trocar a cor do casamento = trocar `primary` aqui.
   * Os valores são injetados como CSS custom properties no <html> pelo
   * RootLayout, então nenhum componente precisa conhecer o hex.
   *
   * Formato: qualquer cor CSS válida (hex, rgb, oklch...).
   */
  theme: {
    colors: {
      /** Verde principal (botões, superfícies, detalhes). */
      primary: "#20583B",
      /** Verde suave (hovers, variações). */
      primarySoft: "#2E7049",
      /** Dourado suave (acento metálico, ornamentos, linhas). */
      secondary: "#C9A46B",
      /** Fundo base — verde escuro (o site é dark). */
      background: "#0F2B1F",
      /** Superfície elevada sobre o verde escuro (cards). */
      surface: "#15382697",
      /** Tinta principal (creme sobre o verde). */
      ink: "#F4EDE1",
      /** Tinta secundária (creme apagado). */
      inkSoft: "#BBAF9B",
      /** Linhas e bordas discretas (dourado bem sutil). */
      line: "#C9A46B3D",
      /** Seções claras (creme) — texto e fundo. */
      cream: "#F7F3ED",
      cream2: "#EBE2D4",
      creamInk: "#2A2A24",
      creamInkSoft: "#66666B",
    },
    /** Cantos arredondados base (px). */
    radius: 12,
    /** Nome curto do tema. */
    name: "Verde & Dourado",
  },

  /* ---------------------------------------------------------------------- */
  /*  ÁUDIO DE ABERTURA                                                     */
  /* ---------------------------------------------------------------------- */
  audio: {
    /** true = o áudio é a primeira e obrigatória experiência. */
    enabled: true,
    /**
     * true  = o portão de áudio aparece a CADA visita.
     * false = em PRODUÇÃO, depois de ouvir uma vez o navegador lembra e pula
     *         direto (a memória é atrelada ao arquivo — trocar o áudio faz o
     *         portão reaparecer para todos).
     * Em desenvolvimento (`npm run dev`) o portão SEMPRE aparece.
     */
    replayEveryVisit: false,
    /**
     * Caminho do arquivo de áudio (em `public/`).
     * Deixe "" para o modo de preparação (só um botão "Entrar", sem player).
     */
    src: "/audio/mensagem.mp3",
    /** Formatos alternativos opcionais para compatibilidade. */
    sources: [] as { src: string; type: string }[],
    /** Título mostrado na tela de áudio. */
    title: "Uma mensagem antes de tudo",
    /**
     * Texto curto e sóbrio exibido acima do player. Sem exageros.
     */
    intro:
      "Antes de abrir o convite, os noivos gravaram algumas palavras para você. " +
      "Ouça com calma — o restante só aparece quando a mensagem terminar.",
    /** Texto exibido quando o arquivo ainda não foi adicionado. */
    placeholderNote:
      "O áudio dos noivos será adicionado aqui em breve.",
    /** Rótulo do botão que inicia a reprodução. */
    startLabel: "Ouvir a mensagem",
    /** Rótulo do botão após o término. */
    continueLabel: "Entrar no convite",
  },

  /* ---------------------------------------------------------------------- */
  /*  HERO / ABERTURA DA LANDING                                            */
  /* ---------------------------------------------------------------------- */
  hero: {
    eyebrow: "Seremos apenas um em Cristo",
    /** Frase de destaque. Quebre com \n se quiser controlar as linhas. */
    headline: "Brenda\n&\nSamuel",
    subhead:
      "Com alegria, convidamos você para celebrar o início da nossa história como família.",
    photo: img("/photos/hero.webp", "Brenda e Samuel", "landscape"),
  },

  /* ---------------------------------------------------------------------- */
  /*  HISTÓRIA / LINHA DO TEMPO                                             */
  /* ---------------------------------------------------------------------- */
  story: {
    title: "Nossa história",
    intro:
      "Alguns momentos que nos trouxeram até aqui.",
    milestones: [
      {
        date: "2022-12-04",
        dateLabel: "04 de dezembro de 2022",
        title: "A primeira vez que nos vimos",
        text:
          "O começo de tudo — adicione aqui a lembrança desse primeiro encontro.",
        photo: img(
          "/photos/historia-1.webp",
          "A primeira vez que nos vimos",
          "portrait",
        ),
      },
      {
        date: "2023-05-01",
        dateLabel: "01 de maio de 2023",
        title: "Começamos a namorar",
        text:
          "O dia em que decidimos caminhar juntos.",
        photo: img(
          "/photos/historia-2.webp",
          "Começamos a namorar",
          "portrait",
        ),
      },
      {
        date: "2025-09-28",
        dateLabel: "28 de setembro de 2025",
        title: "O pedido de casamento",
        text:
          "Um sim que mudou os planos para sempre.",
        photo: img(
          "/photos/historia-3.webp",
          "O pedido de casamento",
          "portrait",
        ),
      },
    ],
  },

  /* ---------------------------------------------------------------------- */
  /*  FOTOS / GALERIA                                                       */
  /* ---------------------------------------------------------------------- */
  gallery: {
    title: "Momentos",
    intro: "Um panorama da nossa caminhada.",
    photos: [
      img("/photos/hero.webp", "Brenda e Samuel", "landscape"),
      img("/photos/historia-1.webp", "Brenda e Samuel", "portrait"),
      img("/photos/historia-3.webp", "Brenda e Samuel", "portrait"),
      img("/photos/historia-2.webp", "Brenda e Samuel", "portrait"),
      // Novas fotos: coloque em public/photos/ e adicione com
      // img("/photos/arquivo.webp", "descrição", "portrait" | "landscape" | "square"),
    ],
  },

  /* ---------------------------------------------------------------------- */
  /*  VERSÍCULOS                                                            */
  /* ---------------------------------------------------------------------- */
  verses: {
    title: "A palavra que nos guia",
    items: [
      {
        text:
          "Completai a minha alegria, de modo que penseis a mesma coisa, " +
          "tenhais o mesmo amor, sejais unidos de alma, tendo o mesmo sentimento.",
        reference: "Filipenses 2:2",
      },
    ],
  },

  /* ---------------------------------------------------------------------- */
  /*  LOCALIZAÇÃO                                                           */
  /* ---------------------------------------------------------------------- */
  /**
   * IMPORTANTE: os endereços só são revelados ao convidado DEPOIS que ele
   * conclui a confirmação de presença. Mantidos aqui de forma centralizada.
   *
   * Regras de exibição (só APÓS a confirmação concluída):
   *  - "Cerimônia e Restaurante" -> mostra CERIMÔNIA + RESTAURANTE
   *  - "Somente cerimônia"       -> mostra apenas a CERIMÔNIA
   */
  locations: {
    /** Cerimônia (igreja). Aparece para TODOS os confirmados. */
    ceremony: {
      label: "Cerimônia",
      name: "Igreja da Cidade",
      address: "Rua Todas as Nações — Igreja da Cidade, São José dos Campos - SP",
      timeLabel: "09:30",
      note: "Chegue com 20 minutos de antecedência para acomodar-se com tranquilidade.",
      mapsQuery: "Igreja da Cidade, Rua Todas as Nações, São José dos Campos - SP",
    },
    /**
     * Restaurante. Aparece apenas para quem escolhe "Cerimônia e Restaurante".
     * Valor atual = Praça da Sé (provisório). Atualize para o local real.
     */
    restaurant: {
      label: "Restaurante",
      name: "Praça da Sé",
      address: "Praça da Sé — Centro, São Paulo - SP",
      timeLabel: "",
      note: "Tire print ou salve este endereço. Lembre-se: no restaurante, cada convidado paga a própria conta (a sua e a de sua família ou acompanhantes).",
      mapsQuery: "Praça da Sé, São Paulo - SP",
    },
  },

  /* ---------------------------------------------------------------------- */
  /*  LISTA DE PRESENTES                                                    */
  /* ---------------------------------------------------------------------- */
  gifts: {
    title: "Lista de presentes",
    text:
      "Sua presença é o presente mais importante. Para quem quiser nos abençoar " +
      "com algo além disso, preparamos uma lista.",
    /** URL única e centralizada da lista de presentes. */
    url: "https://noivos.casar.com/brenda-e-samuel-2027-01-23",
    ctaLabel: "Acessar a lista de presentes",
  },

  /* ---------------------------------------------------------------------- */
  /*  FAQ                                                                   */
  /* ---------------------------------------------------------------------- */
  faq: {
    title: "Perguntas frequentes",
    items: [
      {
        q: "Posso levar crianças?",
        a: "Sim. Ao confirmar presença, inclua cada criança como acompanhante para organizarmos os lugares.",
      },
      {
        q: "Qual é o traje?",
        a: "Traje social. Como a cerimônia é pela manhã, priorize o conforto. Traje branco reservado somente à noiva! Evitar roupas decotadas.",
      },
      {
        q: "Até quando posso confirmar presença?",
        a: "Pedimos que a confirmação seja feita o quanto antes para ajudar na organização.",
      },
      {
        q: "Vou só à cerimônia, preciso confirmar?",
        a: "Sim. No formulário, escolha a opção “Somente cerimônia”.",
      },
      {
        q: "Como funciona o restaurante?",
        a: "É um momento de confraternização após a cerimônia. Cada convidado fica responsável pela própria conta — a sua e a de sua família ou acompanhantes.",
      },
    ],
  },

  /* ---------------------------------------------------------------------- */
  /*  RSVP (CONFIRMAÇÃO DE PRESENÇA)                                        */
  /* ---------------------------------------------------------------------- */
  rsvp: {
    title: "Confirmação de presença",
    intro:
      "Para nos ajudar a receber você bem, confirme sua presença abaixo. " +
      "Leva menos de dois minutos.",
    /** Idade mínima/máxima aceita na validação (aplicada no servidor também). */
    minAge: 0,
    maxAge: 120,
    /** Limite de segurança para o total de pessoas por confirmação. */
    maxPeoplePerSubmission: 20,
    /**
     * Aviso destacado na etapa "Comparecerá em:", antes de o convidado
     * escolher. Deixe "" para ocultar.
     */
    restaurantNote:
      "Atenção: no restaurante, cada convidado é responsável pela própria " +
      "conta — a sua e a de sua família ou acompanhantes.",
    successTitle: "Presença confirmada!",
    successText:
      "Recebemos a sua confirmação. Abaixo estão as informações de localização.",
    declineTitle: "Tudo bem, sentiremos sua falta",
    declineText:
      "Obrigado por avisar. Se mudar de ideia, é só voltar aqui e confirmar.",
  },

  /* ---------------------------------------------------------------------- */
  /*  MENSAGENS / RECADOS                                                   */
  /* ---------------------------------------------------------------------- */
  messages: {
    title: "Deixe um recado",
    intro: "Uma palavra, um versículo, um desejo — os noivos vão ler cada um.",
    placeholder: "Escreva sua mensagem para Brenda e Samuel...",
  },

  /* ---------------------------------------------------------------------- */
  /*  RODAPÉ                                                                */
  /* ---------------------------------------------------------------------- */
  footer: {
    text: "Feito com carinho para o nosso grande dia.",
  },

  /* ---------------------------------------------------------------------- */
  /*  METADADOS / SEO                                                       */
  /* ---------------------------------------------------------------------- */
  meta: {
    siteName: "Brenda & Samuel",
    title: "Brenda & Samuel — 23.01.2027",
    description:
      "O convite de casamento de Brenda e Samuel. Confirme sua presença.",
    /**
     * URL canônica do site em produção (og:url / metadataBase).
     * Ajuste depois do primeiro deploy para o domínio real, ou defina a
     * variável de ambiente NEXT_PUBLIC_SITE_URL na Vercel.
     */
    url:
      process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
      "https://brenda-e-samuel.vercel.app",
    locale: "pt-BR",
  },
} as const;

export type WeddingConfig = typeof wedding;
