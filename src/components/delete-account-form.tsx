"use client";

import { useActionState, useState } from "react";
import { deleteAccount } from "@/app/actions/account";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function DeleteAccountForm() {
  const [state, formAction, pending] = useActionState(deleteAccount, null);
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        Delete my account
      </Button>
    );
  }

  return (
    <form action={formAction} className="space-y-3 rounded-2xl border border-terracotta-deep/30 bg-terracotta/5 p-4">
      <p className="text-sm text-ink">
        This permanently deletes your account and every piece of data tied to it,
        immediately, with no way to undo it. If you want a copy first, download
        your data before continuing.
      </p>
      <p className="text-sm font-medium text-ink-soft">
        Type <span className="font-mono font-bold text-ink">DELETE</span> to confirm.
      </p>
      <Input name="confirmation" placeholder="DELETE" className="max-w-[10rem]" required />

      {state?.error && <p className="text-sm text-terracotta-deep">{state.error}</p>}

      <div className="flex gap-2">
        <Button type="submit" variant="primary" size="sm" disabled={pending}>
          {pending ? "Deleting…" : "Permanently delete my account"}
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(false)}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
