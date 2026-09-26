"use client";

import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  Camera,
  Save,
  Trash2,
  FileText,
} from "lucide-react";
import axios from "axios";
import { signOut, useSession } from "next-auth/react";

export default function UserSettings() {
  const { data: session } = useSession();

  const [form, setForm] = useState({
    street: "Haldwani, Uttarakhand",
    city: "Haldwani",
    state: "Uttarakhand",
    country: "India",
    zipCode: "263139"
  });

  const [details, SetDetails] = useState({
    name: "",
    phone: "",
    bio: "",
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Updated user:", form);
    try {
      const response = await axios.post("http://localhost:3001/user/address", form, {
        withCredentials: true,
      })
      console.log(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  async function handleChangeSecond(e: React.ChangeEvent<HTMLInputElement>) {
    SetDetails({
      ...details,
      [e.target.name]: e.target.value
    })
  }

  async function handleSubmitSecond(e: React.FormEvent) {
    e.preventDefault();

    console.log("Updated user:", details);
    try {
      const response = await axios.patch("http://localhost:3001/user/update", details, {
        withCredentials: true,
      })
      console.log(response.data);
    } catch (err) {
      console.log(err);
    }
  }

  const deleteAccount = async () => {
    try {
      const response = await axios.delete("http://localhost:3001/user/deleteprofile", {
        withCredentials: true
      });
      console.log(response.data);

      if (response.status == 200) {
        await signOut({
          callbackUrl: "/"
        });
      }

    } catch (error: any) {
      console.error('Delete failed:', error.response?.data || error.message);
    }
  }


  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText("barnesbucky933@gmail.com");

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <main className="min-h-screen bg-black px-4 py-8 text-white">
      <div className="mx-auto max-w-4xl">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">
            Account Settings
          </h1>

          <p className="mt-2 text-sm text-zinc-500">
            Manage your personal information and account settings.
          </p>
        </div>

        <div className="space-y-6">

          {/* Profile Section */}
          <section className="rounded-xl border border-zinc-800 bg-zinc-950">

            <div className="border-b border-zinc-800 px-6 py-5">
              <h2 className="font-medium text-white">
                Profile
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                Update your personal information.
              </p>
            </div>

            <div className="p-6">

              {/* Avatar */}
              <div className="mb-8 flex items-center gap-5">

                <div className="relative">

                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-xl font-semibold text-black">
                    <img src={(session?.user?.image)?.toString()} alt="img" />
                  </div>

                  <button
                    type="button"
                    className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full border-2 border-black bg-zinc-800 text-zinc-300 transition hover:bg-zinc-700"
                  >
                    <Camera size={14} />
                  </button>

                </div>

                <div>
                  <h3 className="text-sm font-medium text-white">
                    Profile Picture
                  </h3>

                  <p className="mt-1 text-xs text-zinc-500">
                    JPG, PNG or WEBP. Maximum 5MB.
                  </p>
                </div>

              </div>

              <form onSubmit={handleSubmitSecond} className="space-y-6">

                {/* Name + Email */}
                <div className="grid gap-5 md:grid-cols-2">

                  <InputSecond
                    label="Full Name"
                    name="name"
                    value={details.name}
                    onChange={handleChangeSecond}
                    icon={<User size={16} />}
                  />

                  {/* Email */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-zinc-300">
                      Email
                    </label>

                    <div className="flex h-11 items-center gap-2 rounded-lg border border-zinc-800 bg-black p-1">
                      <Mail
                        size={16}
                        className="ml-2 shrink-0 text-zinc-600"
                      />

                      <span className="min-w-0 flex-1 truncate px-2 text-sm text-zinc-300">
                        {session?.user?.email}
                      </span>

                      <button
                        type="button"
                        onClick={handleCopy}
                        className="h-9 shrink-0 rounded-md bg-green-500 px-4 text-sm font-medium text-black transition hover:bg-green-400 active:scale-[0.98]"
                      >
                        {copied ? "Copied" : "Copy"}
                      </button>
                    </div>
                  </div>

                  {/* Phone */}
                  <InputSecond
                    label="Phone Number"
                    name="phone"
                    type="tel"
                    value={details.phone}
                    onChange={handleChangeSecond}
                    icon={<Phone size={16} />}
                  />

                  {/* Bio */}
                  <InputSecond
                    label="Bio"
                    name="bio"
                    type="text"
                    value={details.bio}
                    onChange={handleChangeSecond}
                    icon={<FileText size={16} />}
                  />

                </div>

                {/* Save */}
                <div className="flex justify-end border-t border-zinc-800 pt-6">
                  <button
                    type="submit"
                    className="flex h-11 items-center gap-2 rounded-lg border border-green-500 bg-green-500 px-5 text-sm font-medium text-black transition hover:bg-green-400 active:scale-[0.98]"
                  >
                    <Save size={16} />
                    Save Changes
                  </button>
                </div>

              </form>


              <form
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                {/* Address */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-300">
                    Address
                  </label>

                  <div className="relative">

                    <MapPin
                      size={16}
                      className="absolute left-3 top-3.5 text-zinc-600"
                    />

                    <input
                      name="street"
                      value={form.street}
                      onChange={handleChange}
                      placeholder="Enter your street address"
                      className="w-full rounded-lg border border-zinc-800 bg-black py-3 pl-10 pr-4 text-sm text-white outline-none placeholder:text-zinc-700 transition focus:border-zinc-600 focus:ring-1 focus:ring-zinc-700"
                    />

                  </div>
                </div>

                {/* City / State / Country */}
                <div className="grid gap-5 md:grid-cols-3">

                  <Input
                    label="City"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                  />

                  <Input
                    label="State"
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                  />

                  <Input
                    label="Country"
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                  />

                  <Input
                    label="Zip code"
                    name="ZipCode"
                    value={form.zipCode}
                    onChange={handleChange}
                  />

                </div>

                {/* Save */}
                <div className="flex justify-end border-t border-zinc-800 pt-6">
                  <button
                    type="submit"
                    className="flex h-11 items-center gap-2 rounded-lg border border-green-500 bg-green-500 px-5 text-sm font-medium text-black transition hover:bg-green-400 active:scale-[0.98]"
                  >
                    <Save size={16} />
                    Save Changes
                  </button>
                </div>

              </form>
            </div>
          </section>

          {/* Security */}
          <section className="rounded-xl border border-zinc-800 bg-zinc-950">

            <div className="flex items-center justify-between gap-4 px-6 py-5">

              <div className="flex items-center gap-4">

                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-800 bg-black">
                  <Lock
                    size={17}
                    className="text-zinc-400"
                  />
                </div>

                <div>
                  <h2 className="text-sm font-medium text-white">
                    Password
                  </h2>

                  <p className="mt-1 text-sm text-zinc-500">
                    Update your account password.
                  </p>
                </div>

              </div>

              <button
                type="button"
                className="rounded-lg border border-zinc-800 px-4 py-2 text-sm font-medium text-zinc-300 transition hover:border-zinc-700 hover:bg-zinc-900"
              >
                Change Password
              </button>

            </div>
          </section>

          {/* Danger Zone */}
          <section className="rounded-xl border border-red-950 bg-zinc-950">

            <div className="flex items-center justify-between gap-5 px-6 py-5">

              <div>
                <h2 className="text-sm font-medium text-red-500">
                  Delete Account
                </h2>

                <p className="mt-1 text-sm text-zinc-500">
                  Permanently delete your account and all
                  associated data.
                </p>
              </div>

              <button onClick={deleteAccount}
                type="button"
                className="flex shrink-0 items-center gap-2 rounded-lg border border-red-900/60 px-4 py-2 text-sm font-medium text-red-500 transition hover:bg-red-950/30"
              >
                <Trash2 size={15} />
                Delete
              </button>

            </div>
          </section>

        </div>
      </div>
    </main>
  );
}


/* -------------------------------- */
/* Reusable Input */
/* -------------------------------- */

function Input({
  label,
  name,
  value,
  onChange,
  type = "text",
  icon,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div>

      <label className="mb-2 block text-sm font-medium text-zinc-300">
        {label}
      </label>

      <div className="relative">

        {icon && (
          <span className="absolute left-3 top-3.5 text-zinc-600">
            {icon}
          </span>
        )}

        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className={`w-full rounded-lg border border-zinc-800 bg-black py-3 pr-4 text-sm text-white outline-none placeholder:text-zinc-700 transition focus:border-zinc-600 focus:ring-1 focus:ring-zinc-700 ${icon ? "pl-10" : "px-4"
            }`}
        />

      </div>

    </div>
  );
}


//for name email and phone number
function InputSecond({
  label,
  name,
  value,
  onChange,
  type = "text",
  icon,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div>

      <label className="mb-2 block text-sm font-medium text-zinc-300">
        {label}
      </label>

      <div className="relative">

        {icon && (
          <span className="absolute left-3 top-3.5 text-zinc-600">
            {icon}
          </span>
        )}

        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className={`w-full rounded-lg border border-zinc-800 bg-black py-3 pr-4 text-sm text-white outline-none placeholder:text-zinc-700 transition focus:border-zinc-600 focus:ring-1 focus:ring-zinc-700 ${icon ? "pl-10" : "px-4"
            }`}
        />

      </div>

    </div>
  );
}