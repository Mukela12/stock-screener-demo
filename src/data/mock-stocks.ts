import type { Stock, WatchlistItem, ScreenerPreset, ChatMessage } from '../types'

function spark(base: number, volatility: number): number[] {
  const data: number[] = [base]
  for (let i = 1; i < 30; i++) {
    data.push(+(data[i - 1] + (Math.random() - 0.48) * volatility).toFixed(2))
  }
  return data
}

export const stocks: Stock[] = [
  // Technology
  { ticker: 'AAPL', name: 'Apple Inc.', sector: 'Technology', price: 178.52, change: 2.34, changePercent: 1.33, volume: 54200000, marketCap: 2800000000000, pe: 28.5, eps: 6.26, divYield: 0.55, high52w: 199.62, low52w: 124.17, avgVolume: 58900000, chartData: spark(175, 3), aiScore: 82, aiSummary: 'Strong services growth offsets hardware slowdown. Buy on dips.' },
  { ticker: 'MSFT', name: 'Microsoft Corp.', sector: 'Technology', price: 415.20, change: -1.78, changePercent: -0.43, volume: 22100000, marketCap: 3100000000000, pe: 35.2, eps: 11.80, divYield: 0.72, high52w: 430.82, low52w: 309.45, avgVolume: 25400000, chartData: spark(410, 5), aiScore: 88, aiSummary: 'AI integration across product suite driving enterprise adoption.' },
  { ticker: 'GOOGL', name: 'Alphabet Inc.', sector: 'Technology', price: 153.44, change: 0.92, changePercent: 0.60, volume: 28300000, marketCap: 1920000000000, pe: 24.1, eps: 6.37, divYield: 0.0, high52w: 165.31, low52w: 115.83, avgVolume: 30100000, chartData: spark(150, 3), aiScore: 79, aiSummary: 'Cloud and AI momentum strong. Search dominance intact.' },
  { ticker: 'NVDA', name: 'NVIDIA Corp.', sector: 'Technology', price: 875.30, change: 12.45, changePercent: 1.44, volume: 41200000, marketCap: 2160000000000, pe: 62.8, eps: 13.94, divYield: 0.02, high52w: 950.02, low52w: 373.56, avgVolume: 45600000, chartData: spark(860, 15), aiScore: 91, aiSummary: 'AI chip demand unprecedented. Data center revenue surging.' },
  { ticker: 'META', name: 'Meta Platforms Inc.', sector: 'Technology', price: 502.15, change: 4.67, changePercent: 0.94, volume: 18700000, marketCap: 1280000000000, pe: 29.3, eps: 17.14, divYield: 0.40, high52w: 542.81, low52w: 279.40, avgVolume: 21200000, chartData: spark(495, 6), aiScore: 76, aiSummary: 'Ad revenue recovery strong. Reality Labs still burning cash.' },
  { ticker: 'AMZN', name: 'Amazon.com Inc.', sector: 'Technology', price: 186.92, change: 1.23, changePercent: 0.66, volume: 35600000, marketCap: 1940000000000, pe: 52.1, eps: 3.59, divYield: 0.0, high52w: 201.20, low52w: 118.35, avgVolume: 39800000, chartData: spark(183, 3), aiScore: 84, aiSummary: 'AWS margins expanding. E-commerce and ads firing on all cylinders.' },
  { ticker: 'TSM', name: 'Taiwan Semiconductor', sector: 'Technology', price: 142.80, change: 3.15, changePercent: 2.25, volume: 16800000, marketCap: 740000000000, pe: 22.4, eps: 6.38, divYield: 1.45, high52w: 158.72, low52w: 88.01, avgVolume: 18200000, chartData: spark(138, 3), aiScore: 86, aiSummary: 'Advanced node demand outpacing capacity. Pricing power intact.' },
  { ticker: 'AVGO', name: 'Broadcom Inc.', sector: 'Technology', price: 1325.60, change: -8.40, changePercent: -0.63, volume: 4200000, marketCap: 614000000000, pe: 34.8, eps: 38.09, divYield: 1.56, high52w: 1438.56, low52w: 795.02, avgVolume: 4800000, chartData: spark(1320, 20), aiScore: 80, aiSummary: 'VMware integration on track. AI networking revenue accelerating.' },
  { ticker: 'CRM', name: 'Salesforce Inc.', sector: 'Technology', price: 276.40, change: -2.10, changePercent: -0.75, volume: 7800000, marketCap: 268000000000, pe: 45.2, eps: 6.12, divYield: 0.58, high52w: 318.72, low52w: 212.00, avgVolume: 8500000, chartData: spark(274, 4), aiScore: 72, aiSummary: 'AI CRM features gaining traction but valuation stretched.' },
  { ticker: 'ORCL', name: 'Oracle Corp.', sector: 'Technology', price: 165.30, change: 1.90, changePercent: 1.16, volume: 11200000, marketCap: 456000000000, pe: 32.1, eps: 5.15, divYield: 0.97, high52w: 178.61, low52w: 99.26, avgVolume: 12400000, chartData: spark(162, 2), aiScore: 74, aiSummary: 'Cloud infrastructure deals piling up. Database moat deepening.' },

  // Healthcare
  { ticker: 'UNH', name: 'UnitedHealth Group', sector: 'Healthcare', price: 528.70, change: -3.42, changePercent: -0.64, volume: 3400000, marketCap: 488000000000, pe: 22.8, eps: 23.19, divYield: 1.42, high52w: 554.70, low52w: 436.38, avgVolume: 3800000, chartData: spark(525, 6), aiScore: 77, aiSummary: 'Optum growth offsetting insurance margin pressure.' },
  { ticker: 'JNJ', name: 'Johnson & Johnson', sector: 'Healthcare', price: 158.40, change: 0.68, changePercent: 0.43, volume: 7200000, marketCap: 382000000000, pe: 15.2, eps: 10.42, divYield: 3.01, high52w: 175.97, low52w: 144.95, avgVolume: 7800000, chartData: spark(156, 2), aiScore: 68, aiSummary: 'Dividend aristocrat. Pharma pipeline strong but litigation risk.' },
  { ticker: 'LLY', name: 'Eli Lilly & Co.', sector: 'Healthcare', price: 782.50, change: 8.90, changePercent: 1.15, volume: 5100000, marketCap: 743000000000, pe: 108.5, eps: 7.21, divYield: 0.65, high52w: 812.00, low52w: 402.72, avgVolume: 5600000, chartData: spark(775, 10), aiScore: 85, aiSummary: 'GLP-1 drugs creating massive TAM. Mounjaro/Zepbound demand soaring.' },
  { ticker: 'PFE', name: 'Pfizer Inc.', sector: 'Healthcare', price: 27.85, change: -0.32, changePercent: -1.14, volume: 32100000, marketCap: 157000000000, pe: 42.1, eps: 0.66, divYield: 5.75, high52w: 33.37, low52w: 25.20, avgVolume: 35600000, chartData: spark(27.5, 0.5), aiScore: 55, aiSummary: 'Post-COVID revenue cliff. High yield but growth uncertain.' },
  { ticker: 'ABBV', name: 'AbbVie Inc.', sector: 'Healthcare', price: 172.30, change: 1.45, changePercent: 0.85, volume: 6800000, marketCap: 304000000000, pe: 18.9, eps: 9.12, divYield: 3.52, high52w: 181.20, low52w: 134.12, avgVolume: 7200000, chartData: spark(170, 2), aiScore: 73, aiSummary: 'Humira biosimilar pressure manageable. Pipeline replacing revenue.' },
  { ticker: 'MRK', name: 'Merck & Co.', sector: 'Healthcare', price: 126.80, change: -0.55, changePercent: -0.43, volume: 9400000, marketCap: 321000000000, pe: 16.4, eps: 7.73, divYield: 2.42, high52w: 131.65, low52w: 99.14, avgVolume: 10200000, chartData: spark(125, 1.5), aiScore: 71, aiSummary: 'Keytruda franchise dominance. Patent cliff in 2028 a concern.' },

  // Finance
  { ticker: 'JPM', name: 'JPMorgan Chase', sector: 'Finance', price: 198.60, change: 1.82, changePercent: 0.92, volume: 9800000, marketCap: 571000000000, pe: 11.2, eps: 17.73, divYield: 2.32, high52w: 210.45, low52w: 135.19, avgVolume: 10600000, chartData: spark(196, 2.5), aiScore: 81, aiSummary: 'Best-in-class bank. Net interest income peak but trading strong.' },
  { ticker: 'V', name: 'Visa Inc.', sector: 'Finance', price: 282.50, change: 0.95, changePercent: 0.34, volume: 6200000, marketCap: 580000000000, pe: 31.4, eps: 9.00, divYield: 0.74, high52w: 293.07, low52w: 227.75, avgVolume: 6800000, chartData: spark(280, 3), aiScore: 83, aiSummary: 'Payment volumes growing. Cross-border recovery adding tailwind.' },
  { ticker: 'MA', name: 'Mastercard Inc.', sector: 'Finance', price: 462.80, change: 2.15, changePercent: 0.47, volume: 3100000, marketCap: 431000000000, pe: 34.8, eps: 13.30, divYield: 0.55, high52w: 481.20, low52w: 359.62, avgVolume: 3400000, chartData: spark(459, 4), aiScore: 82, aiSummary: 'Value-added services driving margin expansion.' },
  { ticker: 'BAC', name: 'Bank of America', sector: 'Finance', price: 35.20, change: 0.48, changePercent: 1.38, volume: 34200000, marketCap: 277000000000, pe: 11.8, eps: 2.98, divYield: 2.61, high52w: 38.45, low52w: 24.96, avgVolume: 37800000, chartData: spark(34.5, 0.6), aiScore: 70, aiSummary: 'Rate sensitivity high. Consumer banking franchise solid.' },
  { ticker: 'GS', name: 'Goldman Sachs', sector: 'Finance', price: 415.70, change: -2.30, changePercent: -0.55, volume: 2100000, marketCap: 138000000000, pe: 15.6, eps: 26.65, divYield: 2.41, high52w: 438.90, low52w: 289.36, avgVolume: 2400000, chartData: spark(412, 5), aiScore: 75, aiSummary: 'Trading and advisory rebound. Consumer exit was right call.' },
  { ticker: 'BRK.B', name: 'Berkshire Hathaway', sector: 'Finance', price: 408.30, change: 1.20, changePercent: 0.29, volume: 3800000, marketCap: 885000000000, pe: 9.4, eps: 43.44, divYield: 0.0, high52w: 422.76, low52w: 329.77, avgVolume: 4200000, chartData: spark(405, 4), aiScore: 78, aiSummary: 'Record cash pile. Insurance operations firing. Succession smooth.' },

  // Energy
  { ticker: 'XOM', name: 'Exxon Mobil Corp.', sector: 'Energy', price: 108.90, change: -1.25, changePercent: -1.13, volume: 15200000, marketCap: 435000000000, pe: 12.1, eps: 9.00, divYield: 3.45, high52w: 120.70, low52w: 95.77, avgVolume: 16800000, chartData: spark(107, 2), aiScore: 67, aiSummary: 'Pioneer acquisition adding scale. Oil price dependent.' },
  { ticker: 'CVX', name: 'Chevron Corp.', sector: 'Energy', price: 155.40, change: -0.82, changePercent: -0.53, volume: 8400000, marketCap: 294000000000, pe: 11.8, eps: 13.17, divYield: 4.01, high52w: 171.70, low52w: 139.62, avgVolume: 9200000, chartData: spark(154, 2), aiScore: 65, aiSummary: 'Strong dividend. Hess acquisition delayed by arbitration.' },
  { ticker: 'COP', name: 'ConocoPhillips', sector: 'Energy', price: 118.70, change: 0.45, changePercent: 0.38, volume: 5600000, marketCap: 141000000000, pe: 12.5, eps: 9.50, divYield: 1.85, high52w: 134.82, low52w: 96.80, avgVolume: 6200000, chartData: spark(117, 2), aiScore: 63, aiSummary: 'Low-cost producer. Disciplined capital allocation.' },
  { ticker: 'SLB', name: 'Schlumberger Ltd.', sector: 'Energy', price: 48.90, change: 0.72, changePercent: 1.49, volume: 11800000, marketCap: 70000000000, pe: 16.2, eps: 3.02, divYield: 2.04, high52w: 62.38, low52w: 42.87, avgVolume: 12600000, chartData: spark(48, 1), aiScore: 60, aiSummary: 'International activity strong. Digital transformation ongoing.' },
  { ticker: 'NEE', name: 'NextEra Energy', sector: 'Energy', price: 62.30, change: 0.85, changePercent: 1.38, volume: 12400000, marketCap: 128000000000, pe: 20.8, eps: 3.00, divYield: 3.05, high52w: 77.69, low52w: 47.15, avgVolume: 13800000, chartData: spark(61, 1), aiScore: 72, aiSummary: 'Renewable leader. Rate environment headwind easing.' },

  // Consumer
  { ticker: 'AMZN', name: 'Amazon.com Inc.', sector: 'Consumer', price: 186.92, change: 1.23, changePercent: 0.66, volume: 35600000, marketCap: 1940000000000, pe: 52.1, eps: 3.59, divYield: 0.0, high52w: 201.20, low52w: 118.35, avgVolume: 39800000, chartData: spark(183, 3), aiScore: 84, aiSummary: 'AWS margins expanding. E-commerce and ads firing.' },
  { ticker: 'TSLA', name: 'Tesla Inc.', sector: 'Consumer', price: 248.40, change: -5.60, changePercent: -2.20, volume: 62400000, marketCap: 790000000000, pe: 68.2, eps: 3.64, divYield: 0.0, high52w: 299.29, low52w: 138.80, avgVolume: 68200000, chartData: spark(250, 8), aiScore: 61, aiSummary: 'EV competition intensifying. Energy and FSD optionality remains.' },
  { ticker: 'HD', name: 'Home Depot Inc.', sector: 'Consumer', price: 352.80, change: 2.10, changePercent: 0.60, volume: 4200000, marketCap: 351000000000, pe: 23.5, eps: 15.01, divYield: 2.48, high52w: 393.29, low52w: 274.26, avgVolume: 4600000, chartData: spark(350, 4), aiScore: 71, aiSummary: 'Housing slowdown impact. Pro customer segment resilient.' },
  { ticker: 'MCD', name: "McDonald's Corp.", sector: 'Consumer', price: 292.50, change: 0.75, changePercent: 0.26, volume: 3800000, marketCap: 211000000000, pe: 24.8, eps: 11.79, divYield: 2.19, high52w: 302.39, low52w: 245.73, avgVolume: 4100000, chartData: spark(290, 3), aiScore: 74, aiSummary: 'Value menu driving traffic. International growth strong.' },
  { ticker: 'NKE', name: 'Nike Inc.', sector: 'Consumer', price: 98.40, change: -1.20, changePercent: -1.20, volume: 9200000, marketCap: 150000000000, pe: 28.1, eps: 3.50, divYield: 1.38, high52w: 128.64, low52w: 88.66, avgVolume: 10400000, chartData: spark(97, 1.5), aiScore: 58, aiSummary: 'Brand reset underway. Direct-to-consumer pivot still in progress.' },
  { ticker: 'SBUX', name: 'Starbucks Corp.', sector: 'Consumer', price: 92.70, change: 0.42, changePercent: 0.45, volume: 8100000, marketCap: 106000000000, pe: 26.4, eps: 3.51, divYield: 2.37, high52w: 107.80, low52w: 71.55, avgVolume: 8900000, chartData: spark(91, 1.5), aiScore: 66, aiSummary: 'New CEO turnaround plan. China recovery uncertain.' },
  { ticker: 'PG', name: 'Procter & Gamble', sector: 'Consumer', price: 168.30, change: 0.55, changePercent: 0.33, volume: 6400000, marketCap: 396000000000, pe: 27.2, eps: 6.19, divYield: 2.38, high52w: 174.67, low52w: 141.45, avgVolume: 7000000, chartData: spark(167, 1.5), aiScore: 70, aiSummary: 'Premium portfolio holding up. Pricing power proven.' },
  { ticker: 'KO', name: 'Coca-Cola Co.', sector: 'Consumer', price: 59.80, change: 0.18, changePercent: 0.30, volume: 12600000, marketCap: 258000000000, pe: 24.1, eps: 2.48, divYield: 3.08, high52w: 64.99, low52w: 51.55, avgVolume: 13800000, chartData: spark(59.2, 0.8), aiScore: 69, aiSummary: 'Steady dividend grower. Emerging markets volume strong.' },
  { ticker: 'PEP', name: 'PepsiCo Inc.', sector: 'Consumer', price: 172.40, change: -0.65, changePercent: -0.38, volume: 5100000, marketCap: 237000000000, pe: 24.8, eps: 6.95, divYield: 2.96, high52w: 183.41, low52w: 155.83, avgVolume: 5600000, chartData: spark(171, 2), aiScore: 68, aiSummary: 'Snack and beverage diversification a strength. Volume soft.' },
  { ticker: 'COST', name: 'Costco Wholesale', sector: 'Consumer', price: 718.30, change: 5.40, changePercent: 0.76, volume: 2100000, marketCap: 319000000000, pe: 48.2, eps: 14.90, divYield: 0.56, high52w: 756.93, low52w: 540.15, avgVolume: 2400000, chartData: spark(712, 8), aiScore: 77, aiSummary: 'Membership renewal rates at record. Same-store sales strong.' },
  { ticker: 'WMT', name: 'Walmart Inc.', sector: 'Consumer', price: 168.50, change: 0.92, changePercent: 0.55, volume: 8200000, marketCap: 454000000000, pe: 28.4, eps: 5.93, divYield: 1.31, high52w: 178.20, low52w: 149.10, avgVolume: 9000000, chartData: spark(167, 2), aiScore: 75, aiSummary: 'E-commerce and ad business inflecting. Market share gains.' },

  // Additional Tech
  { ticker: 'ADBE', name: 'Adobe Inc.', sector: 'Technology', price: 548.20, change: -3.80, changePercent: -0.69, volume: 3400000, marketCap: 244000000000, pe: 42.6, eps: 12.87, divYield: 0.0, high52w: 638.25, low52w: 433.97, avgVolume: 3800000, chartData: spark(545, 6), aiScore: 73, aiSummary: 'AI features boosting creative suite. Figma deal collapse a setback.' },
  { ticker: 'AMD', name: 'Advanced Micro Devices', sector: 'Technology', price: 162.30, change: 4.20, changePercent: 2.66, volume: 52400000, marketCap: 262000000000, pe: 42.8, eps: 3.79, divYield: 0.0, high52w: 187.28, low52w: 93.12, avgVolume: 56800000, chartData: spark(158, 4), aiScore: 78, aiSummary: 'MI300 AI chip gaining share. Data center growth accelerating.' },
  { ticker: 'INTC', name: 'Intel Corp.', sector: 'Technology', price: 43.20, change: -0.85, changePercent: -1.93, volume: 38600000, marketCap: 182000000000, pe: 95.4, eps: 0.45, divYield: 1.15, high52w: 51.28, low52w: 26.86, avgVolume: 42100000, chartData: spark(42.5, 1), aiScore: 45, aiSummary: 'Foundry turnaround uncertain. Losing market share to AMD/ARM.' },
  { ticker: 'NFLX', name: 'Netflix Inc.', sector: 'Technology', price: 628.40, change: 7.80, changePercent: 1.26, volume: 5800000, marketCap: 274000000000, pe: 46.2, eps: 13.60, divYield: 0.0, high52w: 658.75, low52w: 393.37, avgVolume: 6200000, chartData: spark(620, 8), aiScore: 80, aiSummary: 'Ad tier growing faster than expected. Password sharing crackdown working.' },
  { ticker: 'UBER', name: 'Uber Technologies', sector: 'Technology', price: 72.50, change: 1.15, changePercent: 1.61, volume: 18200000, marketCap: 150000000000, pe: 68.5, eps: 1.06, divYield: 0.0, high52w: 82.14, low52w: 40.09, avgVolume: 20100000, chartData: spark(71, 1.5), aiScore: 71, aiSummary: 'Profitability inflection. Delivery + mobility flywheel intact.' },
  { ticker: 'PLTR', name: 'Palantir Technologies', sector: 'Technology', price: 24.80, change: 0.92, changePercent: 3.85, volume: 42600000, marketCap: 54000000000, pe: 248.0, eps: 0.10, divYield: 0.0, high52w: 27.50, low52w: 13.68, avgVolume: 46800000, chartData: spark(23.8, 0.8), aiScore: 62, aiSummary: 'AI platform story compelling but valuation extreme.' },
  { ticker: 'SNOW', name: 'Snowflake Inc.', sector: 'Technology', price: 182.40, change: -2.60, changePercent: -1.41, volume: 5400000, marketCap: 60000000000, pe: -1, eps: -1.45, divYield: 0.0, high52w: 237.72, low52w: 107.13, avgVolume: 6000000, chartData: spark(180, 4), aiScore: 64, aiSummary: 'Product revenue growing but path to profitability unclear.' },

  // Additional Finance
  { ticker: 'BLK', name: 'BlackRock Inc.', sector: 'Finance', price: 815.40, change: 3.20, changePercent: 0.39, volume: 680000, marketCap: 122000000000, pe: 21.2, eps: 38.46, divYield: 2.45, high52w: 848.62, low52w: 614.27, avgVolume: 740000, chartData: spark(810, 8), aiScore: 76, aiSummary: 'AUM at record levels. ETF franchise unmatched.' },
  { ticker: 'SCHW', name: 'Charles Schwab', sector: 'Finance', price: 68.90, change: 0.72, changePercent: 1.06, volume: 8200000, marketCap: 126000000000, pe: 22.8, eps: 3.02, divYield: 1.45, high52w: 74.22, low52w: 48.55, avgVolume: 9000000, chartData: spark(67.5, 1), aiScore: 69, aiSummary: 'TD Ameritrade integration complete. Cash sorting headwind fading.' },

  // Additional Healthcare
  { ticker: 'TMO', name: 'Thermo Fisher Scientific', sector: 'Healthcare', price: 572.80, change: 2.40, changePercent: 0.42, volume: 1800000, marketCap: 220000000000, pe: 33.4, eps: 17.15, divYield: 0.24, high52w: 604.89, low52w: 432.13, avgVolume: 2000000, chartData: spark(568, 6), aiScore: 74, aiSummary: 'Life sciences tools leader. Post-COVID normalization complete.' },
  { ticker: 'ISRG', name: 'Intuitive Surgical', sector: 'Healthcare', price: 388.60, change: 4.70, changePercent: 1.22, volume: 2400000, marketCap: 138000000000, pe: 65.8, eps: 5.91, divYield: 0.0, high52w: 412.68, low52w: 268.68, avgVolume: 2600000, chartData: spark(384, 5), aiScore: 81, aiSummary: 'Robotic surgery adoption curve still early. Da Vinci 5 catalyst.' },
]

