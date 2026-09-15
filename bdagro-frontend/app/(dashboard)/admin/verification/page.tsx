import { MapPin, Check, X } from "lucide-react";

const nidQueue = [
  { name: "আব্দুল করিম", location: "কুমিল্লা", nid: "৩৪৫৬ XXXX XXXX", submitted: "২ ঘণ্টা আগে" },
  { name: "সালমা বেগম", location: "রাজশাহী", nid: "৭৭২১ XXXX XXXX", submitted: "৫ ঘণ্টা আগে" },
  { name: "রফিকুল ইসলাম", location: "দিনাজপুর", nid: "৯০১২ XXXX XXXX", submitted: "গতকাল" },
  { name: "মনির হোসেন", location: "দিনাজপুর", nid: "৪৪৫৬ XXXX XXXX", submitted: "গতকাল" },
  { name: "শিরিন আক্তার", location: "গাজীপুর", nid: "৫৫৬৭ XXXX XXXX", submitted: "২ দিন আগে" },
];

const projectQueue = [
  { name: "লিচু বাগান সম্প্রসারণ", farmer: "মনির হোসেন", location: "দিনাজপুর", goal: "৪,৫০,০০০", risk: "মাঝারি" },
  { name: "পোল্ট্রি খামার", farmer: "শিরিন আক্তার", location: "গাজীপুর", goal: "৩,০০,০০০", risk: "কম" },
  { name: "তরমুজ চাষ", farmer: "কামাল হোসেন", location: "পটুয়াখালী", goal: "২,২০,০০০", risk: "বেশি" },
];

export default function AdminPendingVerificationsPage() {
  return (
    <div className="bg-white min-h-screen flex">
      {/* MAIN */}
      <div className="flex-1 min-w-0">
        <div className="p-8">
          {/* TABS */}
          <div className="flex gap-2 border-b border-neutral-200 mb-6">
            <button className="px-4 py-2.5 text-sm border-b-2 border-primary-800 text-primary-900 -mb-px">
              NID যাচাই ({nidQueue.length})
            </button>
            <button className="px-4 py-2.5 text-sm border-b-2 border-transparent text-neutral-400 hover:text-neutral-700 -mb-px">
              প্রকল্প অনুমোদন ({projectQueue.length})
            </button>
          </div>

          {/* NID VERIFICATION LIST */}
          <div className="border border-neutral-200">
            <div className="divide-y divide-neutral-200">
              {nidQueue.map((u) => (
                <div key={u.name} className="p-5 flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500 text-sm shrink-0">
                      {u.name[0]}
                    </div>
                    <div>
                      <div className="text-sm text-neutral-800">{u.name}</div>
                      <div className="flex items-center gap-1 text-xs text-neutral-400 mt-0.5">
                        <MapPin className="w-3 h-3" />
                        {u.location}
                        <span className="mx-1">·</span>
                        NID: {u.nid}
                        <span className="mx-1">·</span>
                        {u.submitted}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button className="text-xs border border-neutral-300 text-neutral-600 px-3 py-1.5 hover:border-primary-800 hover:text-primary-900">
                      বিস্তারিত দেখুন
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center border border-primary-600 text-primary-700 hover:bg-primary-50">
                      <Check className="w-4 h-4" />
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center border border-danger-500 text-danger-600 hover:bg-danger-50">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* PROJECT APPROVAL LIST */}
          <div className="mt-10">
            <h3 className="text-neutral-900 mb-4">
              প্রকল্প অনুমোদন অপেক্ষমাণ
            </h3>
            <div className="border border-neutral-200">
              <div className="divide-y divide-neutral-200">
                {projectQueue.map((p) => (
                  <div key={p.name} className="p-5">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div>
                        <div className="text-sm text-neutral-800">{p.name}</div>
                        <div className="text-xs text-neutral-400 mt-1">
                          কৃষক: {p.farmer} ·{" "}
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {p.location}
                          </span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-sm text-neutral-800">৳{p.goal}</div>
                        <div className="text-xs text-neutral-400 mt-0.5">ঝুঁকি: {p.risk}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-4">
                      <button className="flex-1 border border-primary-800 bg-primary-900 text-white py-2 text-sm hover:bg-primary-800">
                        অনুমোদন করুন
                      </button>
                      <button className="flex-1 border border-neutral-300 text-neutral-600 py-2 text-sm hover:border-danger-500 hover:text-danger-600">
                        প্রত্যাখ্যান করুন
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
