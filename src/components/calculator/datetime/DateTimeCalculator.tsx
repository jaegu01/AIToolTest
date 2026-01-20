"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, Globe, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type CalcMode = "dday" | "age" | "difference" | "timezone";

const timezones = [
  { id: "Asia/Seoul", label: "Seoul (KST)", offset: "+09:00" },
  { id: "America/New_York", label: "New York (EST)", offset: "-05:00" },
  { id: "America/Los_Angeles", label: "Los Angeles (PST)", offset: "-08:00" },
  { id: "Europe/London", label: "London (GMT)", offset: "+00:00" },
  { id: "Europe/Paris", label: "Paris (CET)", offset: "+01:00" },
  { id: "Asia/Tokyo", label: "Tokyo (JST)", offset: "+09:00" },
  { id: "Asia/Shanghai", label: "Shanghai (CST)", offset: "+08:00" },
  { id: "Australia/Sydney", label: "Sydney (AEST)", offset: "+11:00" },
];

export function DateTimeCalculator() {
  const [mode, setMode] = useState<CalcMode>("dday");
  const [date1, setDate1] = useState("");
  const [date2, setDate2] = useState("");
  const [fromTz, setFromTz] = useState("Asia/Seoul");
  const [toTz, setToTz] = useState("America/New_York");
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const ddayResult = useMemo(() => {
    if (!date1) return null;
    const target = new Date(date1);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    target.setHours(0, 0, 0, 0);

    const diff = target.getTime() - today.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    return {
      days: Math.abs(days),
      isPast: days < 0,
      isToday: days === 0,
    };
  }, [date1]);

  const ageResult = useMemo(() => {
    if (!date1) return null;
    const birth = new Date(date1);
    const today = new Date();

    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    let days = today.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    const totalDays = Math.floor(
      (today.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24)
    );

    return { years, months, days, totalDays };
  }, [date1]);

  const differenceResult = useMemo(() => {
    if (!date1 || !date2) return null;
    const d1 = new Date(date1);
    const d2 = new Date(date2);

    const diff = Math.abs(d2.getTime() - d1.getTime());
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30.44);
    const years = Math.floor(days / 365.25);

    return { days, weeks, months, years };
  }, [date1, date2]);

  const getTimeInTz = (tz: string) => {
    return currentTime.toLocaleTimeString("en-US", {
      timeZone: tz,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  const getDateInTz = (tz: string) => {
    return currentTime.toLocaleDateString("en-US", {
      timeZone: tz,
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const modes = [
    { id: "dday", icon: Calendar, label: "D-Day" },
    { id: "age", icon: Clock, label: "Age" },
    { id: "difference", icon: ArrowRight, label: "Difference" },
    { id: "timezone", icon: Globe, label: "Timezone" },
  ] as const;

  return (
    <div className="space-y-4">
      {/* Mode Tabs */}
      <div className="glass p-2 rounded-xl flex gap-2 overflow-x-auto">
        {modes.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setMode(id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all",
              mode === id
                ? "bg-primary/30 border border-primary"
                : "hover:bg-white/10"
            )}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* D-Day Calculator */}
        {mode === "dday" && (
          <motion.div
            key="dday"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass p-6 rounded-2xl space-y-6"
          >
            <div>
              <label className="block text-sm text-muted-foreground mb-2">
                Target Date
              </label>
              <input
                type="date"
                value={date1}
                onChange={(e) => setDate1(e.target.value)}
                className="w-full px-4 py-3 glass rounded-xl bg-transparent"
              />
            </div>

            {ddayResult && (
              <div className="glass-heavy p-6 rounded-xl text-center">
                <div className="text-6xl font-bold text-primary mb-2">
                  {ddayResult.isToday
                    ? "D-Day!"
                    : ddayResult.isPast
                    ? `D+${ddayResult.days}`
                    : `D-${ddayResult.days}`}
                </div>
                <div className="text-muted-foreground">
                  {ddayResult.isToday
                    ? "Today is the day!"
                    : ddayResult.isPast
                    ? `${ddayResult.days} days ago`
                    : `${ddayResult.days} days remaining`}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Age Calculator */}
        {mode === "age" && (
          <motion.div
            key="age"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass p-6 rounded-2xl space-y-6"
          >
            <div>
              <label className="block text-sm text-muted-foreground mb-2">
                Birth Date
              </label>
              <input
                type="date"
                value={date1}
                onChange={(e) => setDate1(e.target.value)}
                className="w-full px-4 py-3 glass rounded-xl bg-transparent"
              />
            </div>

            {ageResult && (
              <div className="space-y-4">
                <div className="glass-heavy p-6 rounded-xl text-center">
                  <div className="text-5xl font-bold text-primary">
                    {ageResult.years}
                  </div>
                  <div className="text-muted-foreground">years old</div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="glass-light p-4 rounded-xl text-center">
                    <div className="text-2xl font-bold">{ageResult.months}</div>
                    <div className="text-xs text-muted-foreground">months</div>
                  </div>
                  <div className="glass-light p-4 rounded-xl text-center">
                    <div className="text-2xl font-bold">{ageResult.days}</div>
                    <div className="text-xs text-muted-foreground">days</div>
                  </div>
                  <div className="glass-light p-4 rounded-xl text-center">
                    <div className="text-2xl font-bold">{ageResult.totalDays.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">total days</div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Date Difference */}
        {mode === "difference" && (
          <motion.div
            key="difference"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass p-6 rounded-2xl space-y-6"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-muted-foreground mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={date1}
                  onChange={(e) => setDate1(e.target.value)}
                  className="w-full px-4 py-3 glass rounded-xl bg-transparent"
                />
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={date2}
                  onChange={(e) => setDate2(e.target.value)}
                  className="w-full px-4 py-3 glass rounded-xl bg-transparent"
                />
              </div>
            </div>

            {differenceResult && (
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: differenceResult.days, label: "Days" },
                  { value: differenceResult.weeks, label: "Weeks" },
                  { value: differenceResult.months, label: "Months" },
                  { value: differenceResult.years, label: "Years" },
                ].map(({ value, label }) => (
                  <div key={label} className="glass-light p-4 rounded-xl text-center">
                    <div className="text-2xl font-bold">{value.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">{label}</div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Timezone Converter */}
        {mode === "timezone" && (
          <motion.div
            key="timezone"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass p-6 rounded-2xl space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* From Timezone */}
              <div className="glass-light p-4 rounded-xl">
                <select
                  value={fromTz}
                  onChange={(e) => setFromTz(e.target.value)}
                  className="w-full px-3 py-2 glass rounded-lg bg-transparent mb-4"
                >
                  {timezones.map((tz) => (
                    <option key={tz.id} value={tz.id} className="bg-background">
                      {tz.label}
                    </option>
                  ))}
                </select>
                <div className="text-4xl font-bold font-mono text-center">
                  {getTimeInTz(fromTz)}
                </div>
                <div className="text-center text-sm text-muted-foreground mt-2">
                  {getDateInTz(fromTz)}
                </div>
              </div>

              {/* To Timezone */}
              <div className="glass-light p-4 rounded-xl">
                <select
                  value={toTz}
                  onChange={(e) => setToTz(e.target.value)}
                  className="w-full px-3 py-2 glass rounded-lg bg-transparent mb-4"
                >
                  {timezones.map((tz) => (
                    <option key={tz.id} value={tz.id} className="bg-background">
                      {tz.label}
                    </option>
                  ))}
                </select>
                <div className="text-4xl font-bold font-mono text-center text-primary">
                  {getTimeInTz(toTz)}
                </div>
                <div className="text-center text-sm text-muted-foreground mt-2">
                  {getDateInTz(toTz)}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
