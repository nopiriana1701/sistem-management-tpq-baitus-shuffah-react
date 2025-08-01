﻿"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Heart,
  Search,
  Filter,
  Download,
  Plus,
  Eye,
  TrendingUp,
  DollarSign,
  Users,
  Target,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  Building,
  BookOpen,
  GraduationCap,
  Utensils,
  Edit,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";
import CampaignManagement from "@/components/admin/donations/CampaignManagement";
import CategoryManagement from "@/components/admin/donations/CategoryManagement";

interface Donation {
  id: string;
  donorName: string;
  donorEmail?: string;
  donorPhone?: string;
  amount: number;
  type:
    | "GENERAL"
    | "BUILDING"
    | "SCHOLARSHIP"
    | "EQUIPMENT"
    | "RAMADAN"
    | "QURBAN";
  method: "CASH" | "BANK_TRANSFER" | "QRIS" | "E_WALLET" | "CREDIT_CARD";
  status: "PENDING" | "PAID" | "CANCELLED";
  reference?: string;
  message?: string;
  isAnonymous: boolean;
  createdAt: string;
  paidAt?: string;
}

const DonationsPage = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [user, setUser] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [dateFilter, setDateFilter] = useState("ALL");

  const [donationList, setDonationList] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentDonation, setCurrentDonation] = useState<Donation | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<"donations" | "campaigns" | "categories">("donations");
  const [summary, setSummary] = useState({
    totalAmount: 0,
    totalPaid: 0,
    totalCount: 0,
    paidCount: 0,
  });

  useEffect(() => {
    if (status === "loading") return; // Still loading

    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (session?.user) {
      if (session.user.role !== "ADMIN") {
        router.push("/dashboard");
        return;
      }
      setUser(session.user);
      fetchDonations();
    }
  }, [session, status, router]);

  // Refetch when filters change
  useEffect(() => {
    if (user) {
      fetchDonations();
    }
  }, [statusFilter, typeFilter, user]);

  const fetchDonations = async () => {
    try {
      setLoading(true);
      setError("");

      // Build query parameters
      const params = new URLSearchParams({
        limit: "100",
        ...(typeFilter !== "ALL" && { type: typeFilter }),
        ...(statusFilter !== "ALL" && { status: statusFilter }),
      });

      const response = await fetch(`/api/donations?${params}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setDonationList(data.donations || []);

        // Calculate summary from loaded data
        const summary = (data.donations || []).reduce(
          (acc: any, donation: any) => {
            acc.totalAmount += donation.amount;
            if (donation.status === "PAID") {
              acc.totalPaid += donation.amount;
              acc.paidCount++;
            }
            acc.totalCount++;
            return acc;
          },
          { totalAmount: 0, totalPaid: 0, totalCount: 0, paidCount: 0 },
        );

        setSummary(summary);
      } else {
        throw new Error(data.error || "Failed to fetch donations");
      }
    } catch (err) {
      console.error("Error fetching donations:", err);
      setError("Failed to load donations");
      toast.error("Gagal memuat data donasi");
      setDonationList([]);
      setSummary({
        totalAmount: 0,
        totalPaid: 0,
        totalCount: 0,
        paidCount: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  // Form state for add/edit donation
  const [formData, setFormData] = useState<{
    donorName: string;
    donorEmail: string;
    donorPhone: string;
    amount: string;
    type:
      | "GENERAL"
      | "BUILDING"
      | "SCHOLARSHIP"
      | "EQUIPMENT"
      | "RAMADAN"
      | "QURBAN";
    method: "CASH" | "BANK_TRANSFER" | "QRIS" | "E_WALLET" | "CREDIT_CARD";
    status: "PENDING" | "PAID" | "CANCELLED";
    reference: string;
    message: string;
    isAnonymous: boolean;
  }>({
    donorName: "",
    donorEmail: "",
    donorPhone: "",
    amount: "",
    type: "GENERAL",
    method: "CASH",
    status: "PAID",
    reference: "",
    message: "",
    isAnonymous: false,
  });

  // Reset form when modal is opened/closed
  useEffect(() => {
    if (showAddModal) {
      setFormData({
        donorName: "",
        donorEmail: "",
        donorPhone: "",
        amount: "",
        type: "GENERAL",
        method: "CASH",
        status: "PAID",
        reference: "",
        message: "",
        isAnonymous: false,
      });
    } else if (showEditModal && currentDonation) {
      setFormData({
        donorName: currentDonation.donorName,
        donorEmail: currentDonation.donorEmail || "",
        donorPhone: currentDonation.donorPhone || "",
        amount: currentDonation.amount.toString(),
        type: currentDonation.type,
        method: currentDonation.method,
        status: currentDonation.status,
        reference: currentDonation.reference || "",
        message: currentDonation.message || "",
        isAnonymous: currentDonation.isAnonymous,
      });
    }
  }, [showAddModal, showEditModal, currentDonation]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleEditDonation = (donation: Donation) => {
    setCurrentDonation(donation);
    setShowEditModal(true);
  };

  const handleSubmitDonation = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      const isEditing = showEditModal && currentDonation;
      const url = isEditing
        ? `/api/donations/${currentDonation?.id}`
        : "/api/donations";
      const method = isEditing ? "PUT" : "POST";

      // Show loading toast
      const loadingToast = toast.loading(
        isEditing ? "Menyimpan perubahan..." : "Menambahkan donasi baru...",
      );

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount),
          paidAt:
            formData.status === "PAID" ? new Date().toISOString() : undefined,
        }),
      });

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      if (response.ok) {
        const data = await response.json();

        if (isEditing) {
          setDonationList(
            donationList.map((item) =>
              item.id === currentDonation?.id
                ? {
                    ...item,
                    ...formData,
                    amount: parseFloat(formData.amount),
                    paidAt:
                      formData.status === "PAID"
                        ? new Date().toISOString()
                        : undefined,
                  }
                : item,
            ),
          );
          setShowEditModal(false);
          toast.success("Donasi berhasil diperbarui");
        } else {
          const newDonation = {
            ...data.donation,
            id: data.donation.id || Date.now().toString(),
            createdAt: new Date().toISOString(),
          };
          setDonationList([newDonation, ...donationList]);
          setShowAddModal(false);
          toast.success("Donasi berhasil ditambahkan");
        }

        // Refresh the page to ensure we have the latest data
        setTimeout(() => {
          router.refresh();
        }, 1000);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save donation");
      }
    } catch (err) {
      console.error("Error saving donation:", err);
      toast.error(
        `Gagal menyimpan donasi: ${err instanceof Error ? err.message : "Unknown error"}`,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PAID":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "PENDING":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "CANCELLED":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PAID":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "GENERAL":
        return <Heart className="h-4 w-4 text-red-500" />;
      case "BUILDING":
        return <Building className="h-4 w-4 text-blue-500" />;
      case "SCHOLARSHIP":
        return <GraduationCap className="h-4 w-4 text-green-500" />;
      case "EQUIPMENT":
        return <BookOpen className="h-4 w-4 text-purple-500" />;
      case "RAMADAN":
        return <Calendar className="h-4 w-4 text-yellow-500" />;
      case "QURBAN":
        return <Utensils className="h-4 w-4 text-orange-500" />;
      default:
        return <Heart className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "GENERAL":
        return "bg-red-100 text-red-800";
      case "BUILDING":
        return "bg-blue-100 text-blue-800";
      case "SCHOLARSHIP":
        return "bg-green-100 text-green-800";
      case "EQUIPMENT":
        return "bg-purple-100 text-purple-800";
      case "RAMADAN":
        return "bg-yellow-100 text-yellow-800";
      case "QURBAN":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredDonations = donationList.filter((donation) => {
    const matchesSearch =
      donation.donorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.message?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "ALL" || donation.status === statusFilter;
    const matchesType = typeFilter === "ALL" || donation.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const stats = {
    total: donationList.length,
    totalAmount: donationList
      .filter((d) => d.status === "PAID")
      .reduce((sum, d) => sum + d.amount, 0),
    pending: donationList.filter((d) => d.status === "PENDING").length,
    pendingAmount: donationList
      .filter((d) => d.status === "PENDING")
      .reduce((sum, d) => sum + d.amount, 0),
    thisMonth: donationList
      .filter((d) => {
        const donationDate = new Date(d.createdAt);
        const now = new Date();
        return (
          donationDate.getMonth() === now.getMonth() &&
          donationDate.getFullYear() === now.getFullYear() &&
          d.status === "PAID"
        );
      })
      .reduce((sum, d) => sum + d.amount, 0),
    donors: new Set(
      donationList.filter((d) => !d.isAnonymous).map((d) => d.donorName),
    ).size,
  };

  // Show loading state while session is loading
  if (status === "loading") {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Memuat halaman...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Don't render if user is not authenticated or not admin
  if (status === "unauthenticated" || !session?.user || session.user.role !== "ADMIN") {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Management Donasi
            </h1>
            <p className="text-gray-600">Kelola campaign, kategori, dan data donasi</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Laporan
            </Button>
            <Button onClick={() => setShowAddModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Catat Donasi Manual
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("donations")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "donations"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Data Donasi
            </button>
            <button
              onClick={() => setActiveTab("campaigns")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "campaigns"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Campaign Donasi
            </button>
            <button
              onClick={() => setActiveTab("categories")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "categories"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Kategori Donasi
            </button>
          </nav>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Donasi
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(stats.totalAmount)}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Bulan Ini</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatCurrency(stats.thisMonth)}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {formatCurrency(stats.pendingAmount)}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Donatur
                  </p>
                  <p className="text-2xl font-bold text-purple-600">
                    {stats.donors}
                  </p>
                </div>
                <Users className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {activeTab === "donations" && (
          <>
            {/* Donation Categories Progress */}
            <Card>
          <CardHeader>
            <CardTitle>Progress Donasi per Kategori</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(() => {
                // Calculate category totals from actual donation data
                const categoryTotals = donationList
                  .filter(d => d.status === "PAID")
                  .reduce((acc, donation) => {
                    if (!acc[donation.type]) {
                      acc[donation.type] = 0;
                    }
                    acc[donation.type] += donation.amount;
                    return acc;
                  }, {} as Record<string, number>);

                const categories = [
                  {
                    type: "GENERAL",
                    name: "Donasi Umum",
                    target: 100000000,
                    collected: categoryTotals.GENERAL || 0,
                    icon: Heart,
                  },
                  {
                    type: "BUILDING",
                    name: "Pembangunan",
                    target: 500000000,
                    collected: categoryTotals.BUILDING || 0,
                    icon: Building,
                  },
                  {
                    type: "SCHOLARSHIP",
                    name: "Beasiswa",
                    target: 200000000,
                    collected: categoryTotals.SCHOLARSHIP || 0,
                    icon: GraduationCap,
                  },
                  {
                    type: "EQUIPMENT",
                    name: "Peralatan",
                    target: 50000000,
                    collected: categoryTotals.EQUIPMENT || 0,
                    icon: BookOpen,
                  },
                ];

                return categories.map((category) => {
                  const Icon = category.icon;
                  const percentage = category.target > 0 ? (category.collected / category.target) * 100 : 0;

                  return (
                    <div
                      key={category.type}
                      className="p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center mb-3">
                        <Icon className="h-5 w-5 text-teal-600 mr-2" />
                        <h4 className="font-medium text-gray-900">
                          {category.name}
                        </h4>
                      </div>

                      <div className="mb-2">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Terkumpul</span>
                          <span className="font-medium">
                            {Math.round(percentage)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-teal-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{formatCurrency(category.collected)}</span>
                        <span>{formatCurrency(category.target)}</span>
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          </CardContent>
        </Card>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Donasi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <Input
                  placeholder="Cari donatur, referensi, atau pesan..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  leftIcon={<Search className="h-4 w-4" />}
                />
              </div>

              <div className="flex gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-gray-900 bg-white"
                >
                  <option value="ALL">Semua Status</option>
                  <option value="PAID">Lunas</option>
                  <option value="PENDING">Pending</option>
                  <option value="CANCELLED">Dibatalkan</option>
                </select>

                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-gray-900 bg-white"
                >
                  <option value="ALL">Semua Kategori</option>
                  <option value="GENERAL">Umum</option>
                  <option value="BUILDING">Pembangunan</option>
                  <option value="SCHOLARSHIP">Beasiswa</option>
                  <option value="EQUIPMENT">Peralatan</option>
                  <option value="RAMADAN">Ramadan</option>
                  <option value="QURBAN">Qurban</option>
                </select>

                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>

            {/* Donations Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">
                      Donatur
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">
                      Jumlah
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">
                      Kategori
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">
                      Metode
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">
                      Tanggal
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDonations.map((donation) => (
                    <tr
                      key={donation.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-gray-900">
                            {donation.isAnonymous
                              ? "Donatur Anonim"
                              : donation.donorName}
                          </p>
                          <p className="text-sm text-gray-500">
                            {donation.reference}
                            {donation.donorEmail && !donation.isAnonymous && (
                              <span> � {donation.donorEmail}</span>
                            )}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-gray-900">
                          {formatCurrency(donation.amount)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          {getTypeIcon(donation.type)}
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(donation.type)}`}
                          >
                            {donation.type}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-gray-900">
                          {donation.method}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(donation.status)}
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(donation.status)}`}
                          >
                            {donation.status}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-sm text-gray-900">
                            {formatDateTime(donation.createdAt)}
                          </p>
                          {donation.paidAt && (
                            <p className="text-xs text-green-600">
                              Dibayar: {formatDateTime(donation.paidAt)}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditDonation(donation)}
                          >
                            <Edit className="h-4 w-4 text-blue-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              if (
                                window.confirm(
                                  "Apakah Anda yakin ingin menghapus donasi ini?",
                                )
                              ) {
                                // Implement delete functionality here
                                toast.success(
                                  "Fitur hapus donasi akan segera tersedia",
                                );
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredDonations.length === 0 && (
              <div className="text-center py-12">
                <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Tidak ada donasi ditemukan
                </h3>
                <p className="text-gray-500">
                  Coba ubah filter atau kata kunci pencarian
                </p>
              </div>
            )}
          </CardContent>
        </Card>
          </>
        )}

        {activeTab === "campaigns" && <CampaignManagement />}
        {activeTab === "categories" && <CategoryManagement />}
      </div>

      {/* Add Donation Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  Catat Donasi Manual
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmitDonation} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nama Donatur
                    </label>
                    <Input
                      name="donorName"
                      value={formData.donorName}
                      onChange={handleInputChange}
                      placeholder="Nama donatur"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Jumlah Donasi
                    </label>
                    <Input
                      name="amount"
                      type="number"
                      value={formData.amount}
                      onChange={handleInputChange}
                      placeholder="Jumlah donasi"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <Input
                      name="donorEmail"
                      type="email"
                      value={formData.donorEmail}
                      onChange={handleInputChange}
                      placeholder="Email donatur (opsional)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      No. Telepon
                    </label>
                    <Input
                      name="donorPhone"
                      value={formData.donorPhone}
                      onChange={handleInputChange}
                      placeholder="Nomor telepon (opsional)"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Kategori Donasi
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      required
                    >
                      <option value="GENERAL">Donasi Umum</option>
                      <option value="BUILDING">Pembangunan</option>
                      <option value="SCHOLARSHIP">Beasiswa</option>
                      <option value="EQUIPMENT">Peralatan</option>
                      <option value="RAMADAN">Ramadan</option>
                      <option value="QURBAN">Qurban</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Metode Pembayaran
                    </label>
                    <select
                      name="method"
                      value={formData.method}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      required
                    >
                      <option value="CASH">Tunai</option>
                      <option value="BANK_TRANSFER">Transfer Bank</option>
                      <option value="QRIS">QRIS</option>
                      <option value="E_WALLET">E-Wallet</option>
                      <option value="CREDIT_CARD">Kartu Kredit</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      required
                    >
                      <option value="PAID">Dibayar</option>
                      <option value="PENDING">Tertunda</option>
                      <option value="CANCELLED">Dibatalkan</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Referensi
                  </label>
                  <Input
                    name="reference"
                    value={formData.reference}
                    onChange={handleInputChange}
                    placeholder="Nomor referensi (opsional)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pesan/Doa
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Pesan atau doa dari donatur (opsional)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    rows={2}
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isAnonymous"
                    name="isAnonymous"
                    checked={formData.isAnonymous}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="isAnonymous"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Donasi sebagai anonim
                  </label>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => setShowAddModal(false)}
                  >
                    Batal
                  </Button>
                  <Button type="submit" loading={isSubmitting}>
                    Simpan Donasi
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Donation Modal */}
      {showEditModal && currentDonation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Edit Donasi</h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmitDonation} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nama Donatur
                    </label>
                    <Input
                      name="donorName"
                      value={formData.donorName}
                      onChange={handleInputChange}
                      placeholder="Nama donatur"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Jumlah Donasi
                    </label>
                    <Input
                      name="amount"
                      type="number"
                      value={formData.amount}
                      onChange={handleInputChange}
                      placeholder="Jumlah donasi"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <Input
                      name="donorEmail"
                      type="email"
                      value={formData.donorEmail}
                      onChange={handleInputChange}
                      placeholder="Email donatur (opsional)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      No. Telepon
                    </label>
                    <Input
                      name="donorPhone"
                      value={formData.donorPhone}
                      onChange={handleInputChange}
                      placeholder="Nomor telepon (opsional)"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Kategori Donasi
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      required
                    >
                      <option value="GENERAL">Donasi Umum</option>
                      <option value="BUILDING">Pembangunan</option>
                      <option value="SCHOLARSHIP">Beasiswa</option>
                      <option value="EQUIPMENT">Peralatan</option>
                      <option value="RAMADAN">Ramadan</option>
                      <option value="QURBAN">Qurban</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Metode Pembayaran
                    </label>
                    <select
                      name="method"
                      value={formData.method}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      required
                    >
                      <option value="CASH">Tunai</option>
                      <option value="BANK_TRANSFER">Transfer Bank</option>
                      <option value="QRIS">QRIS</option>
                      <option value="E_WALLET">E-Wallet</option>
                      <option value="CREDIT_CARD">Kartu Kredit</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      required
                    >
                      <option value="PAID">Dibayar</option>
                      <option value="PENDING">Tertunda</option>
                      <option value="CANCELLED">Dibatalkan</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Referensi
                  </label>
                  <Input
                    name="reference"
                    value={formData.reference}
                    onChange={handleInputChange}
                    placeholder="Nomor referensi (opsional)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pesan/Doa
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Pesan atau doa dari donatur (opsional)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    rows={2}
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isAnonymous-edit"
                    name="isAnonymous"
                    checked={formData.isAnonymous}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="isAnonymous-edit"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Donasi sebagai anonim
                  </label>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => setShowEditModal(false)}
                  >
                    Batal
                  </Button>
                  <Button type="submit" loading={isSubmitting}>
                    Simpan Perubahan
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default DonationsPage;
