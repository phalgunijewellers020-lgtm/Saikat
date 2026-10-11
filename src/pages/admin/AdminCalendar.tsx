import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  Plus,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Edit2,
  X,
  Check,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Download,
  CalendarDays,
  List,
} from 'lucide-react';
import { StudioBooking } from '../../types/database';
import { DB } from '../../lib/supabase';

export const AdminCalendar: React.FC = () => {
  const [bookings, setBookings] = useState<StudioBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'calendar' | 'agenda'>('agenda');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  const [formData, setFormData] = useState<Partial<StudioBooking>>({
    client_name: '',
    event_type: 'Bengali Royal Wedding',
    date: new Date().toISOString().split('T')[0],
    status: 'confirmed',
    location: '',
    notes: '',
  });

  const loadBookings = async () => {
    setIsLoading(true);
    try {
      const list = await DB.getBookings();
      setBookings(list);
    } catch (err) {
      console.error('Error loading bookings', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleSaveBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.client_name?.trim() || !formData.date) {
      alert('Client name and date are required.');
      return;
    }
    await DB.saveBooking(formData as any);
    setIsModalOpen(false);
    loadBookings();
  };

  const handleDeleteBooking = async (id: string) => {
    if (confirm('Delete this scheduled shoot from the studio calendar?')) {
      await DB.deleteBooking(id);
      loadBookings();
    }
  };

  // Export iCal (.ics) for calendar sync
  const handleExportIcs = (booking: StudioBooking) => {
    const cleanDate = booking.date.replace(/-/g, '');
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Saikat Photography//Studio Schedule//EN',
      'BEGIN:VEVENT',
      `SUMMARY:Shoot: ${booking.client_name} (${booking.event_type})`,
      `DESCRIPTION:${booking.notes || 'Saikat Photography Production Shoot'}`,
      `LOCATION:${booking.location || 'Kolkata, India'}`,
      `DTSTART;VALUE=DATE:${cleanDate}`,
      `DTEND;VALUE=DATE:${cleanDate}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${booking.client_name.replace(/\s+/g, '_')}_Shoot.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const statusColors = {
    confirmed: 'bg-emerald-950/60 text-emerald-400 border-emerald-500/30',
    tentative: 'bg-amber-950/60 text-amber-400 border-amber-500/30',
    completed: 'bg-blue-950/60 text-blue-400 border-blue-500/30',
    blocked: 'bg-neutral-800 text-neutral-400 border-neutral-700',
  };

  const filteredBookings = bookings.filter((b) => {
    if (filterStatus === 'all') return true;
    return b.status === filterStatus;
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif-display font-medium text-white">
            Studio Shoots & Schedule
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Track booked wedding dates, pre-wedding sessions, portrait sessions, and export to Google Calendar.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center bg-[#141414] p-0.5 rounded border border-white/10">
            <button
              onClick={() => setViewMode('agenda')}
              className={`px-3 py-1.5 text-xs font-semibold rounded flex items-center gap-1.5 cursor-pointer transition-colors ${
                viewMode === 'agenda' ? 'bg-[#D91B24] text-white' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Agenda List</span>
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1.5 text-xs font-semibold rounded flex items-center gap-1.5 cursor-pointer transition-colors ${
                viewMode === 'calendar' ? 'bg-[#D91B24] text-white' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5" />
              <span>Calendar</span>
            </button>
          </div>

          <button
            onClick={() => {
              setFormData({
                client_name: '',
                event_type: 'Bengali Royal Wedding',
                date: new Date().toISOString().split('T')[0],
                status: 'confirmed',
                location: '',
                notes: '',
              });
              setIsModalOpen(true);
            }}
            className="bg-[#D91B24] hover:bg-[#b5141c] text-white text-xs font-semibold px-3.5 py-2 rounded flex items-center gap-1.5 transition-colors cursor-pointer shadow"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Schedule Shoot</span>
          </button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#0B0B0B] p-4 rounded-lg border border-white/10">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-neutral-400 font-medium mr-1">Filter Status:</span>
          {['all', 'confirmed', 'tentative', 'completed', 'blocked'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1 text-xs rounded-full border cursor-pointer capitalize transition-colors ${
                filterStatus === st
                  ? 'bg-white/15 text-white border-white/30 font-semibold'
                  : 'bg-white/5 text-neutral-400 border-white/5 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="text-xs text-neutral-400">
          Showing <span className="text-white font-semibold">{filteredBookings.length}</span> shoots
        </div>
      </div>

      {/* View Content */}
      {viewMode === 'agenda' ? (
        <div className="space-y-3.5">
          {filteredBookings.length === 0 ? (
            <div className="bg-[#0B0B0B] border border-white/10 rounded-lg p-10 text-center text-xs text-neutral-500">
              No shoots currently scheduled for this status filter.
            </div>
          ) : (
            filteredBookings.map((b) => (
              <div
                key={b.id}
                className="bg-[#0B0B0B] border border-white/10 hover:border-white/20 rounded-lg p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all"
              >
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h3 className="text-base font-semibold text-white">{b.client_name}</h3>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border uppercase tracking-wider ${
                        statusColors[b.status] || statusColors.confirmed
                      }`}
                    >
                      {b.status}
                    </span>
                    <span className="text-xs text-neutral-400 bg-white/5 px-2 py-0.5 rounded">
                      {b.event_type}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-400">
                    <span className="flex items-center gap-1.5 text-neutral-300">
                      <CalendarIcon className="w-3.5 h-3.5 text-[#D91B24]" />
                      <strong className="font-semibold text-white">
                        {new Date(b.date).toLocaleDateString(undefined, {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </strong>
                    </span>

                    {b.location && (
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                        <span>{b.location}</span>
                      </span>
                    )}
                  </div>

                  {b.notes && (
                    <p className="text-xs text-neutral-400 italic pt-1">
                      Note: {b.notes}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
                  <button
                    onClick={() => handleExportIcs(b)}
                    className="p-2 rounded bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
                    title="Export iCalendar (.ics)"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>

                  <a
                    href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
                      `Shoot: ${b.client_name} (${b.event_type})`
                    )}&details=${encodeURIComponent(b.notes || '')}&location=${encodeURIComponent(
                      b.location || ''
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
                    title="Open in Google Calendar"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    onClick={() => {
                      setFormData(b);
                      setIsModalOpen(true);
                    }}
                    className="p-2 rounded bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
                    title="Edit booking"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleDeleteBooking(b.id)}
                    className="p-2 rounded bg-white/5 hover:bg-red-950/60 text-neutral-400 hover:text-red-400 border border-white/10 transition-colors cursor-pointer"
                    title="Delete booking"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        /* Simple Clean Calendar Grid */
        <div className="bg-[#0B0B0B] rounded-lg border border-white/10 p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h2 className="text-base font-semibold text-white">Monthly Overview</h2>
            <div className="flex items-center gap-2 text-xs text-neutral-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Confirmed
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 ml-2" /> Tentative
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBookings.map((b) => (
              <div key={b.id} className="bg-white/[0.02] border border-white/5 rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#D91B24] font-mono">{b.date}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase border ${statusColors[b.status]}`}>
                    {b.status}
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-white">{b.client_name}</h4>
                <p className="text-xs text-neutral-400">{b.event_type}</p>
                {b.location && (
                  <p className="text-[11px] text-neutral-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {b.location}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#101010] border border-white/15 rounded-xl max-w-lg w-full p-6 shadow-2xl relative space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-lg font-serif-display font-medium text-white">
                {formData.id ? 'Edit Shoot Reservation' : 'Schedule New Shoot'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBooking} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">
                  Client / Couple Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.client_name || ''}
                  onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                  placeholder="e.g. Debashish & Ananya"
                  className="w-full bg-[#181818] border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D91B24]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">
                    Shoot Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date || ''}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-[#181818] border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D91B24]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">
                    Booking Status
                  </label>
                  <select
                    value={formData.status || 'confirmed'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full bg-[#181818] border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D91B24]"
                  >
                    <option value="confirmed">Confirmed (Deposit Received)</option>
                    <option value="tentative">Tentative (Date Held)</option>
                    <option value="completed">Completed & Delivered</option>
                    <option value="blocked">Blocked / Studio Leave</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">
                  Event / Shoot Discipline
                </label>
                <input
                  type="text"
                  value={formData.event_type || ''}
                  onChange={(e) => setFormData({ ...formData, event_type: e.target.value })}
                  placeholder="e.g. Bengali Royal Wedding, Pre-Wedding, Portrait"
                  className="w-full bg-[#181818] border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D91B24]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">
                  Venue / Location
                </label>
                <input
                  type="text"
                  value={formData.location || ''}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. Vedic Village Resort, Kolkata"
                  className="w-full bg-[#181818] border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D91B24]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">
                  Production Notes & Crew Allocation
                </label>
                <textarea
                  rows={3}
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="e.g. 4-member crew, 2 Sony A7RV + 1 Drone operator, 50k deposit received."
                  className="w-full bg-[#181818] border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D91B24]"
                />
              </div>

              <div className="pt-3 border-t border-white/10 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded bg-white/5 hover:bg-white/10 text-neutral-300 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold rounded bg-[#D91B24] hover:bg-[#b5141c] text-white transition-colors cursor-pointer"
                >
                  Save Shoot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCalendar;
