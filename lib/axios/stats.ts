import { StatByCategoryMonth, StatByCategoryMonthSchema, StatFilters } from "../validators/statistiche";
import api from "./index";
import { z } from "zod";

export async function getStats(filters?: StatFilters): Promise<StatByCategoryMonth[]> {
  const res = await api.get<{ byCategory: StatByCategoryMonth[] }>("/stats", {
    params: filters,
  });
  return z.array(StatByCategoryMonthSchema).parse(res.data.byCategory);
}