'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import type { Course } from '@/lib/types';

function StarRating({ rating }: { rating: number | null }) {
  if (!rating) return <span className="text-gray-400 text-sm">No ratings yet</span>;
  return (
    <span className="text-yellow-500 text-sm font-medium">
      {'★'.repeat(Math.round(rating))}{'☆'.repeat(5 - Math.round(rating))} {rating.toFixed(1)}
    </span>
  );
}

function CourseCard({ course }: { course: Course }) {
  return (
    <Link href={`/courses/${course.id}`} className="group block bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden">
      {course.thumbnail_url ? (
        <img src={course.thumbnail_url} alt={course.title} className="w-full h-40 object-cover" />
      ) : (
        <div className="w-full h-40 bg-indigo-100 flex items-center justify-center text-indigo-300 text-4xl">📚</div>
      )}
      <div className="p-4">
        {course.category && (
          <span className="text-xs text-indigo-600 font-semibold uppercase tracking-wider">{course.category}</span>
        )}
        <h3 className="font-semibold text-gray-900 mt-1 group-hover:text-indigo-700 line-clamp-2">{course.title}</h3>
        <p className="text-sm text-gray-500 mt-1">by {course.instructor_name}</p>
        <div className="flex items-center justify-between mt-3">
          <StarRating rating={course.average_rating} />
          <span className="font-bold text-indigo-700">
            {parseFloat(course.price) === 0 ? 'Free' : `$${course.price}`}
          </span>
        </div>
        <p className="text-xs text-gray-400 mt-1">{course.enrollment_count} students</p>
      </div>
    </Link>
  );
}

function LaptopIcon() {
  return (
    <svg width="38" height="36" viewBox="0 0 44 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M41.37 34.7695C41.27 36.5695 39.78 37.9995 37.95 37.9995H5.42C3.6 37.9995 2.1 36.5695 2 34.7695H41.37ZM41.57 32.7695H1.81C0.81 32.7695 0 33.5795 0 34.5795C0 37.5695 2.43 39.9995 5.42 39.9995H37.95C40.94 39.9995 43.37 37.5695 43.37 34.5795C43.38 33.5795 42.57 32.7695 41.57 32.7695Z" fill="#ffffff"></path>
      <path d="M38.3501 15.5801V33.6801H4.12012V9.27012C4.12012 8.77012 4.52012 8.37012 5.02012 8.37012H28.0001" stroke="#ffffff" strokeWidth="2" strokeMiterlimit="10"></path>
      <path d="M41.3801 2V14.27H31.9901C31.3001 14.27 30.6301 14.52 30.1101 14.96L29.1101 15.64V2H41.3801ZM41.5701 0H28.9201C27.9201 0 27.1101 0.81 27.1101 1.81V17.89C27.1101 18.39 27.5201 18.72 27.9401 18.72C28.1401 18.72 28.3501 18.64 28.5201 18.48L31.3501 16.54C31.5201 16.37 31.7501 16.27 31.9901 16.27H41.5701C42.5701 16.27 43.3801 15.46 43.3801 14.46V1.81C43.3801 0.81 42.5701 0 41.5701 0Z" fill="#ffffff"></path>
      <path d="M32.0801 6.12988H38.4101" stroke="#ffffff" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path>
      <path d="M33.8899 10.1396H36.5899" stroke="#ffffff" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path>
      <path d="M10.9399 33.6701V26.7001C10.9399 24.5601 12.9599 22.8301 15.4599 22.8301C17.9599 22.8301 19.9799 24.5601 19.9799 26.7001V33.6701" stroke="#ffffff" strokeWidth="2" strokeMiterlimit="10"></path>
      <path d="M15.46 22.8302C16.9567 22.8302 18.17 21.6168 18.17 20.1202C18.17 18.6235 16.9567 17.4102 15.46 17.4102C13.9633 17.4102 12.75 18.6235 12.75 20.1202C12.75 21.6168 13.9633 22.8302 15.46 22.8302Z" stroke="#ffffff" strokeWidth="2" strokeMiterlimit="10"></path>
    </svg>
  )
}

