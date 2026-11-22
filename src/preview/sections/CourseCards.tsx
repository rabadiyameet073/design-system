import React from 'react';
import { BookOpen, Clock, Users, ArrowRight } from 'lucide-react';

export interface CourseCardsProps {
  id?: string;
}

export const CourseCards: React.FC<CourseCardsProps> = ({ id = 'courses' }) => {
  const courses = [
    {
      title: 'Advanced Spatial Design Engineering',
      duration: '8 Weeks',
      students: '1,420 enrolled',
      level: 'Masterclass'
    },
    {
      title: 'Perceptual Color Science & OKLCH Systems',
      duration: '4 Weeks',
      students: '2,890 enrolled',
      level: 'Intermediate'
    },
    {
      title: 'Three.js & WebGL for Modern Web Products',
      duration: '6 Weeks',
      students: '980 enrolled',
      level: 'Advanced'
    }
  ];

  return (
    <section
      id={id}
      className="w-full py-16 px-6 sm:px-12 border-t"
      style={{
        backgroundColor: 'var(--color-bg-surface)',
        borderColor: 'var(--color-border-default)'
      }}
    >
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="space-y-2">
          <span className="text-xs uppercase font-bold tracking-widest text-[var(--color-action-primary)] font-[var(--font-mono)]">
            Curriculum
          </span>
          <h2
            className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-fg-default)]"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Accredited Design & Engineering Programs
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {courses.map((course, idx) => (
            <div
              key={idx}
              className="p-6 border flex flex-col justify-between space-y-6 shadow-[var(--shadow-sm)]"
              style={{
                backgroundColor: 'var(--color-bg-default)',
                borderColor: 'var(--color-border-default)',
                borderRadius: 'var(--radius-card, var(--radius-lg))'
              }}
            >
              <div className="space-y-3">
                <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-[var(--radius-full)] bg-[var(--color-status-info-bg)] text-[var(--color-status-info-fg)]">
                  {course.level}
                </span>
                <h3
                  className="text-base font-semibold text-[var(--color-fg-default)]"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {course.title}
                </h3>
                <div className="flex items-center gap-4 text-xs text-[var(--color-fg-muted)]">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    <span>{course.students}</span>
                  </div>
                </div>
              </div>

              <button
                className="w-full py-2 text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all hover:bg-[var(--color-bg-surface)] cursor-pointer"
                style={{
                  borderColor: 'var(--color-border-default)',
                  color: 'var(--color-fg-default)',
                  borderRadius: 'var(--radius-button, var(--radius-md))'
                }}
              >
                <span>Syllabus Overview</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

