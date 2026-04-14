import { promises as fs } from "node:fs";
import path from "node:path";
import type { DashboardData } from "@/types/dashboard";

const dashboardFilePath = path.join(process.cwd(), "src", "data", "dashboard.json");

export async function readDashboardData() {
  const raw = await fs.readFile(dashboardFilePath, "utf8");
  return JSON.parse(raw) as DashboardData;
}

export async function writeDashboardData(data: DashboardData) {
  await fs.writeFile(dashboardFilePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}
