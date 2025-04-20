"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import AuthCheck from "@/components/AuthCheck";
import { auth, db } from "@/lib/firebase";
import { doc, updateDoc, collection, addDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
// for git
// CSS for responsive progress bar
const progressBarStyles = `
  :root {
    --progress-width: 37%;
    --progress-track-color: #e2e8f0; /* Darker gray for track */
    --progress-fill-color: #0064a6; /* Darker blue for fill */
    --milestone-active-color: #0064a6; /* Active milestone color */
    --milestone-inactive-color: #94a3b8; /* Inactive milestone color */
  }
  
  @media (max-width: 480px) {
    :root {
      --progress-width: 40%;
    }
  }
`;

export default function GoalSetupPage() {
  const latestInputRef = useRef<HTMLInputElement>(null);
  const [mainGoal, setMainGoal] = useState("");
  const [showChallenge, setShowChallenge] = useState(false);
  const [challenge, setChallenge] = useState("");
  const [showTasks, setShowTasks] = useState(false);
  const [newTaskAdded, setNewTaskAdded] = useState(false);
  const [showGoalInfo, setShowGoalInfo] = useState(true);
  const [showGoalForm, setShowGoalForm] = useState(false);

  interface Task {
    task: string;
    period_frequency: number;
    period: number;
    status: boolean;
    date_created: Date;
  }

  const [tasks, setTasks] = useState<Task[]>([
    {
      task: "",
      period_frequency: 0,
      period: 0,
      status: true,
      date_created: new Date(),
    },
  ]);
  const router = useRouter();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleMainGoalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mainGoal.trim()) {
      setShowChallenge(true);
      setShowGoalInfo(false);
    }
  };

  const handleChallengeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (challenge.trim()) {
      try {
        // Get the current user
        const user = auth.currentUser;

        if (user) {
          // Reference to the user's document
          const userDocRef = doc(db, "users", user.uid);

          // Update the user document with goal and challenge
          await updateDoc(userDocRef, {
            goal: {
              text: mainGoal.trim(),
              challenge: challenge.trim(),
              updatedAt: new Date(),
            },
          });

          console.log("Goal and challenge saved to Firebase");
        }
      } catch (error) {
        console.error("Error saving goal to Firebase:", error);
      }

      // Show tasks section
      setShowTasks(true);
    }
  };

  const handleTaskChange = (
    index: number,
    field: keyof Task,
    value: string | number
  ) => {
    const newTasks = [...tasks];
    const updatedTask = { ...newTasks[index] };

    if (field === "task") {
      // Limit to 40 characters and convert to sentence case if needed
      let processedText = (value as string).slice(0, 40);
      if (processedText.length > 0 && !/^[A-Z]/.test(processedText)) {
        processedText =
          processedText.charAt(0).toUpperCase() + processedText.slice(1);
      }
      updatedTask[field] = processedText;
    } else if (field === "period_frequency" || field === "period") {
      // Only allow numeric characters
      const numericValue = value.toString().replace(/[^0-9]/g, "");
      let parsedValue = numericValue ? parseInt(numericValue) : 0;

      // Validation for period and frequency fields
      if (field === "period") {
        // Ensure value is between 1 and 14
        if (parsedValue > 14) parsedValue = 14;
        if (parsedValue < 0) parsedValue = 0;
      } else if (field === "period_frequency") {
        // Ensure value is between 1 and 31
        if (parsedValue > 31) parsedValue = 31;
        if (parsedValue < 0) parsedValue = 0;
      }

      updatedTask[field] = parsedValue;
    }

    newTasks[index] = updatedTask;
    setTasks(newTasks);
  };

  const addTask = () => {
    setTasks([
      ...tasks,
      {
        task: "",
        period_frequency: 0,
        period: 0,
        status: true,
        date_created: new Date(),
      },
    ]);
    setNewTaskAdded(true);
  };

  // Focus the latest input only when a new task is added
  useEffect(() => {
    if (newTaskAdded && latestInputRef.current) {
      latestInputRef.current.focus();
      setNewTaskAdded(false);
    }
  }, [newTaskAdded]);

  const removeTask = (index: number) => {
    const newTasks = tasks.filter((_, i) => i !== index);
    setTasks(newTasks);
  };

  const handleSubmit = async () => {
    try {
      // Get the current user
      const user = auth.currentUser;

      if (user) {
        // Filter out empty tasks
        const validTasks = tasks.filter(
          (task) =>
            task.task.trim() && task.period_frequency > 0 && task.period > 0
        );

        if (validTasks.length > 0) {
          // Reference to the user's document
          const userDocRef = doc(db, "users", user.uid);

          // Reference to the tasks subcollection within the user document
          const tasksCollectionRef = collection(userDocRef, "tasks");

          // Add each task as a document to the tasks subcollection
          for (const task of validTasks) {
            await addDoc(tasksCollectionRef, {
              task: task.task.trim(),
              period_frequency: task.period_frequency,
              period: task.period,
              status: true,
              date_created: new Date(),
            });
          }

          console.log("Tasks saved to Firebase");
        }
      }
    } catch (error) {
      console.error("Error saving tasks to Firebase:", error);
    }

    // Redirect to price selector page yay
    router.push("/price-selector");
  };

  const renderContent = () => {
    if (showTasks) {
      return (
        <>
          {/* Add the CSS styles */}
          <style dangerouslySetInnerHTML={{ __html: progressBarStyles }} />

          <main className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto py-24">
                <div className="bg-white rounded-xl shadow-md p-8">
                  {/* Progress Bar with Milestone Markers */}
                  <div className="mb-12 relative">
                    {/* Progress Track */}
                    <div
                      className="w-full h-1 absolute top-3 z-0"
                      style={{ backgroundColor: "var(--progress-track-color)" }}
                    ></div>

                    {/* Progress Fill */}
                    <div
                      className="h-1 absolute top-3 z-10"
                      style={{
                        backgroundColor: "var(--progress-fill-color)",
                        width: "var(--progress-width)",
                      }}
                    ></div>

                    {/* Milestone Markers */}
                    <div className="flex justify-between relative z-20">
                      {/* Account Milestone - Completed */}
                      <div className="flex flex-col items-center">
                        <div
                          className="w-6 h-6 rounded-full border-2 flex items-center justify-center"
                          style={{
                            borderColor: "var(--milestone-active-color)",
                            backgroundColor: "var(--milestone-active-color)",
                          }}
                        >
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        </div>
                        <div className="text-sm font-medium mt-2">Account</div>
                      </div>

                      {/* Goals Milestone - Current */}
                      <div className="flex flex-col items-center">
                        <div
                          className="w-6 h-6 rounded-full border-2 bg-white flex items-center justify-center"
                          style={{
                            borderColor: "var(--milestone-active-color)",
                          }}
                        >
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{
                              backgroundColor: "var(--milestone-active-color)",
                            }}
                          ></div>
                        </div>
                        <div className="text-sm font-medium mt-2">Goals</div>
                      </div>

                      {/* Price Milestone */}
                      <div className="flex flex-col items-center">
                        <div
                          className="w-6 h-6 rounded-full border-2 bg-white"
                          style={{
                            borderColor: "var(--milestone-inactive-color)",
                          }}
                        ></div>
                        <div className="text-sm font-medium mt-2">Price</div>
                      </div>

                      {/* App Milestone */}
                      <div className="flex flex-col items-center">
                        <div
                          className="w-6 h-6 rounded-full border-2 bg-white"
                          style={{
                            borderColor: "var(--milestone-inactive-color)",
                          }}
                        ></div>
                        <div className="text-sm font-medium mt-2">App</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row gap-6">
                    <div className="space-y-8 w-2/3">
                      <div>
                        <h1 className="text-2xl font-bold mb-4">
                          Accountability Tasks
                        </h1>

                        <div className="space-y-4 mb-8">
                          <p className="text-lg font-semibold text-gray-800">
                            Let&apos;s get started on what matters most!
                          </p>

                          <p className="text-lg font-semibold text-gray-800">
                            What do you want to be accountable for?
                          </p>

                          <p className="text-gray-600">
                            To be effective, choose tasks within your control.
                            Avoid outcomes. For example, &quot;Run four times a
                            week&quot;, not &quot;Run a 20 minute 5k.&quot;
                          </p>

                          <p className="text-gray-600">
                            You&apos;ll use a specific format. Start with the
                            task itself, then enter the number of times
                            you&apos;ll do the task in a period. Lastly enter
                            the period in days. For example, &quot;Run 3 times
                            in 7 days.&quot; Or, &quot;Stare into the void 1
                            time every 1 days.&quot;
                          </p>
                          <p className="text-gray-600">
                            For this early version of the program we&apos;ll
                            only be accountable for repeating tasks. In the
                            future we&apos;ll be able to track non-repeating
                            tasks, too.
                          </p>

                          <p className="text-gray-600">
                            Enter as many tasks as you like here.
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {tasks.map((task, index) => (
                          <form
                            key={index}
                            className="flex gap-2 items-center"
                            onSubmit={(e) => {
                              e.preventDefault();
                              if (
                                task.task.trim() &&
                                task.period_frequency &&
                                task.period
                              ) {
                                addTask();
                              }
                            }}
                          >
                            <input
                              type="text"
                              value={task.task}
                              onChange={(e) =>
                                handleTaskChange(index, "task", e.target.value)
                              }
                              placeholder="Enter a task"
                              ref={
                                index === tasks.length - 1
                                  ? latestInputRef
                                  : null
                              }
                              className="flex-1 rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-1 focus:ring-secondary focus:border-transparent"
                            />
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={task.period_frequency || ""}
                                onChange={(e) =>
                                  handleTaskChange(
                                    index,
                                    "period_frequency",
                                    e.target.value
                                  )
                                }
                                className="w-16 rounded-md border border-gray-300 px-2 py-2 focus:outline-none focus:ring-1 focus:ring-secondary focus:border-transparent"
                                title="Number of times (1-31)"
                                placeholder="1"
                                min="1"
                                max="31"
                              />
                              <span className="text-gray-600">
                                time(s) every
                              </span>
                              <input
                                type="text"
                                value={task.period || ""}
                                onChange={(e) =>
                                  handleTaskChange(
                                    index,
                                    "period",
                                    e.target.value
                                  )
                                }
                                className="w-16 rounded-md border border-gray-300 px-2 py-2 focus:outline-none focus:ring-1 focus:ring-secondary focus:border-transparent"
                                title="Number of days (1-14)"
                                placeholder="1"
                                min="1"
                                max="14"
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault();
                                    addTask();
                                  }
                                }}
                              />
                              <span className="text-gray-600">day(s)</span>
                            </div>
                            <button
                              onClick={() => removeTask(index)}
                              className="px-3 py-2 text-gray-600 hover:text-gray-800"
                              type="button"
                            >
                              ×
                            </button>
                          </form>
                        ))}
                      </div>

                      <Button
                        onClick={addTask}
                        type="button"
                        variant="ghost"
                        className="hover:text-gray-700"
                      >
                        + Add another task
                      </Button>

                      <Button
                        onClick={handleSubmit}
                        className="w-full"
                        size="lg"
                      >
                        Complete Setup
                      </Button>
                    </div>

                    <div className="w-1/3 flex items-center justify-center">
                      <Image
                        src="/baby-goat.png"
                        alt="Baby Goat"
                        width={200}
                        height={200}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </>
      );
    }

    return (
      <>
        {/* Add the CSS styles */}
        <style dangerouslySetInnerHTML={{ __html: progressBarStyles }} />

        <main className="min-h-screen bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto py-24">
              <div className="bg-white rounded-xl shadow-md p-8">
                {/* Progress Bar with Milestone Markers */}
                <div className="mb-12 relative">
                  {/* Progress Track */}
                  <div
                    className="w-full h-1 absolute top-3 z-0"
                    style={{ backgroundColor: "var(--progress-track-color)" }}
                  ></div>

                  {/* Progress Fill */}
                  <div
                    className="h-1 absolute top-3 z-10"
                    style={{
                      backgroundColor: "var(--progress-fill-color)",
                      width: "var(--progress-width)",
                    }}
                  ></div>

                  {/* Milestone Markers */}
                  <div className="flex justify-between relative z-20">
                    {/* Account Milestone - Completed */}
                    <div className="flex flex-col items-center">
                      <div
                        className="w-6 h-6 rounded-full border-2 flex items-center justify-center"
                        style={{
                          borderColor: "var(--milestone-active-color)",
                          backgroundColor: "var(--milestone-active-color)",
                        }}
                      >
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      </div>
                      <div className="text-sm font-medium mt-2">Account</div>
                    </div>

                    {/* Goals Milestone - Current */}
                    <div className="flex flex-col items-center">
                      <div
                        className="w-6 h-6 rounded-full border-2 bg-white flex items-center justify-center"
                        style={{ borderColor: "var(--milestone-active-color)" }}
                      >
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{
                            backgroundColor: "var(--milestone-active-color)",
                          }}
                        ></div>
                      </div>
                      <div className="text-sm font-medium mt-2">Goals</div>
                    </div>

                    {/* Price Milestone */}
                    <div className="flex flex-col items-center">
                      <div
                        className="w-6 h-6 rounded-full border-2 bg-white"
                        style={{
                          borderColor: "var(--milestone-inactive-color)",
                        }}
                      ></div>
                      <div className="text-sm font-medium mt-2">Price</div>
                    </div>

                    {/* App Milestone */}
                    <div className="flex flex-col items-center">
                      <div
                        className="w-6 h-6 rounded-full border-2 bg-white"
                        style={{
                          borderColor: "var(--milestone-inactive-color)",
                        }}
                      ></div>
                      <div className="text-sm font-medium mt-2">App</div>
                    </div>
                  </div>
                </div>

                {showGoalInfo && (
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold tracking-tight text-center mb-8">
                      A different way to set goals.
                    </h2>

                    <figure className="text-center mb-12">
                      <blockquote className="text-xl text-gray-600 italic mb-4">
                        &ldquo;That exciting thing that you want to do,
                        it&apos;s worth it, and you can do it.&rdquo;
                      </blockquote>
                      <figcaption className="text-sm text-gray-500">
                        — Roland Fisher
                      </figcaption>
                    </figure>
                    <div className="prose prose-slate mx-auto">
                      <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
                        <div className="flex-grow w-full md:w-2/3 order-first">
                          <h2 className="text-2xl font-semibold mb-4">
                            Rethinking Success
                          </h2>
                          <p className="mb-6">
                            Success is personal. Only you can define what it
                            truly means for you. But there&apos;s an important
                            twist:
                          </p>

                          <p className="mb-6">
                            Imagine Steve bragging, &ldquo;Check it out! The sun
                            is shining, and the weather is perfect! I&apos;m so
                            proud of myself!&rdquo; You&apos;d probably wonder
                            if Steve is okay. Why?
                          </p>

                          <p className="mb-6">
                            Because true success isn&apos;t measured by things
                            outside our control.
                          </p>

                          <p className="mb-6">
                            What if Steve came to you bragging about his 100th
                            workout? That would be a reason to celebrate. That
                            took dedication and effort. Real success was showing
                            up—100 times.
                          </p>

                          <p className="mb-6">
                            The only definition of success that matters is to do
                            as you intend.
                          </p>

                          <p className="mb-6">
                            If you do as you intend and don&apos;t get the
                            expected outcome, you only need to adjust your
                            strategy to achieve your goal. You still succeeded.
                          </p>

                          <p>
                            That&apos;s why we&apos;re approaching goals
                            differently.
                          </p>
                        </div>
                        <div className="w-full md:w-1/3 flex-shrink-0 order-last">
                          <Image
                            src="/jumping-horse.png"
                            alt="Jumping Horse"
                            width={400}
                            height={300}
                            className="w-full h-auto"
                          />
                        </div>
                      </div>

                      <div className="bg-slate-50 p-8 rounded-xl mb-8">
                        <div className="flex flex-col md:flex-row items-center gap-6">
                          <div className="w-full md:w-1/3 flex-shrink-0 order-last md:order-first">
                            <Image
                              src="/laughing-horse.png"
                              alt="Laughing Horse"
                              width={400}
                              height={300}
                              className="w-full h-auto"
                            />
                          </div>
                          <div className="flex-grow w-full md:w-2/3">
                            <h2 className="text-2xl font-semibold mb-4">
                              Rebellious Goal Setting
                            </h2>

                            <p className="mb-6">
                              Ever feel like traditional goal-setting is
                              tedious, complicated, and ineffective? You&apos;re
                              not alone—and you don&apos;t have to do it that
                              way.
                            </p>

                            <p className="mb-6">
                              Instead, you&apos;re going to set an anti-SMART
                              goal. It&apos;s refreshingly simple. Forget overly
                              specific or restrictive goals. &quot;Get into
                              shape&quot; is perfectly fine. Why? Because it
                              sets a clear direction, and the details will
                              emerge naturally as you progress.
                            </p>

                            <p className="mb-6">
                              Once your goal is set, you&apos;ll plan tasks to
                              help you achieve it. This doesn&apos;t have to be
                              perfect—in fact, perfectionism only gets in the
                              way. Your plan will evolve as you discover what
                              works best for you.
                            </p>
                          </div>
                        </div>
                      </div>

                      <h3 className="text-xl font-semibold mb-4 text-center">
                        Ready to set your rebellious goal? Let&apos;s do this!
                      </h3>

                      <div className="flex justify-center mt-8">
                        <Button
                          size="lg"
                          onClick={() => {
                            setShowGoalForm(true);
                            setShowGoalInfo(false);
                          }}
                        >
                          Set My Goal
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {showGoalForm && (
                  <div className="flex flex-row gap-6">
                    <div className="space-y-8 w-2/3">
                      <form
                        onSubmit={handleMainGoalSubmit}
                        className="space-y-4"
                      >
                        <div>
                          <label
                            htmlFor="mainGoal"
                            className="block text-2xl font-bold mb-4"
                          >
                            What&apos;s your main goal?
                          </label>
                          <input
                            type="text"
                            id="mainGoal"
                            value={mainGoal}
                            onChange={(e) => setMainGoal(e.target.value)}
                            placeholder="Enter your goal in a sentence..."
                            className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-1 focus:ring-secondary focus:border-transparent"
                            required
                          />
                        </div>
                        {!showChallenge && (
                          <Button type="submit" className="w-full" size="lg">
                            Continue
                          </Button>
                        )}
                      </form>

                      {showChallenge && (
                        <form
                          onSubmit={handleChallengeSubmit}
                          className="space-y-4"
                        >
                          <div>
                            <label
                              htmlFor="challenge"
                              className="block text-2xl font-bold mb-4"
                            >
                              When it comes to your goal, what is the single
                              biggest challenge, frustration, or problem that
                              you&apos;ve been struggling with?
                              <span className="block mt-2 text-base text-gray-500">
                                (Please be as detailed and specific as possible)
                              </span>
                            </label>
                            <textarea
                              id="challenge"
                              value={challenge}
                              onChange={(e) => setChallenge(e.target.value)}
                              placeholder="Tell us about your challenge..."
                              className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-1 focus:ring-secondary focus:border-transparent"
                              rows={3}
                              required
                            />
                          </div>
                          <Button type="submit" className="w-full" size="lg">
                            Continue to Tasks
                          </Button>
                        </form>
                      )}
                    </div>

                    <div className="w-1/3 flex items-center justify-center">
                      <Image
                        src="/baby-goat.png"
                        alt="Baby Goat"
                        width={200}
                        height={200}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </>
    );
  };

  return <AuthCheck>{renderContent()}</AuthCheck>;
}
