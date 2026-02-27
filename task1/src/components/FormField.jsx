import { useFormikContext, useField } from 'formik';

const FormField = ({ text, name, value, placeholder, validator, errorMessage, type = "text" }) => {
    const { submitCount } = useFormikContext();

    const validate = (val) => {
        const valType = validator || 'required';
        const defaultMsg = errorMessage || 'This field is required';

        if (!val) {
            return defaultMsg;
        }

        if (valType === 'email') {
            if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(val)) {
                return errorMessage || 'Invalid email address';
            }
        }

        if (valType === 'phone') {
            if (!/^\d{10}$/.test(val)) {
                return errorMessage || 'Invalid phone number (must be 10 digits)';
            }
        }

        return undefined;
    };

    const [field, meta] = useField({ name, validate });

    // Provide the explicit value prop if we have it, although useField provides it.
    const inputValue = value !== undefined ? value : field.value;

    // Determine if error should be shown: ONLY after submit click
    const isErrorVisible = submitCount > 0 && meta.error;

    return (
        <div className="flex flex-col mb-4">
            <label htmlFor={name} className="mb-1 text-sm font-semibold text-gray-700">
                {text}
            </label>
            <input
                {...field}
                id={name}
                type={type}
                value={inputValue}
                placeholder={placeholder}
                className={`px-4 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors ${isErrorVisible
                    ? 'border-red-500 focus:ring-red-200 bg-red-50'
                    : 'border-gray-300 focus:ring-blue-200 focus:border-blue-400'
                    }`}
            />
            {isErrorVisible && (
                <span className="mt-1 text-xs text-red-500 font-medium">
                    {meta.error}
                </span>
            )}
        </div>
    );
};

export default FormField;
