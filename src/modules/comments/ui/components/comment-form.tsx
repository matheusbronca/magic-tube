import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { UserAvatar } from "@/components/user-avatar";
import { useUser, useClerk } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTRPC } from "@/trpc/client";
import { commentInsertSchema } from "@/db/schema";
import { toast } from "sonner";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface CommentFormProps {
  videoId: string;
  parentId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  variant?: "comment" | "reply"
}

// At front-end, we don't need to keep track of userI
const frontCommentSchema = commentInsertSchema.pick({ videoId: true, parentId: true, value: true });
type CommentSchema = typeof frontCommentSchema;

export const CommentForm = ({ videoId, parentId, variant = "comment", onSuccess, onCancel  }: CommentFormProps) => {
  const clerk = useClerk();
  const { user } = useUser();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const create = useMutation(
    trpc.comments.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.comments.getMany.infiniteQueryFilter({ videoId }));
        queryClient.invalidateQueries(trpc.comments.getMany.infiniteQueryFilter({ videoId, parentId }));
        form.reset();
        toast.success("Comment added");
        onSuccess?.();
      },
      onError: (error) => {
        toast.error("Something went wrong");
        
       if(error.data?.code === "UNAUTHORIZED")  {
         clerk.openSignIn();
       }
      },
    }),
  );

  const form = useForm<z.infer<CommentSchema>>({
    resolver: zodResolver(frontCommentSchema),
    defaultValues: {
      parentId: parentId,
      videoId,
      value: "",
    },
  });

  const handleSubmit = (values: z.infer<CommentSchema>) => {
    create.mutate(values);
 };

  const handleCancel = () => {
    form.reset();
    onCancel?.();
  }

  return (
    <Form {...form} >
      <form className="flex gap-4 group"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <UserAvatar
          size="lg"
          imageUrl={user?.imageUrl || "/user-placeholder.svg"}
          name={user?.username || "User"}
        />
        <div className="flex-1">
          <FormField 
            name="value"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder={variant === "reply" ? "Reply to this comment..." : "Add a comment..."}
                    className="resize-none bg-transparent overflow-hidden min-h-0 h-16"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>

            )}
          />
          <div className="justify-end gap-2 mt-2 flex">
          {onCancel && (
            <Button variant="ghost" type="button" onClick={handleCancel}>
            Cancel
            </Button>
          )}
            <Button type="submit" size="sm" disabled={create.isPending}>
            {variant === "reply" ? "Reply" : "Comment"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};
