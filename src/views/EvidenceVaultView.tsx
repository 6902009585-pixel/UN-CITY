import React, { useState } from 'react';
import { EvidenceDocument, EvidenceCategory } from '../types';
import {
  Camera,
  FolderArchive,
  Upload,
  Plus,
  Trash2,
  Eye,
  Download,
  Calendar,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  Filter,
} from 'lucide-react';

interface EvidenceVaultViewProps {
  evidence: EvidenceDocument[];
  onAddEvidence: (doc: EvidenceDocument) => void;
  onDeleteEvidence: (id: string) => void;
}

export const EvidenceVaultView: React.FC<EvidenceVaultViewProps> = ({
  evidence,
  onAddEvidence,
  onDeleteEvidence,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<EvidenceDocument | null>(null);

  // Upload modal form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<EvidenceCategory>('receipt');
  const [semester, setSemester] = useState('1/2569');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [fileData, setFileData] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');

  const categoriesConfig: { id: EvidenceCategory; name: string; icon: string }[] = [
    { id: 'receipt', name: '🧾 ใบเสร็จลงทะเบียน', icon: '🧾' },
    { id: 'student_card', name: '🪪 บัตรนักศึกษา', icon: '🪪' },
    { id: 'exam_slip', name: '📝 ตารางสอบ/ใบแจ้งสอบ', icon: '📝' },
    { id: 'transcript', name: '📊 ผลสอบ/ใบเช็คเกรด', icon: '📊' },
    { id: 'uni_doc', name: '🏛️ เอกสารมหาวิทยาลัย', icon: '🏛️' },
    { id: 'payment_slip', name: '💳 หลักฐานการชำระเงิน', icon: '💳' },
    { id: 'notes', name: '📑 ชีทสรุป/แนวข้อสอบ', icon: '📑' },
  ];

  const filteredEvidence = evidence.filter((doc) => {
    if (selectedCategory !== 'all' && doc.category !== selectedCategory) return false;
    return true;
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setFileSize(`${(file.size / 1024).toFixed(1)} KB`);

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setFileData(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !fileData) {
      alert('กรุณากรอกชื่อเอกสารและเลือกไฟล์รูปภาพ/เอกสาร');
      return;
    }
    const newDoc: EvidenceDocument = {
      id: `ev-${Date.now()}`,
      title: title.trim(),
      category,
      semester,
      date,
      fileData,
      fileName,
      fileSize,
      notes,
    };
    onAddEvidence(newDoc);
    setIsUploadModalOpen(false);
    setTitle('');
    setFileData('');
    setFileName('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Camera className="w-6 h-6 text-amber-500" />
            <span>📸 คลังหลักฐาน & เอกสารสำคัญ (Evidence & Docs Vault)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            จัดเก็บรูปภาพใบเสร็จลงทะเบียน บัตรนักศึกษา ตารางสอบ ผลสอบ และชีทสรุป
          </p>
        </div>

        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-md transition"
        >
          <Upload className="w-4 h-4" />
          <span>อัปโหลดรูป/หลักฐาน</span>
        </button>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex overflow-x-auto gap-2 pb-2 text-xs">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1.5 rounded-xl font-semibold shrink-0 transition ${
            selectedCategory === 'all'
              ? 'bg-amber-400 text-slate-950 shadow'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
          }`}
        >
          ทั้งหมด ({evidence.length})
        </button>

        {categoriesConfig.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-xl font-semibold shrink-0 transition ${
              selectedCategory === cat.id
                ? 'bg-amber-400 text-slate-950 shadow'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            {cat.name} ({evidence.filter((e) => e.category === cat.id).length})
          </button>
        ))}
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredEvidence.map((doc) => (
          <div
            key={doc.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs flex flex-col group"
          >
            {/* Image Preview Thumbnail */}
            <div
              onClick={() => setPreviewDoc(doc)}
              className="h-44 w-full bg-slate-100 dark:bg-slate-800 relative cursor-pointer overflow-hidden flex items-center justify-center"
            >
              {doc.fileData.startsWith('data:image') || doc.fileData.startsWith('http') ? (
                <img
                  src={doc.fileData}
                  alt={doc.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
              ) : (
                <FileText className="w-12 h-12 text-slate-400" />
              )}
              <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2 text-white">
                <Eye className="w-5 h-5" />
                <span className="text-xs font-bold">ดูภาพขยาย</span>
              </div>
            </div>

            {/* Info */}
            <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
              <div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                  <span>ภาค {doc.semester}</span>
                  <span>{doc.date}</span>
                </div>
                <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white line-clamp-1">
                  {doc.title}
                </h3>
                {doc.notes && (
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">{doc.notes}</p>
                )}
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 truncate max-w-[120px]">
                  {doc.fileName || doc.fileSize || 'รูปถ่ายหลักฐาน'}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPreviewDoc(doc)}
                    className="p-1.5 text-slate-400 hover:text-amber-500 rounded"
                    title="เปิดดู"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteEvidence(doc.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-500 rounded"
                    title="ลบ"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredEvidence.length === 0 && (
        <div className="p-12 text-center text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
          ไม่พบรูปภาพหรือหลักฐานในหมวดหมู่นี้
        </div>
      )}

      {/* Lightbox Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-3xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  {previewDoc.title}
                </h3>
                <span className="text-xs text-slate-400">
                  ภาค {previewDoc.semester} • {previewDoc.date}
                </span>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕ ปิดหน้าต่าง
              </button>
            </div>

            <div className="flex-1 overflow-auto flex items-center justify-center bg-slate-950/50 rounded-xl p-2 min-h-[300px]">
              <img
                src={previewDoc.fileData}
                alt={previewDoc.title}
                className="max-h-[60vh] max-w-full object-contain rounded-lg"
              />
            </div>

            {previewDoc.notes && (
              <p className="text-xs text-slate-600 dark:text-slate-300">
                หมายเหตุ: {previewDoc.notes}
              </p>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <a
                href={previewDoc.fileData}
                download={previewDoc.fileName || 'ru_evidence.jpg'}
                className="px-4 py-2 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow"
              >
                <Download className="w-3.5 h-3.5" />
                <span>ดาวน์โหลดภาพ</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              อัปโหลดหลักฐาน / เอกสาร ม.รามคำแหง
            </h3>

            <form onSubmit={handleSaveDoc} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  ชื่อเอกสาร/รูปภาพ *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="เช่น ใบเสร็จลงทะเบียน 1/69 หรือ บัตรนักศึกษา"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-white dark:bg-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    ประเภทหลักฐาน *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as EvidenceCategory)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-white dark:bg-slate-800"
                  >
                    <option value="receipt">ใบเสร็จลงทะเบียน</option>
                    <option value="student_card">บัตรนักศึกษา</option>
                    <option value="exam_slip">ตารางสอบ/ใบแจ้งสอบ</option>
                    <option value="transcript">ผลสอบ/ใบเช็คเกรด</option>
                    <option value="uni_doc">เอกสารมหาวิทยาลัย</option>
                    <option value="payment_slip">หลักฐานการชำระเงิน</option>
                    <option value="notes">ชีทสรุป/แนวข้อสอบ</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    ภาคเรียน *
                  </label>
                  <input
                    type="text"
                    required
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    placeholder="1/2569"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-white dark:bg-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  เลือกไฟล์รูปภาพ / เอกสาร *
                </label>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  required
                  onChange={handleFileUpload}
                  className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-amber-400 file:text-slate-950 hover:file:bg-amber-300 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  หมายเหตุ
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="เช่น ยอดชำระ 1,150 บ. หรือ เลขที่ใบเสร็จ"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-white dark:bg-slate-800"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs shadow"
                >
                  บันทึกลงคลัง
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