function InstructorIcon() {
  return (
    <svg width="26" height="40" viewBox="0 0 31 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M28.8827 31.2393L26.7251 38.0491H4.27539L2.11774 31.2393H28.8827V31.2393ZM29.3042 29.2881H1.69624C0.55218 29.2881 -0.260704 30.3613 0.0805067 31.4247L2.42884 38.8393C2.63959 39.532 3.30194 40.0003 4.04457 40.0003H26.9659C27.7085 40.0003 28.3709 39.532 28.5816 38.8393L30.93 31.4247C31.2611 30.3613 30.4483 29.2881 29.3042 29.2881Z" fill="#ffffff"></path>
      <path d="M4.48584 30.1174C4.48584 26.9369 7.14528 24.3516 10.4169 24.3516H20.583C23.8546 24.3516 26.514 26.9369 26.514 30.1174" stroke="#ffffff" strokeWidth="2" strokeMiterlimit="10"></path>
      <path d="M15.0737 34.6436H15.9268" stroke="#ffffff" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path>
      <path d="M20.4827 24.3512V22.5853C20.4827 21.7268 20.8039 20.9073 21.3558 20.2341C22.5802 18.7512 23.4232 17.1024 23.7242 14.6341C23.7744 14.2146 24.1357 13.8829 24.5672 13.8829C25.059 13.8829 25.4503 13.4927 25.4503 13.0146V12.2439C25.4503 11.7658 25.0489 11.3756 24.5572 11.3756H24.5471C24.1056 11.3756 23.7543 11.0536 23.7042 10.6341C23.0518 5.1512 19.6197 0.975586 15.5051 0.975586C11.3804 0.975586 7.95828 5.1512 7.27586 10.6341C7.22568 11.0536 6.86439 11.3853 6.43286 11.3853H6.41279C5.8508 11.3853 5.38916 11.8341 5.38916 12.3805V12.878C5.38916 13.4244 5.8508 13.8731 6.41279 13.8731C6.85436 13.8731 7.20561 14.1951 7.25578 14.6244C7.55685 17.0927 8.40988 18.7512 9.62419 20.2341C10.1761 20.9073 10.4973 21.7366 10.4973 22.5951V24.3512" stroke="#ffffff" strokeWidth="2" strokeMiterlimit="10"></path>
      <path d="M6.51318 11.3857H13.9395C15.4449 11.3857 16.8298 10.3223 16.9301 8.86862C16.9603 8.40033 16.9201 7.44423 17.0807 7.00521C17.171 6.7613 17.5724 6.83935 17.6527 7.09301L18.4957 10.4686C18.6763 11.0247 19.2082 11.3955 19.8003 11.3955H24.3565" stroke="#ffffff" strokeWidth="2" strokeMiterlimit="10"></path>
    </svg>
  )
}

function CertificateIcon() {
  return (
    <svg width="37" viewBox="0 0 48 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M29.1048 32.5521H2.67293C1.72721 32.5521 0.964844 31.7998 0.964844 30.8664V2.63786C0.964844 1.70453 1.72721 0.952148 2.67293 0.952148H45.3267C46.2724 0.952148 47.0348 1.70453 47.0348 2.63786V30.8664C47.0348 31.7998 46.2724 32.5521 45.3267 32.5521H41.8044" fill="none" stroke="#ffffff" strokeWidth="2" strokeMiterlimit="10"></path>
      <path d="M8.31836 9.33301H40.6658" fill="none" stroke="#ffffff" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path>
      <path d="M8.31836 16.752H22.369" fill="none" stroke="#ffffff" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path>
      <path d="M35.4355 28.2858C39.001 28.2858 41.8914 25.4332 41.8914 21.9144C41.8914 18.3956 39.001 15.543 35.4355 15.543C31.8699 15.543 28.9795 18.3956 28.9795 21.9144C28.9795 25.4332 31.8699 28.2858 35.4355 28.2858Z" fill="none" stroke="#ffffff" strokeWidth="2" strokeMiterlimit="10"></path>
      <path d="M30.5523 26.0762L28.0626 38.6286C28.0047 38.9238 28.3231 39.1428 28.5837 39L34.5668 35.619C35.0975 35.3143 35.7538 35.3143 36.2942 35.619L42.2773 39C42.5378 39.1524 42.8563 38.9238 42.7984 38.6286L40.3086 26.0762" fill="none" stroke="#ffffff" strokeWidth="2" strokeMiterlimit="10"></path>
    </svg>
  )
}

