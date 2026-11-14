import fs from 'node:fs';
import intros from '../src/data/blog/editorial-intros.json';
import { blogPosts } from '../src/data/blog/posts';

const file = 'src/i18n/generated-content.json';
const dictionaries = JSON.parse(fs.readFileSync(file, 'utf8'));
for (const [locale, entries] of Object.entries(dictionaries) as [string, Record<string, string>][]) {
  for (const [key, value] of Object.entries(entries)) {
    entries[key] = value
      .replace(/AstucesApex|TrucosApex|KodyApex|ЧитыApex|HilelerApex|攻略Apex/g, 'CheatsApex')
      .replace(/AstucesÉquipe éditoriale Apex/g, 'Équipe éditoriale CheatsApex');
    if (locale === 'ja') entries[key] = entries[key].replaceAll('やり投げ', 'Javelin');
    if (locale === 'fr') entries[key] = entries[key].replace(/changeur de peau/gi, 'Skin Changer');
    if (locale === 'es') entries[key] = entries[key].replace(/cambiador de piel/gi, 'Skin Changer');
  }
  const intro = intros[locale as keyof typeof intros];
  if (intro) for (const post of blogPosts) entries[(post.body[0] as { text: string }).text] = intro[post.slug as keyof typeof intro];
  entries.CheatsApex = 'CheatsApex';
  entries['EA Javelin'] = 'EA Javelin';
  entries['Cloud DMA'] = 'Cloud DMA';
}
const specific: Record<string, Record<string, string>> = {
  de: { 'Apex Legends cheats for Windows PC': 'Apex-Legends-Cheats für Windows-PCs', 'About CheatsApex': 'Über CheatsApex', 'Apex purchase and setup questions': 'Fragen zum Kauf und zur Einrichtung von Apex', 'Guides: Apex cheats questions': 'Ratgeber: Fragen zu Apex-Cheats' },
  es: { 'Apex Legends cheats for Windows PC': 'Cheats de Apex Legends para PC con Windows', 'About CheatsApex': 'Sobre CheatsApex', 'Apex purchase and setup questions': 'Preguntas sobre la compra y configuración de Apex', 'Guides: Apex cheats questions': 'Guías: preguntas sobre cheats de Apex' },
  fr: { 'Apex Legends cheats for Windows PC': 'Cheats Apex Legends pour PC Windows', 'About CheatsApex': 'À propos de CheatsApex', 'Apex purchase and setup questions': "Questions sur l’achat et la configuration d’Apex", 'Guides: Apex cheats questions': 'Guides : questions sur les cheats Apex' },
  pl: { 'Apex Legends cheats for Windows PC': 'Cheaty do Apex Legends na PC z Windows', 'About CheatsApex': 'O CheatsApex', 'Apex purchase and setup questions': 'Pytania o zakup i konfigurację Apex', 'Guides: Apex cheats questions': 'Poradniki: pytania o cheaty Apex' },
  pt: { 'Apex Legends cheats for Windows PC': 'Cheats para Apex Legends no PC Windows', 'About CheatsApex': 'Sobre a CheatsApex', 'Apex purchase and setup questions': 'Perguntas sobre compra e configuração de Apex', 'Guides: Apex cheats questions': 'Guias: dúvidas sobre cheats para Apex' },
  ru: { 'Apex Legends cheats for Windows PC': 'Читы для Apex Legends на ПК с Windows', 'About CheatsApex': 'О CheatsApex', 'Apex purchase and setup questions': 'Вопросы о покупке и настройке Apex', 'Guides: Apex cheats questions': 'Руководства: вопросы о читах для Apex' },
  tr: { 'Apex Legends cheats for Windows PC': 'Windows PC için Apex Legends hileleri', 'About CheatsApex': 'CheatsApex hakkında', 'Apex purchase and setup questions': 'Apex satın alma ve kurulum soruları', 'Guides: Apex cheats questions': 'Rehberler: Apex hileleri hakkında sorular' },
  ja: { 'Apex Legends cheats for Windows PC': 'Windows PC向けApex Legendsチート', 'About CheatsApex': 'CheatsApexについて', 'Apex purchase and setup questions': 'Apexの購入と設定に関する質問', 'Guides: Apex cheats questions': 'ガイド：Apexチートに関する質問' },
};
for (const [locale, entries] of Object.entries(specific)) Object.assign(dictionaries[locale], entries);
const faqHero = 'Purchase and setup questions about access duration, Windows requirements, separate services and support. Use the detailed guides for feature explanations.';
const faqHeroCopy = {
  de: 'Fragen zum Kauf: Zugangsdauer, Windows-Anforderungen, separate Dienste und Support. Ausführliche Erklärungen zu den Funktionen finden Sie in den Ratgebern.',
  es: 'Preguntas sobre duración del acceso, requisitos de Windows, servicios separados y asistencia. Las guías explican cada función con más detalle.',
  fr: 'Questions sur la durée d’accès, les prérequis Windows, les services séparés et l’assistance. Les guides détaillent les différentes fonctions.',
  pl: 'Pytania o czas dostępu, wymagania Windows, osobne usługi i pomoc. Szczegółowe wyjaśnienia funkcji znajdziesz w poradnikach.',
  pt: 'Dúvidas sobre duração do acesso, requisitos Windows, serviços separados e suporte. Os guias explicam os recursos em mais detalhes.',
  ru: 'Вопросы о сроке доступа, требованиях Windows, отдельных сервисах и поддержке. Подробные объяснения функций приведены в руководствах.',
  tr: 'Erişim süresi, Windows gereksinimleri, ayrı hizmetler ve destek hakkında sorular. Özelliklerin ayrıntılı açıklamaları mevcut rehberlerde yer alır.',
  ja: 'アクセス期間、Windows要件、別途必要なサービス、サポートに関する質問をまとめています。機能の詳しい説明は各ガイドをご覧ください。',
};
for (const [locale, text] of Object.entries(faqHeroCopy)) dictionaries[locale][faqHero] = text;
const redirects = {
  de: ['Weiterleitung…', 'Weiterleitung zu'], es: ['Redirigiendo…', 'Redirigiendo a'], fr: ['Redirection…', 'Redirection vers'],
  pl: ['Przekierowanie…', 'Przekierowanie do'], pt: ['Redirecionando…', 'Redirecionando para'], ru: ['Перенаправление…', 'Перенаправление на'], tr: ['Yönlendiriliyor…', 'Yönlendirilen adres'], ja: ['転送中…', '転送先'],
};
for (const [locale, [title, label]] of Object.entries(redirects)) {
  dictionaries[locale]['Redirecting…'] = title;
  dictionaries[locale]['Redirecting to'] = label;
}
fs.writeFileSync(file, JSON.stringify(dictionaries, null, 2) + '\n');
console.log('Applied 77 editorial introductions and explicit brand/gaming-terminology corrections. No native-review certification added.');
