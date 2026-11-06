
"use client";

import { useEffect, useState } from "react";
// import { UserJobCount } from "@/lib/api"; 
import { useSession } from "next-auth/react";


import {
    UserRound,
    BriefcaseBusiness,
    FileText,
    MessageCircle,
    Star,
    MapPin,
    Pencil,
    Save,
    X,
} from "lucide-react";
import axios from "axios";

type DashboardUser = {
    id: string;
    name: string | null;
    email: string;
    picture: string | null;
    phone: string | null;
    bio: string | null;
    hourlyRate: number | null;
    role: "CLIENT" | "FREELANCER";
    createdAt: string;

    address?: {
        city?: string;
        state?: string;
        country?: string;
    } | null;

    userSkill?: {
        id: string;
        skill: {
            name: string;
        };
    }[];

    _count?: {
        jobs: number;
        bids: number;
        conversation: number;
        sentMessages: number;
        reviews: number;
    };
};

export default function Dashboard() {
    const [user, setUser] = useState<DashboardUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const [skills, setSkills] = useState<string[]>([]);
    const [skillInput, setSkillInput] = useState("");
    const [getskill, Setgetskill] = useState<string[]>([]);

    const [form, setForm] = useState({
        phone: "",
        bio: "",
        hourlyRate: "",
        name: "",
    });

    

    useEffect(() => {
        const getProfile = async () => {
            try {
                const response = await fetch(
                    "http://localhost:3001/user/get",
                    { credentials: "include" }
                );

                if (!response.ok) {
                    throw new Error("Unable to fetch profile");
                }

                const data = await response.json();
                const profile = data.user;

                setUser(profile);

                setForm({
                    name: profile.name ?? "",
                    phone: profile.phone ?? "",
                    bio: profile.bio ?? "",
                    hourlyRate: profile.hourlyRate?.toString() ?? "",
                });
            } catch (err) {
                setError(
                    err instanceof Error ? err.message : "Something went wrong"
                );
            } finally {
                setLoading(false);
            }
        };

        getProfile();
    }, []);

    // fetching skills
    useEffect(() => {
        const fetchskill = async () => {
            try {
                const response = await axios.get("http://localhost:3001/user/getskills", {
                    withCredentials: true
                })
                console.log("Full response:", response.data);
                console.log("Skills:", response.data.skills);
                Setgetskill(response.data.skills ?? []);

            } catch (err) {
                console.log(err);
            }
        }
        fetchskill();
    }, [])


    const handleSave = async () => {
        setSaving(true);
        setError("");

        try {
            const response = await fetch(
                "http://localhost:3001/user/update",
                {
                    method: "PATCH",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name: form.name,
                        phone: form.phone,
                        bio: form.bio,
                        hourlyRate:
                            form.hourlyRate === "" ? null : Number(form.hourlyRate),
                    }),
                }
            );

            const response_skill = await axios.post("http://localhost:3001/user/skills", {
                skills,
            }, {
                withCredentials: true
            })
            const skill_data = response_skill.data;
            const data = await response.json();

            if (!response.ok || skill_data.status != 200) {
                throw new Error(data.message || "Failed to update profile");
            }

            setUser((previous) =>
                previous ? { ...previous, ...data.user } : previous
            );
            setEditing(false);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Something went wrong"
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#09090b] p-10 text-center text-zinc-400">
                Loading dashboard...
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-[#09090b] p-10 text-center text-red-400">
                {error || "User not found"}
            </div>
        );
    }

    const stats = [
        {
            label: "Jobs",
            value: user._count ?? 0,
            icon: BriefcaseBusiness,
        },
        {
            label: "Bids",
            value: user._count?.bids ?? 0,
            icon: FileText,
        },
        {
            label: "Conversations",
            value: user._count?.conversation ?? 0,
            icon: MessageCircle,
        },
        {
            label: "Reviews",
            value: user._count?.reviews ?? 0,
            icon: Star,
        },
    ];

    const addSkill = () => {
        const newSkill = skillInput.trim();

        if (!newSkill) return;

        // Prevent duplicate skills
        if (
            skills.some(
                (skill) => skill.toLowerCase() === newSkill.toLowerCase()
            )
        ) {
            setSkillInput("");
            return;
        }

        setSkills((previous) => [...previous, newSkill]);
        setSkillInput("");
    };

    const removeSkill = (skillToRemove: string) => {
        setSkills((previous) =>
            previous.filter((skill) => skill !== skillToRemove)
        );
    };

    return (
        <main className="min-h-screen bg-[#09090b] px-5 py-10 text-white sm:px-8">
            <div className="mx-auto max-w-6xl space-y-8">

                {/* Heading */}
                <div>
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-emerald-400">
                        Colosseum Space / Workspace
                    </p>
                    <h1 className="mt-2 text-3xl font-semibold">
                        Dashboard
                    </h1>
                    <p className="mt-2 text-sm text-zinc-500">
                        Manage your account and marketplace activity.
                    </p>
                </div>

                {/* Profile header */}
                <section className="rounded-2xl border border-white/[0.07] bg-[#111113] p-6 sm:p-8">
                    <div className="flex flex-wrap items-center gap-5">
                        {user.picture ? (
                            <img
                                src={user.picture}
                                alt="Profile"
                                className="h-20 w-20 rounded-full object-cover"
                            />
                        ) : (
                            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-zinc-800">
                                <UserRound size={32} className="text-zinc-400" />
                            </div>
                        )}

                        <div className="min-w-0 flex-1">
                            <h2 className="text-xl font-semibold">
                                {user.name || "Unnamed user"}
                            </h2>
                            <p className="mt-1 text-sm text-zinc-400">
                                {user.email}
                            </p>
                            <span className="mt-3 inline-flex rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                                {user.role}
                            </span>
                        </div>

                        <p className="text-xs text-zinc-500">
                            Joined {new Date(user.createdAt).toLocaleDateString("en-IN")}
                        </p>
                    </div>
                </section>

                {/* Statistics */}
                <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                    {stats.map((stat) => {
                        const Icon = stat.icon;

                        return (
                            <div
                                key={stat.label}
                                className="rounded-2xl border border-white/[0.07] bg-[#111113] p-5"
                            >
                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-zinc-500">
                                        {stat.label}
                                    </p>
                                    <Icon size={18} className="text-emerald-400" />
                                </div>

                                <p className="mt-4 text-3xl font-semibold">
                                    {stat.value}
                                </p>
                            </div>
                        );
                    })}
                </section>

                {/* Profile information */}
                <section className="rounded-2xl border border-white/[0.07] bg-[#111113] p-6 sm:p-8">
                    <div className="mb-7 flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold">
                                Personal information
                            </h2>
                            <p className="mt-1 text-sm text-zinc-500">
                                Manage your public profile details.
                            </p>
                        </div>

                        {!editing ? (
                            <button
                                onClick={() => setEditing(true)}
                                className="flex items-center gap-2 rounded-lg border border-zinc-700 px-4 py-2 text-sm transition hover:border-emerald-500 hover:text-emerald-400"
                            >
                                <Pencil size={14} />
                                Edit
                            </button>
                        ) : (
                            <button
                                onClick={() => {
                                    setEditing(false);
                                    setForm({
                                        name: user.name ?? "",
                                        phone: user.phone ?? "",
                                        bio: user.bio ?? "",
                                        hourlyRate: user.hourlyRate?.toString() ?? "",
                                    });
                                    setError("");
                                }}
                                className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white"
                            >
                                <X size={15} />
                                Cancel
                            </button>
                        )}
                    </div>

                    {error && (
                        <p className="mb-5 rounded-lg bg-red-950/30 p-3 text-sm text-red-400">
                            {error}
                        </p>
                    )}

                    <div className="grid gap-6 sm:grid-cols-2">

                        {/* Name */}
                        <div>
                            <label className="mb-2 block text-xs text-zinc-500">
                                Name
                            </label>

                            {editing ? (
                                <input
                                    value={form.name}
                                    onChange={(e) =>
                                        setForm({ ...form, name: e.target.value })
                                    }
                                    placeholder="Name"
                                    className="h-11 w-full rounded-lg border border-zinc-700 bg-black px-3 text-sm outline-none focus:border-emerald-500"
                                />
                            ) : (
                                <p className="text-sm">
                                    {user.name || "Not added"}
                                </p>
                            )}
                        </div>


                        {/* Phone */}
                        <div>
                            <label className="mb-2 block text-xs text-zinc-500">
                                Phone number
                            </label>

                            {editing ? (
                                <input
                                    value={form.phone}
                                    onChange={(e) =>
                                        setForm({ ...form, phone: e.target.value })
                                    }
                                    placeholder="Enter phone number"
                                    className="h-11 w-full rounded-lg border border-zinc-700 bg-black px-3 text-sm outline-none focus:border-emerald-500"
                                />
                            ) : (
                                <p className="text-sm">
                                    {user.phone || "Not added"}
                                </p>
                            )}
                        </div>


                        {/* Hourly rate */}
                        <div>
                            <label className="mb-2 block text-xs text-zinc-500">
                                Hourly rate (₹)
                            </label>

                            {editing ? (
                                <input
                                    type="number"
                                    min="0"
                                    value={form.hourlyRate}
                                    onChange={(e) =>
                                        setForm({ ...form, hourlyRate: e.target.value })
                                    }
                                    placeholder="Enter hourly rate"
                                    className="h-11 w-full rounded-lg border border-zinc-700 bg-black px-3 text-sm outline-none focus:border-emerald-500"
                                />
                            ) : (
                                <p className="text-sm">
                                    {user.hourlyRate != null
                                        ? `₹${user.hourlyRate}/hr`
                                        : "Not added"}
                                </p>
                            )}
                        </div>

                        {/* Bio */}
                        <div className="sm:col-span-2">
                            <label className="mb-2 block text-xs text-zinc-500">
                                About you
                            </label>

                            {editing ? (
                                <textarea
                                    value={form.bio}
                                    onChange={(e) =>
                                        setForm({ ...form, bio: e.target.value })
                                    }
                                    maxLength={1000}
                                    rows={4}
                                    placeholder="Tell clients about yourself and your experience..."
                                    className="w-full resize-y rounded-lg border border-zinc-700 bg-black p-3 text-sm outline-none focus:border-emerald-500"
                                />
                            ) : (
                                <p className="whitespace-pre-line text-sm leading-7 text-zinc-400">
                                    {user.bio || "You haven't added a bio yet."}
                                </p>
                            )}
                        </div>

                    </div>

                    {/* Address */}
                    <div className="mt-7 border-t border-white/[0.07] pt-6">
                        <p className="mb-3 text-xs text-zinc-500">
                            Location
                        </p>

                        <div className="flex items-center gap-2 text-sm text-zinc-300">
                            <MapPin size={16} className="text-emerald-400" />

                            {user.address
                                ? [
                                    user.address.city,
                                    user.address.state,
                                    user.address.country,
                                ]
                                    .filter(Boolean)
                                    .join(", ")
                                : "Address not added"}
                        </div>
                    </div>


                    {/* Skills */}
                    <div className="mt-7 border-t border-white/[0.07] pt-6">

                        <div className="mb-4">
                            <h3 className="text-sm font-semibold">Your skills</h3>
                            <p className="mt-1 text-xs text-zinc-500">
                                Add technologies and skills you work with.
                            </p>
                        </div>

                        {/* Skill input */}
                        {editing && (
                            <div className="mb-5 flex gap-2">
                                <input
                                    type="text"
                                    value={skillInput}
                                    onChange={(e) => setSkillInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            addSkill();
                                        }
                                    }}
                                    placeholder="e.g. TypeScript, React, Rust..."
                                    className="h-11 min-w-0 flex-1 rounded-lg border border-zinc-700 bg-black px-3 text-sm text-white outline-none transition focus:border-emerald-500"
                                />

                                <button
                                    type="button"
                                    onClick={addSkill}
                                    className="rounded-lg bg-emerald-500 px-5 text-sm font-semibold text-black transition hover:bg-emerald-400"
                                >
                                    Add
                                </button>
                            </div>
                        )}

                        {/* Skill boxes */}
                        <div className="flex flex-wrap gap-2">

                            {skills.length > 0 ? (
                                skills.map((skill) => (
                                    <span
                                        key={skill}
                                        className="inline-flex items-center gap-2 rounded-lg border border-zinc-800 bg-black px-3 py-2 text-xs text-zinc-300"
                                    >
                                        {skill}

                                        {editing && (
                                            <button
                                                type="button"
                                                onClick={() => removeSkill(skill)}
                                                className="text-zinc-500 transition hover:text-red-400"
                                                aria-label={`Remove ${skill}`}
                                            >
                                                ×
                                            </button>
                                        )}
                                    </span>
                                ))
                            ) : (
                                <p className="text-sm text-zinc-500">
                                    {getskill.map((skill, i) => (
                                        <div className="inline-flex items-center gap-2 rounded-lg border border-zinc-800 bg-black px-3 py-2 text-xs text-zinc-300" key={i}>{skill.name}</div>
                                    ))}
                                </p>
                            )}

                        </div>
                    </div>


                    {/* Save */}
                    {editing && (
                        <div className="mt-8 flex justify-end">
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="bg-emerald-500 text-black hover:bg-emerald-400"
                            >
                                <Save size={15} className="mr-2" />
                                {saving ? "Saving..." : "Save changes"}
                            </button>
                        </div>
                    )}
                </section>

            </div>
        </main>
    );
}