export const watchlist: WatchlistItem[] = [
  { ticker: 'NVDA', addedAt: '2026-02-15', notes: 'AI chip leader — core position' },
  { ticker: 'MSFT', addedAt: '2026-02-20', notes: 'Azure + Copilot growth' },
  { ticker: 'AAPL', addedAt: '2026-01-10', notes: 'Services inflection' },
  { ticker: 'LLY', addedAt: '2026-03-01', notes: 'GLP-1 mega trend' },
  { ticker: 'JPM', addedAt: '2026-02-28', notes: 'Best bank franchise' },
  { ticker: 'V', addedAt: '2026-03-05', notes: 'Payment volumes growing' },
  { ticker: 'AMZN', addedAt: '2026-01-22', notes: 'AWS + advertising' },
  { ticker: 'COST', addedAt: '2026-03-08', notes: 'Membership renewal rates' },
]

export const screenerPresets: ScreenerPreset[] = [
  {
    name: 'Value Plays',
    filters: [
      { field: 'pe', operator: 'lt', value: 20 },
      { field: 'divYield', operator: 'gt', value: 2.0 },
    ],
  },
  {
    name: 'Growth Monsters',
    filters: [
      { field: 'changePercent', operator: 'gt', value: 0 },
      { field: 'aiScore', operator: 'gt', value: 75 },
    ],
  },
  {
    name: 'Dividend Kings',
    filters: [
      { field: 'divYield', operator: 'gt', value: 2.5 },
      { field: 'pe', operator: 'lt', value: 25 },
    ],
  },
  {
    name: 'AI Picks',
    filters: [
      { field: 'aiScore', operator: 'gt', value: 80 },
    ],
  },
]

