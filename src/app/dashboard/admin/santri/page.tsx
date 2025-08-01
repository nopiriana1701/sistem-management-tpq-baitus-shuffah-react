"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import AddStudentModal from "@/components/modals/AddStudentModal";
import StudentDetailModal from "@/components/modals/StudentDetailModal";
import SantriExcelUpload from "@/components/santri/SantriExcelUpload";
import {
  GraduationCap,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Download,
  Users,
  BookOpen,
  Calendar,
  Upload,
} from "lucide-react";

interface SantriData {
  id: string;
  nis: string;
  name: string;
  birthDate: string;
  birthPlace: string;
  gender: "LAKI_LAKI" | "PEREMPUAN";
  address: string;
  phone?: string;
  email?: string;
  photo?: string;
  status: "ACTIVE" | "INACTIVE" | "GRADUATED" | "DROPPED_OUT";
  enrollmentDate: string;
  graduationDate?: string;
  wali: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  halaqah?: {
    id: string;
    name: string;
    level: string;
  };
  hafalan: Array<{
    id: string;
    surahName: string;
    grade: number;
    status: string;
  }>;
  attendance: Array<{
    id: string;
    date: string;
    status: string;
  }>;
  payments: Array<{
    id: string;
    type: string;
    amount: number;
    status: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

interface HalaqahData {
  id: string;
  name: string;
  level: string;
}

interface SantriFormData {
  nis: string;
  name: string;
  birthDate: string;
  birthPlace: string;
  gender: "LAKI_LAKI" | "PEREMPUAN";
  address: string;
  phone?: string;
  email?: string;
  waliId: string;
  halaqahId?: string;
}

// Helper function to validate image URL
const isValidImageUrl = (url: string): boolean => {
  if (!url || typeof url !== 'string') return false;

  // Check for valid HTTP/HTTPS URLs
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return true;
  }

  // Check for valid data URLs
  if (url.startsWith('data:image/')) {
    try {
      // Basic validation for data URL format
      const parts = url.split(',');
      if (parts.length !== 2) return false;

      const header = parts[0];
      const data = parts[1];

      // Check header format
      if (!header.includes('data:image/') || !header.includes('base64')) return false;

      // Check if base64 data is valid (basic check)
      if (!data || data.length === 0) return false;

      // Try to validate base64 format
      const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
      return base64Regex.test(data);
    } catch (error) {
      console.error('Invalid data URL:', error);
      return false;
    }
  }

  return false;
};

export default function SantriPage() {
  const [santri, setSantri] = useState<SantriData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [halaqahFilter, setHalaqahFilter] = useState("ALL");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [editingSantri, setEditingSantri] = useState<SantriData | null>(null);
  const [selectedSantri, setSelectedSantri] = useState<SantriData | null>(null);
  const [halaqahList, setHalaqahList] = useState<HalaqahData[]>([]);

  useEffect(() => {
    loadSantri();
    loadHalaqahList();
  }, []);

  const loadSantri = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/santri");
      const data = await response.json();

      if (data.success) {
        setSantri(data.data || []);
      } else {
        throw new Error(data.message || "Gagal memuat data santri");
      }
    } catch (error) {
      console.error("Error loading santri:", error);
      setSantri([]); // Ensure santri is always an array
      alert("Gagal memuat data santri");
    } finally {
      setLoading(false);
    }
  };

  const loadHalaqahList = async () => {
    try {
      const response = await fetch("/api/halaqah");
      const data = await response.json();

      if (data.success) {
        setHalaqahList(data.halaqah);
      } else {
        throw new Error(data.message || "Gagal memuat data halaqah");
      }
    } catch (error) {
      console.error("Error loading halaqah:", error);
      // Fallback data
      const fallbackHalaqah = [
        { id: "1", name: "Halaqah Al-Fatihah", level: "Pemula" },
        { id: "2", name: "Halaqah Al-Baqarah", level: "Menengah" },
        { id: "3", name: "Halaqah Ali Imran", level: "Lanjutan" },
        { id: "4", name: "Halaqah An-Nisa", level: "Mahir" },
      ];
      setHalaqahList(fallbackHalaqah);
    }
  };

  const handleCreateSantri = async (santriData: SantriFormData) => {
    try {
      setLoading(true);

      const response = await fetch("/api/santri", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(santriData),
      });

      const data = await response.json();

      if (data.success) {
        // Reload santri list to get fresh data
        await loadSantri();
        alert("Santri berhasil ditambahkan!");
        setShowAddModal(false);
      } else {
        throw new Error(data.message || "Gagal menambahkan santri");
      }
    } catch (error) {
      console.error("Error creating santri:", error);
      alert(
        error instanceof Error ? error.message : "Gagal menambahkan santri",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSantri = async (santriData: SantriFormData) => {
    try {
      setLoading(true);

      const response = await fetch(`/api/santri/${editingSantri?.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(santriData),
      });

      const data = await response.json();

      if (data.success) {
        // Reload santri list to get fresh data
        await loadSantri();
        alert("Data santri berhasil diperbarui!");
        setEditingSantri(null);
        setShowAddModal(false);
      } else {
        throw new Error(data.message || "Gagal memperbarui data santri");
      }
    } catch (error) {
      console.error("Error updating santri:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Gagal memperbarui data santri",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSantri = async (santriId: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus santri ini?")) return;

    try {
      const response = await fetch(`/api/santri/${santriId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        // Reload santri list to get fresh data
        await loadSantri();
        alert("Santri berhasil dihapus!");
        setShowDetailModal(false);
      } else {
        throw new Error(data.message || "Gagal menghapus santri");
      }
    } catch (error) {
      console.error("Error deleting santri:", error);
      alert(error instanceof Error ? error.message : "Gagal menghapus santri");
    }
  };

  const handleViewDetail = async (santri: SantriData) => {
    try {
      // Fetch detailed santri data
      const response = await fetch(`/api/santri/${santri.id}`);
      const data = await response.json();

      if (data.success) {
        setSelectedSantri(data.santri);
        setShowDetailModal(true);
      } else {
        throw new Error(data.message || "Gagal memuat detail santri");
      }
    } catch (error) {
      console.error("Error fetching santri details:", error);
      alert(
        error instanceof Error ? error.message : "Gagal memuat detail santri",
      );
    }
  };

  const handleUploadSuccess = () => {
    // Reload santri data after successful upload
    loadSantri();
    setShowUploadModal(false);
  };

  const handleEditSantri = async (santri: SantriData) => {
    try {
      // Fetch detailed santri data for editing
      const response = await fetch(`/api/santri/${santri.id}`);
      const data = await response.json();

      if (data.success) {
        setEditingSantri(data.santri);
        setShowDetailModal(false);
        setShowAddModal(true);
      } else {
        throw new Error(
          data.message || "Gagal memuat data santri untuk diedit",
        );
      }
    } catch (error) {
      console.error("Error fetching santri for edit:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Gagal memuat data santri untuk diedit",
      );
    }
  };

  const handleExportSantri = () => {
    try {
      // Import the Excel export function dynamically
      import("@/lib/excel-templates").then(({ exportSantriData }) => {
        exportSantriData(filteredSantri);
      });
    } catch (error) {
      console.error("Error exporting santri data:", error);
      alert("Gagal mengexport data santri");
    }
  };

  // Apply filters on client side for better UX
  const filteredSantri = (santri || []).filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.nis.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.wali?.name &&
        s.wali.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (s.wali?.email &&
        s.wali.email.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === "ALL" || s.status === statusFilter;

    const matchesHalaqah =
      halaqahFilter === "ALL" ||
      (halaqahFilter === "NONE" && !s.halaqah?.id) ||
      s.halaqah?.id === halaqahFilter;

    return matchesSearch && matchesStatus && matchesHalaqah;
  });

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "success";
      case "INACTIVE":
        return "secondary";
      case "GRADUATED":
        return "warning";
      case "DROPPED":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "Aktif";
      case "INACTIVE":
        return "Tidak Aktif";
      case "GRADUATED":
        return "Lulus";
      case "DROPPED":
        return "Keluar";
      default:
        return status;
    }
  };

  const getGenderLabel = (gender: string) => {
    return gender === "LAKI_LAKI" ? "Laki-laki" : "Perempuan";
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return age;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <GraduationCap className="h-8 w-8 text-gray-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Manajemen Santri
              </h1>
              <p className="text-gray-600">
                Kelola data santri TPQ Baitus Shuffah
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-2 shadow-md"
            >
              <Upload className="h-4 w-4" />
              Import Excel
            </Button>
            <Button
              variant="primary"
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 shadow-md"
            >
              <Plus className="h-4 w-4" />
              Tambah Santri
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Santri</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {santri.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <GraduationCap className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Santri Aktif</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {(santri || []).filter((s) => s.status === "ACTIVE").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <BookOpen className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Lulus</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {(santri || []).filter((s) => s.status === "GRADUATED").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Santri Baru</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {
                      (santri || []).filter((s) => {
                        const enrollDate = new Date(s.enrollmentDate);
                        const thisMonth = new Date();
                        return (
                          enrollDate.getMonth() === thisMonth.getMonth() &&
                          enrollDate.getFullYear() === thisMonth.getFullYear()
                        );
                      }).length
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cari Santri
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Nama, NIS, atau wali..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="ALL">Semua Status</option>
                  <option value="ACTIVE">Aktif</option>
                  <option value="INACTIVE">Tidak Aktif</option>
                  <option value="GRADUATED">Lulus</option>
                  <option value="DROPPED_OUT">Keluar</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Halaqah
                </label>
                <select
                  value={halaqahFilter}
                  onChange={(e) => setHalaqahFilter(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="ALL">Semua Halaqah</option>
                  <option value="NONE">Belum Ada Halaqah</option>
                  {halaqahList.map((halaqah) => (
                    <option key={halaqah.id} value={halaqah.id}>
                      {halaqah.name} - {halaqah.level}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={handleExportSantri}
                  className="w-full flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Santri Table */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Santri ({filteredSantri.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Memuat data santri...</p>
              </div>
            ) : filteredSantri.length === 0 ? (
              <div className="text-center py-8">
                <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Tidak ada santri
                </h3>
                <p className="text-gray-600">
                  Belum ada data santri atau tidak sesuai filter
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-900">
                        Santri
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">
                        Wali
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">
                        Halaqah
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">
                        Tgl Masuk
                      </th>
                      <th className="text-right py-3 px-4 font-medium text-gray-900">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSantri.map((s) => (
                      <tr
                        key={s.id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                              {s.photo && isValidImageUrl(s.photo) ? (
                                <img
                                  src={s.photo}
                                  alt={s.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                    const parent = target.parentElement;
                                    if (parent) {
                                      parent.innerHTML = `<span class="text-gray-600 font-medium">${s.name.charAt(0).toUpperCase()}</span>`;
                                    }
                                  }}
                                />
                              ) : (
                                <span className="text-gray-600 font-medium">
                                  {s.name.charAt(0).toUpperCase()}
                                </span>
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {s.name}
                              </p>
                              <p className="text-sm text-gray-600">
                                NIS: {s.nis}
                              </p>
                              <p className="text-sm text-gray-500">
                                {getGenderLabel(s.gender)} •{" "}
                                {calculateAge(s.birthDate)} tahun
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-medium text-gray-900">
                              {s.wali?.name || "Tidak ada wali"}
                            </p>
                            <p className="text-sm text-gray-600">
                              {s.wali?.phone || "-"}
                            </p>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          {s.halaqah ? (
                            <div>
                              <p className="font-medium text-gray-900">
                                {s.halaqah.name}
                              </p>
                              <p className="text-sm text-gray-600">
                                {s.halaqah.level}
                              </p>
                            </div>
                          ) : (
                            <span className="text-gray-400 text-sm">
                              Belum ada halaqah
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <Badge
                            variant={
                              getStatusBadgeColor(s.status) as
                                | "default"
                                | "secondary"
                                | "destructive"
                                | "outline"
                            }
                          >
                            {getStatusLabel(s.status)}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-sm text-gray-600">
                            {new Date(s.enrollmentDate).toLocaleDateString(
                              "id-ID",
                            )}
                          </p>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="info"
                              size="sm"
                              onClick={() => handleViewDetail(s)}
                              className="flex items-center gap-1"
                            >
                              <Eye className="h-3 w-3" />
                              Detail
                            </Button>
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleEditSantri(s)}
                              className="flex items-center gap-1"
                            >
                              <Edit className="h-3 w-3" />
                              Edit
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleDeleteSantri(s.id)}
                              className="flex items-center gap-1"
                            >
                              <Trash2 className="h-3 w-3" />
                              Hapus
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Modals */}
        <AddStudentModal
          isOpen={showAddModal}
          onClose={() => {
            setShowAddModal(false);
            setEditingSantri(null);
          }}
          onSave={editingSantri ? handleUpdateSantri : handleCreateSantri}
          editData={editingSantri}
        />

        <StudentDetailModal
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          onEdit={() => selectedSantri && handleEditSantri(selectedSantri)}
          onDelete={() =>
            selectedSantri?.id && handleDeleteSantri(selectedSantri.id)
          }
          student={selectedSantri}
        />

        <SantriExcelUpload
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          onSuccess={handleUploadSuccess}
        />
      </div>
    </DashboardLayout>
  );
}
