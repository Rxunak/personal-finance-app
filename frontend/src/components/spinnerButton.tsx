import { Button } from "../components/ui/button";
import { Spinner } from "../components/ui/spinner";

export function SpinnerButton() {
  return (
    <div className="flex justify-center items-center gap-4 h-210 bg-beige-100">
      <Button disabled size="sm">
        <Spinner data-icon="inline-start" />
        Loading...
      </Button>
    </div>
  );
}
