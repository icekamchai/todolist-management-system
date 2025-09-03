import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState, AppDispatch } from "../redux/store";
import {
  Button,
  Modal,
  Form,
  Input,
  Select,
  Popconfirm,
  Radio,
  Dropdown,
  Menu,
  Tag,
  Upload,
  Image,
  DatePicker,
} from "antd";
import {
  EllipsisOutlined,
  EditOutlined,
  DeleteOutlined,
  LogoutOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  createTask,
  updateTask,
  deleteTask,
  createCategory,
  updateCategory,
  deleteCategory,
  setTasks,
} from "../redux/slices/taskSlice";
import { logout } from "../redux/slices/authSlice";
import TaskCard from "../components/TaskCard";
import toast from "react-hot-toast";
import type { Task, Category } from "../redux/slices/taskSlice";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  useDroppable,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import dayjs from "dayjs";

const { Option } = Select;
const predefinedColors = [
  "#2dd4bf",
  "#f472b6",
  "#a78bfa",
  "#facc15",
  "#fb923c",
  "#60a5fa",
];

const CategoryColumn = ({
  category,
  children,
}: {
  category: Category;
  children: React.ReactNode;
}) => {
  const { setNodeRef } = useDroppable({ id: category.id });
  return <div ref={setNodeRef}>{children}</div>;
};

const getBase64 = (file: File, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result as string));
  reader.readAsDataURL(file);
};

