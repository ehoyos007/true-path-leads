interface FunnelProgressProps {
  step: number;
  totalSteps: number;
}

const FunnelProgress = ({ step, totalSteps }: FunnelProgressProps) => {
  const progress = (step / totalSteps) * 100;

  return (
    <div className="space-y-2">
      <div className="h-1 bg-muted rounded-t-2xl overflow-hidden">
        <div 
          className="h-full bg-primary transition-all duration-300" 
          style={{ width: `${progress}%` }} 
        />
      </div>
      {step < totalSteps && (
        <p className="text-xs text-muted-foreground text-center pt-2">
          Step {step} of {totalSteps - 1}
        </p>
      )}
    </div>
  );
};

export default FunnelProgress;
