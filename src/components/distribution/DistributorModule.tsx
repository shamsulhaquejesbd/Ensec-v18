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
} from 'lucide-react';
import { useERP } from '../../context/ERPContext.tsx';

export const DistributorModule: React.FC = () => {
  const { distributors, addDistributor } = useERP();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [phone, setPhone] = useState('');
  const [district, setDistrict] = useState('Dhaka');
  const [creditLimitBDT, setCreditLimitBDT] = useState<number>(1000000);

  const filtered = distributors.filter(
    (d) =>
      d.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.ownerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.district?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await addDistributor({
      code: `DIS-${Date.now().toString().slice(-4)}`,
      name,
      ownerName,
      phone,
      district,
      region: 'Dhaka Division',
      paymentTermsDays: 30,
      creditLimitBDT,
      status: 'Active',
    });
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
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
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-2 shadow-sm transition"
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
        <div className="relative max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search distributor, proprietor, or district..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
          />
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
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((d) => {
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
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
