"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  doc,
  getDoc,
  collection,
  updateDoc,
  addDoc,
  query,
  where,
  FirestoreError,
  onSnapshot,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Timestamp } from "firebase/firestore";
import { CheckSquare, Square, Trash2, Edit, MinusCircle } from "lucide-react";
import AuthCheck from "@/components/AuthCheck";

interface Task {
  id: string;
  task: string;
  period_frequency: number;
  period: number;
  status: boolean;
  date_created: Timestamp;
  completions_count: number;
}

interface User {
  displayName: string;
  photoURL: string;
  reps?: number; // Renamed from lifetime_reps to match Firestore field
  monthly_reps?: number;
  total_monthly_possible_reps?: number; // Renamed from monthly_possible_reps to match Firestore field
  potential_discount?: number;
}

// Task item component for better code organization
function TaskItem({
  task,
  isEditing,
  editTaskName,
  editTaskFrequency,
  editTaskPeriod,
  onSaveEdit,
  onCancelEdit,
  onStartEdit,
  onComplete,
  onDecrement,
  onDelete,
  setEditTaskName,
  setEditTaskFrequency,
  setEditTaskPeriod,
}: {
  task: Task;
  isEditing: boolean;
  editTaskName: string;
  editTaskFrequency: number;
  editTaskPeriod: number;
  onSaveEdit: (e: React.FormEvent) => Promise<void>;
  onCancelEdit: () => void;
  onStartEdit: (task: Task) => void;
  onComplete: (taskId: string) => Promise<void>;
  onDecrement: (taskId: string) => Promise<void>;
  onDelete: (taskId: string) => Promise<void>;
  setEditTaskName: (name: string) => void;
  setEditTaskFrequency: (freq: number) => void;
  setEditTaskPeriod: (period: number) => void;
}) {
  if (isEditing) {
    return (
      <form onSubmit={onSaveEdit} className="p-4 bg-gray-50 rounded-lg">
        <div className="flex flex-col gap-3 mb-4">
          <input
            type="text"
            value={editTaskName}
            onChange={(e) => setEditTaskName(e.target.value)}
            placeholder="Enter a task"
            className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-1 focus:ring-secondary focus:border-transparent"
            required
          />
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={editTaskFrequency}
              onChange={(e) =>
                setEditTaskFrequency(parseInt(e.target.value) || 1)
              }
              className="w-16 rounded-md border border-gray-300 px-2 py-2 focus:outline-none focus:ring-1 focus:ring-secondary focus:border-transparent"
              min="1"
              max="31"
              required
            />
            <span className="text-gray-600">times every</span>
            <input
              type="number"
              value={editTaskPeriod}
              onChange={(e) => setEditTaskPeriod(parseInt(e.target.value) || 1)}
              className="w-16 rounded-md border border-gray-300 px-2 py-2 focus:outline-none focus:ring-1 focus:ring-secondary focus:border-transparent"
              min="1"
              max="14"
              required
            />
            <span className="text-gray-600">days</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button type="submit" className="flex-1">
            Save
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancelEdit}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </form>
    );
  }

  return (
    <div className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      {/* Left side: Checkbox and Task Info */}
      <div className="flex items-start mr-4">
        <button
          onClick={() => onComplete(task.id)}
          className="mr-3 mt-1 text-gray-500 hover:text-green-500 transition-colors focus:outline-none flex-shrink-0"
          aria-label="Complete task"
        >
          {task.completions_count === task.period_frequency ? (
            <CheckSquare className="h-6 w-6 text-green-500" />
          ) : (
            <Square className="h-6 w-6" />
          )}
        </button>

        <div className="min-w-0 w-40">
          <h3 className="font-medium truncate">{task.task}</h3>
          <p className="text-sm text-gray-500 truncate">
            {task.period_frequency}{" "}
            {task.period_frequency === 1 ? "time" : "times"} every {task.period}{" "}
            {task.period === 1 ? "day" : "days"}
          </p>
        </div>
      </div>

      {/* Middle: Status Bar (takes most space) */}
      <div className="flex-1 bg-gray-200 rounded-full h-2.5 mx-2">
        <div
          className="bg-green-500 h-2.5 rounded-full transition-all duration-300 ease-in-out"
          style={{
            width: `${(task.completions_count / task.period_frequency) * 100}%`,
          }}
        ></div>
      </div>

      {/* Right side: Counter and Actions */}
      <div className="flex items-center gap-3 ml-2 flex-shrink-0">
        <div className="flex-shrink-0 bg-gray-200 px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap">
          {task.completions_count}/{task.period_frequency}
        </div>

        {/* Action buttons */}
        <div className="flex gap-1">
          {task.completions_count > 0 && (
            <button
              onClick={() => onDecrement(task.id)}
              className="p-1 text-gray-500 hover:text-orange-500 transition-colors focus:outline-none"
              aria-label="Decrement completion"
            >
              <MinusCircle className="h-5 w-5" />
            </button>
          )}

          <button
            onClick={() => onStartEdit(task)}
            className="p-1 text-gray-500 hover:text-blue-500 transition-colors focus:outline-none"
            aria-label="Edit task"
          >
            <Edit className="h-5 w-5" />
          </button>

          <button
            onClick={() => onDelete(task.id)}
            className="p-1 text-gray-500 hover:text-red-500 transition-colors focus:outline-none"
            aria-label="Delete task"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function DashboardContent() {
  const [user, setUser] = useState<User>({
    displayName: "Loading...",
    photoURL: "/happy-dog-sideways.png",
  });

  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Use useEffect with proper cleanup for Firebase 11
  useEffect(() => {
    let isMounted = true;
    let unsubscribeTasks: (() => void) | null = null;

    const fetchUserDataAndTasks = async () => {
      try {
        const currentUser = auth.currentUser;

        if (!currentUser) {
          console.error("No authenticated user found");
          if (isMounted) setError("No authenticated user found");
          return;
        }

        const userDocRef = doc(db, "users", currentUser.uid);

        // Get user data
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
          console.error("User document not found in Firestore");
          if (isMounted) setError("User document not found");
          return;
        }

        const userData = userDoc.data() as User;

        if (isMounted) {
          // Set user data from Firestore
          setUser({
            displayName: currentUser.displayName || "User",
            photoURL: currentUser.photoURL || "/happy-dog-sideways.png",
            reps: userData.reps || 0,
            monthly_reps: userData.monthly_reps || 0,
            total_monthly_possible_reps:
              userData.total_monthly_possible_reps || 0,
            potential_discount: userData.potential_discount || 0,
          });
        }

        // Use real-time listener for tasks with Firebase 11
        const tasksCollectionRef = collection(userDocRef, "tasks");
        const tasksQuery = query(
          tasksCollectionRef,
          where("status", "==", true)
        );

        unsubscribeTasks = onSnapshot(
          tasksQuery,
          (snapshot) => {
            if (!isMounted) return;

            const fetchedTasks: Task[] = [];
            snapshot.forEach((doc) => {
              const taskData = doc.data() as Omit<Task, "id">;
              fetchedTasks.push({
                id: doc.id,
                ...taskData,
                // Ensure all required fields have default values if missing
                task: taskData.task || "",
                period_frequency: taskData.period_frequency || 1,
                period: taskData.period || 7,
                status: true,
                date_created:
                  taskData.date_created || Timestamp.fromDate(new Date()),
                completions_count: taskData.completions_count || 0,
              });
            });

            setTasks(fetchedTasks);
            setLoading(false);
          },
          (error) => {
            const firestoreError = error as FirestoreError;
            console.error(
              `Error fetching tasks: ${firestoreError.code}`,
              firestoreError
            );
            if (isMounted) {
              setError(`Error fetching tasks: ${firestoreError.message}`);
              setLoading(false);
            }
          }
        );
      } catch (error) {
        const firestoreError = error as FirestoreError;
        console.error(
          `Error fetching user data: ${firestoreError.code}`,
          firestoreError
        );
        if (isMounted) {
          setError(`Error fetching user data: ${firestoreError.message}`);
          setLoading(false);
        }
      }
    };

    fetchUserDataAndTasks();

    // Cleanup function
    return () => {
      isMounted = false;
      if (unsubscribeTasks) unsubscribeTasks();
    };
  }, []);

  const [newTaskName, setNewTaskName] = useState("");
  const [newTaskFrequency, setNewTaskFrequency] = useState(1);
  const [newTaskPeriod, setNewTaskPeriod] = useState(7);
  const [showAddTask, setShowAddTask] = useState(false);

  // State for editing a task
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editTaskName, setEditTaskName] = useState("");
  const [editTaskFrequency, setEditTaskFrequency] = useState(1);
  const [editTaskPeriod, setEditTaskPeriod] = useState(7);

  // Memoize sorted tasks for better performance
  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => {
      // Sort by completion status first (incomplete tasks first)
      const aComplete = a.completions_count === a.period_frequency;
      const bComplete = b.completions_count === b.period_frequency;
      if (aComplete !== bComplete) {
        return aComplete ? 1 : -1;
      }
      // Then sort by creation date (newest first)
      return b.date_created.toMillis() - a.date_created.toMillis();
    });
  }, [tasks]);

  // Handle task completion and update reps - optimized with useCallback
  const handleTaskCompletion = useCallback(
    async (taskId: string) => {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          console.error("No authenticated user found");
          setError("No authenticated user found");
          return;
        }

        // Find the task in local state
        const task = tasks.find((t) => t.id === taskId);
        if (!task) return;

        // Calculate new completion count (don't exceed max)
        const newCompletionCount = Math.min(
          task.completions_count + 1,
          task.period_frequency
        );

        // First, update the UI immediately for better user experience
        // 1. Update task completion status
        setTasks(
          tasks.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  completions_count: newCompletionCount,
                }
              : t
          )
        );

        // 2. Update user's reps in UI (both lifetime and monthly)
        setUser((prevUser) => ({
          ...prevUser,
          reps: (prevUser.reps || 0) + 1,
          monthly_reps: (prevUser.monthly_reps || 0) + 1,
        }));

        // Then, update in Firestore
        // 1. Update task in database
        const taskDocRef = doc(db, "users", currentUser.uid, "tasks", taskId);
        await updateDoc(taskDocRef, {
          completions_count: newCompletionCount,
        });

        // 2. Update user's reps in database (both lifetime and monthly)
        const userDocRef = doc(db, "users", currentUser.uid);
        await updateDoc(userDocRef, {
          reps: (user.reps || 0) + 1,
          monthly_reps: (user.monthly_reps || 0) + 1,
        });

        // Success is shown through UI updates
      } catch (error) {
        const firestoreError = error as FirestoreError;
        console.error(
          `Error updating task completion: ${firestoreError.code}`,
          firestoreError
        );
        setError(`Error updating task: ${firestoreError.message}`);
      }
    },
    [tasks, user, setError]
  );

  // Handle decrementing task completion - optimized with useCallback
  const handleDecrementCompletion = useCallback(
    async (taskId: string) => {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          console.error("No authenticated user found");
          setError("No authenticated user found");
          return;
        }

        // Find the task in local state
        const task = tasks.find((t) => t.id === taskId);
        if (!task) return;

        // Only proceed if there's a completion to decrement
        if (task.completions_count <= 0) return;

        // Calculate new completion count (don't go below 0)
        const newCompletionCount = Math.max(task.completions_count - 1, 0);

        // Update local state first for immediate UI feedback
        // 1. Update task completion status
        setTasks(
          tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  completions_count: newCompletionCount,
                }
              : task
          )
        );

        // 2. Update user's reps in UI (both lifetime and monthly)
        setUser((prevUser) => ({
          ...prevUser,
          reps: Math.max((prevUser.reps || 0) - 1, 0),
          monthly_reps: Math.max((prevUser.monthly_reps || 0) - 1, 0),
        }));

        // Then update in Firestore
        // 1. Update task in database
        const taskDocRef = doc(db, "users", currentUser.uid, "tasks", taskId);
        await updateDoc(taskDocRef, {
          completions_count: newCompletionCount,
        });

        // 2. Update user's reps in database (both lifetime and monthly)
        const userDocRef = doc(db, "users", currentUser.uid);
        await updateDoc(userDocRef, {
          reps: Math.max((user.reps || 0) - 1, 0),
          monthly_reps: Math.max((user.monthly_reps || 0) - 1, 0),
        });

        // Success is shown through UI updates
      } catch (error) {
        const firestoreError = error as FirestoreError;
        console.error(
          `Error decrementing task completion: ${firestoreError.code}`,
          firestoreError
        );
        setError(`Error updating task: ${firestoreError.message}`);
      }
    },
    [tasks, user, setError]
  );

  // Handle deleting a task (actually sets status to false) - optimized with useCallback
  const handleDeleteTask = useCallback(
    async (taskId: string) => {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          console.error("No authenticated user found");
          setError("No authenticated user found");
          return;
        }

        // Update local state first for immediate UI feedback
        setTasks(
          tasks
            .map((task) =>
              task.id === taskId ? { ...task, status: false } : task
            )
            .filter((task) => task.id !== taskId)
        ); // Still remove from UI

        // Then update in Firestore (set status to false instead of deleting)
        const taskDocRef = doc(db, "users", currentUser.uid, "tasks", taskId);
        await updateDoc(taskDocRef, {
          status: false,
        });
      } catch (error) {
        const firestoreError = error as FirestoreError;
        console.error(
          `Error updating task status: ${firestoreError.code}`,
          firestoreError
        );
        setError(`Error deleting task: ${firestoreError.message}`);
      }
    },
    [tasks, setError]
  );

  // UI placeholder for starting task edit - optimized with useCallback
  const handleStartEdit = useCallback((task: Task) => {
    setEditingTaskId(task.id);
    setEditTaskName(task.task);
    setEditTaskFrequency(task.period_frequency);
    setEditTaskPeriod(task.period);
  }, []);

  // Handle saving task edit - optimized with useCallback
  const handleSaveEdit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!editTaskName.trim() || !editingTaskId) return;

      try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          console.error("No authenticated user found");
          setError("No authenticated user found");
          return;
        }

        // Update local state first for immediate UI feedback
        setTasks(
          tasks.map((task) =>
            task.id === editingTaskId
              ? {
                  ...task,
                  task: editTaskName.trim(),
                  period_frequency: editTaskFrequency,
                  period: editTaskPeriod,
                }
              : task
          )
        );

        // Then update in Firestore
        const taskDocRef = doc(
          db,
          "users",
          currentUser.uid,
          "tasks",
          editingTaskId
        );
        await updateDoc(taskDocRef, {
          task: editTaskName.trim(),
          period_frequency: editTaskFrequency,
          period: editTaskPeriod,
        });

        // Reset edit form
        setEditingTaskId(null);
        setEditTaskName("");
        setEditTaskFrequency(1);
        setEditTaskPeriod(7);
      } catch (error) {
        const firestoreError = error as FirestoreError;
        console.error(
          `Error updating task: ${firestoreError.code}`,
          firestoreError
        );
        setError(`Error updating task: ${firestoreError.message}`);
      }
    },
    [
      editTaskName,
      editingTaskId,
      editTaskFrequency,
      editTaskPeriod,
      tasks,
      setError,
    ]
  );

  // UI placeholder for canceling task edit - optimized with useCallback
  const handleCancelEdit = useCallback(() => {
    setEditingTaskId(null);
    setEditTaskName("");
    setEditTaskFrequency(1);
    setEditTaskPeriod(7);
  }, []);

  // Handle adding a new task - optimized with useCallback
  const handleAddTask = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!newTaskName.trim()) return;

      try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          console.error("No authenticated user found");
          setError("No authenticated user found");
          return;
        }

        // Create new task data
        const newTaskData = {
          task: newTaskName.trim(),
          period_frequency: newTaskFrequency,
          period: newTaskPeriod,
          status: true,
          date_created: Timestamp.fromDate(new Date()),
          completions_count: 0,
        };

        // Add to Firestore
        const tasksCollectionRef = collection(
          db,
          "users",
          currentUser.uid,
          "tasks"
        );
        const docRef = await addDoc(tasksCollectionRef, newTaskData);

        // Update local state with the new task including its Firestore ID
        const newTask = {
          id: docRef.id,
          ...newTaskData,
        };

        // Update local state
        setTasks([...tasks, newTask]);

        // Reset form
        setNewTaskName("");
        setNewTaskFrequency(1);
        setNewTaskPeriod(7);
        setShowAddTask(false);
      } catch (error) {
        const firestoreError = error as FirestoreError;
        console.error(
          `Error adding task: ${firestoreError.code}`,
          firestoreError
        );
        setError(`Error adding task: ${firestoreError.message}`);
      }
    },
    [newTaskName, newTaskFrequency, newTaskPeriod, tasks, setError]
  );

  // Handle daily check-in - optimized with useCallback
  const handleDailyCheckIn = useCallback(async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        console.error("No authenticated user found");
        setError("No authenticated user found");
        return;
      }

      // In a real implementation, you would update the user's check-in status in Firestore
      // Success is shown through UI updates
    } catch (error) {
      const firestoreError = error as FirestoreError;
      console.error(
        `Error recording daily check-in: ${firestoreError.code}`,
        firestoreError
      );
      setError(`Error recording daily check-in: ${firestoreError.message}`);
    }
  }, [setError]);

  // Show loading indicator or error message
  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin mr-2 text-4xl">⟳</div>
        <p className="text-xl">Loading user data...</p>
      </main>
    );
  }

  // Show error message if there's an error
  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-md">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto py-12">
          <div className="bg-white rounded-xl shadow-md p-8">
            {/* User Profile Section */}
            <div className="flex flex-col md:flex-row items-center mb-8 pb-8 border-b border-gray-200">
              <div className="w-24 h-24 rounded-full overflow-hidden mb-4 md:mb-0 md:mr-6">
                <Image
                  src={user?.photoURL || "/happy-dog-sideways.png"}
                  alt="User profile"
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                  priority={true}
                  quality={90}
                />
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-2xl font-bold">
                  {user?.displayName || "User"}
                </h1>
                <div className="flex flex-col md:flex-row gap-4 mt-2">
                  <div className="bg-gray-100 px-4 py-2 rounded-md">
                    <p className="text-sm text-gray-500">Lifetime Reps</p>
                    <p className="text-xl font-bold">{user?.reps || 0}</p>
                  </div>
                  <div className="bg-gray-100 px-4 py-2 rounded-md">
                    <p className="text-sm text-gray-500">Monthly Reps</p>
                    <p className="text-xl font-bold">
                      {user?.monthly_reps || 0}/
                      {user?.total_monthly_possible_reps || 0}
                    </p>
                  </div>
                  <div className="bg-gray-100 px-4 py-2 rounded-md">
                    <p className="text-sm text-gray-500">Potential Discount</p>
                    <p className="text-xl font-bold">
                      {user?.potential_discount || 0}%
                    </p>
                  </div>
                </div>
              </div>
              {/* Daily check-in button moved to tasks section */}
            </div>

            {/* Tasks Section */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Your Tasks</h2>
                <Button
                  onClick={() => setShowAddTask(!showAddTask)}
                  variant="outline"
                  size="sm"
                >
                  {showAddTask ? "Cancel" : "+ Add Task"}
                </Button>
              </div>

              {/* Add Task Form */}
              {showAddTask && (
                <form
                  onSubmit={handleAddTask}
                  className="mb-6 p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex flex-col md:flex-row gap-3 mb-4">
                    <input
                      type="text"
                      value={newTaskName}
                      onChange={(e) => setNewTaskName(e.target.value)}
                      placeholder="Enter a task"
                      className="flex-1 rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-1 focus:ring-secondary focus:border-transparent"
                      required
                    />
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={newTaskFrequency}
                        onChange={(e) =>
                          setNewTaskFrequency(parseInt(e.target.value) || 1)
                        }
                        className="w-16 rounded-md border border-gray-300 px-2 py-2 focus:outline-none focus:ring-1 focus:ring-secondary focus:border-transparent"
                        min="1"
                        max="31"
                        required
                      />
                      <span className="text-gray-600">times every</span>
                      <input
                        type="number"
                        value={newTaskPeriod}
                        onChange={(e) =>
                          setNewTaskPeriod(parseInt(e.target.value) || 1)
                        }
                        className="w-16 rounded-md border border-gray-300 px-2 py-2 focus:outline-none focus:ring-1 focus:ring-secondary focus:border-transparent"
                        min="1"
                        max="14"
                        required
                      />
                      <span className="text-gray-600">days</span>
                    </div>
                  </div>
                  <Button type="submit" className="w-full">
                    Add Task
                  </Button>
                </form>
              )}

              {/* Tasks List */}
              {sortedTasks.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    No tasks yet. Add your first task to get started!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {sortedTasks.map((task) => (
                    <div key={task.id}>
                      <TaskItem
                        task={task}
                        isEditing={editingTaskId === task.id}
                        editTaskName={editTaskName}
                        editTaskFrequency={editTaskFrequency}
                        editTaskPeriod={editTaskPeriod}
                        onSaveEdit={handleSaveEdit}
                        onCancelEdit={handleCancelEdit}
                        onStartEdit={handleStartEdit}
                        onComplete={handleTaskCompletion}
                        onDecrement={handleDecrementCompletion}
                        onDelete={handleDeleteTask}
                        setEditTaskName={setEditTaskName}
                        setEditTaskFrequency={setEditTaskFrequency}
                        setEditTaskPeriod={setEditTaskPeriod}
                      />
                    </div>
                  ))}

                  {/* Daily Check-in Button - Centered after tasks */}
                  <div className="flex justify-center mt-8">
                    <Button
                      onClick={handleDailyCheckIn}
                      variant="default"
                      className="px-8 py-2"
                    >
                      Daily Check-in
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function DashboardPage() {
  return (
    <AuthCheck>
      <DashboardContent />
    </AuthCheck>
  );
}
