"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Heart,
  Star,
  AlertTriangle,
  Users,
  Calendar,
  Clock,
  MapPin,
  FileText,
  Camera,
  Save,
  X,
  CheckCircle,
  Info,
} from "lucide-react";
import { toast } from "react-hot-toast";
import {
  BehaviorRecord,
  BehaviorCategory,
  BehaviorType,
  BehaviorSeverity,
  BehaviorStatus,
  BEHAVIOR_CRITERIA,
  getBehaviorCategoryColor,
  getBehaviorCategoryText,
  getBehaviorTypeColor,
  getBehaviorTypeText,
  getBehaviorSeverityColor,
  getBehaviorSeverityText,
} from "@/lib/behavior-data";

interface BehaviorAssessmentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (behaviorData: Partial<BehaviorRecord>) => void;
  editData?: BehaviorRecord | null;
}

export default function BehaviorAssessmentForm({
  isOpen,
  onClose,
  onSave,
  editData,
}: BehaviorAssessmentFormProps) {
  const [formData, setFormData] = useState<Partial<BehaviorRecord>>({
    santriId: editData?.santriId || "",
    santriName: editData?.santriName || "",
    santriNis: editData?.santriNis || "",
    halaqahId: editData?.halaqahId || "",
    halaqahName: editData?.halaqahName || "",
    criteriaId: editData?.criteriaId || "",
    criteriaName: editData?.criteriaName || "",
    category: editData?.category || "AKHLAQ",
    type: editData?.type || "POSITIVE",
    severity: editData?.severity || "LOW",
    points: editData?.points || 0,
    date: editData?.date || new Date().toISOString().split("T")[0],
    time:
      editData?.time || new Date().toTimeString().split(" ")[0].substring(0, 5),
    description: editData?.description || "",
    context: editData?.context || "",
    location: editData?.location || "",
    status: editData?.status || "ACTIVE",
    followUpRequired: editData?.followUpRequired || false,
    followUpDate: editData?.followUpDate || "",
    followUpNotes: editData?.followUpNotes || "",
    parentNotified: editData?.parentNotified || false,
    metadata: {
      mood: editData?.metadata?.mood || "CALM",
      energy: editData?.metadata?.energy || "MEDIUM",
      participation: editData?.metadata?.participation || "ACTIVE",
      socialInteraction: editData?.metadata?.socialInteraction || "POSITIVE",
    },
  });

  const [selectedCriteria, setSelectedCriteria] = useState(
    editData
      ? BEHAVIOR_CRITERIA.find((c) => c.id === editData.criteriaId)
      : null,
  );

  // Real data for santri and halaqah
  const [santriList, setSantriList] = useState<any[]>([]);
  const [halaqahList, setHalaqahList] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Load real data from API
  useEffect(() => {
    if (isOpen) {
      console.log("?? Modal opened, loading data...");
      loadRealData();
    }
  }, [isOpen]);

  const loadRealData = async () => {
    try {
      setLoadingData(true);
      console.log("?? Loading santri and halaqah data...");

      // Load santri data with timeout
      console.log("?? Fetching santri data from /api/santri");
      const santriController = new AbortController();
      const santriTimeout = setTimeout(() => santriController.abort(), 10000); // 10 second timeout

      const santriResponse = await fetch("/api/santri", {
        signal: santriController.signal,
        headers: {
          "Content-Type": "application/json",
        },
      });
      clearTimeout(santriTimeout);

      console.log(
        "?? Santri response status:",
        santriResponse.status,
        santriResponse.statusText,
      );

      if (!santriResponse.ok) {
        throw new Error(
          `Santri API error: ${santriResponse.status} ${santriResponse.statusText}`,
        );
      }

      const santriData = await santriResponse.json();
      console.log("?? Santri response data:", santriData);

      // Load halaqah data with timeout
      console.log("?? Fetching halaqah data from /api/halaqah");
      const halaqahController = new AbortController();
      const halaqahTimeout = setTimeout(() => halaqahController.abort(), 10000); // 10 second timeout

      const halaqahResponse = await fetch("/api/halaqah", {
        signal: halaqahController.signal,
        headers: {
          "Content-Type": "application/json",
        },
      });
      clearTimeout(halaqahTimeout);

      console.log(
        "?? Halaqah response status:",
        halaqahResponse.status,
        halaqahResponse.statusText,
      );

      if (!halaqahResponse.ok) {
        throw new Error(
          `Halaqah API error: ${halaqahResponse.status} ${halaqahResponse.statusText}`,
        );
      }

      const halaqahData = await halaqahResponse.json();
      console.log("?? Halaqah response data:", halaqahData);

      if (santriData.success && Array.isArray(santriData.santri)) {
        setSantriList(santriData.santri);
        console.log(
          "? Santri data loaded:",
          santriData.santri.length,
          "records",
        );
        console.log("?? Sample santri:", santriData.santri[0]);
      } else {
        console.error("? Failed to load santri data:", santriData);
        setSantriList([]);
        toast.error(
          "Gagal memuat data santri: " +
            (santriData.message || "Data tidak valid"),
        );
      }

      if (halaqahData.success && Array.isArray(halaqahData.halaqah)) {
        setHalaqahList(halaqahData.halaqah);
        console.log(
          "? Halaqah data loaded:",
          halaqahData.halaqah.length,
          "records",
        );
        console.log("?? Sample halaqah:", halaqahData.halaqah[0]);
      } else {
        console.error("? Failed to load halaqah data:", halaqahData);
        setHalaqahList([]);
        toast.error(
          "Gagal memuat data halaqah: " +
            (halaqahData.message || "Data tidak valid"),
        );
      }
    } catch (error) {
      console.error("? Error loading data:", error);
      toast.error(
        "Gagal memuat data santri dan halaqah: " +
          (error instanceof Error ? error.message : "Unknown error"),
      );
    } finally {
      setLoadingData(false);
    }
  };

  const handleSantriChange = (santriId: string) => {
    const santri = santriList.find((s) => s.id === santriId);
    if (santri) {
      const halaqah = halaqahList.find((h) => h.id === santri.halaqahId);
      setFormData((prev) => ({
        ...prev,
        santriId: santri.id,
        santriName: santri.name,
        santriNis: santri.nis,
        halaqahId: santri.halaqahId || "",
        halaqahName: halaqah?.name || "",
      }));
    }
  };

  const handleCriteriaChange = (criteriaId: string) => {
    const criteria = BEHAVIOR_CRITERIA.find((c) => c.id === criteriaId);
    if (criteria) {
      setSelectedCriteria(criteria);
      setFormData((prev) => ({
        ...prev,
        criteriaId: criteria.id,
        criteriaName: criteria.name,
        category: criteria.category,
        type: criteria.type,
        severity: criteria.severity,
        points: criteria.points,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.santriId || !formData.criteriaId || !formData.description) {
      toast.error("Mohon lengkapi semua field yang wajib diisi");
      return;
    }

    const behaviorData: Partial<BehaviorRecord> = {
      ...formData,
      recordedBy: "current_user_id", // Should be from auth context
      recordedByName: "Current User", // Should be from auth context
      recordedAt: new Date().toISOString(),
    };

    onSave(behaviorData);
    toast.success(
      editData
        ? "Catatan perilaku berhasil diperbarui!"
        : "Catatan perilaku berhasil disimpan!",
    );
    onClose();
  };

  const handleReset = () => {
    setFormData({
      santriId: "",
      santriName: "",
      santriNis: "",
      halaqahId: "",
      halaqahName: "",
      criteriaId: "",
      criteriaName: "",
      category: "AKHLAQ",
      type: "POSITIVE",
      severity: "LOW",
      points: 0,
      date: new Date().toISOString().split("T")[0],
      time: new Date().toTimeString().split(" ")[0].substring(0, 5),
      description: "",
      context: "",
      location: "",
      status: "ACTIVE",
      followUpRequired: false,
      followUpDate: "",
      followUpNotes: "",
      parentNotified: false,
      metadata: {
        mood: "CALM",
        energy: "MEDIUM",
        participation: "ACTIVE",
        socialInteraction: "POSITIVE",
      },
    });
    setSelectedCriteria(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <CardHeader className="border-b border-gray-200">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Heart className="h-5 w-5 text-teal-600" />
                <span>
                  {editData ? "Edit Catatan Perilaku" : "Catat Perilaku Santri"}
                </span>
              </CardTitle>
              <button
                type="button"
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Santri <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.santriId}
                  onChange={(e) => handleSantriChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                >
                  <option value="">Pilih Santri</option>
                  {loadingData ? (
                    <option disabled>Memuat data...</option>
                  ) : santriList.length === 0 ? (
                    <option disabled>Tidak ada data santri</option>
                  ) : (
                    santriList.map((santri) => (
                      <option key={santri.id} value={santri.id}>
                        {santri.name} ({santri.nis})
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kriteria Perilaku <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.criteriaId}
                  onChange={(e) => handleCriteriaChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                >
                  <option value="">Pilih Kriteria</option>
                  {BEHAVIOR_CRITERIA.map((criteria) => (
                    <option key={criteria.id} value={criteria.id}>
                      {criteria.name} ({criteria.nameArabic}) -{" "}
                      {criteria.points > 0 ? "+" : ""}
                      {criteria.points} poin
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Criteria Information */}
            {selectedCriteria && (
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-medium text-blue-900">
                        {selectedCriteria.name} ({selectedCriteria.nameArabic})
                      </h4>
                      <p className="text-sm text-blue-700 mt-1">
                        {selectedCriteria.description}
                      </p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getBehaviorCategoryColor(selectedCriteria.category)}`}
                        >
                          {getBehaviorCategoryText(selectedCriteria.category)}
                        </span>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getBehaviorTypeColor(selectedCriteria.type)}`}
                        >
                          {getBehaviorTypeText(selectedCriteria.type)}
                        </span>
                        <span className="text-sm font-medium text-blue-900">
                          {selectedCriteria.points > 0 ? "+" : ""}
                          {selectedCriteria.points} poin
                        </span>
                      </div>
                      {selectedCriteria.examples &&
                        selectedCriteria.examples.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs font-medium text-blue-800">
                              Contoh:
                            </p>
                            <ul className="text-xs text-blue-700 list-disc list-inside">
                              {selectedCriteria.examples
                                .slice(0, 3)
                                .map((example, index) => (
                                  <li key={index}>{example}</li>
                                ))}
                            </ul>
                          </div>
                        )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tanggal <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, date: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Waktu <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, time: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lokasi
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      location: e.target.value,
                    }))
                  }
                  placeholder="Ruang kelas, musholla, dll"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deskripsi Perilaku <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Jelaskan secara detail perilaku yang diamati..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                required
              />
            </div>

            {/* Context */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Konteks/Situasi
              </label>
              <textarea
                value={formData.context}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, context: e.target.value }))
                }
                placeholder="Situasi atau kondisi saat perilaku terjadi..."
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            {/* Metadata */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mood
                </label>
                <select
                  value={formData.metadata?.mood}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      metadata: {
                        ...prev.metadata,
                        mood: e.target.value as any,
                      },
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="HAPPY">Senang</option>
                  <option value="CALM">Tenang</option>
                  <option value="SAD">Sedih</option>
                  <option value="ANGRY">Marah</option>
                  <option value="EXCITED">Bersemangat</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Energi
                </label>
                <select
                  value={formData.metadata?.energy}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      metadata: {
                        ...prev.metadata,
                        energy: e.target.value as any,
                      },
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="HIGH">Tinggi</option>
                  <option value="MEDIUM">Sedang</option>
                  <option value="LOW">Rendah</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Partisipasi
                </label>
                <select
                  value={formData.metadata?.participation}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      metadata: {
                        ...prev.metadata,
                        participation: e.target.value as any,
                      },
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="ACTIVE">Aktif</option>
                  <option value="PASSIVE">Pasif</option>
                  <option value="DISRUPTIVE">Mengganggu</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Interaksi Sosial
                </label>
                <select
                  value={formData.metadata?.socialInteraction}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      metadata: {
                        ...prev.metadata,
                        socialInteraction: e.target.value as any,
                      },
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="POSITIVE">Positif</option>
                  <option value="NEUTRAL">Netral</option>
                  <option value="NEGATIVE">Negatif</option>
                </select>
              </div>
            </div>

            {/* Follow-up */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="followUpRequired"
                  checked={formData.followUpRequired}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      followUpRequired: e.target.checked,
                    }))
                  }
                  className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                />
                <label
                  htmlFor="followUpRequired"
                  className="text-sm font-medium text-gray-700"
                >
                  Memerlukan tindak lanjut
                </label>
              </div>

              {formData.followUpRequired && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tanggal Tindak Lanjut
                    </label>
                    <input
                      type="date"
                      value={formData.followUpDate}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          followUpDate: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Catatan Tindak Lanjut
                    </label>
                    <textarea
                      value={formData.followUpNotes}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          followUpNotes: e.target.value,
                        }))
                      }
                      placeholder="Rencana tindak lanjut..."
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Parent Notification */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="parentNotified"
                checked={formData.parentNotified}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    parentNotified: e.target.checked,
                  }))
                }
                className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
              />
              <label
                htmlFor="parentNotified"
                className="text-sm font-medium text-gray-700"
              >
                Beritahu orang tua
              </label>
            </div>
          </CardContent>

          {/* Footer */}
          <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-between">
            <Button type="button" variant="outline" onClick={handleReset}>
              Reset Form
            </Button>
            <div className="flex space-x-3">
              <Button type="button" variant="outline" onClick={onClose}>
                Batal
              </Button>
              <Button type="submit">
                <Save className="h-4 w-4 mr-2" />
                {editData ? "Update" : "Simpan"}
              </Button>
            </div>
          </div>

          {/* Debug Info - Remove in production */}
          {process.env.NODE_ENV === "development" && (
            <div className="mt-4 p-3 bg-gray-100 rounded text-xs space-y-2">
              <div>
                <strong>Debug Info:</strong>
              </div>
              <div>Loading: {loadingData ? "Yes" : "No"}</div>
              <div>Santri Count: {santriList.length}</div>
              <div>Halaqah Count: {halaqahList.length}</div>
              <div>Selected Santri ID: {formData.santriId || "None"}</div>
              <button
                type="button"
                onClick={loadRealData}
                className="px-2 py-1 bg-blue-500 text-white rounded text-xs"
                disabled={loadingData}
              >
                {loadingData ? "Loading..." : "Reload Data"}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
