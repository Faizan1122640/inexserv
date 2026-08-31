import React, { useState } from 'react';
import {
  MessageSquare,
  Search,
  Filter,
  Plus,
  Trash2,
  Download,
  Mail,
  Phone,
  Building,
  Calendar,
  Clock,
  CheckCircle2,
  RefreshCw,
  X,
  ExternalLink
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export default function AdminLeadsManager({
  leads = [],
  loading = false,
  onRefresh,
  onLeadDeleted,
  onLeadCreated
}) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');
  const [newLead, setNewLead] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    status: 'New',
    notes: ''
  });

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      (lead.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (lead.email || '').toLowerCase().includes(search.toLowerCase()) ||
      (lead.company || '').toLowerCase().includes(search.toLowerCase()) ||
      (lead.notes || '').toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === 'ALL' ||
      (lead.status || 'New').toUpperCase() === statusFilter.toUpperCase();

    return matchesSearch && matchesStatus;
  });

  const handleDeleteLead = async (leadId) => {
    if (!window.confirm('Are you sure you want to delete this lead inquiry?')) {
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/leads/${leadId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        if (onLeadDeleted) onLeadDeleted(leadId);
      } else {
        const json = await res.json();
        alert('Error deleting lead: ' + (json.error || 'Unknown error'));
      }
    } catch (err) {
      alert('Network error deleting lead: ' + err.message);
    }
  };

  const handleCreateLead = async (e) => {
    e.preventDefault();
    setCreateError('');
    setCreating(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLead)
      });
      const json = await res.json();
      if (res.ok && json.success) {
        if (onLeadCreated) onLeadCreated(json.data);
        setShowAddModal(false);
        setNewLead({
          name: '',
          email: '',
          phone: '',
          company: '',
          status: 'New',
          notes: ''
        });
      } else {
        setCreateError(json.error || 'Failed to create lead');
      }
    } catch (err) {
      setCreateError('Network error: ' + err.message);
    } finally {
      setCreating(false);
    }
  };

  const exportToCSV = () => {
    if (leads.length === 0) {
      alert('No leads available to export.');
      return;
    }

    const headers = ['ID', 'Name', 'Email', 'Phone', 'Company', 'Status', 'Notes', 'Created At'];
    const rows = leads.map(l => [
      `"${l.id || ''}"`,
      `"${l.name || ''}"`,
      `"${l.email || ''}"`,
      `"${l.phone || ''}"`,
      `"${l.company || ''}"`,
      `"${l.status || 'New'}"`,
      `"${(l.notes || '').replace(/"/g, '""')}"`,
      `"${l.created_at || ''}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `inexserv-leads-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h2 className="text-xl font-extrabold text-[#0f2b48] flex items-center gap-2.5">
            <MessageSquare className="w-5 h-5 text-[#04A552]" />
            <span>Customer Leads &amp; Inquiries</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Real-time messages submitted from contact forms and service inquiries.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={onRefresh}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Refresh Leads"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={exportToCSV}
            className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#074476]" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-xl bg-[#04A552] hover:bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-900/10 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Lead</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search leads by name, email, company..."
            className="w-full bg-slate-50 text-xs text-slate-800 placeholder-slate-400 pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#04A552] focus:bg-white transition-all"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {['ALL', 'New', 'Contacted', 'In Progress', 'Closed'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                statusFilter.toUpperCase() === status.toUpperCase()
                  ? 'bg-[#074476] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Leads Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {filteredLeads.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-700">No leads found</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              {search || statusFilter !== 'ALL'
                ? 'Try adjusting your search criteria or filter to see more results.'
                : 'Customer inquiries will appear here automatically when submitted from your website.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-5">Lead / Contact</th>
                  <th className="py-3.5 px-5">Company / Notes</th>
                  <th className="py-3.5 px-5">Status</th>
                  <th className="py-3.5 px-5">Received At</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredLeads.map((lead) => {
                  const status = lead.status || 'New';
                  let statusBg = 'bg-blue-50 text-blue-700 border-blue-200';
                  if (status.toLowerCase() === 'new') statusBg = 'bg-emerald-50 text-emerald-700 border-emerald-200';
                  if (status.toLowerCase() === 'contacted') statusBg = 'bg-amber-50 text-amber-700 border-amber-200';
                  if (status.toLowerCase() === 'closed') statusBg = 'bg-slate-100 text-slate-600 border-slate-200';

                  return (
                    <tr key={lead.id || Math.random()} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-4 px-5">
                        <div className="font-bold text-[#0f2b48]">{lead.name || 'Anonymous'}</div>
                        <div className="flex items-center gap-3 text-slate-500 text-[11px] mt-1">
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3 text-slate-400" />
                            <a href={`mailto:${lead.email}`} className="hover:underline">{lead.email}</a>
                          </span>
                          {lead.phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3 text-slate-400" />
                              <a href={`tel:${lead.phone}`} className="hover:underline">{lead.phone}</a>
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-4 px-5">
                        {lead.company && (
                          <div className="font-semibold text-slate-700 flex items-center gap-1.5">
                            <Building className="w-3 h-3 text-slate-400" />
                            <span>{lead.company}</span>
                          </div>
                        )}
                        {lead.notes && (
                          <p className="text-slate-500 text-[11px] mt-0.5 line-clamp-2 italic">
                            "{lead.notes}"
                          </p>
                        )}
                      </td>

                      <td className="py-4 px-5">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold border ${statusBg}`}>
                          {status}
                        </span>
                      </td>

                      <td className="py-4 px-5 text-slate-400 text-[11px] whitespace-nowrap">
                        {lead.created_at ? new Date(lead.created_at).toLocaleString() : 'Just now'}
                      </td>

                      <td className="py-4 px-5 text-right whitespace-nowrap space-x-1">
                        <button
                          onClick={() => setSelectedLead(lead)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-[#074476] hover:bg-slate-100 transition-colors cursor-pointer"
                          title="View Complete Lead Details & Form Fields"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteLead(lead.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                          title="Delete Lead"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Lead Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4 my-auto max-h-[90vh] overflow-y-auto animate-fadeIn">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#0f2b48] flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#04A552]" />
                <span>Add New Lead</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {createError && (
              <div className="bg-red-50 text-red-700 p-3 rounded-xl text-xs border border-red-200">
                {createError}
              </div>
            )}

            <form onSubmit={handleCreateLead} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={newLead.name}
                  onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                  placeholder="e.g. John Doe"
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#04A552]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={newLead.email}
                  onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                  placeholder="e.g. john@company.com"
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#04A552]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone</label>
                  <input
                    type="text"
                    value={newLead.phone}
                    onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#04A552]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Company</label>
                  <input
                    type="text"
                    value={newLead.company}
                    onChange={(e) => setNewLead({ ...newLead, company: e.target.value })}
                    placeholder="Acme Corp"
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#04A552]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
                <select
                  value={newLead.status}
                  onChange={(e) => setNewLead({ ...newLead, status: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#04A552]"
                >
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Inquiry / Notes</label>
                <textarea
                  rows={3}
                  value={newLead.notes}
                  onChange={(e) => setNewLead({ ...newLead, notes: e.target.value })}
                  placeholder="Details of client requirements or inquiry message..."
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#04A552]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-4 py-2 text-xs font-bold text-white bg-[#04A552] hover:bg-emerald-600 rounded-xl transition-colors shadow-md cursor-pointer disabled:opacity-50"
                >
                  {creating ? 'Saving...' : 'Add Lead'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Lead Details & Custom Form Fields Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-5 my-auto max-h-[90vh] overflow-y-auto animate-fadeIn font-sans">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Lead Inquiry Details
                </span>
                <h3 className="text-lg font-bold text-[#0f2b48]">
                  {selectedLead.name || 'Anonymous Inquiry'}
                </h3>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Email Address</span>
                <a href={`mailto:${selectedLead.email}`} className="text-xs font-bold text-[#074476] hover:underline break-all">
                  {selectedLead.email || 'N/A'}
                </a>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Phone Number</span>
                <a href={`tel:${selectedLead.phone}`} className="text-xs font-bold text-[#074476] hover:underline">
                  {selectedLead.phone || 'N/A'}
                </a>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Company / Organization</span>
                <span className="text-xs font-bold text-slate-700">
                  {selectedLead.company || 'N/A'}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Status</span>
                <span className="text-xs font-bold text-emerald-700">
                  {selectedLead.status || 'New'}
                </span>
              </div>
            </div>

            {/* Custom Dynamic Form Fields */}
            {selectedLead.formData && Object.keys(selectedLead.formData).length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#0f2b48] block">Custom Form Submission Data</span>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                  {Object.entries(selectedLead.formData)
                    .filter(([key]) => !['id', 'created_at', 'status'].includes(key))
                    .map(([key, val]) => (
                      <div key={key} className="flex flex-col sm:flex-row sm:justify-between sm:items-start text-xs border-b border-slate-200/60 pb-1.5 last:border-b-0 last:pb-0 gap-1">
                        <span className="font-bold text-slate-600 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}:
                        </span>
                        <span className="text-slate-800 font-medium sm:text-right max-w-xs break-words">
                          {typeof val === 'boolean' ? (val ? 'Yes' : 'No') : String(val || 'N/A')}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Notes / Message */}
            {selectedLead.notes && (
              <div className="space-y-1">
                <span className="text-xs font-bold text-[#0f2b48] block">Inquiry Message / Notes</span>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                  {selectedLead.notes}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-400">
              <span>Submitted: {selectedLead.created_at ? new Date(selectedLead.created_at).toLocaleString() : 'N/A'}</span>
              <button
                type="button"
                onClick={() => setSelectedLead(null)}
                className="px-4 py-2 bg-[#074476] text-white rounded-xl text-xs font-bold hover:bg-[#05335a] transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