const Dashboard = () => {
  const { tasks, categories } = useSelector((state: RootState) => state.tasks);
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const [searchQuery, setSearchQuery] = useState("");

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [modalMode, setModalMode] = useState<"view" | "edit">("view");

  const [addingInColumn, setAddingInColumn] = useState<string | null>(null);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [isEditCategoryModalVisible, setIsEditCategoryModalVisible] =
    useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [editForm] = Form.useForm();
  const [addForm] = Form.useForm();
  const [categoryForm] = Form.useForm();
  const [editCategoryForm] = Form.useForm();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const watchedColor = Form.useWatch("color", editForm);

  useEffect(() => {
    if (modalMode === "edit" && selectedTask) {
      const formValues = {
        ...selectedTask,
        dueDate: selectedTask.dueDate ? dayjs(selectedTask.dueDate) : null,
      };
      editForm.setFieldsValue(formValues);
    } else {
      editForm.resetFields();
    }
  }, [modalMode, selectedTask, editForm]);

  const handleCardClick = (task: Task) => {
    setSelectedTask(task);
    setModalMode("view");
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setSelectedTask(null);
  };

  const handleEditFormSubmit = (values: any) => {
    if (selectedTask) {
      const updatedTask = { ...selectedTask, ...values };
      dispatch(updateTask(updatedTask));
      toast.success("Task updated!");
      handleModalCancel();
    }
  };

  const handleDeleteTask = () => {
    if (selectedTask) {
      dispatch(deleteTask(selectedTask.id));
      toast.error("Task deleted!");
      handleModalCancel();
    }
  };

  const handleInlineAdd = (values: { title: string }, categoryName: string) => {
    if (!values.title || !values.title.trim()) return;
    dispatch(
      createTask({
        title: values.title,
        category: categoryName,
        color: predefinedColors[0],
      })
    );
    addForm.resetFields();
    setAddingInColumn(null);
  };

  const handleCreateCategory = (values: { categoryName: string }) => {
    if (!values.categoryName || !values.categoryName.trim()) {
      setIsAddingCategory(false);
      return;
    }

    dispatch(
      createCategory({
        id: Date.now().toString(),
        name: values.categoryName,
      })
    );
    toast.success(`Category "${values.categoryName}" created!`);
    categoryForm.resetFields();
    setIsAddingCategory(false);
  };

  const handleOpenEditCategoryModal = (category: Category) => {
    setEditingCategory(category);
    editCategoryForm.setFieldsValue({ name: category.name });
    setIsEditCategoryModalVisible(true);
  };

  const handleEditCategorySubmit = (values: { name: string }) => {
    if (editingCategory) {
      dispatch(updateCategory({ id: editingCategory.id, name: values.name }));
      toast.success("List renamed!");
      setIsEditCategoryModalVisible(false);
      setEditingCategory(null);
    }
  };

  const handleDeleteCategory = (categoryId: string) => {
    dispatch(deleteCategory(categoryId));
    toast.error("List deleted!");
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find((t) => t.id === active.id);
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;

    if (!over) return;
    if (active.id === over.id) return;

    const activeTask = tasks.find((t) => t.id === active.id);
    if (!activeTask) return;

    const overId = over.id;
    const overTask = tasks.find((t) => t.id === overId);
    const overCategory = overTask
      ? categories.find((c) => c.name === overTask.category)
      : categories.find((c) => c.id === overId);

    if (!overCategory) return;

    const oldIndex = tasks.findIndex((t) => t.id === active.id);
    let newIndex;

    if (overTask) {
      newIndex = tasks.findIndex((t) => t.id === overId);
    } else {
      const tasksInOverCategory = tasks.filter(
        (t) => t.category === overCategory.name
      );
      newIndex = oldIndex + tasksInOverCategory.length;
    }

    const updatedTasks = tasks.map((t) =>
      t.id === active.id ? { ...t, category: overCategory.name } : t
    );

    dispatch(setTasks(arrayMove(updatedTasks, oldIndex, newIndex)));
  };

  const filteredTasks = useMemo(() => {
    if (!searchQuery) {
      return tasks;
    }
    return tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.details?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [tasks, searchQuery]);

  const handleBeforeUpload = (file: File) => {
    getBase64(file, (imageUrl) => {
      editForm.setFieldsValue({ coverImage: imageUrl });
    });
    return false;
  };

  return (
    <div className="flex flex-col h-screen bg-slate-900 font-sans">
      <nav className="w-full bg-slate-800 p-4 shadow-lg flex-shrink-0 border-b border-slate-700 flex justify-between items-center gap-4">
        <div className="w-1/3">
          <h1 className="text-xl font-bold text-teal-400 truncate">
            ToDoList Management
          </h1>
        </div>

        <div className="w-1/3">
          <Input.Search
            placeholder="Search tasks..."
            allowClear
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="w-1/3 flex justify-end">
          <Button
            type="text"
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            className="text-gray-400 hover:text-white"
          >
            Logout
          </Button>
        </div>
      </nav>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        autoScroll={false}
      >
        <main className="flex-grow flex gap-4 p-4 overflow-x-auto items-start">
          {categories.map((category) => {
            const categoryTasks = filteredTasks.filter(
              (t) => t.category === category.name
            );
            const categoryMenu = (
              <Menu>
                <Menu.Item
                  key="1"
                  onClick={() => handleOpenEditCategoryModal(category)}
                >
                  Edit list name
                </Menu.Item>
                <Menu.Item key="2" danger>
                  <Popconfirm
                    title="Delete this list?"
                    description="All cards in this list will be deleted."
                    onConfirm={() => handleDeleteCategory(category.id)}
                    okText="Yes, Delete"
                    cancelText="No"
                  >
                    Delete this list
                  </Popconfirm>
                </Menu.Item>
              </Menu>
            );

            return (
              <CategoryColumn key={category.id} category={category}>
                <div className="bg-slate-800 p-2 rounded-xl w-80 flex-shrink-0 flex flex-col h-full">
                  <div className="flex justify-between items-center px-2 py-1 mb-2">
                    <h2 className="font-bold text-gray-200 flex items-center gap-2">
                      {category.name}
                      <span className="text-sm font-normal text-gray-400 bg-slate-700 px-2 py-0.5 rounded-full">
                        {categoryTasks.length}
                      </span>
                    </h2>
                    <Dropdown overlay={categoryMenu} trigger={["click"]}>
                      <Button
                        type="text"
                        icon={<EllipsisOutlined className="text-gray-400" />}
                      />
                    </Dropdown>
                  </div>
                  <div className="space-y-2 overflow-y-auto flex-grow hide-scrollbar min-h-[100px]">
                    <SortableContext
                      items={categoryTasks.map((t) => t.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      {categoryTasks.map((task) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          onClick={() => handleCardClick(task)}
                        />
                      ))}
                    </SortableContext>
                  </div>
                  {addingInColumn === category.name ? (
                    <Form
                      form={addForm}
                      onFinish={(values) =>
                        handleInlineAdd(values, category.name)
                      }
                      className="mt-2"
                    >
                      <Form.Item name="title" className="mb-2">
                        <Input.TextArea
                          autoSize
                          placeholder="Enter a title for this card..."
                        />
                      </Form.Item>
                      <div className="flex items-center gap-2">
                        <Button
                          type="primary"
                          htmlType="submit"
                          className="bg-teal-500 hover:bg-teal-600 border-none"
                        >
                          Add card
                        </Button>
                        <Button
                          type="text"
                          onClick={() => setAddingInColumn(null)}
                          className="text-gray-400"
                        >
                          Cancel
                        </Button>
                      </div>
                    </Form>
                  ) : (
                    <Button
                      type="text"
                      onClick={() => setAddingInColumn(category.name)}
                      className="mt-2 w-full text-left text-gray-400 hover:bg-slate-700"
                    >
                      + Add a card
                    </Button>
                  )}
                </div>
              </CategoryColumn>
            );
          })}

          <div className="bg-slate-800 bg-opacity-50 hover:bg-opacity-100 transition-colors p-2 rounded-xl w-80 flex-shrink-0">
            {isAddingCategory ? (
              <Form form={categoryForm} onFinish={handleCreateCategory}>
                <Form.Item name="categoryName" className="mb-2">
                  <Input placeholder="Enter list title..." />
                </Form.Item>
                <div className="flex items-center gap-2">
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="bg-teal-500 hover:bg-teal-600 border-none"
                  >
                    Add list
                  </Button>
                  <Button
                    type="text"
                    onClick={() => setIsAddingCategory(false)}
                    className="text-gray-400"
                  >
                    Cancel
                  </Button>
                </div>
              </Form>
            ) : (
              <Button
                type="text"
                onClick={() => setIsAddingCategory(true)}
                className="w-full text-left text-gray-200 font-semibold"
              >
                + Add another list
              </Button>
            )}
          </div>
        </main>

        <DragOverlay>
          {activeTask ? <TaskCard task={activeTask} /> : null}
        </DragOverlay>
      </DndContext>
      <Modal
        open={isModalVisible}
        onCancel={handleModalCancel}
        destroyOnClose
        centered
        title={
          modalMode === "view" && selectedTask ? (
            <div className="flex items-center gap-2">
              <div
                style={{ backgroundColor: selectedTask.color }}
                className="w-4 h-4 rounded-sm"
              />
              <span className="font-bold text-lg">{selectedTask.title}</span>
            </div>
          ) : (
            "Edit Task"
          )
        }
        footer={
          modalMode === "view"
            ? [
                <Button key="close" onClick={handleModalCancel}>
                  Close
                </Button>,
                <Popconfirm
                  key="delete"
                  title="Delete this task?"
                  onConfirm={handleDeleteTask}
                  okText="Yes, Delete"
                  cancelText="No"
                >
                  <Button icon={<DeleteOutlined />} danger>
                    Delete
                  </Button>
                </Popconfirm>,
                <Button
                  key="edit"
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={() => setModalMode("edit")}
                >
                  Edit
                </Button>,
              ]
            : [
                <Button key="back" onClick={() => setModalMode("view")}>
                  Back
                </Button>,
                <Button
                  key="submit"
                  type="primary"
                  className="bg-teal-500 hover:bg-teal-600 border-none"
                  onClick={() => editForm.submit()}
                >
                  Save Changes
                </Button>,
              ]
        }
      >
        {modalMode === "view" && selectedTask ? (
          <div className="space-y-4">
            {selectedTask.coverImage && (
              <Image
                src={selectedTask.coverImage}
                alt="cover"
                className="rounded-md"
              />
            )}
            <div>
              <h3 className="font-semibold text-gray-400">Category</h3>
              <Tag>{selectedTask.category}</Tag>
            </div>
            {selectedTask.details && (
              <div>
                <h3 className="font-semibold text-gray-400">Details</h3>
                <p className="text-gray-200 whitespace-pre-wrap">
                  {selectedTask.details}
                </p>
              </div>
            )}
            {selectedTask.dueDate && (
              <div>
                <h3 className="font-semibold text-gray-400">Due Date</h3>
                {(() => {
                  const isDueToday = dayjs().isSame(
                    dayjs(selectedTask.dueDate),
                    "day"
                  );
                  const isOverdue = dayjs().isAfter(
                    dayjs(selectedTask.dueDate),
                    "day"
                  );

                  return (
                    <div className="flex items-center gap-2">
                      <p className="text-gray-200">
                        {dayjs(selectedTask.dueDate).format("DD MMMM YYYY")}
                      </p>
                      {isOverdue && <Tag color="red">Overdue</Tag>}
                      {isDueToday && <Tag color="warning">Due Today</Tag>}
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        ) : (
          <Form
            form={editForm}
            layout="vertical"
            onFinish={handleEditFormSubmit}
          >
            <Form.Item name="title" label="Title">
              <Input />
            </Form.Item>
            <Form.Item name="details" label="Details">
              <Input.TextArea rows={4} />
            </Form.Item>
            <Form.Item name="category" label="Category">
              <Select>
                {categories.map((c) => (
                  <Option key={c.id} value={c.name}>
                    {c.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="dueDate" label="Due Date">
              <DatePicker className="w-full" />
            </Form.Item>
            <Form.Item name="color" label="Label Color">
              <Radio.Group>
                {predefinedColors.map((color) => (
                  <Radio.Button
                    key={color}
                    value={color}
                    className={
                      watchedColor === color ? "ring-2 ring-teal-400" : ""
                    }
                    style={{
                      backgroundColor: color,
                      width: "40px",
                      height: "32px",
                      border: "none",
                      marginRight: "8px",
                    }}
                  />
                ))}
              </Radio.Group>
            </Form.Item>
            <Form.Item name="coverImage" label="Cover Image">
              <Upload
                name="avatar"
                listType="picture"
                showUploadList={false}
                beforeUpload={handleBeforeUpload}
                accept="image/*"
              >
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
              </Upload>
            </Form.Item>

            <Form.Item
              shouldUpdate={(prevValues, curValues) =>
                prevValues.coverImage !== curValues.coverImage
              }
            >
              {({ getFieldValue }) => {
                const coverImage = getFieldValue("coverImage");
                return coverImage ? (
                  <Image
                    src={coverImage}
                    alt="preview"
                    className="rounded-md mt-2"
                  />
                ) : null;
              }}
            </Form.Item>
          </Form>
        )}
      </Modal>

      <Modal
        title="Edit list name"
        open={isEditCategoryModalVisible}
        onCancel={() => setIsEditCategoryModalVisible(false)}
        onOk={() => editCategoryForm.submit()}
        centered
      >
        <Form
          form={editCategoryForm}
          layout="vertical"
          onFinish={handleEditCategorySubmit}
        >
          <Form.Item
            name="name"
            label="List name"
            rules={[{ required: true, message: "Please enter a list name." }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Dashboard;
