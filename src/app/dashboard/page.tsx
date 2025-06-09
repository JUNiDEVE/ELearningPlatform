"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

interface ProfileData {
  Name: string;
  Profession: string;
  Description: string;
}
export default function Dashboard() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const userId = searchParams?.get("userId");

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/dashboard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      const data = await res.json();
      setProfile(data.user);
      console.log(data.user);
    };

    if (userId) fetchData();
  }, [userId]);

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/students?tutorId=${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const studentsData = await response.json();
        setStudents(studentsData);
        console.log(studentsData);
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchStudents();
  }, [userId]);

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-6">

      {/* Students Section */}
      <div className="lg:w-2/3">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">My Students</h3>
            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
              {(() => {
                const uniqueStudents = new Set(students.map(s => s.UserId));
                return uniqueStudents.size;
              })()} Student(s)
            </span>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-400">Loading My Students... </p>
            </div>
          ) : students.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400">No students found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {(() => {
                // Group students by UserId
                const groupedStudents = students.reduce((acc, student) => {
                  if (!acc[student.UserId]) {
                    acc[student.UserId] = {
                      ...student,
                      courses: []
                    };
                  }
                  acc[student.UserId].courses.push({
                    CourseTitle: student.CourseTitle,
                    PurchaseDate: student.PurchaseDate,
                    PaymentStatus: student.PaymentStatus,
                    Amount: student.Amount,
                    CourseId: student.CourseId
                  });
                  return acc;
                }, {});

                return Object.values(groupedStudents).map((student: any) => (
                  <div
                    key={student.UserId}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-4 rtl:space-x-reverse">
                        <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-gray-600 font-medium text-lg">
                            {student.Name?.charAt(0) || 'U'}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 text-lg">
                            {student.Name || 'نام نامشخص'}
                          </h4>
                          <p className="text-sm text-gray-500">{student.Email}</p>
                          {student.Profession && (
                            <p className="text-xs text-gray-400">{student.Profession}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-left rtl:text-right">
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                          {student.courses.length} course
                        </span>
                      </div>
                    </div>

                    {/* Courses List */}
                    <div className="mt-4 ml-16 rtl:mr-16 rtl:ml-0">
                      <div className="space-y-2">
                        {student.courses.map((course: any, courseIndex: number) => (
                          <div 
                            key={courseIndex}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                          >
                            <div>
                              <h5 className="font-medium text-gray-800 text-sm">
                                {course.CourseTitle}
                              </h5>
                              <p className="text-xs text-gray-500">
                                {new Date(course.PurchaseDate).toLocaleDateString('fa-IR')}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2 rtl:space-x-reverse">
                              <span className="text-xs font-medium text-gray-600">
                                {course.Amount?.toLocaleString()} $$$
                              </span>
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                {course.PaymentStatus}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ));
              })()}
            </div>
          )}

          {/* Show More Button (if you want to implement pagination) */}
          {students.length > 10 && (
            <div className="mt-6 text-center">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                مشاهده بیشتر
              </button>
            </div>
          )}
        </div>
      </div>
            {/* Profile Section */}
      <div className="lg:w-1/3">
        <div className="bg-white p-6 rounded-xl shadow-md text-center">
          <div className="w-24 h-24 mx-auto rounded-full bg-[#0F172A] flex items-center justify-center">
            <img src="/images/logo.png" alt="Profile" className="w-8 h-8" />
          </div>

          {!profile ? (
            <p className="text-gray-400 mt-4">در حال بارگذاری...</p>
          ) : (
            <>
              <h2 className="mt-4 text-lg font-bold text-gray-900">
                {profile.Name}
              </h2>
              <p className="text-gray-600 text-sm mt-1">{profile.Profession}</p>
              <p className="text-gray-600 text-sm mt-1">{profile.Description}</p>
              <p className="text-green-600 text-sm mt-1">AmjadLearn</p>
            </>
          )}
        </div>
      </div>

    </div>
  );
}