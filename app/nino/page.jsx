"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AppShell from "../app-shell/AppShell";
import { getChildren, createChild } from "../../lib/tracker-api";
import styles from "./nino.module.css";

export default function NinoPage() {
  const router = useRouter();
  const [email, setEmail] = useState(null);
  const [children, setChildren] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const e = sessionStorage.getItem("qk_email");
    if (!e) { router.replace("/login"); return; }
    setEmail(e);
    getChildren(e).then(c => setChildren(c || []));
  }, [router]);

  async function handleAdd(ev) {
    ev.preventDefault();
    if (!name.trim() || !age) return;
    setSaving(true);
    setError(null);
    try {
      const child = await createChild(email, name.trim(), parseInt(age, 10));
      setChildren(prev => [...prev, child]);
      setName(""); setAge(""); setShowForm(false);
    } catch (e) {
      setError("No se pudo guardar. Intenta de nuevo.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AppShell>
      <div className={styles.page}>
        <h1 className={styles.heading}>Mis hijos</h1>
        <p className={styles.sub}>Los perfiles se comparten entre NeuroEsencia y Buenas Noches.</p>

        {children.map(child => (
          <div key={child.id} className={styles.childCard}>
            <div className={styles.avatar}>{child.name[0].toUpperCase()}</div>
            <div className={styles.info}>
              <p className={styles.childName}>{child.name}</p>
              <p className={styles.childAge}>{child.age_years} años</p>
            </div>
            <div className={styles.links}>
              <Link href="/neuroesencia/progreso" className={styles.link}>NE →</Link>
              <Link href="/buenas-noches" className={styles.link}>BN →</Link>
            </div>
          </div>
        ))}

        {!showForm && (
          <button className={styles.addBtn} onClick={() => setShowForm(true)}>
            + Agregar hijo
          </button>
        )}

        {showForm && (
          <form className={styles.form} onSubmit={handleAdd}>
            <p className={styles.formTitle}>Nuevo perfil</p>
            <input
              className={styles.input}
              placeholder="Nombre"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
            <input
              className={styles.input}
              type="number"
              placeholder="Edad (años)"
              min={0}
              max={18}
              value={age}
              onChange={e => setAge(e.target.value)}
              required
            />
            {error && <p className={styles.error}>{error}</p>}
            <div className={styles.formBtns}>
              <button type="button" className={styles.cancelBtn} onClick={() => setShowForm(false)}>
                Cancelar
              </button>
              <button type="submit" className={styles.saveBtn} disabled={saving}>
                {saving ? "Guardando…" : "Guardar"}
              </button>
            </div>
          </form>
        )}
      </div>
    </AppShell>
  );
}
