import { BlogPosts } from "app/components/posts";

export default function Page() {
  return (
    <section>
      <h1 className="mb-8 text-2xl font-semibold tracking-tighter">
        Magic Genie 🪔
      </h1>
      <p className="mb-4">
        {`Amazing market insights, tips, and tricks to help you grow your business.`}
      </p>
      <div className="my-8">
        <BlogPosts />
      </div>
    </section>
  );
}
