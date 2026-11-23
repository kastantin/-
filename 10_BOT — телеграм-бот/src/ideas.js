// Хранение идей: ideas.jsonl — для бота, ideas.csv — открыть в Excel.
import { access, appendFile, mkdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const JSONL_FILE = 'ideas.jsonl';
const CSV_FILE = 'ideas.csv';
const CSV_COLUMNS = ['date', 'episode', 'username', 'name', 'userId', 'text'];
const CSV_HEADER = 'Дата;Серия;Ник;Имя;ID;Идея';
const BOM = '﻿';
// Ячейка, начинающаяся с этих символов, в Excel станет формулой — экранируем.
const FORMULA_START = /^[=+\-@\t\r]/;

export function csvEscape(value) {
  const raw = String(value ?? '');
  const safe = FORMULA_START.test(raw) ? `'${raw}` : raw;
  return /[";\r\n]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
}

export function toCsvRow(idea) {
  return CSV_COLUMNS.map((column) => csvEscape(idea[column])).join(';');
}

async function fileExists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch (err) {
    if (err.code === 'ENOENT') return false;
    throw err;
  }
}

export async function saveIdea(dataDir, idea) {
  await mkdir(dataDir, { recursive: true });
  await appendFile(path.join(dataDir, JSONL_FILE), `${JSON.stringify(idea)}\n`, 'utf8');

  const csvPath = path.join(dataDir, CSV_FILE);
  const header = (await fileExists(csvPath)) ? '' : `${BOM}${CSV_HEADER}\r\n`;
  await appendFile(csvPath, `${header}${toCsvRow(idea)}\r\n`, 'utf8');
}

// Заявки на сотрудничество — резервная копия на случай, если пересылка владельцу не дошла.
const COLLABS_FILE = 'collabs.jsonl';

export async function saveCollab(dataDir, collab) {
  await mkdir(dataDir, { recursive: true });
  await appendFile(path.join(dataDir, COLLABS_FILE), `${JSON.stringify(collab)}\n`, 'utf8');
}

export async function readLastIdeas(dataDir, limit, onBadLine = () => {}) {
  let raw;
  try {
    raw = await readFile(path.join(dataDir, JSONL_FILE), 'utf8');
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    throw err;
  }
  return raw
    .split('\n')
    .filter((line) => line.trim() !== '')
    .slice(-limit)
    .flatMap((line) => {
      try {
        return [JSON.parse(line)];
      } catch (err) {
        onBadLine(line, err);
        return [];
      }
    });
}
