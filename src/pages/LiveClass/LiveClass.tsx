import type { ReactElement } from "react";
import MeetingImg from "../../assets/undraw_meeting_re_i53h.png";

export default function LiveClass(): ReactElement {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow p-4 text-center text-lg font-semibold">Live Class</div>

      <div className="bg-white rounded-xl shadow-soft p-4">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button className="px-4 py-2 rounded-md bg-[#13A541] text-white text-sm">All meetings</button>
          <button className="px-4 py-2 rounded-md bg-white border text-sm">Today</button>
          <button className="px-4 py-2 rounded-md bg-white border text-sm">Tomorrow</button>
          <button className="px-4 py-2 rounded-md bg-white border text-sm">Invitation</button>
        </div>

        {/* Empty state */}
        <div className="py-16 text-center">
          <img
            src={MeetingImg}
            alt="No meetings"
            className="w-[420px] h-auto mx-auto mb-4"
          />
          <p className="text-gray-600">No meeting found</p>
        </div>
      </div>
    </div>
  );
}