export const sampleChatHistory: ChatMessage[] = [
  {
    id: '1',
    role: 'user',
    content: 'What are the best value stocks in my screener right now?',
    timestamp: '2026-03-09T14:30:00Z',
  },
  {
    id: '2',
    role: 'assistant',
    content: 'Based on current P/E ratios and dividend yields, here are the top value picks from your screener:\n\n1. **BRK.B** (Berkshire Hathaway) — P/E 9.4, no dividend but massive cash pile ($167B). Warren Buffett\'s conglomerate trades at a significant discount to intrinsic value.\n\n2. **JPM** (JPMorgan Chase) — P/E 11.2, 2.32% yield. Best-in-class bank with strong trading revenue and net interest income.\n\n3. **BAC** (Bank of America) — P/E 11.8, 2.61% yield. Consumer banking franchise solid, rate sensitivity provides upside if rates stay elevated.\n\n4. **XOM** (Exxon Mobil) — P/E 12.1, 3.45% yield. Pioneer acquisition adds scale. Strong free cash flow generation.\n\nAll four trade below 15x earnings with solid fundamentals. JPM and BAC offer the best risk-adjusted returns given current macro conditions.',
    timestamp: '2026-03-09T14:30:05Z',
  },
  {
    id: '3',
    role: 'user',
    content: 'Compare AAPL vs MSFT for a long-term hold.',
    timestamp: '2026-03-09T14:32:00Z',
  },
  {
    id: '4',
    role: 'assistant',
    content: 'Here\'s a head-to-head comparison:\n\n**Apple (AAPL)** — AI Score: 82/100\n- Price: $178.52 | P/E: 28.5 | Yield: 0.55%\n- Strengths: Services revenue growing 15% YoY ($22B/quarter), massive installed base (2.2B devices), $162B cash\n- Risks: iPhone cycle dependency, China regulatory, India manufacturing ramp\n\n**Microsoft (MSFT)** — AI Score: 88/100\n- Price: $415.20 | P/E: 35.2 | Yield: 0.72%\n- Strengths: Azure growing 29%, Copilot AI integration across Office 365 (400M users), GitHub Copilot at 1.8M paid subscribers\n- Risks: Higher valuation, cloud spending normalization, Activision integration costs\n\n**Verdict**: For a 5+ year hold, MSFT edges out AAPL due to stronger AI positioning and enterprise moat. However, AAPL offers better value at current prices. Consider a 60/40 MSFT/AAPL split.',
    timestamp: '2026-03-09T14:32:08Z',
  },
]