function GroupIcon() {
  return (
    <svg width="38" height="40" viewBox="0 0 45 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.5004 20.4568C26.6355 20.4568 29.9876 17.1309 29.9876 13.0282C29.9876 8.92549 26.6355 5.59961 22.5004 5.59961C18.3653 5.59961 15.0132 8.92549 15.0132 13.0282C15.0132 17.1309 18.3653 20.4568 22.5004 20.4568Z" stroke="#ffffff" strokeWidth="2" strokeMiterlimit="10"></path>
      <path d="M32.7999 39.0468H12.2005C11.6821 39.0468 11.2598 38.6277 11.2598 38.1134V31.6182C11.2598 25.4563 16.2896 20.4658 22.5002 20.4658C28.7107 20.4658 33.7406 25.4563 33.7406 31.6182V38.123C33.7406 38.6277 33.3182 39.0468 32.7999 39.0468Z" stroke="#ffffff" strokeWidth="2" strokeMiterlimit="10"></path>
      <path d="M25.6772 6.06643C26.6563 3.09501 29.4784 0.952148 32.7997 0.952148C36.9368 0.952148 40.2869 4.27596 40.2869 8.38072C40.2869 12.4855 36.9368 15.8093 32.7997 15.8093C31.6862 15.8093 30.6303 15.5712 29.68 15.1331" stroke="#ffffff" strokeWidth="2" strokeMiterlimit="10"></path>
      <path d="M29.1714 16.4088C30.3137 16.0279 31.5327 15.8184 32.7998 15.8184C39.0103 15.8184 44.0402 20.8088 44.0402 26.9707V33.4755C44.0402 33.9898 43.6178 34.4088 43.0995 34.4088H33.9133" stroke="#ffffff" strokeWidth="2" strokeMiterlimit="10"></path>
      <path d="M19.3229 6.06643C18.3342 3.09501 15.5217 0.952148 12.2004 0.952148C8.06325 0.952148 4.70361 4.27596 4.70361 8.38072C4.70361 12.4855 8.05366 15.8093 12.1908 15.8093C13.3043 15.8093 14.3602 15.5712 15.3105 15.1331" stroke="#ffffff" strokeWidth="2" strokeMiterlimit="10"></path>
      <path d="M15.8288 16.4088C14.6865 16.0279 13.4674 15.8184 12.2004 15.8184C5.98982 15.8184 0.959961 20.8088 0.959961 26.9707V33.4755C0.959961 33.9898 1.38232 34.4088 1.90066 34.4088H11.0869" stroke="#ffffff" strokeWidth="2" strokeMiterlimit="10"></path>
    </svg>
  )
}
export default function HomePage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [numberOfMembers, setNumberOfMembers] = useState(0);
  const [loading, setLoading] = useState(true);

  // Parallax state — normalised offset from hero centre (-1 … 1)
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const rect = heroRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMouse({
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 2,   // -1 … 1
      y: ((e.clientY - rect.top)  / rect.height - 0.5) * 2,
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setMouse({ x: 0, y: 0 });
  }, []);

  // Helper: return a CSS transform string for a given depth multiplier
  const parallax = (depthX: number, depthY: number = depthX) =>
    `translate(${mouse.x * depthX}px, ${mouse.y * depthY}px)`;

  useEffect(() => {
    Promise.all([
      api.get('/courses/'),
      api.get('/users/count')
    ]).then(([coursesResponse, usersResponse]) => {
      setCourses(coursesResponse.data.results ?? coursesResponse.data);
      setNumberOfMembers(usersResponse.data.count);
      setLoading(false)
    }).catch(() => setLoading(false));
  }, []);

  const numberOfCourses = courses.length;
  return (
    <div>
      {/* Hero */}
      <section
        ref={heroRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="lg:min-h-[500px] xl:min-h-[600px] 2xl:min-h-[660px] bg-[#eaf0f2] flex flex-col justify-end text-white text-center relative before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-[url('/BG-1.webp')] before:bg-cover before:bg-center"
      >
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-center z-10">
          <div className="flex flex-col items-center mt-[75px] lg:mt-0 lg:items-start justify-center w-3/4 lg:w-1/2 relative mb-[50px]">
            <li className="text-white text-sm absolute top-[-15%] left-[-10%] w-50 h-50 z-[-1]"
                style={{ transform: parallax(-18, -12), transition: 'transform 0.12s ease-out' }}>
              <img src="/shape-13.png" alt="dots" className="w-50 h-50" />
            </li>
            <h1 className="text-[#181818] text-4xl md:text-5xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-extrabold mb-4 text-center lg:text-left">
              Get <span className="text-[#ee4a62] mr-2">2500+</span>
              Best Online Courses From EduLMS
            </h1>
            <p className="text-[#181818] text-lg mb-8 max-w-xl text-center lg:text-left">
              Discover expert-led courses, earn certificates, and advance your career.
            </p>
            <Link
              href="/courses"
              className="group inline-flex items-center gap-3 bg-[#1ab69d] min-h-[60px] text-white font-medium px-8 py-3 rounded-[5px] relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-3">
                Find Courses
                {/* Arrow Right */}
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </span>
              {/* Gradient slide-in overlay */}
              <span className="absolute inset-0 bg-[linear-gradient(-90deg,#31b978,#1ab69d)] -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-in-out" />
            </Link>
          </div>   
          <div className="px-1 relative">
            <img src="/girl-1.webp" alt="Hero Image" className="w-[300px] h-[338px] md:w-[400px] md:h-[450px] lg:w-[350px] lg:h-[394px] xl:w-[400px] xl:h-[450px] 2xl:w-[538px] 2xl:h-[605px] object-cover" />
            {/* Background shapes */}
            <ul className="flex items-center justify-center gap-4 absolute top-0 w-full h-full">
              <li className="text-white text-sm absolute top-90 right-[-14%] w-50 h-50 z-[-1]"
                  style={{ transform: parallax(14, 10), transition: 'transform 0.12s ease-out' }}>
                <img src="/shape-13.png" alt="dots" className="w-50 h-50" />
              </li>
              <li 
                className="text-white text-sm absolute top-[60%] left-[0%] w-50 h-50 z-[-1]"
                style={{ transform: parallax(18, 12), transition: 'transform 0.12s ease-out' }}>
                <span 
                  className="bg-[#f8b81f] w-[41] h-[41] rounded-full" 
                  style={{ 
                    transform: 'translate3d(-12.3px, 3.8px, 0px)',
                    transformStyle: 'preserve-3d',
                    backfaceVisibility: 'hidden',
                    position: 'relative',
                    display: 'block',
                    left: '0px',
                    top: '0px' 
                  }}></span>
              </li>
              <li className="text-white text-sm absolute top-[20%] left-[5%] w-50 h-50 z-[-1]"
                  style={{ transform: parallax(-20, -27), transition: 'transform 0.12s ease-out' }}>
                <img src="/shape-16.png" alt="dots" className="w-50 h-50" />
              </li>
              <li className="text-white text-sm absolute top-[21%] left-[64%] w-40 h-40 z-10">
                <img src="/shape-02.png" alt="dots" className="w-40 h-40" />
              </li>
              <li className="animate-side-to-side text-white text-sm absolute top-[10%] left-0 w-24 h-10 z-[-1]">
                <img src="/shape-15.png" alt="dots" className="w-24 h-10" />
              </li>
              <li className="text-white text-sm absolute bottom-[20%] right-[-20%] w-20 h-20 z-[-1]"
                  style={{ transform: parallax(-22, -16), transition: 'transform 0.12s ease-out' }}>
                <img src="/shape-18.png" alt="dots" className="w-20 h-20" />
              </li>
            </ul>
          </div>
        </div>
        <li className="text-white text-sm absolute top-20 right-0 w-12 h-30 z-0">
          <img src="/shape-01.png" alt="dots" className="w-12 h-30" />
        </li>
      </section>
      
      {/* Banner */}
      <section className="bg-[linear-gradient(-90deg,#31b978,#1ab69d)] flex items-center justify-center">
        <div className="max-w-7xl mx-auto flex items-center justify-center font-spartan text-2xl">
          <div className="flex items-center justify-center gap-4 py-10 px-6 border-r-[hsla(0,0%,100%,.15)] border-r-solid border-r-1">
            <div className="w-20 h-20 rounded-full bg-[hsla(0,0%,100%,.1)] flex items-center justify-center"><LaptopIcon /></div>
            <p className="text-white">{numberOfCourses} Online Courses</p>
          </div>
          <div className="flex items-center justify-center gap-4 py-10 px-6 border-r-[hsla(0,0%,100%,.15)] border-r-solid border-r-1">
            <div className="w-20 h-20 rounded-full bg-[hsla(0,0%,100%,.1)] flex items-center justify-center"><InstructorIcon /></div>
            <p className="text-white">Top Instructors</p>
          </div>  
          <div className="flex items-center justify-center gap-4 py-10 px-6 border-r-[hsla(0,0%,100%,.15)] border-r-solid border-r-1">
            <div className="w-20 h-20 rounded-full bg-[hsla(0,0%,100%,.1)] flex items-center justify-center"><CertificateIcon /></div>
            <p className="text-white">Online Certifications</p>
          </div>
          <div className="flex items-center justify-center gap-4 py-10 px-6">
            <div className="w-20 h-20 rounded-full bg-[hsla(0,0%,100%,.1)] flex items-center justify-center"><GroupIcon /></div>
            <p className="text-white">{numberOfMembers} Members</p>
          </div>
        </div>
      </section>

      {/* Course grid */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Featured Courses</h2>
        {loading ? (
          <div className="text-center text-gray-400 py-20">Loading courses…</div>
        ) : courses.length === 0 ? (
          <div className="text-center text-gray-400 py-20">No courses published yet.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {courses.map((c) => <CourseCard key={c.id} course={c} />)}
          </div>
        )}
      </section>
    </div>
  );
}
