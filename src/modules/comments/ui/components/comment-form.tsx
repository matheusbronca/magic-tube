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
  onSuccess?: () => void;
}

// At front-end, we don't need to keep track of userId
const frontCommentSchema = commentInsertSchema.omit({ userId: true });
type CommentSchema = typeof frontCommentSchema;

export const CommentForm = ({ videoId, onSuccess }: CommentFormProps) => {
  const clerk = useClerk();
  const { user } = useUser();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const create = useMutation(
    trpc.comments.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.comments.getMany.queryFilter({ videoId }));
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
      videoId,
      value: "",
    },
  });

  const handleSubmit = (values: z.infer<CommentSchema>) => {
    create.mutate(values);
  };

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
                    placeholder="Add a comment..."
                    className="resize-none bg-transparent overflow-hidden min-h-0 h-16"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>

            )}
          />
          <div className="justify-end gap-2 mt-2 flex">
            <Button type="submit" size="sm" disabled={create.isPending}>
              Comment
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};
