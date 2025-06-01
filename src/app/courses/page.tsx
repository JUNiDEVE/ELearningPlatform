"use client" // Enables client-side rendering in Next.js

/* eslint-disable @next/next/no-img-element */
// Disables Next.js warning for using <img> instead of <Image>
 import { useSearchParams } from 'next/navigation'; // Import hook for reading URL query params
import { useState, useEffect } from "react"; // Import React hooks
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Course } from "./../course"; // Import Course type (not used)
import Link from "next/link"; // Import Next.js Link component
import { useRouter } from 'next/navigation'; // Import router for navigation

export default function CoursesPage() { // Main component for displaying courses
  const [courses, setCourses] = useState<any[]>([]); // State to hold courses

  const searchParams = useSearchParams(); // Get search params from URL

  const userId = searchParams?.get('userId'); // Extract userId from query params
 
  const router = useRouter(); // Get router instance

  const handleSignOut = () => { // Function to handle sign out
    // Optional: Clear any stored data or session here
    router.push('http://localhost:3000'); // Redirect to home page
  };

  useEffect(() => { // Fetch courses when component mounts  
    fetch('/api/courses') // Call API endpoint for courses
      .then(res => res.json()) // Parse JSON response
      .then(data => setCourses(data)) // Store courses in state
      .catch(err => console.error('Fetch error:', err)); // Log fetch errors
  }, []);
  
  const handlePurchase = async (courseId: string, price: number) => { // Function to handle course purchase
    try {
      // Mock user ID - integrate with authentication
      
      const response = await fetch("/api/purchase", { // Call purchase API
        method: "POST", // HTTP method
        headers: { "Content-Type": "application/json" }, // Set headers
        body: JSON.stringify({ courseId, userId, amount: price }), // Request body with course and user info
      });

      if (response.ok) { // If purchase successful
        alert("Course purchased successfully!"); // Show success alert
      }
    } catch (error) { // Handle errors
      console.error("Purchase failed:", error); // Log error
      alert("Purchase failed. Please try again."); // Show error alert
    }
  };

  return (
    <div className="min-h-screen bg-gray-50"> {/* Main container */}
      <nav className="bg-white shadow-sm border-b"> {/* Navigation bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold">amoozeshgah</h1> {/* Site title */}
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/admin" className="text-blue-600 hover:text-blue-800">
                Admin Panel {/* Link to admin panel */}
              </Link>
              <button
                onClick={handleSignOut}
                className="text-red-600 hover:text-red-800 border border-red-600 px-3 py-1 rounded"
              >
                Sign Out {/* Sign out button */}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8"> {/* Main content */}
        <div className="px-4 py-6 sm:px-0">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Available Courses {/* Section title */}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => ( // Loop through courses
              <div
                key={course.Id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <img
                  src={course.ImageUrl || "/api/placeholder/300/200"} // Course image or placeholder
                  alt={course.Title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-black">{course.Title}</h3> {/* Course title */}
                  <p className="text-gray-600 mb-4">{course.Description}</p> {/* Course description */}
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-gray-500">
                      by {course.Tutor?.name} {/* Tutor name */}
                    </span>
                    <span className="text-2xl font-bold text-green-600">
                      ${course.Price} {/* Course price */}
                    </span>
                  </div>
                  <button
                    onClick={() => handlePurchase(course.Id, course.Price)} // Purchase button
                    className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
                  >
                    Purchase Course NOOOW!!!!! {/* Button text ofc */}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
