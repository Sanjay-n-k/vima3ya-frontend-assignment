import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Formik, Form, useFormikContext } from 'formik';
import FormField from './components/FormField';

const FormObserver = ({ onFormComplete }) => {
  const { isValid, values, isValidating } = useFormikContext();

  useEffect(() => {
    const isFilled = values.firstName &&
      values.lastName &&
      values.email &&
      values.phone &&
      values.color &&
      values.food &&
      values.consent;

    if (isValid && !isValidating && isFilled) {
      onFormComplete();
    }
  }, [isValid, values, isValidating, onFormComplete]);

  return null;
};

const SECTIONS = [
  { id: 'sectionA', title: 'Section A — Personal Info' },
  { id: 'sectionB', title: 'Section B — Contact Details' },
  { id: 'sectionC', title: 'Section C — Preferences' },
  { id: 'sectionD', title: 'Section D — Review' }
];

function App() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isShimmering, setIsShimmering] = useState(false);
  const sectionRefs = useRef([]);
  const shimmerTimeout = useRef(null);

  const onFormComplete = useCallback(() => {
    setIsShimmering(true);
    if (shimmerTimeout.current) {
      clearTimeout(shimmerTimeout.current);
    }
    shimmerTimeout.current = setTimeout(() => {
      setIsShimmering(false);
    }, 3000);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const container = document.getElementById('scrollContainer');
      if (!container) return;
      const containerTop = container.getBoundingClientRect().top;

      let currentIdx = 0;
      sectionRefs.current.forEach((ref, index) => {
        if (ref) {
          const rect = ref.getBoundingClientRect();
          // Adjust logic so it detects if section is in upper half of view
          if (rect.top - containerTop < container.clientHeight * 0.5) {
            currentIdx = index;
          }
        }
      });
      setActiveIndex(currentIdx);
    };

    const container = document.getElementById('scrollContainer');
    if (container) {
      container.addEventListener('scroll', handleScroll);
      // Run once on mount to establish base
      handleScroll();
    }

    return () => {
      if (container) container.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const initialValues = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    color: '',
    food: '',
    consent: '',
    comments: ''
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans text-gray-800">

      {/* Sidebar Navigation */}
      <div className="w-1/4 min-w-[250px] max-w-[300px] bg-white border-r shadow-sm p-8 flex flex-col">
        <h1 className="text-xl font-bold mb-8 text-blue-600">Application Form</h1>
        <ul className="space-y-6 flex-1 relative">
          {/* Vertical line connecting bullets */}
          <div className="absolute left-[11px] top-4 bottom-4 w-0.5 bg-gray-200 -z-10" />

          {SECTIONS.map((section, index) => {
            const isHighlighted = index <= activeIndex;
            return (
              <li key={section.id} className="flex items-center group cursor-default">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all duration-300 z-10 bg-white
                    ${isHighlighted
                      ? 'border-blue-500 bg-blue-500 text-white'
                      : 'border-gray-300 text-gray-400 group-hover:border-blue-300'}`}
                >
                  <span className="text-xs font-bold">{index + 1}</span>
                </div>
                <span
                  className={`ml-4 text-sm font-medium transition-colors duration-300
                    ${isHighlighted ? 'text-blue-600' : 'text-gray-500'}`}
                >
                  {section.id.replace('section', '')}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto relative scroll-smooth p-10" id="scrollContainer">

        {/* Shimmer overlay */}
        {isShimmering && (
          <div className="fixed top-6 right-6 bg-white shadow-lg rounded-xl p-4 w-80 z-50 border border-blue-100 flex items-center space-x-4 animate-pulse">
            <div className="rounded-full bg-blue-200 h-10 w-10"></div>
            <div className="flex-1 space-y-2 py-1">
              <div className="h-4 bg-blue-200 rounded w-3/4"></div>
              <div className="h-3 bg-blue-100 rounded w-5/6"></div>
            </div>
          </div>
        )}

        <div className="max-w-2xl mx-auto pb-32">
          <Formik
            initialValues={initialValues}
            validateOnMount={true}
            onSubmit={(values) => {
              console.log('Form Submitted', values);
              alert('Form is fully valid and submitted!');
            }}
          >
            {() => (
              <Form>
                <FormObserver onFormComplete={onFormComplete} />

                {/* Section A */}
                <div
                  ref={el => sectionRefs.current[0] = el}
                  data-index={0}
                  className="mb-16 bg-white p-8 rounded-xl shadow-sm border border-gray-100"
                >
                  <h2 className="text-2xl font-bold mb-6 text-gray-800">{SECTIONS[0].title}</h2>
                  <FormField
                    name="firstName"
                    text="First Name"
                    placeholder="Enter first name"
                  />
                  <FormField
                    name="lastName"
                    text="Last Name"
                    placeholder="Enter last name"
                  />
                </div>

                {/* Section B */}
                <div
                  ref={el => sectionRefs.current[1] = el}
                  data-index={1}
                  className="mb-16 bg-white p-8 rounded-xl shadow-sm border border-gray-100"
                >
                  <h2 className="text-2xl font-bold mb-6 text-gray-800">{SECTIONS[1].title}</h2>
                  <FormField
                    name="email"
                    text="Email Address"
                    type="email"
                    placeholder="Enter email address"
                    validator="email"
                  />
                  <FormField
                    name="phone"
                    text="Phone Number"
                    type="tel"
                    placeholder="10-digit phone number"
                    validator="phone"
                  />
                </div>

                {/* Section C */}
                <div
                  ref={el => sectionRefs.current[2] = el}
                  data-index={2}
                  className="mb-16 bg-white p-8 rounded-xl shadow-sm border border-gray-100"
                >
                  <h2 className="text-2xl font-bold mb-6 text-gray-800">{SECTIONS[2].title}</h2>
                  <FormField
                    name="color"
                    text="Favorite Color"
                    placeholder="e.g. Blue"
                  />
                  <FormField
                    name="food"
                    text="Favorite Food"
                    placeholder="e.g. Pizza"
                  />
                </div>

                {/* Section D */}
                <div
                  ref={el => sectionRefs.current[3] = el}
                  data-index={3}
                  className="mb-16 bg-white p-8 rounded-xl shadow-sm border border-gray-100"
                >
                  <h2 className="text-2xl font-bold mb-6 text-gray-800">{SECTIONS[3].title}</h2>
                  <FormField
                    name="consent"
                    text="Type 'I AGREE' to consent"
                    placeholder="I AGREE"
                    validator="required"
                    errorMessage="You must type I AGREE"
                  />
                  <FormField
                    name="comments"
                    text="Final Comments"
                    placeholder="Any final thoughts?"
                  />

                  <button
                    type="submit"
                    className="mt-8 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition focus:outline-none focus:ring-4 focus:ring-blue-300 w-full"
                  >
                    Submit Application
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}

export default App;
