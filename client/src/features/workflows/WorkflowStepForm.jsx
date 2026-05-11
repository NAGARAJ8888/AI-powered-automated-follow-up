const StepTypeSelect = ({ value, onChange, error }) => {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-700 mb-1">
        Step Type <span className="text-red-500">*</span>
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-lg border px-3 py-2 text-sm text-gray-900 bg-white hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
          error ? 'border-red-400 bg-red-50' : 'border-gray-200'
        }`}
      >
        <option value="reminder">Reminder</option>
        <option value="escalation">Escalation</option>
      </select>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};

const StepDelayInput = ({ value, onChange, error }) => {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-700 mb-1">
        Delay <span className="text-red-500">*</span>
      </label>
      <input
        type="number"
        inputMode="numeric"
        min={0}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g. 24"
        className={`w-full rounded-lg border px-3 py-2 text-sm text-gray-900 bg-white hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
          error ? 'border-red-400 bg-red-50' : 'border-gray-200'
        }`}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};

const StepMessageTextarea = ({ value, onChange, error }) => {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-700 mb-1">
        Message <span className="text-red-500">*</span>
      </label>
      <textarea
        rows={3}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={value ? '' : 'What should happen in this step?'}
        className={`w-full rounded-lg border px-3 py-2 text-sm text-gray-900 bg-white hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
          error ? 'border-red-400 bg-red-50' : 'border-gray-200'
        }`}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};

const WorkflowStepForm = ({ step, index, error, onChange, onRemove, canRemove }) => {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 sm:p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center">
            <span className="text-sm font-semibold text-gray-800">{step.stepNumber}</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">
              {step.type === 'escalation' ? 'Escalation' : 'Reminder'} Step
            </p>
            <p className="text-xs text-gray-500">Configure the delay and message.</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onRemove(index)}
          disabled={!canRemove}
          className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition-colors border ${
            canRemove
              ? 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
              : 'bg-gray-50 text-gray-400 border-gray-100 cursor-not-allowed'
          }`}
          aria-label={`Remove step ${step.stepNumber}`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Remove
        </button>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-3">
          <StepTypeSelect
            value={step.type}
            onChange={(v) => onChange(index, { type: v })}
            error={error?.type}
          />
        </div>

        <div className="md:col-span-3">
          <StepDelayInput
            value={step.delay}
            onChange={(v) => onChange(index, { delay: v })}
            error={error?.delay}
          />
        </div>

        <div className="md:col-span-6">
          <StepMessageTextarea
            value={step.message}
            onChange={(v) => onChange(index, { message: v })}
            error={error?.message}
          />
        </div>
      </div>
    </div>
  );
};

export default WorkflowStepForm;

