// app/(protected)/dashboard/page.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  RefoundReqCreate,
  RefoundReqFilters,
  RefoundReqResponse,
  RefoundReqUpdateState,
  StateReq,
} from "@/lib/validators/refoundreq";
import {
  createRefound,
  deleteRefound,
  getRefounds,
  getStates,
  updateRefound,
  updateRefoundState,
} from "@/lib/axios/refounds";
import Table from "@/app/components/table";
import RefoundFiltersForm from "@/app/components/forms/filter-form";
import Modal, { ModalHandle } from "@/app/components/modal";
import StateLegend from "@/app/components/state-legend";
import { STATE_CONFIG, StateId } from "@/lib/config/states";
import { useSessionStore } from "@/lib/store/session-store";
import RefoundUpdateStateForm from "@/app/components/forms/deny-form";
import RefoundCreateForm from "@/app/components/forms/refound-form";
import { getCategories } from "@/lib/axios/refounds";
import { CategoryReq } from "@/lib/validators/refoundreq";

function StatoBadge({ stato }: { stato: string }) {
  const config = STATE_CONFIG[stato as StateId];
  if (!config) return <span>{stato}</span>;
  const Icon = config.icon;
  return <Icon className={config.className} />;
}

export default function DashboardPage() {
  const [filters, setFilters] = useState<RefoundReqFilters>({});
  const [refounds, setRefounds] = useState<RefoundReqResponse[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const router = useRouter();
  const denyModalRef = useRef<ModalHandle>(null);
  const createModalRef = useRef<ModalHandle>(null);
  const role = useSessionStore((s) => s.user?.role);
  const [editingRefound, setEditingRefound] =
    useState<RefoundReqResponse | null>(null);
  const [categories, setCategories] = useState<CategoryReq[]>([]);

  const [states, setStates] = useState<StateReq[]>([]);

  useEffect(() => {
    getCategories().then(setCategories).catch(console.error);
    getStates().then(setStates).catch(console.error);
  }, []);

  useEffect(() => {
    getRefounds(filters).then(setRefounds);
  }, [filters]);

  async function handleStateUpdate(id: number, data: RefoundReqUpdateState) {
    const updated = await updateRefoundState(id, data);
    setRefounds((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
  }

  async function handleApprova(r: RefoundReqResponse) {
    await handleStateUpdate(r.id, { state: "ACCETTATO" });
  }

  async function handleLiquida(r: RefoundReqResponse) {
    await handleStateUpdate(r.id, { state: "PAGATO" });
  }

  function handleRifiutaClick(r: RefoundReqResponse) {
    setSelectedId(r.id);
    denyModalRef.current?.open();
  }

  async function onRifiutaSubmit(data: RefoundReqUpdateState) {
    if (!selectedId) return;
    await handleStateUpdate(selectedId, { ...data, state: "RIFIUTATO" });
    denyModalRef.current?.close();
    setSelectedId(null);
  }

  async function onCreateSubmit(data: RefoundReqCreate) {
    const created = await createRefound(data);
    setRefounds((prev) => [created, ...prev]);
    createModalRef.current?.close();
  }

  async function onEditSubmit(data: RefoundReqCreate) {
    if (!editingRefound) return;

    const updated = await updateRefound(editingRefound.id, data);

    setRefounds((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));

    createModalRef.current?.close();
    setEditingRefound(null);
  }

  function handleEditClick(r: RefoundReqResponse) {
    setEditingRefound(r);
    createModalRef.current?.open();
  }

  // async function handleDelete(r: RefoundReqResponse) {
  //   await deleteRefound(r.id);
  //   setRefounds((prev) => prev.filter((item) => item.id !== r.id));
  // }

  async function handleDelete(r: RefoundReqResponse) {
    const confirmed = window.confirm(
      "Sei sicuro di voler eliminare questa richiesta?",
    );

    if (!confirmed) return;

    await deleteRefound(r.id);

    setRefounds((prev) => prev.filter((item) => item.id !== r.id));
  }

  const actionColumn =
    role === "ADMIN"
      ? [
          {
            header: "Azioni",
            render: (r: RefoundReqResponse) => {
              const Approva = STATE_CONFIG["ACCETTATO"].icon;
              const Rifiuta = STATE_CONFIG["RIFIUTATO"].icon;
              const Liquida = STATE_CONFIG["PAGATO"].icon;

              return (
                <div
                  className="flex gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  {r.state === "ATTESA" && (
                    <>
                      <button
                        className="btn btn-ghost btn-xs"
                        onClick={() => handleApprova(r)}
                        title="Approva"
                      >
                        <Approva
                          size={16}
                          className={STATE_CONFIG["ACCETTATO"].className}
                        />
                      </button>
                      <button
                        className="btn btn-ghost btn-xs"
                        onClick={() => handleRifiutaClick(r)}
                        title="Rifiuta"
                      >
                        <Rifiuta
                          size={16}
                          className={STATE_CONFIG["RIFIUTATO"].className}
                        />
                      </button>
                    </>
                  )}
                  {r.state === "ACCETTATO" && (
                    <button
                      className="btn btn-ghost btn-xs"
                      onClick={() => handleLiquida(r)}
                      title="Liquida"
                    >
                      <Liquida
                        size={16}
                        className={STATE_CONFIG["PAGATO"].className}
                      />
                    </button>
                  )}
                </div>
              );
            },
          },
        ]
      : [];

  const actionColumnUser =
    role === "USER"
      ? [
          {
            header: "Azioni",
            render: (r: RefoundReqResponse) => {
              return (
                <div
                  className="flex justify-start items-start w-[12.5]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    className="btn btn-primary btn-sm ml-auto"
                    onClick={() => handleEditClick(r)}
                  >
                    Modifica
                  </button>
                </div>
              );
            },
          },
        ]
      : [];

  const actionColumnUserDelete =
    role === "USER"
      ? [
          {
            header: "Cancella",
            render: (r: RefoundReqResponse) => {
              return (
                <div
                  className="flex justify-start items-start w-[12.5]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    className="btn btn-primary btn-sm ml-auto"
                    onClick={() => handleDelete(r)}
                  >
                    Delete
                  </button>
                </div>
              );
            },
          },
        ]
      : [];

  const columns = [
    {
      header: "Dipendente",
      render: (r: RefoundReqResponse) =>
        `${r.user.firstName} ${r.user.lastName}`,
    },
    { header: "Categoria", render: (r: RefoundReqResponse) => r.category },
    { header: "Importo", render: (r: RefoundReqResponse) => `${r.import} €` },
    {
      header: "Descrizione",
      render: (r: RefoundReqResponse) => r.description ?? "-",
    },
    {
      header: "Stato",
      render: (r: RefoundReqResponse) => <StatoBadge stato={r.state} />,
    },
    {
      header: "Data spesa",
      render: (r: RefoundReqResponse) =>
        new Date(r.expenseDate).toLocaleDateString("it-IT"),
    },
    ...actionColumn,
    ...actionColumnUser,
    ...actionColumnUserDelete,
  ];

  return (
    <div className="ml-5 flex flex-col gap-4">
      <div className="flex flex-row items-center gap-5">
        <h1>Rimborso spese</h1>
        <StateLegend />
        {role === "USER" && (
          <button
            className="btn btn-primary btn-sm ml-auto"
            onClick={() => {
              setEditingRefound(null);
              createModalRef.current?.open();
            }}
          >
            Nuova richiesta
          </button>
        )}
      </div>

      <div className="flex flex-row gap-4">
        <RefoundFiltersForm
          onSubmit={setFilters}
          onReset={() => setFilters({})}
          categories={categories}
          states={states}
        />
        <Table
          maxHeight="80vh"
          data={refounds}
          columns={columns}
          keyExtractor={(r) => r.id}
          onRowClick={(r) => router.push(`/dashboard/${r.id}`)}
        />
      </div>

      <Modal ref={denyModalRef} title="Rifiuta richiesta">
        <RefoundUpdateStateForm
          onSubmit={onRifiutaSubmit}
          onCancel={() => {
            denyModalRef.current?.close();
            setSelectedId(null);
          }}
        />
      </Modal>

      <Modal
        ref={createModalRef}
        title={
          editingRefound ? "Modifica richiesta" : "Nuova richiesta di rimborso"
        }
      >
        <RefoundCreateForm
          key={editingRefound?.id ?? "new"}
          categories={categories}
          initialData={editingRefound ?? undefined}
          onSubmit={editingRefound ? onEditSubmit : onCreateSubmit}
          onCancel={() => {
            createModalRef.current?.close();
            setEditingRefound(null);
          }}
        />
      </Modal>
    </div>
  );
}
