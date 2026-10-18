import React, { useState } from 'react';
import {
  Users2,
  Plus,
  Search,
  MapPin,
  Phone,
  CreditCard,
  DollarSign,
  AlertTriangle,
  Building,
  CheckCircle,
  CheckCircle2,
  AlertCircle,
  X,
  Edit2,
  Check,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext.tsx';
import { Distributor } from '../../types/erp.ts';

const BANGLADESH_DISTRICTS = [
  'Dhaka',
  'Chittagong',
  'Kushtia',
  'Rajshahi',
  'Khulna',
  'Sylhet',
  'Rangpur',
  'Barisal',
  'Bogra',
  'Jessore',
  'Dinajpur',
  "Cox's Bazar",
  'Tangail',
  'Faridpur',
  'Pabna',
  'Noakhali',
  'Comilla',
  'Mymensingh',
  'Gazipur',
  'Narayanganj',
];

const DISTRICT_TO_REGION: Record<string, string> = {
  Dhaka: 'Dhaka Division',
  Gazipur: 'Dhaka Division',
  Narayanganj: 'Dhaka Division',
  Tangail: 'Dhaka Division',
  Faridpur: 'Dhaka Division',
  Chittagong: 'Chittagong Division',
  Comilla: 'Chittagong Division',
  Noakhali: 'Chittagong Division',
  "Cox's Bazar": 'Chittagong Division',
  Kushtia: 'Khulna Division',
  Khulna: 'Khulna Division',
  Jessore: 'Khulna Division',
  Rajshahi: 'Rajshahi Division',
  Bogra: 'Rajshahi Division',
  Pabna: 'Rajshahi Division',
  Rangpur: 'Rangpur Division',
  Dinajpur: 'Rangpur Division',
  Sylhet: 'Sylhet Division',
  Barisal: 'Barisal Division',
  Mymensingh: 'Mymensingh Division',
};

export const DistributorModule: React.FC = () => {
  const { distributors, addDistributor, updateDistributor } = useERP();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDistributor, setEditingDistributor] = useState<Distributor | null>(null);

  // Form states for Create
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [district, setDistrict] = useState('Dhaka');
  const [region, setRegion] = useState('Dhaka Division');
  const [territory, setTerritory] = useState('');
  const [address, setAddress] = useState('');
  const [creditLimitBDT, setCreditLimitBDT] = useState<number>(1000000);
  const [paymentTermsDays, setPaymentTermsDays] = useState<number>(30);
  const [openingBalanceBDT, setOpeningBalanceBDT] = useState<number>(0);
  const [status, setStatus] = useState<'Active' | 'Review' | 'Blocked'>('Active');

  // Edit Form States
  const [editName, setEditName] = useState('');
  const [editOwnerName, setEditOwnerName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editDistrict, setEditDistrict] = useState('Dhaka');
  const [editRegion, setEditRegion] = useState('Dhaka Division');
  const [editTerritory, setEditTerritory] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editCreditLimitBDT, setEditCreditLimitBDT] = useState<number>(1000000);
  const [editPaymentTermsDays, setEditPaymentTermsDays] = useState<number>(30);
  const [editStatus, setEditStatus] = useState<'Active' | 'Review' | 'Blocked'>('Active');

  // UI feedback states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'warning' | 'error' } | null>(null);

  const filtered = distributors.filter(
    (d) =>
      d.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.ownerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.district?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAddModal = () => {
    const list = distributors || [];
    const nextCode = `DIS-0${list.length + 1}`;
    setCode(nextCode);
    setName('');
    setOwnerName('');
    setPhone('');
    setEmail('');
    setDistrict('Dhaka');
    setRegion('Dhaka Division');
    setTerritory('');
    setAddress('');
    setCreditLimitBDT(1000000);
    setPaymentTermsDays(30);
    setOpeningBalanceBDT(0);
    setStatus('Active');
    setModalError(null);
    setShowAddModal(true);
  };

  const handleDistrictChange = (selectedDistrict: string) => {
    setDistrict(selectedDistrict);
    if (DISTRICT_TO_REGION[selectedDistrict]) {
      setRegion(DISTRICT_TO_REGION[selectedDistrict]);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !ownerName.trim() || !phone.trim() || !code.trim()) {
      setModalError('Please fill in all required fields (Name, Proprietor, Phone, Code).');
      return;
    }

    setIsSubmitting(true);
    setModalError(null);

    try {
      const res = await addDistributor({
        code: code.trim().toUpperCase(),
        name: name.trim(),
        ownerName: ownerName.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        district: district.trim(),
        region: region.trim(),
        territory: territory.trim() || undefined,
        address: address.trim() || undefined,
        paymentTermsDays: Number(paymentTermsDays) || 30,
        creditLimitBDT: Number(creditLimitBDT) || 0,
        openingBalanceBDT: Number(openingBalanceBDT) || 0,
        status: status,
      });

      if (res && res.error) {
        setToastMessage({
          text: `Distributor registered locally (${res.error})`,
          type: 'warning',
        });
      } else {
        setToastMessage({
          text: `Distributor "${name.trim()}" onboarded successfully!`,
          type: 'success',
        });
      }

      setShowAddModal(false);
      setTimeout(() => setToastMessage(null), 4000);
    } catch (err: any) {
      setModalError(err?.message || 'Failed to onboard distributor');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenEditModal = (d: Distributor) => {
    setEditingDistributor(d);
    setEditName(d.name || '');
    setEditOwnerName(d.ownerName || '');
    setEditPhone(d.phone || '');
    setEditEmail(d.email || '');
    setEditDistrict(d.district || 'Dhaka');
    setEditRegion(d.region || 'Dhaka Division');
    setEditTerritory(d.territory || '');
    setEditAddress(d.address || '');
    setEditCreditLimitBDT(d.creditLimitBDT || 1000000);
    setEditPaymentTermsDays(d.paymentTermsDays || 30);
    setEditStatus((d.status as any) || 'Active');
    setModalError(null);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDistributor) return;

    setIsSubmitting(true);
    setModalError(null);

    try {
      await updateDistributor(editingDistributor.id, {
        name: editName.trim(),
        ownerName: editOwnerName.trim(),
        phone: editPhone.trim(),
        email: editEmail.trim() || undefined,
        district: editDistrict.trim(),
        region: editRegion.trim(),
        territory: editTerritory.trim() || undefined,
        address: editAddress.trim() || undefined,
        creditLimitBDT: Number(editCreditLimitBDT) || 0,
        paymentTermsDays: Number(editPaymentTermsDays) || 30,
        status: editStatus,
      });

      setToastMessage({
        text: `Distributor "${editName.trim()}" updated successfully!`,
        type: 'success',
      });
      setEditingDistributor(null);
      setTimeout(() => setToastMessage(null), 4000);
    } catch (err: any) {
      setModalError(err?.message || 'Failed to update distributor');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`flex items-center justify-between p-3.5 rounded-xl text-xs font-semibold shadow-md transition-all ${
            toastMessage.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
              : toastMessage.type === 'warning'
              ? 'bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200'
              : 'bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {toastMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            )}
            <span>{toastMessage.text}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 ml-3"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Users2 className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              Distributor Management & Credit Lines
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Authorized regional dealers, commercial credit exposure, and territory accounts nationwide.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-2 shadow-sm transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Onboard New Distributor</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4">
          <div className="text-xs font-semibold text-slate-400">Total Authorized Dealers</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {distributors.length}
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">64 Districts Covered</div>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4">
          <div className="text-xs font-semibold text-slate-400">Total Credit Exposure</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            ৳
            {(
              distributors.reduce((acc, d) => acc + (d.currentOutstandingBDT || d.openingBalanceBDT || 0), 0) /
              100000
            ).toFixed(1)}{' '}
            Lac
          </div>
          <div className="text-[11px] text-amber-600 font-medium mt-1">Within Approved Credit Limits</div>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4">
          <div className="text-xs font-semibold text-slate-400">Total Credit Limit Extended</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            ৳
            {(
              distributors.reduce((acc, d) => acc + (d.creditLimitBDT || 0), 0) /
              100000
            ).toFixed(1)}{' '}
            Lac
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Eastern Bank & Bank Guarantee Backed</div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative max-w-sm flex-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search distributor, proprietor, code, or district..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenAddModal}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add Dealer</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold">
                <th className="py-3 px-3">Distributor Name</th>
                <th className="py-3 px-3">Proprietor / Contact</th>
                <th className="py-3 px-3">Territory & Region</th>
                <th className="py-3 px-3 text-right">Credit Limit</th>
                <th className="py-3 px-3 text-right">Outstanding (BDT)</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    <p className="font-medium text-slate-600 dark:text-slate-300">No distributors found</p>
                    <p className="text-[11px] mt-1">Try adjusting your search or onboard a new distributor partner.</p>
                    <button
                      type="button"
                      onClick={handleOpenAddModal}
                      className="mt-3 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Onboard Distributor Now</span>
                    </button>
                  </td>
                </tr>
              ) : (
                filtered.map((d) => {
                  const outstanding = d.currentOutstandingBDT || d.openingBalanceBDT || 0;
                  const isOverLimit = outstanding > (d.creditLimitBDT || 0);
                  return (
                    <tr key={d.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">
                        <div>{d.name}</div>
                        <span className="text-[10px] text-slate-400 font-mono">{d.code}</span>
                      </td>
                      <td className="py-3 px-3 text-slate-700 dark:text-slate-300">
                        <div>{d.ownerName}</div>
                        <div className="text-[11px] text-slate-400">{d.phone}</div>
                      </td>
                      <td className="py-3 px-3 text-slate-500">
                        <div>{d.district}</div>
                        <div className="text-[10px] text-slate-400">{d.region}</div>
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                        ৳{d.creditLimitBDT?.toLocaleString()}
                      </td>
                      <td
                        className={`py-3 px-3 text-right font-mono font-bold ${
                          isOverLimit ? 'text-rose-600' : 'text-emerald-600 dark:text-emerald-400'
                        }`}
                      >
                        ৳{outstanding.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            d.status === 'Active'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : d.status === 'Review'
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                              : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          }`}
                        >
                          {d.status || 'Active'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => handleOpenEditModal(d)}
                          className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 cursor-pointer inline-flex items-center gap-1"
                        >
                          <Edit2 className="w-3 h-3 text-slate-400" />
                          <span>Edit</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: ONBOARD NEW DISTRIBUTOR */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="relative w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4 text-xs my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                  <Building className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    Onboard New Distributor
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Register authorized regional dealer partner and configure commercial credit limits
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-bold p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {modalError && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                      Distributor Code *
                    </label>
                    <button
                      type="button"
                      onClick={() => setCode(`DIS-0${distributors.length + 1}`)}
                      className="text-[10px] text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer font-mono"
                    >
                      Auto
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-slate-900 dark:text-white"
                    placeholder="e.g. DIS-01"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Account Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold text-slate-900 dark:text-white"
                  >
                    <option value="Active">Active (Authorized)</option>
                    <option value="Review">Review (Pending Compliance)</option>
                    <option value="Blocked">Blocked (Credit Hold)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Distributor Enterprise Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    placeholder="e.g. M/S Green Power Electric Corp"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Proprietor / Owner Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    placeholder="e.g. Haji Md. Abdur Rahman"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Phone / Mobile *
                  </label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    placeholder="e.g. +880 1712-345678"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Official Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    placeholder="e.g. greenpower.dist@gmail.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Operating District *
                  </label>
                  <select
                    value={district}
                    onChange={(e) => handleDistrictChange(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  >
                    {BANGLADESH_DISTRICTS.map((dist) => (
                      <option key={dist} value={dist}>
                        {dist}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Administrative Region / Division
                  </label>
                  <input
                    type="text"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    placeholder="e.g. Dhaka Division"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Territory / DB Point
                  </label>
                  <input
                    type="text"
                    value={territory}
                    onChange={(e) => setTerritory(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    placeholder="e.g. Mirpur-10 Commercial Hub"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Trade Shop Address
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    placeholder="e.g. Holding 45, Battery Market, Station Road"
                  />
                </div>
              </div>

              {/* Commercial Terms */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                  <span>Commercial Credit Agreement & Limits</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Approved Credit Limit (BDT) *
                    </label>
                    <input
                      type="number"
                      min={0}
                      step={50000}
                      value={creditLimitBDT}
                      onChange={(e) => setCreditLimitBDT(Number(e.target.value))}
                      className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-slate-900 dark:text-white"
                    />
                    <span className="text-[10px] text-slate-400 mt-0.5 block">
                      ৳{(creditLimitBDT / 100000).toFixed(1)} Lac
                    </span>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Payment Terms (Days)
                    </label>
                    <select
                      value={paymentTermsDays}
                      onChange={(e) => setPaymentTermsDays(Number(e.target.value))}
                      className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                    >
                      <option value={15}>15 Days</option>
                      <option value={30}>30 Days (Standard)</option>
                      <option value={45}>45 Days</option>
                      <option value={60}>60 Days</option>
                      <option value={90}>90 Days (Enterprise)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Opening Balance (BDT)
                    </label>
                    <input
                      type="number"
                      min={0}
                      step={10000}
                      value={openingBalanceBDT}
                      onChange={(e) => setOpeningBalanceBDT(Number(e.target.value))}
                      className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-slate-900 dark:text-white"
                    />
                    <span className="text-[10px] text-slate-400 mt-0.5 block">Initial Ledger Balance</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isSubmitting ? 'Onboarding...' : 'Onboard Distributor'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT DISTRIBUTOR */}
      {editingDistributor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4 text-xs my-8">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                  <Edit2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    Edit Distributor Account
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Modify profile details, contact person, or credit line allocations ({editingDistributor.code})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingDistributor(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-bold p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {modalError && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Distributor Enterprise Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Account Status
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold text-slate-900 dark:text-white"
                  >
                    <option value="Active">Active (Authorized)</option>
                    <option value="Review">Review (Pending Compliance)</option>
                    <option value="Blocked">Blocked (Credit Hold)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Proprietor / Owner Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editOwnerName}
                    onChange={(e) => setEditOwnerName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Phone / Mobile
                  </label>
                  <input
                    type="text"
                    required
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    District
                  </label>
                  <select
                    value={editDistrict}
                    onChange={(e) => {
                      setEditDistrict(e.target.value);
                      if (DISTRICT_TO_REGION[e.target.value]) {
                        setEditRegion(DISTRICT_TO_REGION[e.target.value]);
                      }
                    }}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  >
                    {BANGLADESH_DISTRICTS.map((dist) => (
                      <option key={dist} value={dist}>
                        {dist}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Region / Division
                  </label>
                  <input
                    type="text"
                    value={editRegion}
                    onChange={(e) => setEditRegion(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-blue-600" />
                  <span>Update Credit Terms</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Approved Credit Limit (BDT)
                    </label>
                    <input
                      type="number"
                      min={0}
                      step={50000}
                      value={editCreditLimitBDT}
                      onChange={(e) => setEditCreditLimitBDT(Number(e.target.value))}
                      className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-slate-900 dark:text-white"
                    />
                    <span className="text-[10px] text-slate-400 mt-0.5 block">
                      ৳{(editCreditLimitBDT / 100000).toFixed(1)} Lac
                    </span>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Payment Terms (Days)
                    </label>
                    <select
                      value={editPaymentTermsDays}
                      onChange={(e) => setEditPaymentTermsDays(Number(e.target.value))}
                      className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                    >
                      <option value={15}>15 Days</option>
                      <option value={30}>30 Days</option>
                      <option value={45}>45 Days</option>
                      <option value={60}>60 Days</option>
                      <option value={90}>90 Days</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingDistributor(null)}
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  <span>{isSubmitting ? 'Updating...' : 'Update Distributor'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
