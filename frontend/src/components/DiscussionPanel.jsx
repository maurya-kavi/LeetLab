import { useEffect, useState } from "react";
import { LoaderCircle, MessageSquare, Send, Trash2, UserRound } from "lucide-react";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "../store/useAuthStore";

const getInitials = (name) =>
  name
    ?.trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

const DiscussionPanel = ({ problemId }) => {
  const authUser = useAuthStore((state) => state.authUser);
  const [discussions, setDiscussions] = useState([]);
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isPosting, setIsPosting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setLoadError("");

    axiosInstance
      .get(`/discussions/${problemId}`)
      .then(({ data }) => {
        if (isMounted) setDiscussions(data.discussions || []);
      })
      .catch((error) => {
        if (!isMounted) return;
        setLoadError(error.response?.data?.error || "Could not load discussions.");
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [problemId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmedContent = content.trim();
    if (trimmedContent.length < 2 || trimmedContent.length > 2000) return;

    setIsPosting(true);
    try {
      const { data } = await axiosInstance.post(`/discussions/${problemId}`, {
        content: trimmedContent,
      });
      setDiscussions((current) => [data.discussion, ...current]);
      setContent("");
      toast.success("Discussion posted");
    } catch (error) {
      toast.error(error.response?.data?.error || "Could not publish your post");
    } finally {
      setIsPosting(false);
    }
  };

  const handleDelete = async (discussionId) => {
    setDeletingId(discussionId);
    try {
      await axiosInstance.delete(`/discussions/${discussionId}`);
      setDiscussions((current) => current.filter((item) => item.id !== discussionId));
      toast.success("Discussion deleted");
    } catch (error) {
      toast.error(error.response?.data?.error || "Could not delete this post");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="space-y-6">
      <div>
        <h2 className="flex items-center gap-2 text-xl font-bold">
          <MessageSquare className="h-5 w-5 text-primary" />
          Problem discussion
        </h2>
        <p className="mt-1 text-sm text-base-content/60">
          Share an approach, ask a question, or help someone understand this problem.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3 rounded-xl border border-base-300 bg-base-200 p-4">
        <label htmlFor="discussion-post" className="font-semibold">Start a discussion</label>
        <textarea
          id="discussion-post"
          className="textarea textarea-bordered min-h-28 w-full bg-base-100"
          placeholder="What did you learn while solving this problem?"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          maxLength={2000}
          minLength={2}
          required
        />
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs text-base-content/60">{content.length}/2000</span>
          <button
            type="submit"
            className="btn btn-primary btn-sm gap-2"
            disabled={isPosting || content.trim().length < 2}
          >
            {isPosting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            Post
          </button>
        </div>
      </form>

      {isLoading ? (
        <div className="flex justify-center p-8">
          <LoaderCircle className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : loadError ? (
        <div className="alert alert-error">{loadError}</div>
      ) : discussions.length === 0 ? (
        <div className="rounded-xl border border-dashed border-base-300 p-8 text-center">
          <MessageSquare className="mx-auto h-8 w-8 text-base-content/40" />
          <p className="mt-3 font-semibold">No discussions yet</p>
          <p className="mt-1 text-sm text-base-content/60">Be the first to share an idea or ask a question.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {discussions.map((discussion) => {
            const author = discussion.user;
            const canDelete = authUser?.id === author?.id || authUser?.role === "ADMIN";

            return (
              <article key={discussion.id} className="rounded-xl border border-base-300 bg-base-100 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/15 font-semibold text-primary">
                    {author?.image ? (
                      <img src={author.image} alt="" className="h-full w-full object-cover" />
                    ) : (
                      getInitials(author?.name) || <UserRound className="h-5 w-5" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold">{author?.name || "LeetLab user"}</span>
                        {author?.role === "ADMIN" && <span className="badge badge-primary badge-sm">Admin</span>}
                        <time className="text-xs text-base-content/50" dateTime={discussion.createdAt}>
                          {new Date(discussion.createdAt).toLocaleString()}
                        </time>
                      </div>
                      {canDelete && (
                        <button
                          type="button"
                          className="btn btn-ghost btn-xs text-error"
                          onClick={() => handleDelete(discussion.id)}
                          disabled={deletingId === discussion.id}
                          aria-label="Delete discussion post"
                        >
                          {deletingId === discussion.id ? (
                            <LoaderCircle className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      )}
                    </div>
                    <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6">{discussion.content}</p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default DiscussionPanel;
