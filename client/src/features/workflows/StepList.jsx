import WorkflowStepForm from './WorkflowStepForm';

const StepList = ({ steps, stepErrors, onChangeStep, onRemoveStep }) => {
  return (
    <div className="space-y-3">
      {steps.map((step, idx) => (
        <WorkflowStepForm
          key={step.stepNumber ?? idx}
          step={step}
          index={idx}
          error={Array.isArray(stepErrors) ? stepErrors[idx] : undefined}
          canRemove={steps.length > 1}
          onRemove={onRemoveStep}
          onChange={onChangeStep}
        />
      ))}
    </div>
  );
};

export default StepList;

