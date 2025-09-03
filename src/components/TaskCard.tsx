import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Task } from "../redux/slices/taskSlice";
import dayjs from "dayjs";
import { ClockCircleOutlined } from "@ant-design/icons";

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
}

const TaskCard = ({ task, onClick }: TaskCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const isDueToday = task.dueDate && dayjs().isSame(dayjs(task.dueDate), "day");
  const isOverdue = task.dueDate && dayjs().isAfter(dayjs(task.dueDate), "day");

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0 : 1,
  };

  const statusRingClass = isOverdue
    ? "ring-2 ring-red-500"
    : isDueToday
    ? "ring-2 ring-amber-500"
    : "";
  const statusTextColorClass = isOverdue
    ? "text-red-400"
    : isDueToday
    ? "text-amber-400"
    : "text-gray-400";

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className={`bg-slate-700 cursor-pointer rounded-lg shadow-md hover:bg-slate-600 transition-colors overflow-hidden ${statusRingClass}`}
    >
      {/* 1. Title จะอยู่บนสุดเสมอ */}
      <div
        style={{ backgroundColor: task.color }}
        className="p-2.5 text-white font-semibold"
      >
        {task.title}
      </div>

      {/* สร้าง Container ใหม่สำหรับเนื้อหาส่วนที่เหลือ เพื่อให้มี Padding สวยงาม */}
      <div className="p-2.5 space-y-2">
        {/* 2. Details */}
        {task.details && (
          <p className="text-gray-300 text-sm break-words line-clamp-3 min-h-[72px]">
            {task.details}
          </p>
        )}

        {/* 3. รูปภาพ (ย้ายมาอยู่ตรงนี้) */}
        {task.coverImage && (
          <img
            src={task.coverImage}
            alt={task.title}
            className="w-full object-cover rounded-md" // ปรับมุมเล็กน้อยให้สวยงาม
          />
        )}

        {/* 4. Due Date */}
        {task.dueDate && (
          <div
            className={`text-xs flex items-center gap-2 ${statusTextColorClass}`}
          >
            <ClockCircleOutlined />
            <span>{dayjs(task.dueDate).format("DD MMM")}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