export const aiResponseTemplates: Record<string, string> = {
  'top value': 'Based on current fundamentals, the best value plays are BRK.B (P/E 9.4), JPM (P/E 11.2, 2.3% yield), and BAC (P/E 11.8, 2.6% yield). All three trade below 12x earnings with strong balance sheets.',
  'sector analysis': 'Technology leads with an average AI score of 76/100, driven by AI infrastructure demand (NVDA, MSFT, GOOGL). Healthcare shows the most dispersion — LLY (85) vs PFE (55). Energy remains oil-price dependent with avg scores around 65.',
  'portfolio review': 'Your watchlist is tech-heavy (37.5%) with strong AI exposure. Consider adding CVX or XOM for energy diversification and JNJ for defensive healthcare. Current portfolio beta: ~1.25. Suggest rebalancing to 30% tech for lower risk.',
  'risk assessment': 'Key risks in your portfolio: 1) Tech concentration (>35%), 2) Rate sensitivity (JPM, BAC), 3) AI valuation premium (NVDA at 62x PE). Mitigation: Add dividend aristocrats (PG, KO) and reduce NVDA position by 10%.',
  'default': 'I analyzed your portfolio against current market conditions. Your holdings show strong quality metrics with an average AI score of 76/100. Key opportunity: Healthcare (LLY, ISRG) is showing momentum. Key risk: Energy sector headwinds from OPEC+ uncertainty. Would you like me to dive deeper into any specific area?',
}

export const tickerData = [
  { ticker: 'AAPL', price: 178.52, change: 1.33 },
  { ticker: 'MSFT', price: 415.20, change: -0.43 },
  { ticker: 'NVDA', price: 875.30, change: 1.44 },
  { ticker: 'GOOGL', price: 153.44, change: 0.60 },
  { ticker: 'META', price: 502.15, change: 0.94 },
  { ticker: 'TSLA', price: 248.40, change: -2.20 },
  { ticker: 'JPM', price: 198.60, change: 0.92 },
  { ticker: 'LLY', price: 782.50, change: 1.15 },
  { ticker: 'V', price: 282.50, change: 0.34 },
  { ticker: 'AMZN', price: 186.92, change: 0.66 },
]

export const portfolioAllocation = [
  { name: 'Technology', value: 40, color: '#000000' },
  { name: 'Healthcare', value: 20, color: '#FF6B6B' },
  { name: 'Finance', value: 15, color: '#FFCC00' },
  { name: 'Energy', value: 15, color: '#FAF5ED' },
  { name: 'Consumer', value: 10, color: '#F0ECE4' },
]
