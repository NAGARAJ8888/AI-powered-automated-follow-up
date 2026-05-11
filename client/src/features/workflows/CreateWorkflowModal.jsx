import { useEffect, useMemo, useState } from 'react';
import { useCreateWorkflowMutation } from './workflowApi';
import StepList from './StepList';

const INITIAL_FORM = {
  name: '',
  steps: [
    {
      stepNumber: 1,
      type: 'reminder',
      delay: '',
      message: '',
    },
  ],
};

const normalizeSteps = (steps) => {
  if (!Array.isArray(steps)) return [];
  return steps
    .map((s, idx) => ({
      stepNumber: s.stepNumber ?? idx + 1,
      type: s.type ?? 'reminder',
      delay: s.delay ?? '',
      message: s.message ?? '',
    }))
    .map((s, idx) => ({ ...s, stepNumber: idx + 1 }));
};

const CreateWorkflowModal = ({ isOpen, onClose }) => {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});

  const [createWorkflow, { isLoading, error: apiError, reset: resetMutation }] =
    useCreateWorkflowMutation();

  useEffect(() => {
    if (!isOpen) return;
    setForm(INITIAL_FORM);
    setErrors({});
    resetMutation();
  }, [isOpen, resetMutation]);

  const stepCount = form.steps.length;

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = 'Workflow name is required.';

    if (!Array.isArray(form.steps) || form.steps.length < 1) {
      newErrors.steps = 'At least one step is required.';
      return newErrors;
    }

    const stepsErrors = form.steps.map((s) => {
      const e = {};
      if (!s.type) e.type = 'Step type is required.';

      const delayNum =
        typeof s.delay === 'string' && s.delay.trim() ? Number(s.delay) : Number(s.delay);
      if (!s.delay && s.delay !== 0) e.delay = 'Delay is required.';
      else if (Number.isNaN(delayNum) || !Number.isFinite(delayNum)) e.delay = 'Enter a valid delay.';
      else if (delayNum < 0) e.delay = 'Delay must be 0 or greater.';

      if (!String(s.message ?? '').trim()) e.message = 'Message is required.';
      return Object.keys(e).length ? e : undefined;
    });

    if (stepsErrors.some(Boolean)) newErrors.steps = stepsErrors;

    return newErrors;
  };

  const apiErrorMessage = useMemo(() => {
    return apiError?.data?.message ?? 'Something went wrong. Please try again.';
  }, [apiError]);

  const handleStepChange = (idx, patch) => {
    setForm((prev) => {
      const nextSteps = normalizeSteps(prev.steps);
      const step = nextSteps[idx];
      const merged = { ...step, ...patch };
      nextSteps[idx] = merged;
      return { ...prev, steps: normalizeSteps(nextSteps) };
    });

    setErrors((prev) => {
      if (!prev.steps) return prev;
      const next = Array.isArray(prev.steps) ? [...prev.steps] : prev.steps;
      if (Array.isArray(next) && next[idx]) {
        next[idx] = { ...next[idx], ...patch };
      }
      return { ...prev, steps: next };
    });
  };

  const handleAddStep = () => {
    setForm((prev) => {
      const nextSteps = normalizeSteps(prev.steps);
      nextSteps.push({
        stepNumber: nextSteps.length + 1,
        type: 'reminder',
        delay: '',
        message: '',
      });
      return { ...prev, steps: normalizeSteps(nextSteps) };
    });
  };

  const handleRemoveStep = (idx) => {
    setForm((prev) => {
      const nextSteps = normalizeSteps(prev.steps);
      if (nextSteps.length <= 1) return prev;
      nextSteps.splice(idx, 1);
      return { ...prev, steps: normalizeSteps(nextSteps) };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    const payload = {
      name: form.name.trim(),
      steps: normalizeSteps(form.steps).map((s) => ({
        stepNumber: s.stepNumber,
        type: s.type,
        delay: Number(s.delay),
        message: String(s.message ?? '').trim(),
      })),
    };

    try {
      await createWorkflow(payload).unwrap();
      onClose();
    } catch {
      // api error displayed below
    }
  };

  if (!isOpen) return null;

  const showScrollButton = stepCount >= 2;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="workflow-modal-title"
    >
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[-1]"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
        {/* When there are 2+ steps, allow scrolling for the whole form content */}
        {showScrollButton ? (
          <div className="max-h-[80vh] overflow-auto">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h2 id="workflow-modal-title" className="text-lg font-semibold text-gray-900">
                Create Workflow
              </h2>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                aria-label="Close modal"
                type="button"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              <div className="px-6 py-5 space-y-5">
                {/* API Error */}
                {apiError && (
                  <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                    {apiErrorMessage}
                  </div>
                )}

                {/* Name */}
                <div>
                  <label htmlFor="workflow-name" className="block text-sm font-medium text-gray-700 mb-1">
                    Workflow Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="workflow-name"
                    name="name"
                    value={form.name}
                    onChange={(e) => {
                      const value = e.target.value;
                      setForm((prev) => ({ ...prev, name: value }));
                      if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                    }}
                    placeholder="Sales Follow-up"
                    className={`w-full rounded-lg border px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                      errors.name
                        ? 'border-red-400 bg-red-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  />
                  {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
                </div>

                {/* Steps header */}
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Steps</p>
                    <p className="text-xs text-gray-500">Add reminder and escalation steps with delays.</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <p className="text-xs text-gray-500">
                      {stepCount} step{stepCount === 1 ? '' : 's'}
                    </p>
                    <button
                      type="button"
                      onClick={handleAddStep}
                      className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-sm"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add Step
                    </button>
                  </div>
                </div>

                {errors.steps && typeof errors.steps === 'string' && (
                  <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                    {errors.steps}
                  </div>
                )}

                {/* Scroll to steps button */}
                <div className="flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      const el = document.getElementById('workflow-steps');
                      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                    className="inline-flex items-center gap-2 rounded-xl bg-gray-100 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-200 transition-colors"
                    aria-label="Scroll to workflow steps"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14m7-7H5" />
                    </svg>
                    Scroll to steps
                  </button>
                </div>

                {/* Steps list */}
                <div id="workflow-steps" className="space-y-3">
                  <StepList
                    steps={normalizeSteps(form.steps)}
                    stepErrors={Array.isArray(errors.steps) ? errors.steps : undefined}
                    onChangeStep={handleStepChange}
                    onRemoveStep={handleRemoveStep}
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-100">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  {isLoading && (
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                  )}
                  {isLoading ? 'Creating…' : 'Create Workflow'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h2 id="workflow-modal-title" className="text-lg font-semibold text-gray-900">
                Create Workflow
              </h2>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                aria-label="Close modal"
                type="button"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              <div className="px-6 py-5 space-y-5">
                {apiError && (
                  <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                    {apiErrorMessage}
                  </div>
                )}

                <div>
                  <label htmlFor="workflow-name" className="block text-sm font-medium text-gray-700 mb-1">
                    Workflow Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="workflow-name"
                    name="name"
                    value={form.name}
                    onChange={(e) => {
                      const value = e.target.value;
                      setForm((prev) => ({ ...prev, name: value }));
                      if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                    }}
                    placeholder="Sales Follow-up"
                    className={`w-full rounded-lg border px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                      errors.name
                        ? 'border-red-400 bg-red-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  />
                  {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
                </div>

                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Steps</p>
                    <p className="text-xs text-gray-500">Add reminder and escalation steps with delays.</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <p className="text-xs text-gray-500">
                      {stepCount} step{stepCount === 1 ? '' : 's'}
                    </p>
                    <button
                      type="button"
                      onClick={handleAddStep}
                      className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-sm"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add Step
                    </button>
                  </div>
                </div>

                {errors.steps && typeof errors.steps === 'string' && (
                  <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                    {errors.steps}
                  </div>
                )}

                <div id="workflow-steps" className="space-y-3">
                  <StepList
                    steps={normalizeSteps(form.steps)}
                    stepErrors={Array.isArray(errors.steps) ? errors.steps : undefined}
                    onChangeStep={handleStepChange}
                    onRemoveStep={handleRemoveStep}
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-100">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  {isLoading && (
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                  )}
                  {isLoading ? 'Creating…' : 'Create Workflow'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default CreateWorkflowModal;

