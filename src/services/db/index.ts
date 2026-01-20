import Dexie, { Table } from "dexie";

export interface HistoryRecord {
  id?: number;
  calculatorType: string;
  expression: string;
  result: string;
  timestamp: number;
  isFavorite: boolean;
}

export interface VariableRecord {
  id?: number;
  name: string;
  value: number;
  description?: string;
  createdAt: number;
}

export interface ThemeCustomization {
  id?: number;
  name: string;
  colors: {
    background: string;
    foreground: string;
    primary: string;
    accent: string;
    card: string;
  };
  createdAt: number;
}

export interface UserPreference {
  key: string;
  value: string | number | boolean | object;
}

class GlassCalcDB extends Dexie {
  history!: Table<HistoryRecord>;
  variables!: Table<VariableRecord>;
  themes!: Table<ThemeCustomization>;
  preferences!: Table<UserPreference>;

  constructor() {
    super("GlassCalcDB");

    this.version(1).stores({
      history: "++id, calculatorType, timestamp, isFavorite",
      variables: "++id, name, createdAt",
      themes: "++id, name, createdAt",
      preferences: "key",
    });
  }
}

export const db = new GlassCalcDB();

// History operations
export async function addHistory(record: Omit<HistoryRecord, "id">) {
  return db.history.add(record);
}

export async function getHistory(
  calculatorType?: string,
  limit: number = 100
) {
  let query = db.history.orderBy("timestamp").reverse();

  if (calculatorType) {
    query = db.history
      .where("calculatorType")
      .equals(calculatorType)
      .reverse();
  }

  return query.limit(limit).toArray();
}

export async function clearHistory(calculatorType?: string) {
  if (calculatorType) {
    return db.history.where("calculatorType").equals(calculatorType).delete();
  }
  return db.history.clear();
}

export async function toggleFavorite(id: number) {
  const record = await db.history.get(id);
  if (record) {
    return db.history.update(id, { isFavorite: !record.isFavorite });
  }
}

export async function getFavorites() {
  return db.history.where("isFavorite").equals(1).toArray();
}

// Variable operations
export async function saveVariable(variable: Omit<VariableRecord, "id">) {
  const existing = await db.variables.where("name").equals(variable.name).first();
  if (existing) {
    return db.variables.update(existing.id!, variable);
  }
  return db.variables.add(variable);
}

export async function getVariables() {
  return db.variables.orderBy("name").toArray();
}

export async function deleteVariable(name: string) {
  return db.variables.where("name").equals(name).delete();
}

// Custom theme operations
export async function saveCustomTheme(theme: Omit<ThemeCustomization, "id">) {
  return db.themes.add(theme);
}

export async function getCustomThemes() {
  return db.themes.orderBy("createdAt").toArray();
}

export async function deleteCustomTheme(id: number) {
  return db.themes.delete(id);
}

// Preferences operations
export async function setPreference(key: string, value: UserPreference["value"]) {
  return db.preferences.put({ key, value });
}

export async function getPreference(key: string) {
  const pref = await db.preferences.get(key);
  return pref?.value;
}

export async function getAllPreferences() {
  return db.preferences.toArray();
}
