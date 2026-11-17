
"use client";

import { useEffect, useState } from "react";
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
import EmailVerification from "@/components/shared/EmailVerification";
import { GetAddress, uploadAddress } from "@/lib/api";

type AddressType = {
    city: string;
    state: string;
    country: string;
    street: string;
    zipCode: string;
};

type Skill = {
    id: string;
    name: string;
};

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
    emailVerifiedAt: string | null;
    phoneVerifiedAt: string | null;
    address?: AddressType | null;
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

const EMPTY_ADDRESS: AddressType = {
    city: "",
    state: "",
    country: "India",
    street: "",
    zipCode: "",
};

export default function Dashboard() {
    // Main data
    const [user, setUser] = useState<DashboardUser | null>(null);
    const [address, setAddress] = useState<AddressType | null>(null);

    // Loading states
    const [loading, setLoading] = useState(true);
    const [savingPersonal, setSavingPersonal] = useState(false);
    const [savingAddress, setSavingAddress] = useState(false);
    const [savingSkills, setSavingSkills] = useState(false);

    // Independent editing states
    const [editingPersonal, setEditingPersonal] = useState(false);
    const [editingAddress, setEditingAddress] = useState(false);
    const [editingSkills, setEditingSkills] = useState(false);

    // Errors
    const [personalError, setPersonalError] = useState("");
    const [addressError, setAddressError] = useState("");
    const [skillsError, setSkillsError] = useState("");

    // Personal information form
    const [form, setForm] = useState({
        name: "",
        phone: "",
        bio: "",
        hourlyRate: "",
    });

    // Address form
    const [addressForm, setAddressForm] =
        useState<AddressType>(EMPTY_ADDRESS);

    // Skills
    const [skills, setSkills] = useState<string[]>([]);
    const [savedSkills, setSavedSkills] = useState<string[]>([]);
    const [skillInput, setSkillInput] = useState("");

    // --------------------------------
    // 1. FETCH USER PROFILE
    // --------------------------------

    useEffect(() => {
        const getProfile = async () => {
            try {
                const response = await fetch(
                    "http://localhost:3001/user/get",
                    {
                        credentials: "include",
                    }
                );

                if (!response.ok) {
                    throw new Error("Unable to fetch profile");
                }

                const data = await response.json();
                const profile: DashboardUser = data.user;

                if (!profile) {
                    throw new Error("User profile not found");
                }

                setUser(profile);

                setForm({
                    name: profile.name ?? "",
                    phone: profile.phone ?? "",
                    bio: profile.bio ?? "",
                    hourlyRate:
                        profile.hourlyRate?.toString() ?? "",
                });
            } catch (error) {
                console.error("Profile fetch error:", error);
            } finally {
                setLoading(false);
            }
        };

        getProfile();
    }, []);

    // --------------------------------
    // 2. FETCH ADDRESS
    // --------------------------------

    useEffect(() => {
        const fetchAddress = async () => {
            try {
                const response = await GetAddress();

                // Supports either direct data or Axios response data.
                const data =
                    response?.data?.address ??
                    response?.data ??
                    response?.address ??
                    response;

                if (!data || typeof data !== "object") {
                    return;
                }

                const savedAddress: AddressType = {
                    city: data.city ?? "",
                    state: data.state ?? "",
                    country: data.country ?? "India",
                    street: data.street ?? "",
                    zipCode: data.zipCode ?? "",
                };

                setAddress(savedAddress);
                setAddressForm(savedAddress);
            } catch (error) {
                console.error("Address fetch error:", error);
            }
        };

        fetchAddress();
    }, []);

    // --------------------------------
    // 3. FETCH SKILLS
    // --------------------------------

    useEffect(() => {
        const fetchSkills = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:3001/user/getskills",
                    {
                        withCredentials: true,
                    }
                );

                const fetchedSkills: Skill[] =
                    response.data.skills ?? [];

                const skillNames = fetchedSkills.map(
                    (skill) => skill.name
                );

                setSkills(skillNames);
                setSavedSkills(skillNames);
            } catch (error) {
                console.error("Skills fetch error:", error);
            }
        };

        fetchSkills();
    }, []);

    // --------------------------------
    // 4. SAVE PERSONAL INFORMATION
    // --------------------------------

    const handleSavePersonal = async () => {
        setSavingPersonal(true);
        setPersonalError("");

        try {
            const response = await axios.patch(
                "http://localhost:3001/user/update",
                {
                    name: form.name,
                    phone: form.phone,
                    bio: form.bio,
                    hourlyRate:
                        form.hourlyRate === ""
                            ? null
                            : Number(form.hourlyRate),
                },
                {
                    withCredentials: true,
                }
            );

            const updatedUser = response.data.user;

            setUser((previous) =>
                previous
                    ? {
                          ...previous,
                          ...(updatedUser ?? {
                              name: form.name,
                              phone: form.phone,
                              bio: form.bio,
                              hourlyRate:
                                  form.hourlyRate === ""
                                      ? null
                                      : Number(form.hourlyRate),
                          }),
                      }
                    : previous
            );

            setEditingPersonal(false);
        } catch (error) {
            console.error("Personal information update error:", error);
            setPersonalError("Failed to update personal information.");
        } finally {
            setSavingPersonal(false);
        }
    };

    // --------------------------------
    // 5. SAVE ADDRESS
    // --------------------------------

    const handleSaveAddress = async () => {
        setSavingAddress(true);
        setAddressError("");

        try {
            const response = await uploadAddress(
                addressForm.city,
                addressForm.state,
                addressForm.country,
                addressForm.zipCode,
                addressForm.street
            );

            const data =
                response?.data?.address ??
                response?.data ??
                response?.address ??
                response;

            const savedAddress: AddressType = {
                city: data?.city ?? addressForm.city,
                state: data?.state ?? addressForm.state,
                country: data?.country ?? addressForm.country,
                street: data?.street ?? addressForm.street,
                zipCode: data?.zipCode ?? addressForm.zipCode,
            };

            setAddress(savedAddress);
            setAddressForm(savedAddress);
            setEditingAddress(false);
        } catch (error) {
            console.error("Address update error:", error);
            setAddressError("Failed to update address.");
        } finally {
            setSavingAddress(false);
        }
    };

    // --------------------------------
    // 6. SAVE SKILLS
    // --------------------------------

    const handleSaveSkills = async () => {
        setSavingSkills(true);
        setSkillsError("");

        try {
            await axios.post(
                "http://localhost:3001/user/skills",
                {
                    skills,
                },
                {
                    withCredentials: true,
                }
            );

            setSavedSkills([...skills]);
            setEditingSkills(false);
        } catch (error) {
            console.error("Skills update error:", error);
            setSkillsError("Failed to update skills.");
        } finally {
            setSavingSkills(false);
        }
    };

    // --------------------------------
    // 7. CANCEL FUNCTIONS
    // --------------------------------

    const cancelPersonalEdit = () => {
        if (!user) return;

        setForm({
            name: user.name ?? "",
            phone: user.phone ?? "",
            bio: user.bio ?? "",
            hourlyRate: user.hourlyRate?.toString() ?? "",
        });

        setPersonalError("");
        setEditingPersonal(false);
    };

    const cancelAddressEdit = () => {
        setAddressForm(address ?? EMPTY_ADDRESS);
        setAddressError("");
        setEditingAddress(false);
    };

    const cancelSkillsEdit = () => {
        setSkills([...savedSkills]);
        setSkillInput("");
        setSkillsError("");
        setEditingSkills(false);
    };

    // --------------------------------
    // 8. ADD AND REMOVE SKILLS
    // --------------------------------

    const addSkill = () => {
        const newSkill = skillInput.trim();

        if (!newSkill) return;

        const alreadyExists = skills.some(
            (skill) =>
                skill.toLowerCase() === newSkill.toLowerCase()
        );

        if (alreadyExists) {
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

    // --------------------------------
    // 9. LOADING
    // --------------------------------

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
                Unable to load user profile.
            </div>
        );
    }

    // --------------------------------
    // 10. DASHBOARD STATISTICS
    // --------------------------------

    const stats = [
        {
            label: "Jobs",
            value: user._count?.jobs ?? 0,
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

    // --------------------------------
    // 11. DASHBOARD UI
    // --------------------------------

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

                {/* Profile Header */}

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
                                <UserRound
                                    size={32}
                                    className="text-zinc-400"
                                />
                            </div>
                        )}

                        <div className="min-w-0 flex-1">
                            <h2 className="text-xl font-semibold">
                                {user.name || "Unnamed user"}
                            </h2>

                            <div className="mt-1 flex flex-wrap items-center gap-2">
                                <p className="text-sm text-zinc-400">
                                    {user.email}
                                </p>

                                {user.emailVerifiedAt ? (
                                    <span className="text-sm text-green-400">
                                        ✓ Email verified
                                    </span>
                                ) : (
                                    <EmailVerification />
                                )}
                            </div>

                            <span className="mt-3 inline-flex rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                                {user.role}
                            </span>
                        </div>

                        <p className="text-xs text-zinc-500">
                            Joined{" "}
                            {new Date(user.createdAt).toLocaleDateString("en-IN")}
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

                                    <Icon
                                        size={18}
                                        className="text-emerald-400"
                                    />
                                </div>

                                <p className="mt-4 text-3xl font-semibold">
                                    {stat.value}
                                </p>
                            </div>
                        );
                    })}
                </section>

                {/* PERSONAL INFORMATION */}

                <section className="rounded-2xl border border-white/[0.07] bg-[#111113] p-6 sm:p-8">
                    <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h2 className="text-lg font-semibold">
                                Personal Information
                            </h2>

                            <p className="mt-1 text-sm text-zinc-500">
                                Manage your public profile details.
                            </p>
                        </div>

                        {!editingPersonal ? (
                            <button
                                onClick={() => setEditingPersonal(true)}
                                className="flex items-center gap-2 rounded-lg border border-zinc-700 px-4 py-2 text-sm hover:border-emerald-500 hover:text-emerald-400"
                            >
                                <Pencil size={14} />
                                Edit
                            </button>
                        ) : (
                            <div className="flex gap-3">
                                <button
                                    onClick={cancelPersonalEdit}
                                    className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white"
                                >
                                    <X size={15} />
                                    Cancel
                                </button>

                                <button
                                    onClick={handleSavePersonal}
                                    disabled={savingPersonal}
                                    className="flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm text-black hover:bg-emerald-400 disabled:opacity-50"
                                >
                                    <Save size={14} />
                                    {savingPersonal ? "Saving..." : "Save"}
                                </button>
                            </div>
                        )}
                    </div>

                    {personalError && (
                        <p className="mb-5 rounded-lg bg-red-950/30 p-3 text-sm text-red-400">
                            {personalError}
                        </p>
                    )}

                    <div className="grid gap-6 sm:grid-cols-2">

                        {/* Name */}

                        <div>
                            <label className="mb-2 block text-xs text-zinc-500">
                                Name
                            </label>

                            {editingPersonal ? (
                                <input
                                    value={form.name}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            name: e.target.value,
                                        })
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
                            <div className="mb-2 flex flex-wrap items-center gap-3">
                                <label className="text-xs text-zinc-500">
                                    Phone number
                                </label>

                                <span className="text-xs text-zinc-500">
                                    {user.phoneVerifiedAt
                                        ? "✓ Phone verified"
                                        : "Phone not verified"}
                                </span>
                            </div>

                            {editingPersonal ? (
                                <input
                                    value={form.phone}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            phone: e.target.value,
                                        })
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

                        {/* Hourly Rate */}

                        <div>
                            <label className="mb-2 block text-xs text-zinc-500">
                                Hourly rate (₹)
                            </label>

                            {editingPersonal ? (
                                <input
                                    type="number"
                                    min="0"
                                    value={form.hourlyRate}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            hourlyRate: e.target.value,
                                        })
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

                            {editingPersonal ? (
                                <textarea
                                    value={form.bio}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            bio: e.target.value,
                                        })
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
                </section>

                {/* ADDRESS */}

                <section className="rounded-2xl border border-white/[0.07] bg-[#111113] p-6 sm:p-8">
                    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h2 className="text-lg font-semibold">
                                Address
                            </h2>

                            <p className="mt-1 text-sm text-zinc-500">
                                Manage your location details.
                            </p>
                        </div>

                        {!editingAddress ? (
                            <button
                                onClick={() => setEditingAddress(true)}
                                className="flex items-center gap-2 rounded-lg border border-zinc-700 px-4 py-2 text-sm hover:border-emerald-500 hover:text-emerald-400"
                            >
                                <Pencil size={14} />
                                Edit
                            </button>
                        ) : (
                            <div className="flex gap-3">
                                <button
                                    onClick={cancelAddressEdit}
                                    className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white"
                                >
                                    <X size={15} />
                                    Cancel
                                </button>

                                <button
                                    onClick={handleSaveAddress}
                                    disabled={savingAddress}
                                    className="flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm text-black hover:bg-emerald-400 disabled:opacity-50"
                                >
                                    <Save size={14} />
                                    {savingAddress ? "Saving..." : "Save"}
                                </button>
                            </div>
                        )}
                    </div>

                    {addressError && (
                        <p className="mb-5 rounded-lg bg-red-950/30 p-3 text-sm text-red-400">
                            {addressError}
                        </p>
                    )}

                    {editingAddress ? (
                        <div className="grid gap-4 sm:grid-cols-2">
                            <input
                                value={addressForm.street}
                                onChange={(e) =>
                                    setAddressForm({
                                        ...addressForm,
                                        street: e.target.value,
                                    })
                                }
                                placeholder="Street / Area"
                                maxLength={200}
                                className="w-full rounded-lg border border-zinc-700 bg-black p-3 text-sm outline-none focus:border-emerald-500"
                            />

                            <input
                                value={addressForm.city}
                                onChange={(e) =>
                                    setAddressForm({
                                        ...addressForm,
                                        city: e.target.value,
                                    })
                                }
                                placeholder="City"
                                maxLength={100}
                                className="w-full rounded-lg border border-zinc-700 bg-black p-3 text-sm outline-none focus:border-emerald-500"
                            />

                            <input
                                value={addressForm.state}
                                onChange={(e) =>
                                    setAddressForm({
                                        ...addressForm,
                                        state: e.target.value,
                                    })
                                }
                                placeholder="State"
                                maxLength={100}
                                className="w-full rounded-lg border border-zinc-700 bg-black p-3 text-sm outline-none focus:border-emerald-500"
                            />

                            <input
                                value={addressForm.zipCode}
                                onChange={(e) =>
                                    setAddressForm({
                                        ...addressForm,
                                        zipCode: e.target.value,
                                    })
                                }
                                placeholder="ZIP / Postal code"
                                maxLength={20}
                                className="w-full rounded-lg border border-zinc-700 bg-black p-3 text-sm outline-none focus:border-emerald-500"
                            />

                            <input
                                value={addressForm.country}
                                onChange={(e) =>
                                    setAddressForm({
                                        ...addressForm,
                                        country: e.target.value,
                                    })
                                }
                                placeholder="Country"
                                maxLength={100}
                                className="w-full rounded-lg border border-zinc-700 bg-black p-3 text-sm outline-none focus:border-emerald-500 sm:col-span-2"
                            />
                        </div>
                    ) : (
                        <div className="flex items-start gap-3 text-sm text-zinc-300">
                            <MapPin
                                size={18}
                                className="mt-0.5 shrink-0 text-emerald-400"
                            />

                            <span>
                                {address
                                    ? [
                                          address.street,
                                          address.city,
                                          address.state,
                                          address.zipCode,
                                          address.country,
                                      ]
                                          .filter(Boolean)
                                          .join(", ") || "Address not added"
                                    : "Address not added"}
                            </span>
                        </div>
                    )}
                </section>

                {/* SKILLS */}

                <section className="rounded-2xl border border-white/[0.07] bg-[#111113] p-6 sm:p-8">
                    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h2 className="text-lg font-semibold">
                                Your Skills
                            </h2>

                            <p className="mt-1 text-sm text-zinc-500">
                                Add technologies and skills you work with.
                            </p>
                        </div>

                        {!editingSkills ? (
                            <button
                                onClick={() => setEditingSkills(true)}
                                className="flex items-center gap-2 rounded-lg border border-zinc-700 px-4 py-2 text-sm hover:border-emerald-500 hover:text-emerald-400"
                            >
                                <Pencil size={14} />
                                Edit
                            </button>
                        ) : (
                            <div className="flex gap-3">
                                <button
                                    onClick={cancelSkillsEdit}
                                    className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white"
                                >
                                    <X size={15} />
                                    Cancel
                                </button>

                                <button
                                    onClick={handleSaveSkills}
                                    disabled={savingSkills}
                                    className="flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm text-black hover:bg-emerald-400 disabled:opacity-50"
                                >
                                    <Save size={14} />
                                    {savingSkills ? "Saving..." : "Save"}
                                </button>
                            </div>
                        )}
                    </div>

                    {skillsError && (
                        <p className="mb-5 rounded-lg bg-red-950/30 p-3 text-sm text-red-400">
                            {skillsError}
                        </p>
                    )}

                    {/* Add skill */}

                    {editingSkills && (
                        <div className="mb-5 flex gap-2">
                            <input
                                type="text"
                                value={skillInput}
                                onChange={(e) =>
                                    setSkillInput(e.target.value)
                                }
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        addSkill();
                                    }
                                }}
                                placeholder="e.g. TypeScript, React, Rust..."
                                className="h-11 min-w-0 flex-1 rounded-lg border border-zinc-700 bg-black px-3 text-sm text-white outline-none focus:border-emerald-500"
                            />

                            <button
                                type="button"
                                onClick={addSkill}
                                className="rounded-lg bg-emerald-500 px-5 text-sm font-semibold text-black hover:bg-emerald-400"
                            >
                                Add
                            </button>
                        </div>
                    )}

                    {/* Skill list */}

                    <div className="flex flex-wrap gap-2">
                        {skills.length > 0 ? (
                            skills.map((skill) => (
                                <span
                                    key={skill}
                                    className="inline-flex items-center gap-2 rounded-lg border border-zinc-800 bg-black px-3 py-2 text-xs text-zinc-300"
                                >
                                    {skill}

                                    {editingSkills && (
                                        <button
                                            type="button"
                                            onClick={() => removeSkill(skill)}
                                            className="text-zinc-500 hover:text-red-400"
                                            aria-label={`Remove ${skill}`}
                                        >
                                            ×
                                        </button>
                                    )}
                                </span>
                            ))
                        ) : (
                            <p className="text-sm text-zinc-500">
                                No skills added yet.
                            </p>
                        )}
                    </div>
                </section>
            </div>
        </main>
    );
}
