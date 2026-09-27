import React, { useState } from 'react';
import { GoogleSheetConfig, StudentProfile } from '../types';
import { AppStorage } from '../services/storage';
import {
  Settings,
  Cloud,
  Download,
  Upload,
  RotateCcw,
  CheckCircle2,
  ExternalLink,
  Database,
  RefreshCw,
  FileSpreadsheet,
  AlertTriangle,
  Layers,
  Save,
} from 'lucide-react';

interface SettingsAndSheetsViewProps {
  sheetConfig: GoogleSheetConfig;
  onSaveSheetConfig: (config: GoogleSheetConfig) => void;
  onSyncGoogleSheet: () => void;
  isSyncing: boolean;
  onResetAllData: () => void;
  onReloadAllData: () => void;
  onResetToCleanState?: () => void;
  onLoadSampleData?: () => void;
}

export const SettingsAndSheetsView: React.FC<SettingsAndSheetsViewProps> = ({
  sheetConfig,
  onSaveSheetConfig,
  onSyncGoogleSheet,
  isSyncing,
  onResetAllData,
  onReloadAllData,
  onResetToCleanState,
  onLoadSampleData,
}) => {
  const [spreadsheetId, setSpreadsheetId] = useState(sheetConfig.spreadsheetId);
  const [webAppUrl, setWebAppUrl] = useState(sheetConfig.webAppUrl);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [confirmCleanReset, setConfirmCleanReset] = useState(false);
  const [confirmSampleLoad, setConfirmSampleLoad] = useState(false);

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSheetConfig({
      ...sheetConfig,
      spreadsheetId: spreadsheetId.trim(),
      webAppUrl: webAppUrl.trim(),
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleExportBackup = () => {
    const jsonStr = AppStorage.exportFullBackup();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ru_study_hub_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const ok = AppStorage.importFullBackup(content);
        if (ok) {
          alert('นำเข้าข้อมูลสำรองสำเร็จแล้ว! กำลังรีเฟรชระบบ');
          onReloadAllData();
        } else {
          alert('ไฟล์ข้อมูลไม่ถูกต้อง กรุณาตรวจสอบไฟล์ .json');
        }
      }
    };
    reader.readAsText(file);
  };

  const databaseTables = [
    'STUDENT',
    'CURRICULUM',
    'SUBJECTS',
    'REGISTRATION',
    'SEMESTERS',
    'SCHEDULE',
    'EXAMS',
    'SCORES',
    'GRADES',
    'ASSIGNMENTS',
    'STUDY_PLAN',
    'STUDY_LOG',
    'CALENDAR',
    'EXPENSES',
    'DOCUMENTS',
    'NOTIFICATIONS',
    'GOALS',
    'SETTINGS',
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Settings className="w-6 h-6 text-amber-500" />
            <span>⚙️ ตั้งค่าระบบ & 🗄️ เชื่อมต่อ Google Sheets</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            กำหนดค่าการเชื่อมต่อ Google Sheets Web App สำหรับบันทึกข้อมูล และการสำรองข้อมูลในเครื่อง
          </p>
        </div>
      </div>

      {/* Google Sheets Config Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-emerald-500" />
            <h2 className="font-bold text-base text-slate-900 dark:text-white">
              การเชื่อมต่อ Google Sheets Database
            </h2>
          </div>

          {spreadsheetId && (
            <a
              href={`https://docs.google.com/spreadsheets/d/${spreadsheetId}`}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
            >
              <span>เปิดชีทใน Google Sheets</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>

        <form onSubmit={handleSaveConfig} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Google Spreadsheet ID *
            </label>
            <input
              type="text"
              required
              value={spreadsheetId}
              onChange={(e) => setSpreadsheetId(e.target.value)}
              placeholder="1JnCpycaqtRqkpcPnPcMB4x-7dwoA1HEmC-7pKxKUqj8"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono font-bold text-slate-900 dark:text-white"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              ID ของ Google Sheet ที่แชร์ให้สิทธิ์แก้ไขหรือเข้าถึง
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Google Apps Script Web App URL *
            </label>
            <input
              type="url"
              required
              value={webAppUrl}
              onChange={(e) => setWebAppUrl(e.target.value)}
              placeholder="https://script.google.com/macros/s/.../exec"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono text-slate-900 dark:text-white"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Endpoint ของ Web App สำหรับส่งและรับข้อมูลโครงสร้างฐานข้อมูล
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-md transition"
            >
              <Save className="w-4 h-4" />
              <span>บันทึกการตั้งค่า Google Sheets</span>
            </button>

            <button
              type="button"
              onClick={onSyncGoogleSheet}
              disabled={isSyncing}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition"
            >
              {isSyncing ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Cloud className="w-4 h-4" />
              )}
              <span>{isSyncing ? 'กำลังซิงค์...' : 'ซิงค์ข้อมูลขึ้น Google Sheet ทันที'}</span>
            </button>
          </div>

          {savedSuccess && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>บันทึกการตั้งค่าการเชื่อมต่อเรียบร้อยแล้ว</span>
            </div>
          )}
        </form>
      </div>

      {/* Database Schema Tree Display (as requested in brief) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
        <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
          <Database className="w-5 h-5 text-indigo-500" />
          <span>โครงสร้างชีทฐานข้อมูล (18 แผ่นงานที่รองรับ)</span>
        </h3>

        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 font-mono text-xs">
          <div className="font-bold text-slate-900 dark:text-white mb-2">📊 RU DATABASE STRUCTURE:</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {databaseTables.map((t) => (
              <div
                key={t}
                className="flex items-center gap-1.5 p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
              >
                <span className="text-amber-500 font-bold">├──</span>
                <span>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Backup, Import, and Reset */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-5">
        <h3 className="font-bold text-base text-slate-900 dark:text-white">
          สำรองข้อมูล & รีเซ็ตระบบ (Offline Backup & Reset)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Export */}
          <button
            onClick={handleExportBackup}
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-left transition space-y-2 group"
          >
            <Download className="w-5 h-5 text-blue-500" />
            <div className="font-bold text-xs text-slate-900 dark:text-white">
              ส่งออกข้อมูล (Export JSON)
            </div>
            <p className="text-[11px] text-slate-400 leading-tight">
              ดาวน์โหลดไฟล์สำรองข้อมูลทั้งหมดในเครื่องเก็บไว้แบบออฟไลน์
            </p>
          </button>

          {/* Import */}
          <label className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-left transition space-y-2 group cursor-pointer block">
            <Upload className="w-5 h-5 text-emerald-500" />
            <div className="font-bold text-xs text-slate-900 dark:text-white">
              นำเข้าข้อมูล (Import JSON)
            </div>
            <p className="text-[11px] text-slate-400 leading-tight">
              กู้คืนข้อมูลจากไฟล์สำรอง .json ที่เคยส่งออกไว้
            </p>
            <input
              type="file"
              accept=".json"
              onChange={handleImportBackup}
              className="hidden"
            />
          </label>

          {/* Reset Clean Slate */}
          {confirmCleanReset ? (
            <div className="p-4 rounded-xl border border-rose-300 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/30 text-left space-y-2">
              <div className="font-bold text-xs text-rose-600 dark:text-rose-400">
                ⚠️ ยืนยันล้างข้อมูลทั้งหมดให้เป็นค่าว่าง?
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                ข้อมูลวิชา ตารางเรียน และตารางสอบทั้งหมดจะถูกลบออกเพื่อเริ่มกรอกใหม่
              </p>
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    if (onResetToCleanState) {
                      onResetToCleanState();
                    } else {
                      onResetAllData();
                    }
                    setConfirmCleanReset(false);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition cursor-pointer"
                >
                  ยืนยันล้างข้อมูล
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmCleanReset(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs transition cursor-pointer"
                >
                  ยกเลิก
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setConfirmCleanReset(true)}
              className="p-4 rounded-xl border border-rose-200 dark:border-rose-900/40 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-left transition space-y-2 group cursor-pointer"
            >
              <RotateCcw className="w-5 h-5 text-rose-500" />
              <div className="font-bold text-xs text-rose-600 dark:text-rose-400">
                🧹 ล้างข้อมูลเป็นค่าว่าง (Clean Slate)
              </div>
              <p className="text-[11px] text-slate-400 leading-tight">
                ล้างวิชาและข้อมูลทั้งหมดออก เพื่อเริ่มต้นกรอกข้อมูลของคุณเองตอนนี้
              </p>
            </button>
          )}
        </div>

        {onLoadSampleData && (
          <div className="pt-2 flex justify-end">
            {confirmSampleLoad ? (
              <div className="flex items-center gap-2 p-2 rounded-xl bg-amber-500/10 border border-amber-500/30">
                <span className="text-xs text-amber-500 font-medium">โหลดชุดข้อมูลตัวอย่าง ม.รามคำแหง?</span>
                <button
                  type="button"
                  onClick={() => {
                    onLoadSampleData();
                    setConfirmSampleLoad(false);
                  }}
                  className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition cursor-pointer"
                >
                  โหลดข้อมูลตัวอย่าง
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmSampleLoad(false)}
                  className="px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs transition cursor-pointer"
                >
                  ยกเลิก
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmSampleLoad(true)}
                className="text-xs text-slate-500 hover:text-amber-500 flex items-center gap-1.5 transition cursor-pointer"
              >
                <span>🔄 ต้องการโหลดชุดข้อมูลตัวอย่างเพื่อดูเป็นแนวทาง</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
