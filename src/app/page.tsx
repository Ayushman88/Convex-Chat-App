"use client";
import React, { useState, ChangeEvent, FormEvent } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";

interface FormData {
  message: string;
}

export default function Home() {
  const { user } = useUser();
  const createMessage = useMutation(api.messages.createMessage);
  const getMessages = useQuery(api.messages.showMessageList);
  const [formData, setFormData] = useState<FormData>({ message: "" });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (user) {
      await createMessage({
        message: formData.message,
        userId: user.id,
        profileImageUrl: user.imageUrl || "", // Pass profile image URL (if available)
      });
      setFormData({ message: "" });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="space-y-6 w-full max-w-lg">
        <form onSubmit={handleSubmit} className="flex flex-row space-x-4">
          <div className="flex-grow">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="message"
            >
              Message
            </label>
            <input
              type="text"
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="self-end px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:bg-blue-700"
          >
            Submit
          </button>
        </form>

        <div className="mt-6 bg-white shadow-md rounded-md p-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Messages</h2>
          <div
            className="space-y-2 overflow-y-auto"
            style={{
              maxHeight: "200px",
            }}
          >
            {getMessages?.map((msg, index) => (
              <div
                key={index}
                className="p-3 border border-gray-200 rounded-md bg-gray-50 text-gray-800"
              >
                <div className="flex items-center space-x-4">
                  {/* Display profile picture */}
                  {msg.profileImageUrl && (
                    <Image
                      src={msg.profileImageUrl}
                      alt="Profile"
                      width={40} // You can adjust the width
                      height={40} // You can adjust the height
                      className="rounded-full"
                    />
                  )}
                  <div className="flex-grow">
                    {msg.message}
                    <div className="text-sm text-gray-500">
                      {typeof window !== "undefined" &&
                        formatDistanceToNow(new Date(msg.createdAt), {
                          addSuffix: true,
                        })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
