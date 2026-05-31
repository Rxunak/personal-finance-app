import { Button } from "../components/ui/button";
import { Spinner } from "../components/ui/spinner";

export function SpinnerButton() {
  return (
    <div className="flex h-210 items-center justify-center gap-4 bg-beige-100 dark:bg-background">
      <Button disabled size="sm">
        <Spinner data-icon="inline-start" />
        Loading...
      </Button>
    </div>
  );
}
