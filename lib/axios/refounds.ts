import { CategoryReq, CategoryReqSchema, RefoundReqCreate, RefoundReqFilters, RefoundReqResponse, RefoundReqResponseSchema, RefoundReqUpdateState, StateReq, StateReqSchema } from "../validators/refoundreq";
import api from "./index";
import { z } from "zod";

export async function getStates(): Promise<StateReq[]> {
  const res = await api.get<{ states: StateReq[] }>("/states");
  return z.array(StateReqSchema).parse(res.data.states);
}

export async function getCategories(): Promise<CategoryReq[]> {
  const res = await api.get<{ categories: CategoryReq[] }>("/categories");
  return z.array(CategoryReqSchema).parse(res.data.categories);
}

export async function getRefounds(filters?: RefoundReqFilters): Promise<RefoundReqResponse[]> {
  const res = await api.get<{ refounds: RefoundReqResponse[] }>("/refound", {
    params: filters,
  });
  return z.array(RefoundReqResponseSchema).parse(res.data.refounds);
}

export async function createRefound(data: RefoundReqCreate): Promise<RefoundReqResponse> {
  const res = await api.post<RefoundReqResponse>("/refound", data);
  return RefoundReqResponseSchema.parse(res.data);
}

export async function updateRefoundState(id: number, data: RefoundReqUpdateState): Promise<RefoundReqResponse> {
  const res = await api.put<RefoundReqResponse>(`/refound/${id}`, data);
  return RefoundReqResponseSchema.parse(res.data);
}

export async function getRefoundById(id: number): Promise<RefoundReqResponse> {
  const res = await api.get<RefoundReqResponse>(`/refound/${id}`);
  return RefoundReqResponseSchema.parse(res.data);
}