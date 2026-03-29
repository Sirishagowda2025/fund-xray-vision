import { DEMO_DATA, type PortfolioData, type Fund } from "./demoData";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

function mapFund(f: any): Fund {
  const xirr = typeof f.xirr === "number" ? f.xirr : 0;
  return {
    name: f.fundName || f.name || "Unknown Fund",
    category: f.category || "Other",
    amountInvested: f.amountInvested || 0,
    currentValue: f.currentValue || 0,
    xirr: parseFloat(xirr.toFixed(1)),
    status: xirr >= 15 ? "Outperforming" : xirr >= 8 ? "Watch" : "Underperforming",
  };
}

function buildPortfolioData(funds: any[], metrics: any, insights: any): PortfolioData {
  const xirr = metrics?.xirr ?? 12;
  return {
    funds: funds.map(mapFund),
    metrics: {
      xirr,
      totalValue: metrics?.totalCurrentValue ?? 0,
      portfolioOverlap: metrics?.overlapPercent ?? 0,
      annualExpenseDrag: metrics?.expenseDragAnnual ?? 0,
      healthScore: metrics?.healthScore ?? 65,
    },
    scoreBreakdown: insights?.scoreBreakdown ?? {
      performance: Math.min(100, Math.round(xirr * 4)),
      diversification: metrics?.diversificationScore ?? 60,
      costEfficiency: metrics?.costScore ?? 55,
      riskAlignment: 70,
    },
    insights: insights?.recommendations
      ? insights.recommendations.slice(0, 3).map((r: string, i: number) => ({
          icon: ["📊","💰","⚖️"][i] ?? "💡",
          title: r.split(" ").slice(0, 5).join(" "),
          description: r,
        }))
      : DEMO_DATA.insights,
    redFlags: insights?.redFlags
      ? insights.redFlags.map((msg: string, i: number) => ({
          message: msg,
          severity: (i === 0 ? "high" : i === 1 ? "high" : "medium") as "high"|"medium"|"low",
        }))
      : DEMO_DATA.redFlags,
    recommendations: insights?.recommendations
      ? insights.recommendations.map((r: string, i: number) => ({
          action: r,
          impact: insights.estimatedImpact ?? "Improves portfolio health",
          projectedScoreChange: [8, 6, 4][i] ?? 3,
          category: (["switch","add","reduce","rebalance"][i] ?? "rebalance") as any,
        }))
      : DEMO_DATA.recommendations,
    benchmarks: [
      { label: "1Y Returns",    portfolioReturn: xirr,       benchmarkReturn: 13.2 },
      { label: "3Y Returns",    portfolioReturn: xirr - 1.5, benchmarkReturn: 13.5 },
      { label: "5Y Returns",    portfolioReturn: xirr - 2,   benchmarkReturn: 14.2 },
      { label: "Risk (Std Dev)", portfolioReturn: 16.2,       benchmarkReturn: 14.8 },
    ],
    riskRadar: [
      { axis: "Market Risk",          value: Math.min(90, 50 + (metrics?.overlapPercent ?? 30) / 2) },
      { axis: "Concentration",        value: metrics?.overlapPercent ?? 50 },
      { axis: "Expense Efficiency",   value: metrics?.costScore ?? 60 },
      { axis: "Diversification",      value: metrics?.diversificationScore ?? 55 },
      { axis: "Volatility",           value: 62 },
      { axis: "Liquidity",            value: 85 },
    ],
  };
}

export async function uploadStatement(file: File, riskProfile = "moderate"): Promise<PortfolioData> {
  try {
    const formData = new FormData();
    formData.append("statement", file);
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 60000);
    const uploadRes = await fetch(`${API_URL}/api/analyze/upload`, { method: "POST", body: formData, signal: controller.signal });
    clearTimeout(t);
    if (!uploadRes.ok) throw new Error(`Upload ${uploadRes.status}`);
    const uploadData = await uploadRes.json();

    const insightsRes = await fetch(`${API_URL}/api/analyze/insights`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ funds: uploadData.funds, metrics: uploadData.metrics, riskProfile }),
    });
    const ins = insightsRes.ok ? await insightsRes.json() : {};
    return buildPortfolioData(uploadData.funds, uploadData.metrics, ins.insights);
  } catch (e) {
    console.error("Upload failed:", e);
    return { ...DEMO_DATA, _uploadFailed: true } as any;
  }
}

export async function analyzeDemoPortfolio(riskProfile = "moderate"): Promise<PortfolioData> {
  try {
    const backendFunds = DEMO_DATA.funds.map(f => ({
      fundName: f.name, category: f.category,
      amountInvested: f.amountInvested, currentValue: f.currentValue,
      xirr: f.xirr, folio: "DEMO", transactions: [],
    }));

    const pRes = await fetch(`${API_URL}/api/analyze/portfolio`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ funds: backendFunds }),
    });
    if (!pRes.ok) throw new Error("Portfolio call failed");
    const pData = await pRes.json();

    const iRes = await fetch(`${API_URL}/api/analyze/insights`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ funds: backendFunds, metrics: pData.metrics, riskProfile }),
    });
    const iData = iRes.ok ? await iRes.json() : {};
    return buildPortfolioData(backendFunds, pData.metrics, iData.insights);
  } catch (e) {
    console.warn("Demo API failed, using static data:", e);
    return DEMO_DATA;
  }
}
